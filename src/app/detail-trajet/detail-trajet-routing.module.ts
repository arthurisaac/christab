import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailTrajetPage } from './detail-trajet.page';

const routes: Routes = [
  {
    path: '',
    component: DetailTrajetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailUrbainPageRoutingModule {}
