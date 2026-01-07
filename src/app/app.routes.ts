import { Routes } from '@angular/router';
import { Onboarding } from './pages/onboarding/onboarding';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { SampleForm } from './pages/sample-form/sample-form';

export const routes: Routes = [
  { path: '', redirectTo: '/onboarding', pathMatch: 'full' },
  { path: 'onboarding', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'sample-form', component: SampleForm }
];
