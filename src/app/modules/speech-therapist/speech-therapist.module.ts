
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpeechTherapistComponent } from './speech-therapist/speech-therapist.component';
import { RouterModule, Routes } from '@angular/router';
import { SpeechTherapistGuard } from 'src/app/guards/speech-therapist.guard';
import {MatTabsModule} from '@angular/material/tabs';
import { ExercisesComponent } from './exercises/exercises.component';
import { PatientsComponent } from './patients/patients.component';

import {ConfirmDialogModule} from 'primeng/confirmdialog';


//import {MaterialExampleModule} from '@angular/material.module';
//import {TreeFlatOverviewExample} from './tree-flat-overview-example';

import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {DialogModule} from 'primeng/dialog';

import { TagModule } from 'primeng/tag';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {ListboxModule} from 'primeng/listbox';

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

    FormsModule,
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
    ButtonModule,
    InputNumberModule,
    InputTextModule,

     ConfirmDialogModule,
     CardModule,
     MatCardModule,
      MatTableModule,
      TagModule,
      DialogModule,
      MatSortModule,
      MatPaginatorModule,
      MatSelectModule,
      MultiSelectModule,
      ListboxModule

  ]
})
export class SpeechTherapistModule { }
