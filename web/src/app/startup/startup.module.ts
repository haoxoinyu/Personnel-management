import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {StartupRoutingModule} from './startup-routing.module';
import {PageModule} from '../page/page.module';
import {StartupComponent} from './startup.component';



@NgModule({
  declarations: [StartupComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    PageModule,
    StartupRoutingModule,
  ]
})
export class StartupModule { }
