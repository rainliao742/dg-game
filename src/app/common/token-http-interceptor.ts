import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from './logger.service';
import { CAR_MODEL, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN, LOGIN_API } from './system-parameter';

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {

  constructor(
    private logger: LoggerService,
    private auth: AuthService,
    private router: Router
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 情況 A. request to the same origin
    if (req.url.startsWith('/assets')) {
      this.logger.log('### access: ' + req.url);
      return next.handle(req);
    }

    // 情況 B. request to login api
    if (req.url === LOGIN_API) {
      this.logger.log('### request to login api', req.url);
      return next
        .handle(req)
        .pipe(
          tap(event => {
            this.logger.log('### event:', event);
            if (event instanceof HttpResponse) {
              this.auth.setAccessToken(event.body[JWT_ACCESS_TOKEN]);
              this.auth.setRefreshToken(event.body[JWT_REFRESH_TOKEN]);
              this.logger.log('### store information . . .');
            }
          }),
          catchError(this.handleError.bind(this)) // handle the error
        );
    }

    // 情況 C. request to other api
    this.logger.log('### request to the api:', req.url);
    const accessToken = this.auth.getAccessToken();
    const refreshToken = this.auth.getRefreshToken();
    const newReq = accessToken === null || refreshToken === null
      ? req
      : req.clone({
        setHeaders: { [JWT_ACCESS_TOKEN]: accessToken, [JWT_REFRESH_TOKEN]: refreshToken },
        body: { ...req.body, carModel: CAR_MODEL }
      });
    return next
      .handle(newReq)
      .pipe(
        tap({
          next: event => {
            this.logger.log('### event:', event);
            if (event instanceof HttpResponse) {
              const newAccessToken = event.headers.get(JWT_ACCESS_TOKEN);
              const newRefreshToken = event.headers.get(JWT_REFRESH_TOKEN);
              if (newAccessToken && newRefreshToken && newAccessToken !== accessToken && newRefreshToken !== refreshToken) {
                this.auth.setAccessToken(newAccessToken);
                this.auth.setRefreshToken(newRefreshToken);
                this.logger.log('### update information . . .');
              }
            }
          },
          error: (error) => {
            this.logger.error('### error:', error, 'status:', error.status);
            if (error.status === 401 || error.status === 403) {
              this.logger.log(`### ${error.status} happens! navigate to login page.`);
              this.router.navigate(['index'],);
            }
          }
        }),
        catchError(this.handleError.bind(this)) // handle the error
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {

    this.logger.log('### handle the error: ', error);

    if (error.error instanceof ProgressEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.error('A client-side or network error occurred');
    } else if (error.error instanceof ErrorEvent) {
      // show message
      this.logger.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong
      this.logger.error(`Backend returned code ${error.status},`, 'body was:', error.error);
    }

    return throwError(error);
  }
}
