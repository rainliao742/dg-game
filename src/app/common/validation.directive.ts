import { Directive, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';


// ========================================================================

/**
 * 檢驗: E-MAIL
 */
@Directive({
  selector: '[ngModel][appEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmailValidatorDirective),
      multi: true
    }
  ]
})
export class EmailValidatorDirective implements Validator {

  regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor() {
  }

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return this.regExp.test(c.value) ? null : { email: true };
  }

}

// ========================================================================

/**
 * 檢驗: 數字(不含小數)
 */
@Directive({
  selector: '[ngModel][appDigits]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DigitsValidatorDirective),
      multi: true
    }
  ]
})
export class DigitsValidatorDirective implements Validator {

  regExp = /^[0-9]*$/;

  constructor() {
  }

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return this.regExp.test(c.value) ? null : { digits: true };
  }

}

// ========================================================================

/**
 * 檢驗: 數字(有小數)
 */
@Directive({
  selector: '[ngModel][appDecimal]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DecimalValidatorDirective),
      multi: true
    }
  ]
})
export class DecimalValidatorDirective implements Validator, OnInit {

  @Input() appDecimal: number[] = [0, 0];
  lengthDigit: any;
  lengthFraction: any;
  regExp: any;

  constructor() {
  }

  ngOnInit() {
    this.lengthDigit = this.appDecimal[0] - this.appDecimal[1];
    this.lengthFraction = this.appDecimal[1];
    const pattern = `^[0-9]{1,${this.lengthDigit}}` + (this.lengthFraction > 0 ? `([\.][0-9]{1,${this.lengthFraction}})?$` : '$');
    this.regExp = new RegExp(pattern);
  }

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return this.regExp.test(c.value) ? null : {
      decimal: {
        digit: this.lengthDigit,
        fraction: this.lengthFraction
      }
    };
  }

}

// ========================================================================

/**
 * 檢驗: 只含
 *    1. 英文
 *    2. 數字
 *    3. underline(_)
 *    4. dash(-)
 */
@Directive({
  selector: '[ngModel][appCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CodeValidatorDirective),
      multi: true
    }
  ]
})
export class CodeValidatorDirective implements Validator {

  regExp = /^[a-zA-Z0-9_-]*$/;

  constructor() {
  }

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return this.regExp.test(c.value) ? null : { code: true };
  }

}

// ========================================================================

/**
 * 檢驗: 分機 (1-5個數字)
 */
@Directive({
  selector: '[ngModel][appExt]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ExtValidatorDirective),
      multi: true
    }
  ]
})
export class ExtValidatorDirective implements Validator {

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    const regExp = /^[0-9]{1,5}$/;
    return regExp.test(c.value) ? null : { ext: true };
  }

}

// ========================================================================

/**
 * 檢驗: 小於等於 最大值
 */
@Directive({
  selector: '[ngModel][appMax]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxValidatorDirective),
      multi: true
    }
  ]
})
export class MaxValidatorDirective implements Validator {

  @Input() appMax = 0;

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return c.value <= this.appMax ? null : {
      maxValue: {
        max: this.appMax,
        actual: c.value
      }
    };
  }
}

// ========================================================================

/**
 * 檢驗: 大於等於 最小值
 */
@Directive({
  selector: '[ngModel][appMin]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinValidatorDirective),
      multi: true
    }
  ]
})
export class MinValidatorDirective implements Validator {

  @Input() appMin = 0;

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    return c.value >= this.appMin ? null : {
      minValue: {
        min: this.appMin,
        actual: c.value
      }
    };
  }
}

// ========================================================================

/**
 * 檢驗: 統一編號
 */
@Directive({
  selector: '[ngModel][appTaxCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TaxCodeValidatorDirective),
      multi: true
    }
  ]
})
export class TaxCodeValidatorDirective implements Validator {

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }
    const invalidList = '00000000,11111111';
    if (/^\d{8}$/.test(c.value) === false || invalidList.indexOf(c.value) !== -1) {
      return { taxCode: true };
    }

    let sum = 0;
    const validateOperator = [1, 2, 1, 2, 1, 2, 4, 1];
    const calculate = function (product: any) { // 個位數 + 十位數
      const ones = product % 10;
      const tens = (product - ones) / 10;
      return ones + tens;
    };
    for (let i = 0; i < validateOperator.length; i++) {
      sum += calculate(c.value[i] * validateOperator[i]);
    }

    return (sum % 10 === 0 || (c.value[6] === '7' && (sum + 1) % 10 === 0)) ? null : { taxCode: true };
  }
}

// ========================================================================

/**
 * 檢驗: 身分證
 */
@Directive({
  selector: '[ngModel][appIDCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdCodeValidatorDirective),
      multi: true
    }
  ]
})
export class IdCodeValidatorDirective implements Validator {
  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }

    if (/^[A-Z](1|2)\d{8}$/.test(c.value) === false) {
      return { IdCode: true };
    }

    // //建立字母分數陣列(A~Z)
    const city = new Array(
      1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
      20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
    )

    //將字串分割為陣列(IE必需這麼做才不會出錯)
    const id: any[] = c.value.split('');
    //計算總分
    let total = city[id[0].charCodeAt(0) - 65];
    for (let i = 1; i <= 8; i++) {
      total += eval(id[i]) * (9 - i);
    }
    //補上檢查碼(最後一碼)
    total += eval(id[9]);
    //檢查比對碼(餘數應為0);
    return ((total % 10 === 0)) ? null : { IdCode: true };
  }

}

// ========================================================================

/**
 * 檢驗: 居留證編號
 */
@Directive({
  selector: '[ngModel][appArcCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ArcCodeValidatorDirective),
      multi: true
    }
  ]
})
export class ArcCodeValidatorDirective implements Validator {

  validate(c: FormControl): any {
    if (!c.value) {
      return;
    }

    if (/^[a-zA-Z]{1}[a-dA-D1-2]{1}[0-9]{8}$/.test(c.value) === false) {
      return { ArcCode: true };
    }

    const idVal = c.value;
    let sum = 0;
    const str1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const str2 = "1011121314151617341819202122352324252627282932303133";
    const t1 = str2.substr(str1.indexOf(idVal.substr(0, 1)) * 2, 2);
    const t2 = str2.substr(str1.indexOf(idVal.substr(1, 1)) * 2, 2);

    sum = Number(t1.substr(0, 1)) * 1 + Number(t1.substr(1, 1)) * 9;
    sum += (Number(t2) % 10) * 8;

    const t10 = idVal.substr(9, 1);
    let t10_ = 0;

    for (let t_i = 3; t_i <= 9; t_i++) {
      sum += idVal.substr(t_i - 1, 1) * (10 - t_i);
    }

    (sum % 10 === 0) ? t10_ = 0 : t10_ = 10 - (sum % 10);

    return (t10_ === t10) ? null : { ArcCode: true };
  }
}


// ========================================================================

/**
 * 自動跳框
 */
@Directive({
  selector: '[appAutoTab]'
})
export class AutoTabDirective {
  @Input('appAutoTab') appAutoTab!: { focus: () => void; };

  @HostListener('input', ['$event.target']) onInput(input: { value: string | any[]; attributes: { maxlength: { value: any; }; }; }) {
    const length = input.value.length
    const maxLength = input.attributes.maxlength.value
    if (length >= maxLength) {
      this.appAutoTab.focus()
    }
  }
}