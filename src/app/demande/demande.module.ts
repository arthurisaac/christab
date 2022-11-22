import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, NavParams} from '@ionic/angular';

import { DemandePageRoutingModule } from './demande-routing.module';

import {DemandePage, PopoverPage} from './demande.page';
import {TooltipsModule} from 'ionic-tooltips';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DemandePageRoutingModule,
        // AgmCoreModule,
        TooltipsModule,
        FontAwesomeModule,

    ],
  declarations: [DemandePage, PopoverPage]
})
export class DemandePageModule {}
