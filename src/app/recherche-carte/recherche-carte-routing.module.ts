import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechercheCartePage } from './recherche-carte.page';

const routes: Routes = [
  {
    path: '',
    component: RechercheCartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechercheCartePageRoutingModule {}
