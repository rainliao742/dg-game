import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { BaseQueryComponent } from 'src/app/common/base-query-component';
import { CommonService } from 'src/app/common/common.service';
import { Summary } from 'src/app/common/constant';
import { DialogService } from 'src/app/common/dialog/dialog.service';

@Component({
  selector: 'app-actlist-member',
  templateUrl: './actlist-member.component.html',
  styleUrls: ['./actlist-member.component.css']
})
export class ActlistMemberComponent extends BaseQueryComponent implements OnInit {

  @ViewChild("question") questionRef!: TemplateRef<any>;
  overlayRef!: OverlayRef;

  @ViewChild('qform', { static: true }) qform!: NgForm;
  @ViewChild('table', { static: true }) table!: Table;

  columnList = [
    { name: '序號', sort: '', dataKey: 'rowNum', class: 'action-1' },
    { name: '報到關鍵字', sort: 'key_question_value', dataKey: 'keyQuestionValue', dataKeyById: true },
    { name: '是否報到', sort: 'is_entered', dataKey: 'isEntered' },
    { name: '報到時間', sort: 'update_date', dataKey: 'updateDate', format: 'date', formatString: 'yyyy/MM/dd HH:mm:ss' },
  ];

  id: number | undefined;
  qvo = { isEntered: 'all' } as any;
  vo = { master: { id: 0 }, details: [], masterExt: {}, detailExts: [] };
  masterExt: any;
  detailExts: any;
  subscription!: Subscription;
  isInitOk = false;
  isChecked = false;
  queryList = [] as any[];
  activityName = '';
  keyQuestion = '';
  totalRecordCnt = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private dialog: DialogService,
  ) {
    super(common);
  }

  ngOnInit(): void {
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    this.vo.master.id = this.id;
    this.initPage();
    this.execQuery();
    this.initActivity();
    this.popupSetting();
  }

  //頁面初始化
  initPage(): void {
    this.paginationVo.pageSize = this.pageSize;
    this.paginationVo.curPageNum = 1;
    this.paginationVo.sortField = 'update_date';
    this.paginationVo.direction = 1;
    this.curPageNum = 1;
  }

  //新增問券
  add(): void {
    this.overlayRef.attach(
      new TemplatePortal(this.questionRef, this.viewContainerRef)
    );
  }

  //問券問題init
  initActivity(): void {
    this.common.doPostAPI('activity/init', this.vo).subscribe(resp => {
      if (!resp.result) {
        this.common.toast(Summary.Fail, resp.message, 'error');
        return;
      }
      //問券填寫區
      this.masterExt = resp.master;
      this.detailExts = resp.details;

      this.initQuestionTable();

      this.activityName = this.masterExt.activityName;
      this.keyQuestion = this.masterExt.keyQuestion;
    });
  }



  saveActivity() {
    this.vo.masterExt = this.masterExt;
    this.vo.detailExts = this.detailExts;
    this.saveQuestion();
  }

  //問券儲存
  private saveQuestion = () => {

    this.common.doPostAPI('activity/save', this.vo).subscribe(resp => {
      if (!resp.result) {
        this.dialog.notify('*注意*', '報名失敗，請再試一次');
        return;
      }
      this.initQuestionTable();
      this.closeQuestion();
      this.dialog.notify('*通知*', '報名成功，期待您的參與');
    });
  }

  initQuestionTable() {
    this.masterExt.keyQuestionValue = '';
    this.detailExts.forEach((x: { questionNameValue: any; }) => {
      x.questionNameValue = '';
    });
  }

  //關閉問券頁
  closeQuestion() {
    this.overlayRef.detach();
  }

  //問券彈窗設定
  private popupSetting(): void {
    // 設定彈窗出來時的定位
    const strategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const configs = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: strategy,
    });

    this.overlayRef = this.overlay.create(configs);
    this.overlayRef.backdropClick().subscribe((res) => {
      this.overlayRef.detach();
    });
  }

  //報名資訊init
  query(): void {
    this.initPage();
    this.table.reset();
    this.execQuery();
  }

  //報名資訊查詢
  execQuery = () => {
    this.blockTable();
    this.common.doPostAPI('member/init', { id: this.id, member: this.qvo, pagination: this.paginationVo }).subscribe(resp => {
      if (!resp.result) {
        this.common.toast(Summary.Fail, resp.message, 'error');
        return;
      }
      this.queryList = resp.members;
      this.queryList.forEach((x, i) => x.rowNum = i + 1 + (this.curPageNum - 1) * this.pageSize);
      this.totalRecordCnt = resp.totalRecordCnt;
    }, this.unblockTable, this.unblockTable);
  }

  delete(): void {
    const checkedList = this.getCheckedList();
    if (checkedList.length < 1) {
      this.common.toast(Summary.Notice, '請選擇一筆資料', 'error');
      return;
    }

    this.blockTable();
    this.common.doPostAPI('member/delete', { members: checkedList }).subscribe(resp => {
      if (!resp.result) {
        this.common.toast(Summary.Fail, resp.message, 'error');
        return;
      }
      this.common.toast(Summary.Success, '資料刪除成功');
      this.query();
    }, this.unblockTable, this.unblockTable);

  }


  private getCheckedList(): any[] {
    return this.queryList.filter(x => x.checked);
  }

}
