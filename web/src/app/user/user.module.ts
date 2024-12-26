import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {PageModule} from '../page/page.module';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
  declarations: [UserComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    PageModule,
    UserRoutingModule
  ]
})
export class UserModule { }
