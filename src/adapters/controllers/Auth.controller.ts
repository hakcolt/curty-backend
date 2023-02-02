import { BaseController, IRequest } from "../base/Base.controller"
import { LoginUserUseCase } from "../../application/modules/auth/useCases/signIn"
import { AuthProvider } from "../providers/Auth.provider"
import { RefreshTokenUseCase } from "../../application/modules/auth/useCases/refresh"
import { NextFunction, Request, Response, Router } from "express"
import { URLConstants } from "../../application/shared/settings/Constants"
import { RemoteUserRepository } from "../repositories/remote/User.repository"

export class AuthController extends BaseController {

  refresh = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteUserRepository()
    const authProvider = new AuthProvider()
    const refreshTokenService = new RefreshTokenUseCase(req.resources, repository, authProvider)

    const token = req.cookies["nodeA2.refreshToken"]

    this.handleResult(req, res, next, refreshTokenService.execute(token))
  }

  signIn = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteUserRepository()
    const authProvider = new AuthProvider()
    const loginService = new LoginUserUseCase(req.resources, repository, authProvider)

    const credentials = req.body

    this.handleResult(req, res, next, loginService.execute(credentials))
  }

  override initializeRoutes(router: Router) {
    const refreshUrl = URLConstants.Users.Refresh
    router[refreshUrl.method](refreshUrl.path, this.refresh)
    
    const signInUrl = URLConstants.Users.SignIn
    router[signInUrl.method](signInUrl.path, this.signIn)
  }
}

export default new AuthController()