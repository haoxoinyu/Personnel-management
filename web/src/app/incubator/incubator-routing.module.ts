import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IncubatorComponent} from './incubator.component';

const routes: Routes = [
  {
    path: '',
    component: IncubatorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncubatorRoutingModule {
}
