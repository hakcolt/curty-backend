import { v4 } from "uuid"
import { ILink } from "../../../domain/link/ILink"
import { Link } from "../../../domain/link/Link"
import db from "./db.mock"

export class LinkModel {
  update(linkToPush: Link): Link | null {
    for (const index in db.users) {
      const linkInDb = db.links[index]
      if (linkInDb.id !== linkToPush.id) continue
      db.links[index] = linkToPush
      return linkToPush
    }
    return null
  }

  getBy(input: Record<string, any>): Link[] | null {
    const inputKeys = Object.keys(input)
    const linkKeys = Object.keys(db.links[0])

    const linksMatched: Link[] = []
    for (const linkFromDb of db.links) {
      for (const keyToVerify of inputKeys) {
        if (!linkKeys.includes(keyToVerify) || linkFromDb[keyToVerify] !== input[keyToVerify]) break
        linksMatched.push(linkFromDb)
      }
    }
    return linksMatched
  }

  create(link: ILink): Link {
    const uid = v4()
    const linkToPush: Link = {
      id: uid,
      name: link.name,
      path: link.path,
      url: link.url,
      createdAt: link.createdAt,
      userId: link.userId
    }
    db.links.push(linkToPush)
    return linkToPush
  }

  delete(id: string, userId: string): boolean {
    const links = db.links
    for (const index in links) {
      const link = links[index]
      if (link.id === id && link.userId === userId) {
        links.splice(parseInt(index))
        return true
      }
    }
    return false
  }
}

export default new LinkModel()