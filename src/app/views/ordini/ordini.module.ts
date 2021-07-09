import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';
import { OrdiniComponent } from './ordini.component';
import { OrdiniRoutingModule } from './ordini-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrdiniRoutingModule
  ],
  declarations : [
    OrdiniComponent
  ]
})
export class OrdiniModule { }
