import { validate, ValidatorOptions } from 'class-validator';

export const validateDto = async (
  dto: object,
  options: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  },
) => {
  return await validate(dto, options);
};
