import {Component, EventEmitter, OnInit} from '@angular/core';
import {Page} from '../entity/page';
import {User} from '../entity/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormGroup, NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../service/sweet-alert.service';
import {LoginService} from '../service/login.service';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {SharedService} from '../service/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  // 默认显示第1页的内容
  page = 0;

  // 每页默认为5条
  size = 5;

  // 初始化一个有0条数据的
  pageData = new Page<User>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });

  searchParameters = {
    username: ''
  };

  me: User;
  beLogout = new EventEmitter<void>();

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private loginService: LoginService,
              private sharedService: SharedService) {
  }

  form = new FormGroup({});

  ngOnInit(): void {
    console.log('app组件调用ngOnInit()');
    // 使用默认值 page = 0 调用loadByPage()方法
    this.loadByPage();
  }

  onPage(page: number): void {
    this.loadByPage(page);
  }

  loadByPage(page = 1): void {
    console.log('触发loadByPage方法');
    const httpParams = new HttpParams().append('page', page.toString())
      .append('size', this.size.toString());
    console.log(this.searchParameters);
    this.httpClient.post<Page<User>>('/api/user', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('重新设置pageData');
          this.pageData = pageData;
        },
        error => {
          console.error('请求数据失败', error);
        }
      );
  }

  onDelete(index: number, id: number): void {
    this.sweetAlertService.showWarning('', '', 'warning')
      .then(isConfirmed => {
        if (isConfirmed) {
          this.httpClient.delete(`/api/user/delete/${id}`)
            .subscribe(() => {
                console.log('删除成功');
                this.sweetAlertService.showSuccess('删除成功', 'success');
                this.pageData.content.splice(index, 1);
                this.loadByPage();
              },
              error => {
                this.sweetAlertService.showError('删除失败', '请稍后再试。', 'error');
                console.log('删除失败', error);
              });
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '1000px',
      height: '360px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadByPage(this.page);
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    this.sharedService.setId(id);
    const dialogRef = this.dialog.open(EditComponent, {
      width: '1000px',
      height: '360px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadByPage(this.page);
    });
  }

  onSubmit(form: NgForm, page = 1) {
    console.log('调用了search');
    console.log(this.searchParameters);
    if (form.valid) {
      console.log(this.sharedService.getSomeValue());
      console.log('提交的查询参数:', this.searchParameters);
      const httpParams = new HttpParams().append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<User>>('/api/user', this.searchParameters, {params: httpParams}).subscribe(
        pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('clazz组件接收到查询返回数据，重新设置pageData');
          console.log(pageData);
          this.pageData = pageData;
          this.loadByPage(page);
        },
        error => {
          console.error('请求数据失败', error);
        }
      );
    }
  }
}
