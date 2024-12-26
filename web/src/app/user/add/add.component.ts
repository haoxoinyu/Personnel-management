import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {LoginService} from '../../service/login.service';
import {SharedService} from '../../service/shared.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  user = {
    id: 1,
    username: '',
    name: '',
  };

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              private loginService: LoginService,
              private sharedService: SharedService,
              private userService: UserService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.user);
    this.httpClient.post('/api/user/add', this.user)
      .subscribe((result) => {
        console.log('接收到返回数据', result);
        this.dialogRef.close(result);
        this.sweetAlertService.showSuccess('新增成功!', 'success');
      }, (error) => {
        if (error.error.error === '用户已存在') {
          this.sweetAlertService.showError('新增失败', '用户已存在', 'error');
        } else {
          this.sweetAlertService.showError('新增失败', '', 'error');
        }
        console.log('请求失败', error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
