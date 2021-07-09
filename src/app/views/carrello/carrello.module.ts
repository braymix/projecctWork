import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';
import { CarrelloComponent } from './carrello.component';
import { CarrelloRoutingModule } from './carrello-routing.module';

@NgModule({
  declarations: [
    CarrelloComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CarrelloRoutingModule
  ]
})
export class CarrelloModule { }
