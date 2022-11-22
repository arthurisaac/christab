import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenouvellementPageRoutingModule } from './renouvellement-routing.module';

import { RenouvellementPage } from './renouvellement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenouvellementPageRoutingModule
  ],
  declarations: [RenouvellementPage]
})
export class RenouvellementPageModule {}
