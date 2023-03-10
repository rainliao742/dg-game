import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-notify',
  templateUrl: './dialog-notify.component.html',
  styleUrls: ['./dialog-notify.component.css']
})
export class DialogNotifyComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogNotifyComponent>,
   
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit() {
  }
}
