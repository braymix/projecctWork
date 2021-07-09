import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnalisiComponent } from "./analisi.component";
import { AnalisiRoutingModule } from "./analisi-routing.module";
import { SharedModule } from "../../modules/shared/shared.module";

@NgModule({
  declarations: [ AnalisiComponent ],
  imports: [CommonModule, AnalisiRoutingModule, SharedModule],
})
export class AnalisiModule {}
