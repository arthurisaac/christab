import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UtilisateurPageRoutingModule } from './utilisateur-routing.module';

import { UtilisateurPage } from './utilisateur.page';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
    UtilisateurPageRoutingModule
  ],
  declarations: [
                 // UtilisateurPage
                 ]
})
export class UtilisateurPageModule {}
