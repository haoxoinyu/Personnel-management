import {Injectable} from '@angular/core';

/**
 * 缓存
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  /** 认证令牌 */
  private static authToken: string | null = sessionStorage.getItem('authToken');

  constructor() {
  }

  static setAuthToken(token: string | null) {
    CacheService.authToken = token;
    if (typeof token === 'string') {
      sessionStorage.setItem('authToken', token);
    }
  }

  static getAuthToken() {
    if (CacheService.authToken === null) {
      return '';
    }
    return CacheService.authToken;
  }
}
