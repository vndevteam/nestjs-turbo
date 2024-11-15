import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DEFAULT_PAGE_LIMIT, Order } from '../../constants';
import { PageOptionsDto } from './page-options.dto';

export class OffsetPaginationDto {
  @ApiProperty()
  @Expose()
  readonly limit: number;

  @ApiProperty()
  @Expose()
  readonly offset: number;

  @ApiProperty()
  @Expose()
  readonly nextPage?: number;

  @ApiProperty()
  @Expose()
  readonly previousPage?: number;

  @ApiProperty()
  @Expose()
  readonly totalRecords: number;

  @ApiProperty()
  @Expose()
  readonly totalPages: number;

  constructor(
    totalRecords: number,
    pageOptions: PageOptionsDto = {
      limit: DEFAULT_PAGE_LIMIT,
      offset: 0,
      order: Order.ASC,
    },
  ) {
    this.limit = pageOptions.limit;
    this.offset = pageOptions.offset;
    const currentPage = pageOptions.offset / pageOptions.limit + 1;
    this.nextPage = currentPage < this.totalPages ? currentPage + 1 : undefined;
    this.previousPage =
      currentPage > 1 && currentPage - 1 < this.totalPages
        ? currentPage - 1
        : undefined;
    this.totalRecords = totalRecords;
    this.totalPages =
      this.limit > 0 ? Math.ceil(totalRecords / pageOptions.limit) : 0;
  }
}
