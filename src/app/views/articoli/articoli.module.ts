import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticoliRoutingModule } from './articoli-routing.module';
import { ArticoliComponent } from './articoli.component';
import {ButtonModule} from 'primeng/button';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {RatingModule} from 'primeng/rating';
import {SharedModule} from '../../modules/shared/shared.module';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SliderModule} from 'primeng/slider';
import { DettaglioArticoliComponent } from './dettaglio-articoli/dettaglio-articoli.component';
import { CardModule } from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
  declarations: [
    ArticoliComponent,
    DettaglioArticoliComponent
  ],
  imports: [
    CommonModule,
    ArticoliRoutingModule,
    ButtonModule,
    DataViewModule,
    DropdownModule,
    FormsModule,
    RatingModule,
    SharedModule,
    ToggleButtonModule,
    AutoCompleteModule,
    PaginatorModule,
    SliderModule, 
    CardModule
  ]
})
export class ArticoliModule { }
