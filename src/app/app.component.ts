import { Component } from '@angular/core';
import { CommonService } from './common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'buycar';

  constructor(
    public common: CommonService,
  ) {
  }

  ngOnInit() {
  }
}
