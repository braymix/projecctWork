import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableRowExpansionComponent } from "../../containers/table-row-expansion/table-row-expansion.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { RippleModule } from "primeng/ripple";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ChartModule } from "primeng/chart";
import { BadgeModule } from "primeng/badge";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { AnalisiDettaglioArticoloComponent } from "../../containers/analisi-dettaglio-articolo/analisi-dettaglio-articolo.component";
import { AnalisiOrdiniComponent } from "../../containers/analisi-ordini/analisi-ordini.component";
import { AnalisiTotaleTortaComponent } from "../../containers/analisi-totale-torta/analisi-totale-torta.component";
import { TableModule } from 'primeng/table';
import {ProgressBarModule} from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    TableRowExpansionComponent,
    AnalisiDettaglioArticoloComponent,
    AnalisiOrdiniComponent,
    AnalisiTotaleTortaComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    RippleModule,
    InputNumberModule,
    DropdownModule,
    ReactiveFormsModule,
    BadgeModule,
    ChartModule,
    CardModule,
    ProgressBarModule,
    InputTextModule,
    AutoCompleteModule
  ],
  exports: [
    CommonModule,
    TableRowExpansionComponent,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    RippleModule,
    InputNumberModule,
    ReactiveFormsModule,
    BadgeModule,
    CalendarModule,
    ChartModule,
    DropdownModule,
    CardModule,
    AnalisiDettaglioArticoloComponent,
    AnalisiOrdiniComponent,
    AnalisiTotaleTortaComponent,
    ProgressBarModule,
    InputTextModule,
    AutoCompleteModule
  ],
})
export class SharedModule {}
