import {
  applyDecorators,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IRequest, JwtGuard } from '../guards/jwt.guard';

@Injectable()
export class JwtExtend extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request: IRequest = context.switchToHttp().getRequest();

    if (request.user) {
      return true;
    }

    return super.canActivate(context) as boolean;
  }
}

export function Authentication() {
  return applyDecorators(UseGuards(JwtGuard, JwtExtend));
}
