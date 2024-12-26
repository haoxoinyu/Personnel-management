import {Component, OnInit} from '@angular/core';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  isLogin = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.isLogin$.subscribe(isLogin => this.isLogin = isLogin);
  }
}
