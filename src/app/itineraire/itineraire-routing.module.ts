import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItinerairePage } from './itineraire-page.component';

const routes: Routes = [
  {
    path: '',
    component: ItinerairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetPageRoutingModule {}
