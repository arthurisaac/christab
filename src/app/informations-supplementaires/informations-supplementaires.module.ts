import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationsSupplementairesPageRoutingModule } from './informations-supplementaires-routing.module';

import { InformationsSupplementairesPage } from './informations-supplementaires.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationsSupplementairesPageRoutingModule
  ],
  declarations: [InformationsSupplementairesPage]
})
export class InformationsSupplementairesPageModule {}
