import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** 数据源 */
  private isLogin: BehaviorSubject<boolean>;

  /** 数据源对应的订阅服务 */
  public isLogin$: Observable<boolean>;
  private isLoginCacheKey = 'isLogin';
  meUser: User;
  constructor(private httpClient: HttpClient) {
    const isLogin: string = window.sessionStorage.getItem(this.isLoginCacheKey);
    this.isLogin = new BehaviorSubject(this.convertStringToBoolean(isLogin));
    this.isLogin$ = this.isLogin.asObservable();
  }

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @return 登录成功:true; 登录失败: false。
   */
  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`api/Login`, {username, password});
  }

  /**
   * 设置登录状态
   * @param isLogin 登录状态
   */
  setIsLogin(isLogin: boolean) {
    window.sessionStorage.setItem(this.isLoginCacheKey, this.convertBooleanToString(isLogin));
    this.isLogin.next(isLogin);
  }

  /**
   * 注销
   */
  logout(): Observable<void> {
    const url = 'api/login/logout';
    return this.httpClient.get<void>(url);
  }

  /**
   * 字符串转换为boolean
   * @param value 字符串
   * @return 1 true; 其它 false
   */
  convertStringToBoolean(value: string) {
    return value === '1';
  }

  /**
   * boolean转string
   * @param value boolean
   * @return '1' true; '0' false;
   */
  convertBooleanToString(value: boolean) {
    return value ? '1' : '0';
  }

  /**
   * 获取当前登录的教师
   */
  me(user: User) {
    this.meUser = user;
  }

  getMe() {
    return this.meUser;
  }

  /**
   * 获取所有用户
   */
  all(): Observable<User[]> {
    const httpParams = new HttpParams().append('name', '');
    return this.httpClient.get<User[]>('api/User', {params: httpParams});
  }

  /**
   * 分页
   * @param params name:名称,page:第几页,size:每页大小
   */
  page(params: { username?: string, page?: number, size?: number }):
    Observable<{ totalPages: number, content: Array<User> }> {
    const url = 'api/User';

    /* 设置默认值 */
    if (params.page === undefined) {
      params.page = 0;
    }
    if (params.size === undefined) {
      params.size = 10;
    }

    /* 初始化查询参数 */
    const queryParams = new HttpParams()
      .set('name', params.username ? params.username : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    console.log(queryParams);

    return this.httpClient.get<{ totalPages: number, content: Array<User> }>(url, {params: queryParams});
  }

  /**
   * 更新用户
   * @param id id
   * @param user 用户
   */
  update(id: number | undefined, user: User | undefined): Observable<User> {
    const url = `api/user/update/${id}`;
    return this.httpClient.put<User>(url, user);
  }

  /**
   * 获取某个用户
   * @param id 用户ID
   */
  getById(id: number): Observable<User> {
    const url = `api/user/getbyid/${id}`;
    return this.httpClient.get<User>(url);
  }

  /**
   * 删除用户
   * @param id 用户id
   */
  deleteById(id: number): Observable<void> {
    const url = `api/user/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
