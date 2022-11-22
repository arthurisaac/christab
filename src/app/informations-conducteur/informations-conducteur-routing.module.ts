import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationsConducteurPage } from './informations-conducteur.page';

const routes: Routes = [
  {
    path: '',
    component: InformationsConducteurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationsConducteurPageRoutingModule {}
