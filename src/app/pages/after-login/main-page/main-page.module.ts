import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPagePageRoutingModule } from './main-page-routing.module';

import { MainPagePage } from './main-page.page';
import { FooterNavBarComponent } from 'src/app/components/footer-nav-bar/footer-nav-bar.component';
import { TopNavBarComponent } from 'src/app/components/top-nav-bar/top-nav-bar.component';
import { ResultsSearchBarComponent } from 'src/app/components/results-search-bar/results-search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPagePageRoutingModule,
  ],
  entryComponents: [
    FooterNavBarComponent,
    TopNavBarComponent,
    ResultsSearchBarComponent,
  ],
  declarations: [
    MainPagePage,
    FooterNavBarComponent,
    TopNavBarComponent,
    ResultsSearchBarComponent,
  ],
})
export class MainPagePageModule {}
