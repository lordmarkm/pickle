import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
