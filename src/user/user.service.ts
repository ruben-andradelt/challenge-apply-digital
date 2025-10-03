import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(): Promise<string> {
    return this.jwtService.signAsync({ id: 'id' });
  }
}
