import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetPassagerPage } from './trajet-passager.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetPassagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetPassagerPageRoutingModule {}
