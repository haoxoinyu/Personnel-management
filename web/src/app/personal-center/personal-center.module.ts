import { NgModule } from '@angular/core';
import {PersonalCenterComponent} from './personal-center.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {PersonalCenterRoutingModule} from './personal-center-routing.module';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    PersonalCenterComponent,
  ],
  entryComponents: [ChangePasswordComponent],
  imports: [
    CommonModule,
    PersonalCenterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ]
})
export class PersonalCenterModule { }
