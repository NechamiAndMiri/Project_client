import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechTherapistComponent } from './speech-therapist/speech-therapist.component';
import { RouterModule, Routes } from '@angular/router';
import { SpeechTherapistGuard } from 'src/app/guards/speech-therapist.guard';

const ROUTES:Routes=[
{path:"",component:SpeechTherapistComponent}

]

@NgModule({
  declarations: [
    SpeechTherapistComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class SpeechTherapistModule { }
