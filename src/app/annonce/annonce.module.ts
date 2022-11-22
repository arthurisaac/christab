import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnoncePageRoutingModule } from './annonce-routing.module';

import { AnnoncePage } from './annonce.page';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnnoncePageRoutingModule,
        FontAwesomeModule
    ],
  declarations: [AnnoncePage]
})
export class AnnoncePageModule {}
