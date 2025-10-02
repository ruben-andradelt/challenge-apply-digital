import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PriceRange', async: false })
export class PriceRangeValidator implements ValidatorConstraintInterface {
  validate(maxPrice: number, args: ValidationArguments) {
    const dto = args.object as any;
    if (dto.minPrice != null && maxPrice != null) {
      return maxPrice >= dto.minPrice;
    }

    return true;
  }

  defaultMessage() {
    return 'Max price must be greater than or equal than minPrice';
  }
}
