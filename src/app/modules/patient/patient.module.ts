import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient/all lessons/patient.component';
import { RouterModule, Routes } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppModule } from 'src/app/app.module';
import {SliderModule} from 'primeng/slider'
import {ContextMenuModule} from 'primeng/contextmenu';
import {SlideMenuModule} from 'primeng/slidemenu';
import {ToolbarModule} from 'primeng/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { LessonService } from 'src/app/services/lesson.service';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {AccordionModule} from 'primeng/accordion';


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
    MatButtonModule,
    SliderModule,
    SlideMenuModule,
    ContextMenuModule,
    ToolbarModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    AccordionModule
  ],
  providers:[
    LessonService
  ]
})
export class PatientModule { }
