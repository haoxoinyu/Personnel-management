import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../entity/user';
import {LoginService} from '../../service/login.service';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  /**
   * 用户名称.
   */
  nameFormControl = new FormControl('', Validators.required);

  user = {
    id: 1,
    name: '',
    username: ''
  };
  users: User;
  value = '';

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    username: new FormControl(null, Validators.required)
  });

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private loginService: LoginService,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.loadById(+id);
  }

  /**
   * 由后台加载预编辑的班级.
   * @param id 班级id.
   */
  loadById(id: number): void {
    console.log('loadById');
    id = this.sharedService.getId();
    console.log(id);
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    console.log(this.user.name);
    this.httpClient.post<User>(`api/user/edit/${id}`, id)
      .subscribe(user => {
        console.log('接收到了user', user);
        this.users = user;
        this.nameFormControl.patchValue(user[0].name);
        this.formGroup.get('username').setValue(user[0].username);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const userId = this.users[0].id;
    const name = this.nameFormControl.value;
    const username = this.formGroup.get('username').value;
    const password = 'yunzhi';
    const user = new User(
      userId,
      username,
      name,
      password
    );
    console.log(user);
    this.httpClient.put<User>(`/api/user/update`, user)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(user);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '用户已存在') {
            this.sweetAlertService.showError('编辑失败', '用户已存在', 'error');
          } else {
            this.sweetAlertService.showError('编辑失败', '', 'error');
          }
          console.log(error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
