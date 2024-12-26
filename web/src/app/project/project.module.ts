import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../page/page.module';
import {ProjectRoutingModule} from './project-routing.module';



@NgModule({
  declarations: [ProjectComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    PageModule,
    ProjectRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProjectModule { }
