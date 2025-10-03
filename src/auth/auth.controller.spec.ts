import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { generateJWT: jest.fn() },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call AuthService.generateJWT and return a token', async () => {
    const mockToken = 'mocked-jwt-token';
    (authService.generateJWT as jest.Mock).mockResolvedValue(mockToken);

    const result = await authController.generateJWT();

    expect(result).toBe(mockToken);
    expect(authService.generateJWT).toHaveBeenCalled();
  });
});
