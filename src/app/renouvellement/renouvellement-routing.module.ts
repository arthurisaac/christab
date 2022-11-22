import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenouvellementPage } from './renouvellement.page';

const routes: Routes = [
  {
    path: '',
    component: RenouvellementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenouvellementPageRoutingModule {}
