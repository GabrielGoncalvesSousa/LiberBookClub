import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/codigoQueAndeiTestar/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/codigoQueAndeiTestar/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/before-login/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'main-page',
    loadChildren: () => import('./pages/after-login/main-page/main-page.module').then((m) => m.MainPagePageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/before-login/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'thank-you',
    loadChildren: () => import('./pages/before-login/thank-you/thank-you.module').then((m) => m.ThankYouPageModule),
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/before-login/welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
