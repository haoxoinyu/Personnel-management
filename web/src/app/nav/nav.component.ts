import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {
  /*标题*/
  title: string | undefined;
  /*菜单项*/
  menus = new Array<{ url: string; name: string }>();

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.title = '教务管理系统';
    this.menus.push({url: 'user', name: '登录用户管理'});
    this.menus.push({url: 'incubator', name: '孵化公司管理'});
    this.menus.push({url: 'startup', name: '创业公司管理'});
    this.menus.push({url: 'employees', name: '员工管理'});
    this.menus.push({url: 'investors', name: '投资方管理'});
    this.menus.push({url: 'project', name: '创业项目管理'});
    this.menus.push({url: 'personalCenter', name: '个人中心'});
  }

  onLogout() {
    this.userService.logout()
      .subscribe(() => {
        this.userService.setIsLogin(false);
      });
  }

}
