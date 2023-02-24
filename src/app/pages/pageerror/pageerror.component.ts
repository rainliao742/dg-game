import { Component, OnInit } from '@angular/core';

// JQuery
declare function jScript1(): any;

@Component({
  selector: 'app-pageerror',
  templateUrl: './pageerror.component.html',
  styleUrls: ['./pageerror.component.css']
})
export class PageerrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
    window.scrollTo(0,0);

    jScript1();
  }

}
