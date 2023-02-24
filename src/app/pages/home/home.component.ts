import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { LoggerService } from 'src/app/common/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private logger: LoggerService,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  loginType: boolean | undefined;
  errorMsg = '';
  vo = { userId: '', password: '' } as any;
  //{ userId: 'admin', password: 'admin' } 


  ngOnInit(): void {
  }

  login() {
    this.common.blockUI();
    this.common.doLogin(this.vo).subscribe({
      next: (respVo) => {
        //前往活動維護後台
        this.loginType = true;
        this.router.navigate(['../list']);
      }, error: (error) => {
        this.errorMsg = '登入失敗';
        this.loginType = false;
        console.log(this.errorMsg, !this.loginType);
        this.common.unblockUI();
      }, complete: () => {
        this.common.unblockUI();
      }
    });
  }

}
