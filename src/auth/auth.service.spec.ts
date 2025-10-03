import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should generate a JWT', async () => {
    const mockToken = 'mocked-jwt-token';
    (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);

    const token = await authService.generateJWT();

    expect(token).toBe(mockToken);
    expect(jwtService.signAsync).toHaveBeenCalledWith({ id: 'id' });
  });
});
