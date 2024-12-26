import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'incubator',
    loadChildren: () => import('./incubator/incubator.module').then(m => m.IncubatorModule)
  },
  {
    path: 'startup',
    loadChildren: () => import('./startup/startup.module').then(m => m.StartupModule)
  },
  {
    path: 'employees',
    loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule)
  },
  {
    path: 'investors',
    loadChildren: () => import('./investors/investors.module').then(m => m.InvestorsModule)
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule)
  },
  {
    path: 'personalCenter',
    loadChildren: () => import('./personal-center/personal-center.module').then(m => m.PersonalCenterModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: []
})
export class AppRoutingModule {
}
