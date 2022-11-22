import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechercheCartePageRoutingModule } from './recherche-carte-routing.module';

import { RechercheCartePage } from './recherche-carte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechercheCartePageRoutingModule
  ],
  declarations: [RechercheCartePage]
})
export class RechercheCartePageModule {}
