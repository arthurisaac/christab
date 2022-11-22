import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemandePassagerPageRoutingModule } from './demande-passager-routing.module';

import { DemandePassagerPage } from './demande-passager.page';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DemandePassagerPageRoutingModule,
        FontAwesomeModule
    ],
  declarations: [DemandePassagerPage]
})
export class DemandePassagerPageModule {}
