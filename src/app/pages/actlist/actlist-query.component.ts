import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { BaseQueryComponent } from 'src/app/common/base-query-component';
import { CommonService } from 'src/app/common/common.service';
import { Summary } from 'src/app/common/constant';


@Component({
  selector: 'app-actlist-query',
  templateUrl: './actlist-query.component.html',
  styleUrls: ['./actlist-query.component.css']
})
export class ActlistQueryComponent extends BaseQueryComponent implements OnInit {


  @ViewChild('form', { static: true }) form!: NgForm;
  @ViewChild('table', { static: true }) table!: Table;

  columnList = [
   // { name: '序號', sort: '', dataKey: 'rowNum', class: 'action-1' },
    { name: '活動名稱', sort: 'activity_name', dataKey: 'activityName' },
    { name: '活動類型', sort: 'activity_type', dataKey: 'activityType' },
    { name: '報到問題', sort: 'key_question', dataKey: 'keyQuestion' },
    { name: '格式限制', sort: 'pattern', dataKey: 'pattern' },
    { name: '活動時間描述', sort: 'time_description', dataKey: 'timeDescription' },
    { name: '活動地點描述', sort: 'venue', dataKey: 'venue' },
    { name: '活動起始時間', sort: 'activity_start_time', dataKey: 'activityStartTime', format: 'date', formatString: 'yyyy/MM/dd HH:mm:ss' },
    { name: '活動結束時間', sort: 'activity_end_time', dataKey: 'activityEndTime', format: 'date', formatString: 'yyyy/MM/dd HH:mm:ss' },
  ];

  masterVo = {} as any;
  vo = { startTime: '', endTime: '' } as any;
  subscription!: Subscription;
  isInitOk = false;
  queryList = [] as any[];
  isChecked = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private common: CommonService,
  ) {
    super(common);
  }

  ngOnInit(): void {

  }

  initPage(): void {
    this.paginationVo.pageSize = this.pageSize;
    this.paginationVo.curPageNum = 1;
    this.paginationVo.sortField = 'id';
    this.curPageNum = 1;
  }

  execQuery(): void {
    console.log(this.vo.startTime > this.vo.endTime);
    if (this.vo.startTime > this.vo.endTime) {
      this.common.toast(Summary.Notice, '起始日期不可大於結束日期', 'warn');
      return;
    }

    this.blockTable();
    this.common.doPostAPI('gameSetting/list', { master: this.masterVo, startTime: this.vo.startTime, endTime: this.vo.endTime, pagination: this.paginationVo }).subscribe(resp => {
      if (!resp.result) {
        this.common.toast(Summary.Fail, resp.message, 'error');
        return;
      }
      this.queryList = resp.masters;
      this.queryList.forEach((x, i) => x.rowNum = i + 1);
      this.totalRecordCnt = resp.totalRecordCnt;
    }, this.unblockTable, this.unblockTable);
  }

  query(): void {
    this.initPage();
    this.table.reset();
    this.execQuery();
  }


  add(): void {
    this.router.navigate(['list/add']);

  }

  edit(x: any): void {
    this.router.navigate(['list/edit', x.id]);
  }

  gotoMember(x: any): void {
    this.router.navigate(['member', x.id]);
  }

  gotoActivity(x: any): void {
    this.router.navigate(['activity', x.id]);
  }

  delete(): void {
    console.log('Delete', 666);
  }

  clear(): void {
    this.form.resetForm();
    setTimeout(() => {
      this.vo = {};
      this.masterVo = {};
      this.queryList.length = 0;
    });
  }

  checkAll(): void {
    setTimeout(() => {
      this.queryList.forEach(x => x.checked = this.isChecked);
    });
  }

}
