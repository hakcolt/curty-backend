import { NextFunction, Request, Response, Router } from "express"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import { Result, ResultData } from "../../application/shared/useCases/BaseUseCase"
import { IRequest } from "./context/IRequest"

export { IRequest }

export abstract class BaseController {
  abstract initializeRoutes(router: Router): void

  getResultToResponse(req: Request, res: Response, result: Result): Result {
    if (result.isSuccess && result instanceof ResultData) {
      const cookie = result.cookie
      const origin = req.headers.origin
      if (cookie && (!origin || AppSettings.SERVER_ORIGINS.indexOf(origin!) !== -1)) {
        res.cookie(cookie.name, cookie.value, {
          expires: cookie.expires,
          sameSite: "none",
          httpOnly: true,
          secure: true,
          domain: req.headers.host
        })
      }

      const tempResult = new ResultData()
      tempResult.setMessage(result.message, result.statusCode, result.next)

      const data = result.data
      if (data) tempResult.data = data

      result = tempResult
    }
    return result
  }

  async handleResult(req: Request, res: Response, next: NextFunction, useCase: Promise<Result>) {
    try {
      let result = await useCase
      if (result.statusCode > 300 && result.statusCode < 400) {
        const resultData = result as ResultData<string>
        const url = resultData.data
        return res.status(resultData.statusCode).redirect(url)
      }
      const resultFormatted = this.getResultToResponse(req, res, result)
      res.status(resultFormatted.statusCode).json(resultFormatted)
    } catch (e: any) { next(e) }
  }
}
