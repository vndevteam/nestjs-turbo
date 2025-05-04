import { applyDecorators } from '@nestjs/common';
import { EnumOptions, Field, type FieldOptions } from '@nestjs/graphql';
import {
  Constructor,
  IsNullable,
  IsPassword,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
} from '@repo/nest-common';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { safeRegisterEnum } from '../utils';

interface IFieldOptions {
  each?: boolean;
}

interface INumberFieldOptions extends IFieldOptions {
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

interface IEnumFieldOptions extends IFieldOptions {
  enumName?: string;
}

type IBooleanFieldOptions = IFieldOptions;
type ITokenFieldOptions = IFieldOptions;
type IClassFieldOptions = IFieldOptions;

export function NumberField(
  options: FieldOptions & INumberFieldOptions = {},
): PropertyDecorator {
  const { each, nullable, int, min, max, isPositive } = options;

  const decorators = [
    Field(() => (each ? [Number] : Number), { ...options }),
    nullable ? IsNullable({ each }) : NotEquals(null, { each }),
    int ? IsInt({ each }) : IsNumber({}, { each }),
    min !== undefined && Min(min, { each }),
    max !== undefined && Max(max, { each }),
    isPositive && IsPositive({ each }),
  ].filter(Boolean);

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    NumberField({ nullable: true, ...options }),
  );
}

export function StringField(
  options: FieldOptions & IStringFieldOptions = {},
): PropertyDecorator {
  const {
    each,
    nullable,
    minLength = 1,
    maxLength,
    toLowerCase,
    toUpperCase,
  } = options;

  const decorators = [
    Field(() => (each ? [String] : String), { ...options }),
    IsString({ each }),
    nullable ? IsNullable({ each }) : NotEquals(null, { each }),
    MinLength(minLength, { each }),
    maxLength && MaxLength(maxLength, { each }),
    toLowerCase && ToLowerCase(),
    toUpperCase && ToUpperCase(),
  ].filter(Boolean);

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    StringField({ nullable: true, ...options }),
  );
}

export function TokenField(
  options: FieldOptions & ITokenFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    Field(() => (options.each ? [String] : String), { ...options }),
    IsJWT({ each: options.each }),
    options.nullable
      ? IsNullable({ each: options.each })
      : NotEquals(null, { each: options.each }),
  );
}

export function PasswordField(
  options: FieldOptions & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField({ minLength: 6, ...options }),
    IsPassword(),
    options.nullable ? IsNullable() : NotEquals(null),
  );
}

export function PasswordFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    PasswordField({ nullable: true, ...options }),
  );
}

export function BooleanField(
  options: FieldOptions & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Field(() => (options.each ? [Boolean] : Boolean), { ...options }),
    ToBoolean(),
    IsBoolean({ each: options.each }),
    options.nullable
      ? IsNullable({ each: options.each })
      : NotEquals(null, { each: options.each }),
  ];

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    BooleanField({ nullable: true, ...options }),
  );
}

export function EmailField(
  options: FieldOptions & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField({ toLowerCase: true, ...options }),
    IsEmail(),
    options.nullable ? IsNullable() : NotEquals(null),
  );
}

export function EmailFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    EmailField({ nullable: true, ...options }),
  );
}

export function UUIDField(
  options: FieldOptions & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    Field(() => (options.each ? [String] : String), { ...options }),
    IsUUID('4', { each: options.each }),
    options.nullable ? IsNullable() : NotEquals(null),
  );
}

export function UUIDFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    UUIDField({ nullable: true, ...options }),
  );
}

export function URLField(
  options: FieldOptions & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField(options),
    IsUrl({}, { each: options.each }),
    options.nullable
      ? IsNullable({ each: options.each })
      : NotEquals(null, { each: options.each }),
  );
}

export function URLFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    URLField({ nullable: true, ...options }),
  );
}

export function DateField(
  options: FieldOptions & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    Field(() => (options.each ? [Date] : Date), { ...options }),
    IsDate(),
    options.nullable ? IsNullable() : NotEquals(null),
  );
}

export function DateFieldOptional(
  options: Omit<FieldOptions, 'nullable'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    DateField({ ...options, nullable: true }),
  );
}

export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: FieldOptions & Omit<EnumOptions<TEnum>, 'name'> & IEnumFieldOptions,
): PropertyDecorator {
  const { nullable, each, enumName, valuesMap, ...rest } = options;
  const enumType = getEnum();

  if (enumName) {
    safeRegisterEnum(enumType, enumName, valuesMap);
  }

  const typeFn = () => (each ? [enumType] : enumType);
  const graphqlOptions = { ...rest, nullable } as FieldOptions;

  const decorators = [
    Field(typeFn, graphqlOptions),
    IsEnum(getEnum(), { each }),
    nullable ? IsNullable() : NotEquals(null),
  ];

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<FieldOptions, 'nullable'> &
    Omit<EnumOptions<TEnum>, 'name'> &
    IEnumFieldOptions,
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    EnumField(getEnum, { nullable: true, ...options }),
  );
}

export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: FieldOptions & IClassFieldOptions = {},
): PropertyDecorator {
  const { nullable, each, ...rest } = options;

  const typeFn = () => (each ? [getClass()] : getClass());
  const graphqlOptions = { ...rest, nullable } as FieldOptions;

  const decorators = [
    Field(typeFn, graphqlOptions),
    ValidateNested({ each }),
    nullable ? IsNullable() : NotEquals(null),
    nullable !== false && IsDefined(),
  ].filter(Boolean);

  return applyDecorators(...decorators);
}

export function ClassFieldOptional<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<FieldOptions, 'nullable'> & IClassFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional({ each: options.each }),
    ClassField(getClass, { nullable: true, ...options }),
  );
}
