import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {EmployeesRoutingModule} from './employees-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../page/page.module';



@NgModule({
  declarations: [EmployeesComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    MatDialogModule,
    FormsModule,
    PageModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
