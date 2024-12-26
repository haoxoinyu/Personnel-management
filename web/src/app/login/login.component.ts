import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../service/user.service';
import {SweetAlertService} from '../service/sweet-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup | undefined;

  constructor(private userService: UserService,
              private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  /**
   * 点击提交按钮后进行用户登录
   */
  onSubmit() {
    const username = this.formGroup.get('username').value;
    const password = this.formGroup.get('password').value;
    this.userService.login(username, password).subscribe(result => {
        this.userService.me(result);
        this.userService.setIsLogin(true);
        this.sweetAlertService.showSuccess('登录成功', 'success');
    },
    error => {
      if (error.error.error === '用户不存在') {
        this.sweetAlertService.showError('用户不存在', '', 'error');
      }
      if (error.error.error === '密码不正确') {
        this.sweetAlertService.showError('密码不正确', '', 'error');
      }
    });
  }
}
