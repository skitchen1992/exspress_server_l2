import jwt, { Jwt, JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { SETTINGS } from '../utils/settings';

class JwtService {
  private readonly secret: Secret;

  constructor(secret: Secret) {
    this.secret = secret;
  }

  generateToken(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string, options?: VerifyOptions): string | Jwt | JwtPayload | null {
    try {
      return jwt.verify(token, this.secret, options);
    } catch (err) {
      return null;
    }
  }

  decodeToken(token: string): null | { [key: string]: any } | string {
    return jwt.decode(token);
  }
}

export const jwtService = new JwtService(SETTINGS.JWT_SECRET_KEY!);
