import {EventEmitter, Injectable} from '@angular/core';
import Swal, {SweetAlertResult} from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor(private httpClient: HttpClient, private router: Router, private userService: UserService) { }

  /**
   * 显示错误信息
   * @param title 弹窗标题
   * @param text 弹窗文本
   * @param icon 弹窗图标
   */
  public showError(title: string, text: string, icon: 'error'): void {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  }

  /**
   * 显示成功信息
   * @param title 弹窗标题
   * @param icon 弹窗图标
   */
  public showSuccess(title: string, icon: 'success'): void {
    Swal.fire({
      title,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  }

  /**
   * 显示无条款信息
   * @param title 弹窗标题
   * @param text 弹窗文本
   * @param icon 弹窗图标
   */
  public showWithoutTerm(title: string, text: string, icon: 'warning'): void {
    Swal.fire({
      icon: 'warning',
      title,
      text,
    }).then(() => {
      this.router.navigate(['term']);
    });
  }

  /**
   * 显示注销警告
   * @param title 弹窗标题
   * @param icon 弹窗图标
   */
  public showLogoutWarning(title: string, icon: 'warning'): void {
    Swal.fire({
      title,
      icon: 'warning',
      showConfirmButton: false,
      timer: 1500
    });
  }

  /**
   * 显示警告信息
   * @param title 弹窗标题
   * @param text 弹窗文本
   * @param icon 弹窗图标
   * @returns Promise<boolean>
   */
  public showWarning(title: string, text: string, icon: 'warning'): Promise<boolean> {
    return Swal.fire({
      title: '确定吗?',
      text: '该操作可能会失败，建议检查有关数据是否清空。',
      icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，删除！',
      cancelButtonText: '取消'
    }).then((result: { isConfirmed: any; }) => {
      return result.isConfirmed;
    });
  }

  /**
   * 显示信息
   */
  public showInfo(): void {
    Swal.fire({
      title: '用户已冻结',
      text: '请联系管理员解决',
      icon: 'question'
    });
  }

  /**
   * 返回登录界面
   */
  public returnLogin(): void {
    Swal.fire({
      title: '即将返回登录界面...',
      html: '',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then((result: SweetAlertResult<any>) => { // 明确 result 的类型
      if (result && result.dismiss !== Swal.DismissReason.cancel) { // 检查 result 是否存在
        console.log('I was closed by the timer');
        this.userService.logout()
          .subscribe(() => {
            this.userService.setIsLogin(false);
          });
      }
    });
  }
}
