import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncubatorComponent } from './incubator.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../page/page.module';
import {IncubatorRoutingModule} from './incubator-routing.module';



@NgModule({
  declarations: [IncubatorComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    PageModule,
    IncubatorRoutingModule,
    ReactiveFormsModule
  ]
})
export class IncubatorModule { }
