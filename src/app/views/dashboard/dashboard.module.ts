import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
