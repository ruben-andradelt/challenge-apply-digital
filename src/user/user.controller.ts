import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Private')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('jwt')
  @ApiOperation({
    summary: '⚠️ Generate JWT',
    description: 'Generates a JWT for accessing private endpoints',
  })
  @ApiOkResponse({ type: String })
  async generateJWT(): Promise<string> {
    return this.userService.generateJWT();
  }
}
