import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DecomptePageRoutingModule } from './decompte-routing.module';

import { DecomptePage } from './decompte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecomptePageRoutingModule
  ],
  declarations: [DecomptePage]
})
export class DecomptePageModule {}
