import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BearerToken, JwtPayload } from './bearer-token';
import { JwtService } from '@nestjs/jwt';

export interface IRequest {
  headers: Record<'authorization', string>;
  user?: BearerToken;
}

export interface JwtAuthorizationRequest {
  user: BearerToken;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: IRequest = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.replace('Bearer ', '');

    const decodedToken: JwtPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decodedToken) {
      throw new BadRequestException();
    }

    request.user = new BearerToken(token, decodedToken);

    return true;
  }
}
