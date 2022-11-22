import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetCartePage } from './trajet-carte.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetCartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetCartePageRoutingModule {}
