import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNotifyComponent } from './dialog-notify.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
    console.log('DialogService is created . . .');
  }

  /**
   * 通知訊息(多語系)
   * @param title 標題
   * @param msg 訊息
   * @param msgParam 訊息內的變數
   * @param isChangeLine 訊息是否依<br>要換行
   */
  notify(title: any, msg: any, msgParam = {}, isChangeLine = false) {
    return this.dialog.open(DialogNotifyComponent, {
      disableClose: false,
      panelClass: 'custom-dialog',
      data: {
        title,
        message: msg,
        messageParam: msgParam,
        isChangeLine
      }
    });
  }


}
