import { ILink } from "./ILink"

export class Link implements ILink {
  id: string
  name: string | undefined
  path: string
  url: string
  createdAt: string
  userId: string
}