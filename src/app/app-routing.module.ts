import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { SpeechTherapistGuard } from './guards/speech-therapist.guard';
import { LogInComponent } from './log-in/log-in.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const ROUTES:Routes=[
  {path:"login",component:LogInComponent},
  {path:"",pathMatch:"full" ,redirectTo:"login"},
  {path:"patient",loadChildren:()=>import("./modules/patient/patient.module").then(m=>m.PatientModule)},
  {path:"speechTherapist",loadChildren:()=>import("./modules/speech-therapist/speech-therapist.module").then(m=>m.SpeechTherapistModule),canActivate:[SpeechTherapistGuard]},
  {path:"admin",loadChildren:()=>import("./modules/admin/admin.module").then(m=>m.AdminModule),canActivate:[AdminGuard]},
  {path:"**",pathMatch:"full" ,component:PageNotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
