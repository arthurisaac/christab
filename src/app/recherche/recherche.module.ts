import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecherchePageRoutingModule } from './recherche-routing.module';

import { RecherchePage } from './recherche.page';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecherchePageRoutingModule,
        FontAwesomeModule
    ],
  declarations: [RecherchePage]
})
export class RecherchePageModule {}
