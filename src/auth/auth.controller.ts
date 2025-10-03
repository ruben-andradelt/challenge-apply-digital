import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Private')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('jwt')
  @ApiOperation({
    summary: '⚠️ Generate JWT',
    description: 'Generates a JWT for accessing private endpoints',
  })
  @ApiOkResponse({ type: String })
  async generateJWT(): Promise<string> {
    return this.authService.generateJWT();
  }
}
