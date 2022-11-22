import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetConducteurPageRoutingModule } from './trajet-conducteur-routing.module';

import { TrajetConducteurPage } from './trajet-conducteur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrajetConducteurPageRoutingModule,
    // AgmCoreModule
  ],
  declarations: [TrajetConducteurPage]
})
export class TrajetConducteurPageModule {}
