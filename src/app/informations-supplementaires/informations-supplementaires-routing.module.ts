import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationsSupplementairesPage } from './informations-supplementaires.page';

const routes: Routes = [
  {
    path: '',
    component: InformationsSupplementairesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationsSupplementairesPageRoutingModule {}
