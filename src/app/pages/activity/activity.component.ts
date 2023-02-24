import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm} from '@angular/forms';
import { addDays, format, compareAsc } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { DialogService } from 'src/app/common/dialog/dialog.service';



@Component({
  selector: 'app-activityComponent',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @ViewChild("question") questionRef!: TemplateRef<any>;
  overlayRef!: OverlayRef;

  @ViewChild("checkin") checkinRef!: TemplateRef<any>;
  overlayRef2!: OverlayRef;

  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;

  vo = { master: {id: 0}, details: [], masterExt: {}, detailExts: [] };
  checkInVo = { masterExt: {} };
  keyQuestionValue = '';
  activityName = '';
  keyQuestion = '';
  today: any;
  masterExt: any;
  detailExts: any;
  start!:Date;
  end!:Date;
  checkInMaster:any;
  isTodayInAxt!:boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private dialog: DialogService,
    // -----------------------------
    // 找到答案了 !  被開啟的頁面，才會有這個物件
    // 這個頁面沒有被人開起，所以這邊才會是空的
    // -----------------------------
    // @Inject(MAT_DIALOG_DATA) public data: any
    ) {
 
  }


  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.vo.master.id = parseInt(id);
 
    this.initActivity()
    this.popupSetting();
  }

  initActivity(): void {
    this.common.doPostAPI('activity/init', this.vo).subscribe(resp => {
      //問券填寫區
      this.masterExt = resp.master;
      this.masterExt.keyQuestionValue = '';

      this.detailExts = resp.details;
      this.detailExts.forEach((x: { questionNameValue: any; }) => {
        x.questionNameValue = '';
      });

      this.activityName = this.masterExt.activityName;
      this.keyQuestion = this.masterExt.keyQuestion;

      this.today = new Date();
      console.log(resp, 666);

      //日期
      this.start = new Date(Date.parse(this.masterExt?.activityStartTime));
      this.end = new Date(Date.parse(this.masterExt?.activityEndTime));


      //報到區
      this.checkInMaster = resp.master;
      this.checkInMaster.keyQuestionValue = '';

    });
  }

  openQuestion(): void {
    this.overlayRef.attach(
      new TemplatePortal(this.questionRef, this.viewContainerRef)
    );
  }

  closeQuestion() {
    this.overlayRef.detach();
  }

  openCheckin(): void {
    this.overlayRef2.attach(
      new TemplatePortal(this.checkinRef, this.viewContainerRef)
    );
  }

  closeCheckin() {
    this.overlayRef2.detach();
  }

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

    this.overlayRef2 = this.overlay.create(configs);
    this.overlayRef2.backdropClick().subscribe((res) => {
      this.overlayRef2.detach();
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


  saveCheckin() {
    console.log(this.checkInMaster);
    if (this.form2.invalid) {
      return;
    }
    this.checkInVo.masterExt=this.checkInMaster;
    this.common.doPostAPI('activity/checkIn', this.checkInVo).subscribe(resp => {
      console.log(resp,666)
      if (!resp.result) {
        this.dialog.notify('*注意*', resp.msg);
        return;
      }
      this.dialog.notify('*通知*', '報到成功~~');
    });
  }

}
