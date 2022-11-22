import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeConducteurPage } from './home-conducteur.page';

const routes: Routes = [
  {
    path: '',
    component: HomeConducteurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeConducteurPageRoutingModule {}
