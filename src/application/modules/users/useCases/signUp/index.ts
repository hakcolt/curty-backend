import { IUserRepository } from "../../providerContracts/IUser.repository"
import { BaseUseCase } from "../../../../shared/useCases/BaseUseCase"
import { UserDTO, UserInput } from "../../dto/User.dto"
import { Result } from "../../../../shared/useCases/BaseUseCase"
import { IAuthProvider } from "../../../auth/providerContracts/IAuth.provider"
import { Resources, strings } from "../../../../shared/locals"
import { IUser } from "../../../../../domain/user/IUser"
import { URLConstants } from "../../../../shared/settings/Constants"

export class RegisterUserUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly repository: IUserRepository,
    private readonly authProvider: IAuthProvider
  ) {
    super(resources)
  }

  override async execute(data: any): Promise<Result> {
    const result = new Result()
    const userDTO: UserDTO = UserDTO.fromJSON(data as UserInput)

    if (!userDTO.validateInputValues(result, this.resources)) return result

    const hasUser = await this.repository.fetchBy({ email: userDTO.email })

    if (hasUser) {
      result.setError(this.resources.get(strings.ALREADY_EXISTS), 409)
      return result
    }
    const userData = userDTO.toDomain()
    userData.password = this.authProvider.encryptPassword(userData.password)

    await this.createUser(result, userData)

    return result
  }

  async createUser(result: Result, data: IUser) {
    const user = await this.repository.create(data)

    if (user) result.setMessage(this.resources.get(strings.USER_CREATED), 201, URLConstants.Users.SignIn.path)
    else result.setError(this.resources.get(strings.ALREADY_EXISTS), 409)
  }
}