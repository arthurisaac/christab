import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnginPage } from './engin.page';

const routes: Routes = [
  {
    path: '',
    component: EnginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnginPageRoutingModule {}
