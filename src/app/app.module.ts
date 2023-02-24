import { OverlayModule } from "@angular/cdk/overlay";
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import flatpickr from 'flatpickr';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw';
import { CountdownModule } from 'ngx-countdown';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginationComponent } from './common/component/pagination.component';
import { DatetimePickerDirective } from './common/datetime-picker.directive';
import { DialogNotifyComponent } from './common/dialog/dialog-notify.component';
import { LoggerService } from './common/logger.service';
import { ScriptComponent } from './common/script.component';
import { TokenHttpInterceptor } from './common/token-http-interceptor';
import { AutoTabDirective } from './common/validation.directive';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActlistDetailComponent } from './pages/actlist/actlist-detail.component';
import { ActlistMemberComponent } from "./pages/actlist/actlist-member.component";
import { ActlistQueryComponent } from './pages/actlist/actlist-query.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { PageerrorComponent } from './pages/pageerror/pageerror.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

flatpickr.defaultConfig = {
  locale: MandarinTraditional,
  allowInput: true,
  clickOpens: false,
  disableMobile: true,
};

@NgModule({
  declarations: [
    AppComponent,
    AutoTabDirective,
    ActivityComponent,
    ActlistQueryComponent,
    ActlistDetailComponent,
    ActlistMemberComponent,
    PageerrorComponent,
    ScriptComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DialogNotifyComponent,
    PaginationComponent,
    DatetimePickerDirective,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxSpinnerModule,
    CountdownModule,
    AppRoutingModule,
    NgxMaskModule.forRoot(maskConfig),
    OverlayModule,
    MatDialogModule,

    //primeng
    ConfirmDialogModule,
    DynamicDialogModule,
    DialogModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
    ToastModule,
    BlockUIModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenHttpInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    MessageService,
    ConfirmationService,
  ],
})
export class AppModule {
  constructor(private logger: LoggerService) {
    logger.log('MainModule is created . . .');
  }
}
