import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { IsAutenticatedService } from './services/is-autenticated.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
      canActivate: [AuthGuardService]
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'login',
        loadChildren: () => import('./views/login/login.component').then(m => m.LoginComponent),
        canActivate: [AuthGuardService]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'articoli',
        loadChildren: () => import('./views/articoli/articoli.module').then(m => m.ArticoliModule),
        canActivate: [IsAutenticatedService]
      },
      {
        path: 'ordini',
        loadChildren: () => import('./views/ordini/ordini.module').then(m => m.OrdiniModule),
        canActivate: [IsAutenticatedService]
      },
      {
        path: 'acquisti',
        loadChildren: () => import('./views/acquisti/acquisti.module').then(m => m.AcquistiModule),
        canActivate: [IsAutenticatedService]
      },
      {
        path: 'carrello',
        loadChildren: () => import('./views/carrello/carrello.module').then(m => m.CarrelloModule),
        canActivate: [IsAutenticatedService]
      },
      {
        path: 'analisi',
        loadChildren: () => import('./views/analisi/analisi.module').then(m => m.AnalisiModule),
        canActivate: [IsAutenticatedService]
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
