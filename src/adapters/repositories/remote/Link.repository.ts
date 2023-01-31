import { PrismaClient, User } from "@prisma/client"
import { ILinkRepository } from "../../../application/modules/links/providerContracts/ILink.repository"
import { AppSettings } from "../../../application/shared/settings/AppSettings"
import { ILink } from "../../../domain/link/ILink"
import { Link } from "../../../domain/link/Link"

const prisma = new PrismaClient()

export class RemoteLinkRepository implements ILinkRepository {
  async update(where: Record<string, any>, attributes: Record<string, any>): Promise<Link | null> {
    try {
      const link = await prisma.link.update({
        where,
        data: attributes
      })
      return link as unknown as Link
    } catch (e: any) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }

  async fetchBy(attributes: Record<string, any>): Promise<Link | null> {
    try {
      const link = await prisma.link.findUnique({ where: attributes })
      return link as unknown as Link
    } catch (e: any) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }

  async fetchListBy(attributes: Record<string, any>): Promise<Link[]> {
    try {
      const links = await prisma.link.findMany({
        where: attributes
      })
      return links as unknown as Link[]
    } catch (e: any) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return []
    }
  }

  async create(data: ILink): Promise<Link | null> {
    try {
      const link = await prisma.link.create({
        data: {
          name: data.name,
          path: data.path,
          url: data.url,
          createdAt: data.createdAt,
          user: { connect: { id: data.userId } }
        }
      })
      return link as unknown as Link
    } catch (e: any) {
      if (AppSettings.SERVER_MODE === "development") console.log(e)
      return null
    }
  }

  async deleteOne(where: Record<string, any>): Promise<boolean> {
    try {
      const result = await prisma.link.deleteMany({
        where: {
          id: where.id,
          userId: where.userId
        }
      })
      return !!result.count
    } catch (e: any) {
      if (process.env.NODE_ENV === "development") console.log(e)
      return false
    }
  }
}

