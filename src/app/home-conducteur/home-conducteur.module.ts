import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeConducteurPageRoutingModule } from './home-conducteur-routing.module';

import { HomeConducteurPage } from './home-conducteur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeConducteurPageRoutingModule
  ],
  declarations: [HomeConducteurPage]
})
export class HomeConducteurPageModule {}
