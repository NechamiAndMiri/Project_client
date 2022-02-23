import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient/patient.component';
import { RouterModule, Routes } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const ROUTES:Routes=[
{path:"",component:PatientComponent}
]

@NgModule({
  declarations: [
    PatientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class PatientModule { }
