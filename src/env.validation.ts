import { plainToClass } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsInt()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  CONTENTFUL_SPACE_ID: string;

  @IsNotEmpty()
  @IsString()
  CONTENTFUL_ACCESS_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  CONTENTFUL_ENVIRONMENT: string;

  @IsNotEmpty()
  @IsString()
  CONTENTFUL_CONTENT_TYPE: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
