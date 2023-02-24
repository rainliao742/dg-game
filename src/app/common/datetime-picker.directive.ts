import { Directive, ElementRef, forwardRef, Input, NgZone, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { FlatpickrFn, Instance } from 'flatpickr/dist/types/instance';
import { Options } from 'flatpickr/dist/types/options';
import { FlatpickrMode } from 'src/app/common/scheme';
import { isNotEmpty } from 'src/app/common/util';

declare var flatpickr: FlatpickrFn;

@Directive({
  selector: '[ngModel][appDatetimePicker]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatetimePickerDirective),
      multi: true
    }
  ],
})
export class DatetimePickerDirective implements OnInit, OnChanges, Validator {

  @Input() mode: FlatpickrMode = 'date';

  placeholder = 'yyyy/MM/dd';
  dateFormat = 'Y/m/d';
  noCalendar = false;
  enableTime = false;
  enableSeconds = false;
  regExp = /^\d{4}\/\d{2}\/\d{2}$/;

  constructor(
    private zone: NgZone,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('【DatePickerDirective】 ngOnChanges . . . ; changes:', changes);
    switch (this.mode) {
      case 'datetime':
        this.placeholder = 'yyyy/MM/dd HH:mm';
        this.dateFormat = 'Y/m/d H:i';
        this.noCalendar = false;
        this.enableTime = true;
        this.enableSeconds = false;
        this.regExp = /^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}$/;
        break;
      case 'datetime_second':
        this.placeholder = 'yyyy/MM/dd HH:mm:ss';
        this.dateFormat = 'Y/m/d H:i:S';
        this.noCalendar = false;
        this.enableTime = true;
        this.enableSeconds = true;
        this.regExp = /^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}$/;
        break;
      case 'time':
        this.placeholder = 'HH:mm';
        this.dateFormat = 'H:i';
        this.noCalendar = true;
        this.enableTime = true;
        this.enableSeconds = false;
        this.regExp = /^\d{2}:\d{2}$/;
        break;
      case 'time_second':
        this.placeholder = 'HH:mm:ss';
        this.dateFormat = 'H:i:S';
        this.noCalendar = true;
        this.enableTime = true;
        this.enableSeconds = true;
        this.regExp = /^\d{2}:\d{2}:\d{2}$/;
        break;
    }
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {

      const hostElement = this.elementRef.nativeElement;
      this.renderer.setAttribute(hostElement, 'placeholder', this.placeholder);
      this.renderer.addClass(hostElement, 'date-picker-input');

      const options: Options = {
        dateFormat: this.dateFormat,
        noCalendar: this.noCalendar,
        enableTime: this.enableTime,
        enableSeconds: this.enableSeconds,
        minuteIncrement: 1, // second 也會受影響
        time_24hr: true,
      };
      const instance: Instance = flatpickr(hostElement, options);

      // create calendar element
      const spanElement = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.addClass(spanElement, 'date-picker-calendar');
      const iElement = this.renderer.createElement('i') as HTMLElement;
      this.renderer.addClass(iElement, 'pi');
      this.renderer.addClass(iElement, 'pi-calendar');
      this.renderer.appendChild(spanElement, iElement);
      this.renderer.listen(spanElement, 'click', () => instance.open());

      // append calendar element
      const parent = this.renderer.parentNode(hostElement);
      this.renderer.insertBefore(parent, spanElement, hostElement.nextSibling);
    });
  }

  validate(control: FormControl): ValidationErrors | null {

    const value = control.value as string;

    const failFormat = isNotEmpty(value) && !this.regExp.test(value);

    if (!failFormat) {
      return null;
    }

    return { date: { failFormat } };
  }
}
