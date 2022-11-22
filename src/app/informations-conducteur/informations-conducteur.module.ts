import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationsConducteurPageRoutingModule } from './informations-conducteur-routing.module';

import { InformationsConducteurPage } from './informations-conducteur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationsConducteurPageRoutingModule
  ],
  declarations: [InformationsConducteurPage]
})
export class InformationsConducteurPageModule {}
