import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DecomptePage } from './decompte.page';

const routes: Routes = [
  {
    path: '',
    component: DecomptePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DecomptePageRoutingModule {}
