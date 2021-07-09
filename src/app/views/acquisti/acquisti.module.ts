import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';
import { AcquistiComponent } from './acquisti.component';
import { AcquistiRoutingModule } from './acquisti-routing.module';

@NgModule({
  declarations: [
    AcquistiComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AcquistiRoutingModule
  ]
})
export class AcquistiModule { }
