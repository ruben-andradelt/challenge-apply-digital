import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Private')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('jwt')
  @ApiOkResponse({ type: String })
  async generateJWT(): Promise<string> {
    return this.userService.generateJWT();
  }
}
