import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

  {
    path: 'welcome',
    loadChildren: () => import('./pages/before-login/welcome/welcome.module').then((m) => m.WelcomePageModule),
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
    path: 'my-list',
    loadChildren: () => import('./pages/after-login/my-list/my-list.module').then((m) => m.MyListPageModule),
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
