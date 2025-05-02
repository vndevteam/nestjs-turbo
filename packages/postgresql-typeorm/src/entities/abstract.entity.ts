import { plainToInstance } from 'class-transformer';
import { BaseEntity } from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  toDto<Dto>(dtoClass: new () => Dto): Dto {
    return plainToInstance(dtoClass, this);
  }
}
