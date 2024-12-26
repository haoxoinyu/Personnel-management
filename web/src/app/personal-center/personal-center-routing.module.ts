import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonalCenterComponent} from "./personal-center.component";


/*定义路由*/
const routes: Routes = [
  {
    path: '',
    component: PersonalCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalCenterRoutingModule { }
