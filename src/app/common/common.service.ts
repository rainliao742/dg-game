import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { SubjectType } from './constant';
import { ConfirmSeverity, MessageSeverity } from './scheme';
import { HTTP_OPTION, LOGIN_API, REST_API } from './system-parameter';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  private subject = new Subject<SubjectType>();
  blocked = false;
  visible = false; // for p-dialog
  innerHTML = ''; // for p-dialog
  selectedItemsLabel = '已選擇 {0} 筆'; // for p-multiSelect

  blockUI = () => this.blocked = true;
  unblockUI = () => this.blocked = false;

  constructor(
    private http: HttpClient,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  publish(type: SubjectType): void {
    this.subject.next(type);
  }

  goBack(): void {
    this.location.back();
  }

  scrollTo(element: HTMLElement): void {
    window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
  }

  toast(summary: string, detail: string, severity: MessageSeverity = 'info'): void {
    this.messageService.add({
      summary, detail, severity,
    });
  }

  confirm(message: string, accept: () => void, severity: ConfirmSeverity = 'info', reject?: () => void): void {
    let acceptButtonStyleClass = '';
    let rejectButtonStyleClass = 'p-button-text';
    if (severity === 'danger') {
      acceptButtonStyleClass += ' p-button-danger';
      rejectButtonStyleClass += ' p-button-danger';
    }
    this.confirmationService.confirm({
      message, accept, reject, acceptButtonStyleClass, rejectButtonStyleClass,
    });
  }

  dialog(message: string): void {
    this.visible = true;
    this.innerHTML = message;
  }

  // ================================= call rest api =================================

  doLogin(vo: any) {
    return this.http.post<any>(LOGIN_API, vo, HTTP_OPTION);
  }

  doPostAPI(url: string, vo: any) {
    return this.http.post<any>(REST_API + url, vo, HTTP_OPTION);
  }
}

