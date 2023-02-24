// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// import { LOGIN_ROUTE } from '../common/system-parameter';
// import { isEmpty, isNotEmpty } from '../common/util';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private auth: AuthService,
//     private router: Router,
//   ) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const targetUrl = state.url;
//     return this.checkAuth(targetUrl, route);
//   }

//   /**
//    * 檢查認證情況
//    * @param targetUrl 欲前往的 url
//    */
//   checkAuth(targetUrl: string, route: ActivatedRouteSnapshot): boolean {
//     console.log('@@@ checkAuth targetUrl:', targetUrl);

//     /**
//      * 之所以，先檢查是否"缺少token"
//      * 是因為，AppModule 實現自動登入
//      * 也是先看 "瀏覽器是否有 token"
//      */

//     // 若"缺少token"，則返回登入頁面
//     const accessToken = this.auth.getAccessToken();
//     const refreshToken = this.auth.getRefreshToken();
//     if (isEmpty(accessToken) || isEmpty(refreshToken)) {
//       console.log('@@@ checkAuth no pass because less token . . .');
//       // this.dialog.notify('common.notify', 'common.message.nologin');
//       this.auth.targetUrl = targetUrl;
//       this.auth.logout();
//       this.router.navigateByUrl(LOGIN_ROUTE);
//       return false;
//     }

//     // 若"尚未登入"，則返回登入頁面
//     if (!this.auth.isLogin) {
//       console.log('@@@ checkAuth no pass because no login . . .');
//       // this.dialog.notify('common.notify', 'common.message.nologin');
//       this.auth.targetUrl = targetUrl;
//       this.auth.logout();
//       this.router.navigateByUrl(LOGIN_ROUTE);
//       return false;
//     }

//     return true;
//   }
// }
