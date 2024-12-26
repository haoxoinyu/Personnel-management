import {Component, Inject} from '@angular/core';
import {UserService} from '../../service/user.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../entity/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent {
  oldPassword?: string;
  newPassword?: string;
  Password?: string;
  me?: User;

  constructor(private userService: UserService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.me = data;
  }

  onSubmit() {
    console.log(this.oldPassword);
    console.log(this.me.password);
    if (this.oldPassword !== this.me.password) {
      this.sweetAlertService.showError('修改失败', '旧密码不正确', 'error');
    } else {
      this.me.password = this.newPassword;
      this.userService.update(this.me.id, this.me)
        .subscribe((response: any) => {
            // 处理成功响应
            console.log('Password changed successfully', response);
            this.dialogRef.close(response);
            this.sweetAlertService.showSuccess('修改成功!', 'success');
            setTimeout(() => {
              this.sweetAlertService.returnLogin();
            }, 1500);
          },
          (error: { error: { error: string; }; }) => {
            console.error('Error changing password', error);
          }
        );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
