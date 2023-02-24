import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-script',
  template: `
    <div #script style.display="none">
      <ng-content></ng-content>
    </div>
  `
})
export class ScriptComponent implements OnInit, AfterViewInit {

  @Input()
  type!: string;
  @Input()
  src!: string;
  @ViewChild('script')
  script!: ElementRef;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.convertToScript();
  }

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.type = this.type ? this.type : 'text/javascript';
    if (this.src) {
      script.src = this.src;
    }
    if (element.innerHTML) {
      script.innerHTML = element.innerHTML;
    }
    const parent = element.parentElement;
    parent.parentElement.replaceChild(script, parent);
  }

}
