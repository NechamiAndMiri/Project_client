import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechTherapistComponent } from './speech-therapist/speech-therapist.component';
import { RouterModule, Routes } from '@angular/router';
import { SpeechTherapistGuard } from 'src/app/guards/speech-therapist.guard';
import {MatTabsModule} from '@angular/material/tabs';
import { ExercisesComponent } from './exercises/exercises.component';
import { PatientsComponent } from './patients/patients.component';
//import {MaterialExampleModule} from '@angular/material.module';
//import {TreeFlatOverviewExample} from './tree-flat-overview-example';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ButtonModule} from 'primeng/button';


const ROUTES:Routes=[
{path:"" ,pathMatch:"full",component:SpeechTherapistComponent},
{
  path: "patients",
  component:PatientsComponent
},
{
        path: "exercises",pathMatch:"full",
        component:ExercisesComponent
}
]

// const ROUTES:Routes=[
//   {path:"" ,pathMatch:"full",component:SpeechTherapistComponent,
//   children: [
//     {
//         path: "/patients",pathMatch:"full",
//         component:PatientsComponent,outlet:"inside"
//     },
//     {
//       path: "/exercises",pathMatch:"full",
//       component:ExercisesComponent
//     },
//   // {
//   //   path: "",pathMatch:"full",
//   //   redirectTo:"patients"
//   // }
//     ]}
  
  
  
//   ];

@NgModule({
  declarations: [
    SpeechTherapistComponent,
    ExercisesComponent,
    PatientsComponent
  ],
  imports: [
    MatTabsModule,
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    OverlayPanelModule,
    ButtonModule
  ]
})
export class SpeechTherapistModule { }
