import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarrelloComponent } from './carrello.component';

const routes: Routes = [
  {
    path: '',
    component: CarrelloComponent,
    data: {
      title: 'Carrello'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrelloRoutingModule {}
