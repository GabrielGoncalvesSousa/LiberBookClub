import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    MatCheckboxModule,
  ],
  declarations: [
    SignupPage,
  ],
})
export class SignupPageModule {}
