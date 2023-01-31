import { beforeAll, beforeEach, describe, expect, it } from "vitest"
import { DeleteLinkUseCase } from "."
import { LocalLinkRepository } from "../../../../../adapters/repositories/local/Link.repository"
import config from "../../../../../infrastructure/config"
import db from "../../../../../infrastructure/databases/local/db.mock"
import { createResource, plurals, strings } from "../../../../shared/locals"
import { AppSettings } from "../../../../shared/settings/AppSettings"

AppSettings.init(config)

describe("when try refresh access token", () => {
  let deleteLinkUseCase: DeleteLinkUseCase

  beforeAll(() => {
    const repo = new LocalLinkRepository()
    deleteLinkUseCase = new DeleteLinkUseCase(createResource(), repo)
  })

  beforeEach(() => {
    if (!db.links[0]) db.links[0] = {
      "id": "8767a65d-6f83-478d-954d-10be5a2df24d",
      "name": "Linkedin",
      "path": "/linkedin",
      "url": "https://linkedin.com/in/hakcolt",
      "createdAt": "1856-06-15T18:30:51.876-05:00",
      "userId": "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
  })

  it("should return status 200 if there is not any problem", async () => {
    const args = {
      id: "8767a65d-6f83-478d-954d-10be5a2df24d",
      userId: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
    const result = await deleteLinkUseCase.execute(args)

    expect(result.error).toBeUndefined()
    expect(result.message).toBe(deleteLinkUseCase.resources.get(strings.SUCCESSFUL_OPERATION))
    expect(result.statusCode).toBe(202)
    expect(result.isSuccess).toBeTruthy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 409 if link id is wrong", async () => {
    const args = {
      id: "8767a65d-6f83-954d-10be5a2df24d",
      userId: "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
    const result = await deleteLinkUseCase.execute(args)

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(deleteLinkUseCase.resources.get(strings.NOT_FOUND))
    expect(result.statusCode).toBe(409)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 409 if user id is wrong", async () => {
    const args = {
      id: "8767a65d-6f83-478d-954d-10be5a2df24d",
      userId: "9177a65d-6f83-478d-954d"
    }
    const result = await deleteLinkUseCase.execute(args)

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(deleteLinkUseCase.resources.get(strings.NOT_FOUND))
    expect(result.statusCode).toBe(409)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })

  it("should return status 400 if any args is null", async () => {
    const result = await deleteLinkUseCase.execute({ userId: "9177a65d-6f83-478d-954d" })

    expect(result.message).toBeUndefined()
    expect(result.error).toBe(deleteLinkUseCase.resources.getWithParams(plurals.MISSING_ATRIBUTES, "id: string"))
    expect(result.statusCode).toBe(400)
    expect(result.isSuccess).toBeFalsy()
    expect(result.next).toBeUndefined()
  })
})