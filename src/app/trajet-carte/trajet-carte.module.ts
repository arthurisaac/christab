import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetCartePageRoutingModule } from './trajet-carte-routing.module';

import { TrajetCartePage } from './trajet-carte.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TrajetCartePageRoutingModule,
        // AgmCoreModule
    ],
  declarations: [TrajetCartePage]
})
export class TrajetCartePageModule {}
