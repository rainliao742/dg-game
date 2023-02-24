import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common/common.service';
import { Pagination } from 'src/app/common/scheme';
import { findMax, findMin } from 'src/app/common/util';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  @Input() totalRecordCnt = 0;          // 資料總筆數
  @Input() showPageSizeList = true;     // 是否顯示每頁筆數清單
  @Input() pageSizeList = [10, 20, 30]; // 每頁筆數清單
  @Input() pageSize = 20;               // 每頁筆數
  @Input() perPageNum = 5;              // 一次顯示多少頁碼
  @Input() curPageNum = 1;              // 目前頁碼

  totalPageNum = 0;                     // 頁碼總數量 (= 資料總筆數 / 每頁筆數)
  pageNumList = [] as number[];         // 頁碼清單

  @Output() changePage = new EventEmitter<Pagination>(); // emit when change "目前頁碼" / "每頁筆數"

  subscription: Subscription | undefined;

  constructor(
    private common: CommonService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('【PaginationComponent】 ngOnChanges . . . ; changes:', changes);
    this.create();
  }

  // 前往: 第一頁, 上一頁, 下一頁, 最後一頁
  goto(which: string): void {
    switch (which) {
      case 'first':
        this.curPageNum = 1;
        break;
      case 'previous':
        this.curPageNum--;
        break;
      case 'next':
        this.curPageNum++;
        break;
      case 'last':
        this.curPageNum = this.totalPageNum;
        break;
    }
    this.calPageNumList();
    this.emit();
  }

  // 前往: 第 n 頁
  gotoPage(pageNum: number): void {
    if (pageNum === this.curPageNum) {
      return;
    }
    this.curPageNum = pageNum;
    this.calPageNumList();
    this.emit();
  }

  // 變更每頁筆數
  changePageSize(): void {
    this.curPageNum = 1;
    this.create();
    this.emit();
  }

  private create(): void {
    this.totalPageNum = Math.ceil(this.totalRecordCnt / this.pageSize); // 不滿一頁的也算一頁
    this.calPageNumList();
  }

  private emit(): void {
    this.changePage.emit({
      startNum: this.pageSize * (this.curPageNum - 1) + 1,
      endNum: this.pageSize * (this.curPageNum),
      pageSize: this.pageSize,
      curPageNum: this.curPageNum,
    });
  }

  // 計算"頁碼清單"，依賴 "perPageNum" 與 "curPageNum"
  private calPageNumList(): void {

    this.pageNumList.length = 0;

    const half = Math.floor(this.perPageNum / 2);
    const midPageNum = this.curPageNum;
    const minPageNum = this.curPageNum - half;
    const maxPageNum = this.curPageNum + half;
    const invalidPageNumList = [] as number[];

    // 跑一次頁碼的範圍
    for (let pageNum = minPageNum; pageNum <= maxPageNum; pageNum++) {
      if (this.isValid(pageNum)) {
        this.pageNumList.push(pageNum);
      } else {
        invalidPageNumList.push(pageNum);
      }
    }

    // 將不合法的頁碼轉為合法
    invalidPageNumList.forEach(invalidPageNum => {
      const diff = invalidPageNum - midPageNum;
      const pageNum = diff < 0 ? findMax(this.pageNumList) as number + 1 : findMin(this.pageNumList) as number - 1;
      if (this.isValid(pageNum)) {
        this.pageNumList.push(pageNum);
      }
    });

    // 由小到大排序
    this.pageNumList.sort((a, b) => a - b);
  }

  // 判斷頁碼是否合法
  private isValid(pageNum: number): boolean {
    return pageNum >= 1 && pageNum <= this.totalPageNum;
  }
}
