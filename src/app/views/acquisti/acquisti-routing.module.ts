import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcquistiComponent } from './acquisti.component';

const routes: Routes = [
  {
      path: '',
      component: AcquistiComponent,
      data: {
          title: 'Lista acquisti'
      }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcquistiRoutingModule { }
