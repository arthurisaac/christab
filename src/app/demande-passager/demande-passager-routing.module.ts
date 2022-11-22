import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandePassagerPage } from './demande-passager.page';

const routes: Routes = [
  {
    path: '',
    component: DemandePassagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandePassagerPageRoutingModule {}
