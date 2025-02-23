import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';

import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'CompareConfirmPassword' })
@Injectable()
export class CompareConfirmPasswordRule
  implements ValidatorConstraintInterface
{
  async validate(value: string, args: ValidationArguments) {
    const { object } = args;

    const password = object['password'] as string;
    const confirmPassword = object['confirmPassword'] as string;

    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `password and confirm password do not match`;
  }
}

export function CompareConfirmPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CompareConfirmPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CompareConfirmPasswordRule,
    });
  };
}
