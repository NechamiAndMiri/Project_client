import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechTherapistComponent } from './speech-therapist/speech-therapist.component';
import { RouterModule, Routes } from '@angular/router';
import { SpeechTherapistGuard } from 'src/app/guards/speech-therapist.guard';
import {MatTabsModule} from '@angular/material/tabs';
import { ExercisesComponent } from './exercises/exercises.component';
import { PatientsComponent } from './patients/patients.component';


// const ROUTES:Routes=[
// {path:"" ,pathMatch:"full",component:SpeechTherapistComponent,
// children: [
//   // {
//   //     path: "patients",
//   //     component:PatientsComponent,outlet:"inside"
//   // },
//   {
//     path: "exercises",
//     component:ExercisesComponent
// },
// // {
// //   path: "",pathMatch:"full",
// //   redirectTo:"patients"
// // }
// ]
// }
// ,
// {
//   path: "patients",
//   component:PatientsComponent,outlet:"inside"
// },
// ]

const ROUTES:Routes=[
  {path:"" ,pathMatch:"full",component:SpeechTherapistComponent,
  children: [
    {
        path: "/patients",pathMatch:"full",
        component:PatientsComponent,outlet:"inside"
    },
    {
      path: "/exercises",pathMatch:"full",
      component:ExercisesComponent
    },
  // {
  //   path: "",pathMatch:"full",
  //   redirectTo:"patients"
  // }
    ]}
  
  
  
  ];

@NgModule({
  declarations: [
    SpeechTherapistComponent,
    ExercisesComponent,
    PatientsComponent
  ],
  imports: [
    MatTabsModule,
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class SpeechTherapistModule { }
