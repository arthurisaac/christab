import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetPassagerPageRoutingModule } from './trajet-passager-routing.module';

import { TrajetPassagerPage } from './trajet-passager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrajetPassagerPageRoutingModule,
    // AgmCoreModule
  ],
  declarations: [TrajetPassagerPage]
})
export class TrajetPassagerPageModule {}
