import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const isProdMode = environment.production;

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(...args: any[]) {
    if (isProdMode) {
      return;
    }
    console.log(...args);
  }

  warn(...args: any[]) {
    if (isProdMode) {
      return;
    }
    console.warn(...args);
  }

  error(...args: any[]) {
    console.error(...args);
  }

}
