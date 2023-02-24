import { Injectable } from '@angular/core';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../common/system-parameter';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private _storage = sessionStorage; // 儲存空間 (sessionStorage / localStorage)

    constructor(
    ) { }

    getItem(key: string): string {
        let itemv = this._storage.getItem(key);
        itemv = itemv == null ? "" : itemv;
        return itemv;
    }
    setItem(key: string, value: string) {
        this._storage.setItem(key, value);
    }

    getAccessToken() {
        return this.getItem(JWT_ACCESS_TOKEN);
    }

    setAccessToken(accessToken: string) {
        return this.setItem(JWT_ACCESS_TOKEN, accessToken);
    }

    getRefreshToken() {
        return this.getItem(JWT_REFRESH_TOKEN);
    }

    setRefreshToken(refreshToken: string) {
        return this.setItem(JWT_REFRESH_TOKEN, refreshToken);
    }
}
