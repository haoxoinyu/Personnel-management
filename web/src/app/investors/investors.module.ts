import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorsComponent } from './investors.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../page/page.module';
import {InvestorsRoutingModule} from './investors-routing.module';



@NgModule({
  declarations: [InvestorsComponent, AddComponent, EditComponent],
  entryComponents: [AddComponent, EditComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    PageModule,
    InvestorsRoutingModule,
    ReactiveFormsModule
  ]
})
export class InvestorsModule { }
