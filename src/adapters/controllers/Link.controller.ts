import { BaseController, IRequest } from "../base/Base.controller"
import { NextFunction, Request, Response, Router } from "express"
import { URLConstants } from "../../application/shared/settings/Constants"
import { RemoteLinkRepository } from "../repositories/remote/Link.repository"
import { ListLinkUseCase } from "../../application/modules/links/useCases/list"
import { CreateLinkUseCase } from "../../application/modules/links/useCases/create"
import { RemoteUserRepository } from "../repositories/remote/User.repository"
import { DeleteLinkUseCase } from "../../application/modules/links/useCases/delete"

export class LinkController extends BaseController {
  create = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const linkRepository = new RemoteLinkRepository()
    const userRepository = new RemoteUserRepository()
    const createLinkService = new CreateLinkUseCase(req.resources, linkRepository, userRepository)

    const link = req.body
    const userInfo = req.userInfo

    link.userId = userInfo.id

    this.handleResult(req, res, next, createLinkService.execute(link))
  }

  listLinks = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteLinkRepository()
    const listLinkService = new ListLinkUseCase(req.resources, repository)

    const tokenArgs = req.userInfo

    this.handleResult(req, res, next, listLinkService.execute(tokenArgs))
  }

  delete = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest

    const repository = new RemoteLinkRepository()
    const deleteLinkService = new DeleteLinkUseCase(req.resources, repository)

    const linkId = req.params.id
    const userInfo = req.userInfo

    this.handleResult(req, res, next, deleteLinkService.execute({
      id: linkId,
      userId: userInfo.id
    }))
  }

  override initializeRoutes(router: Router) {
    const listLinkUrl = URLConstants.Links.List
    router[listLinkUrl.method](listLinkUrl.path, this.listLinks)

    const createLinkUrl = URLConstants.Links.Create
    router[createLinkUrl.method](createLinkUrl.path, this.create)

    const deleteLinkUrl = URLConstants.Links.Delete
    router[deleteLinkUrl.method](deleteLinkUrl.path, this.delete)
  }
}

export default new LinkController()