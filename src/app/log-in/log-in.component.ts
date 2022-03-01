import { Component, OnInit } from '@angular/core';
import { LogInUser } from '../models/log-in-user.model';
import { User } from '../models/user.model';
import { LogInService } from '../services/log-in.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';
import { PatientDTO } from '../models/patientDTO.model'
import {SpeechTherapist} from '../models/speechTherapist.model'
import { Patient } from '../models/patient.model';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',

  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  hide = true;
  loginForm: FormGroup = new FormGroup({
    "firstName": new FormControl("",[Validators.required]),
    "lastName": new FormControl("",Validators.required),
    "password": new FormControl("",[Validators.required,Validators.minLength(8)])
  });
  matcher = new MyErrorStateMatcher();
  user!:User|SpeechTherapistDTO|PatientDTO;
  userLogin!: LogInUser;
  a: LogInUser = new LogInUser("Patient1", "Patient1", "Patient1")
  constructor(private _logInService: LogInService,private router:Router) {
  }

  ngOnInit() {


  }
  getUserDetails() {
    this.userLogin = this.loginForm.value;
    //alert(JSON.stringify(this.userLogin));
   
    this._logInService.getUser(this.userLogin).subscribe(user => {
      this.user = user;
    

 var u =(Object)(this.user);
 
      if(user==null)
      {
        alert("הפרטים שהזנת שגויים")
        this.router.navigate(["/login"])
      }
   
      else if((Object)(this.user).patient==undefined&&(Object)(this.user).speechTherapist==undefined) 
      {
        this.user=new User(u.user.id,u.user.firstName,u.user.lastName,u.user.identityNumber,u.user.email,u.user.permissionLevelId,u.user.password,u.user.phone)
        sessionStorage.setItem("user",JSON.stringify(user) );
        if(this.user instanceof User) console.log("yygygyg")
        this.router.navigate(["/admin"])
      }
      //  מפה להמשיך להכניס את היוסר נכון
      else if((Object)(this.user).patient==undefined)
      {

         this.user=new SpeechTherapistDTO(new User(u.user.id,u.user.firstName,u.user.lastName,u.user.identityNumber,u.user.email,u.user.permissionLevelId,u.user.password,u.user.phone),
         (new SpeechTherapist(u.speechTherapist.id,u.speechTherapist.userId,u.speechTherapist.address,u.speechTherapist.prospectus,u.speechTherapist.logo)))
        sessionStorage.setItem("user",JSON.stringify(user) );
        this.router.navigateByUrl("/speechTherapist")
     }
     else if((Object)(this.user).speechTherapist==undefined)

     this.user=new PatientDTO(new User(u.user.id,u.user.firstName,u.user.lastName,u.user.identityNumber,u.user.email,u.user.permissionLevelId,u.user.password,u.user.phone),
     new Patient(u.patient.id,u.patient.userId,u.patient.speechTherapistId,u.patient.dateOfBirth,u.patient.pronunciationProblemId));
     sessionStorage.setItem("user",JSON.stringify(user) );
     this.router.navigateByUrl("/patient")
      
     },
      err=>{alert("error accured with server connect")}
    )
   
    
  }


}
