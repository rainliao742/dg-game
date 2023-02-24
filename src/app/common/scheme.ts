
export interface Pagination {
  startNum: number;
  endNum: number;
  pageSize: number;
  curPageNum: number;
}

export interface PaginationVo {
  pageSize: number;
  curPageNum: number;
  sortField: string;
  direction: 1 | -1;
}


export type MessageSeverity = 'info' | 'success' | 'warn' | 'error';

export type ConfirmSeverity = 'info' | 'danger';

export type FlatpickrMode = 'date' | 'datetime' | 'datetime_second' | 'time' | 'time_second';
