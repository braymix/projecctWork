import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DettaglioArticoliComponent } from './dettaglio-articoli.component';
import { SharedModule } from '../../../modules/shared/shared.module';


@NgModule({
  declarations: [
    DettaglioArticoliComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class DettaglioArticoliModule { }
