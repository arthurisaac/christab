import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeAvisPageRoutingModule } from './type-avis-routing.module';

import { TypeAvisPage } from './type-avis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeAvisPageRoutingModule
  ],
  declarations: [TypeAvisPage]
})
export class TypeAvisPageModule {}
