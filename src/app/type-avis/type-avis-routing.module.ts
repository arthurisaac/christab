import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeAvisPage } from './type-avis.page';

const routes: Routes = [
  {
    path: '',
    component: TypeAvisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeAvisPageRoutingModule {}
