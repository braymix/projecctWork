import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticoliComponent } from './articoli.component';
import { DettaglioArticoliComponent } from './dettaglio-articoli/dettaglio-articoli.component';

const routes: Routes = [
  { 
    path: '', 
    component: ArticoliComponent,
    data: {
      title: 'Articoli'
    }
  },
  { 
    path: ':asin', 
    component: DettaglioArticoliComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticoliRoutingModule { }
