import { Component, OnInit } from '@angular/core';
import {User} from '../entity/user';
import {UserService} from '../service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './change-password/change-password.component';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.sass']
})
export class PersonalCenterComponent implements OnInit {
  /** 绑定到V层 */
  public user: User | undefined;
  public role: number | undefined;
  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    // 调用M层的相关方法
    this.user = this.userService.getMe();
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '900px',
      height: '400px',
      data: this.user
    });
  }

}
