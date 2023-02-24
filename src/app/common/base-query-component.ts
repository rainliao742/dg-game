import { SortEvent } from 'primeng/api';
import { CommonService } from './common.service';
import { Pagination, PaginationVo } from './scheme';

export abstract class BaseQueryComponent {

  paginationVo = {} as PaginationVo;
  totalRecordCnt = 0;
  pageSize = 10;
  curPageNum = 1;
  isQuerying = false;

  blockTable = () => this.isQuerying = true;
  unblockTable = () => this.isQuerying = false;

  constructor(
    common: CommonService,
  ) {
    this.initPage();
  }

  abstract initPage(): void;
  abstract execQuery(): void;

  validateForm(): boolean {
    return true;
  }

  sort(event: SortEvent): void {
    if (!this.validateForm()) {
      return;
    }
    this.initPage();
    this.paginationVo.sortField = event.field as string;
    this.paginationVo.direction = event.order as 1 | -1;
    this.execQuery();
  }

  changePage(pagination: Pagination): void {
    if (!this.validateForm()) {
      return;
    }
    this.paginationVo.pageSize = pagination.pageSize;
    this.paginationVo.curPageNum = pagination.curPageNum;
    this.pageSize = pagination.pageSize;
    this.curPageNum = pagination.curPageNum;
    this.execQuery();
  }
}
