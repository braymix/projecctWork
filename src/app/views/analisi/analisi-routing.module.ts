import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnalisiComponent } from "./analisi.component";

const routes: Routes = [
  { path: "", component: AnalisiComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalisiRoutingModule {}
