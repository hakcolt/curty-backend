import { IAuthProvider } from "../../application/modules/auth/providerContracts/IAuth.provider"
import jwt from "jsonwebtoken"
import { AppSettings } from "../../application/shared/settings/AppSettings"
import { AccessToken } from "../../domain/session/AccessToken"
import bcrypt from "bcrypt"
import { TokenArgs } from "../../domain/session/TokenArgs"

export class AuthProvider implements IAuthProvider {
  encryptPassword(data: string): string {
    return bcrypt.hashSync(data, 10)
  }

  auth(password: string, passwordEncrypted: string): boolean {
    return bcrypt.compareSync(password, passwordEncrypted)
  }

  getJWT({ id, email }: TokenArgs, refreshToken: boolean): AccessToken {
    const expirationTime = refreshToken ? AppSettings.JWT_REFRESH_TOKEN_TIME : AppSettings.JWT_ACCESS_TOKEN_TIME
    const token = jwt.sign({ id, email }, refreshToken ? AppSettings.JWT_REFRESH_TOKEN_KEY : AppSettings.JWT_ACCESS_TOKEN_KEY, {
      expiresIn: expirationTime
    })

    const expiresAt = new Date()
    expiresAt.setTime(expiresAt.getTime() + expirationTime * 1000)

    return {
      token,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
  }

  verifyJWT(token: string, refreshToken: boolean): boolean {
    try {
      return !!jwt.verify(token, refreshToken ? AppSettings.JWT_REFRESH_TOKEN_KEY : AppSettings.JWT_ACCESS_TOKEN_KEY)
    } catch (e: any) { return false }
  }

  decodeJWT(token: string): TokenArgs {
    return jwt.decode(token) as TokenArgs
  }

}