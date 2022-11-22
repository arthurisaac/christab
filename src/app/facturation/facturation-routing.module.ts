import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturationPage } from './facturation.page';

const routes: Routes = [
  {
    path: '',
    component: FacturationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturationPageRoutingModule {}
