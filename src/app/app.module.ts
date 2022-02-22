import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogInComponent } from './log-in/log-in.component';
import {HttpClientModule} from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import { LogInService } from './services/log-in.service';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {CheckboxModule} from 'primeng/checkbox';
import {MatTreeModule} from '@angular/material/tree';
import {SliderModule} from 'primeng/slider'

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CheckboxModule,
    MatTreeModule,
    SliderModule
   
  ],
  providers: [LogInService],
  bootstrap: [AppComponent],
  exports:[   AppComponent,
    LogInComponent ]
})
export class AppModule { }
