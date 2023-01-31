import { BaseUseCase, Result } from "../../../../shared/useCases/BaseUseCase"
import { plurals, Resources, strings } from "../../../../shared/locals"
import { ILinkRepository } from "../../providerContracts/ILink.repository"

export class DeleteLinkUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: ILinkRepository
  ) {
    super(resources)
  }

  override async execute(data: Record<string, any>): Promise<Result> {
    const result = new Result()

    if (!data.id || !data.userId) {
      result.setError(this.resources.getWithParams(plurals.MISSING_ATRIBUTES, "id: string"), 400)
      return result
    }

    const deleteResult = await this.repository.deleteOne({ id: data.id, userId: data.userId })
    if (deleteResult) result.setMessage(this.resources.get(strings.SUCCESSFUL_OPERATION), 202)
    else result.setError(this.resources.get(strings.NOT_FOUND), 409)

    return result
  }
}