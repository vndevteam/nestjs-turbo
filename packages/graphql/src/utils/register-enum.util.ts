import { registerEnumType } from '@nestjs/graphql';

const registeredEnums = new WeakMap<object, string>();

/**
 * Register enum with GraphQL only once.
 * Based on the enum object instead of the string name to avoid memory leak and name collision.
 *
 * @param enumType - The enum object to register.
 * @param name - The name of the enum in GraphQL schema.
 * @param valuesMap (EnumMetadataValuesMap<T>) - The mapping of enum values to their descriptions and deprecation reasons.
 * @example
 * ```typescript
 * enum MyEnum {
 *   VALUE1 = 'VALUE1',
 *   VALUE2 = 'VALUE2',
 * }
 *
 * safeRegisterEnum(MyEnum, 'MyEnum', {
 *  VALUE1: {
 *    description: 'Value 1',
 *    deprecationReason: 'Use VALUE2 instead',
 *  },
 *  VALUE2: {
 *   description: 'Value 2',
 *  },
 * });
 * ```
 */
export function safeRegisterEnum(
  enumType: object,
  name: string,
  valuesMap: object,
): void {
  if (!registeredEnums.has(enumType)) {
    registerEnumType(enumType, { name, valuesMap });
    registeredEnums.set(enumType, name);
  }
}
