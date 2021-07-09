import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdiniComponent } from "./ordini.component";

const routes: Routes = [
    {
        path: '',
        component: OrdiniComponent,
        data: {
            title: 'Lista ordini'
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdiniRoutingModule {}