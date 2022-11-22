import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeFonctionPage } from './type-fonction.page';

const routes: Routes = [
  {
    path: '',
    component: TypeFonctionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeFonctionPageRoutingModule {}
