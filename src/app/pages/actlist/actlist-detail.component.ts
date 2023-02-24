import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { Summary } from 'src/app/common/constant';
import { isNotEmpty } from 'src/app/common/util';

@Component({
  selector: 'app-actlist-detail',
  templateUrl: './actlist-detail.component.html',
  styleUrls: ['./actlist-detail.component.css']
})
export class ActlistDetailComponent implements OnInit {

  @ViewChild('form', { static: true }) form!: NgForm;

  isAdd: boolean | undefined;
  isAlreadyReply = false;
  isInitOk = false;
  vo = {} as any;
  detailList = [] as any[];
  identity = 0;
  startTime = '';
  endTime = '';


  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.isAdd = this.route.snapshot.url[1].path === 'add';
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.vo.id = id;
    this.isAdd ? this.init4Add() : this.checkReply(id), this.init4Edit(id);
  }

  back(): void {
    this.common.goBack();
  }

  checkReply(id: any): void {

    this.common.doPostAPI('member/checkReply', { id: id }).subscribe(resp => {
      if (!resp.result) {
        this.common.toast(Summary.Fail, resp.message, 'error');
        return;
      }
      if (resp.members.length >0){
        this.isAlreadyReply=true;      
      }

    });
  }

saveAdd(): void {
  if(this.startTime > this.endTime) {
  this.common.toast(Summary.Notice, '起始日期不可大於結束日期', 'warn');
  return;
}
if (this.form.invalid) {
  return;
}
this.common.confirm('確定新增 ?', this.execSaveAdd);
  }

saveEdit(): void {
  if(this.startTime > this.endTime) {
  this.common.toast(Summary.Notice, '起始日期不可大於結束日期', 'warn');
  return;
}

if (this.form.invalid) {
  return;
}
this.common.confirm(`確定修改<span class="major">${this.vo.activityName}</span> ?`, this.execSaveEdit);
  }

delete (): void {
  this.common.confirm(`確定刪除<a class="major">${this.vo.activityName}</a> ? <br>
    若刪除活動問題及問券填寫資料也會刪除唷`, this.execDelete, 'danger');
}

plus(): void {
  this.detailList.push({ identity: this.identity++ });
}

minus(i: number): void {
  this.detailList.splice(i, 1);
}

  private init4Add(): void {
  this.vo = {};
  this.endTime = '';
  this.startTime = '';
  this.initDetailList();
}

  private init4Edit(id: string): void {

  this.common.doPostAPI('gameSetting/initEdit', { master: this.vo }).subscribe(resp => {
    if (!resp.result) {
      this.common.toast(Summary.Fail, resp.message, 'error');
      return;
    }
    this.isInitOk = true;
    this.vo = resp.master;
    this.startTime = resp.startTime;
    this.endTime = resp.endTime;
    this.initDetailList(resp.details);
  });
}

  private initDetailList(array ?: any[]): void {
  this.identity = 0;
  this.detailList = isNotEmpty(array) ? array as any[] : [{}]; // 預設一筆明細
  this.detailList.forEach(x => x.identity = this.identity++);

}

  private reset4Add(): void {
  this.form.resetForm();
  setTimeout(() => {
  this.vo = {};
  this.initDetailList();
});
  }


  private execSaveEdit = () => {

  this.detailList.forEach((x, i) => x.id = { activityHId: this.vo.id, seq: i + 1 });

  this.common.doPostAPI('gameSetting/saveEdit', { master: this.vo, startTime: this.startTime, endTime: this.endTime, details: this.detailList }).subscribe(resp => {
    if (!resp.result) {
      this.common.toast(Summary.Fail, resp.message, 'error');
      return;
    }
    this.common.toast(Summary.Success, '活動修改成功');
    this.common.goBack();
  });
}


  private execSaveAdd = () => {

  this.detailList.forEach((x, i) => x.id = { seq: i + 1 });

  this.common.blockUI();
  this.common.doPostAPI('gameSetting/saveAdd', { master: this.vo, startTime: this.startTime, endTime: this.endTime, details: this.detailList }).subscribe(resp => {
    if (!resp.result) {
      this.common.toast(Summary.Fail, resp.message, 'error');
      return;
    }
    this.common.toast(Summary.Success, '活動新增成功');
    this.reset4Add();
    this.common.goBack();
  }, this.common.unblockUI, this.common.unblockUI);
}

  private execDelete = () => {
  this.common.blockUI();
  this.common.doPostAPI('gameSetting/delete', { master: this.vo }).subscribe(resp => {
    if (!resp.result) {
      this.common.toast(Summary.Fail, resp.message, 'error');
      return;
    }
    this.common.toast(Summary.Success, '活動刪除成功');
    this.common.goBack();
  }, this.common.unblockUI, this.common.unblockUI);
}
}
