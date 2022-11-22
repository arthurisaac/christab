import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetPage } from './trajet.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetPage
  },
  /*{
    path: 'trajet-conducteur',
    loadChildren: () => import('./trajet-conducteur/trajet-conducteur.module').then( m => m.TrajetConducteurPageModule)
  },
  {
    path: 'trajet-passager',
    loadChildren: () => import('./trajet-passager/trajet-passager.module').then( m => m.TrajetPassagerPageModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetPageRoutingModule {}
