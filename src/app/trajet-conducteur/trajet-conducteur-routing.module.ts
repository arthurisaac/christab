import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetConducteurPage } from './trajet-conducteur.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetConducteurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetConducteurPageRoutingModule {}
