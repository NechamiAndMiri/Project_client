import { Component, OnInit } from '@angular/core';
import { LogInUser } from '../models/log-in-user.model';
import { User } from '../models/user.model';
import { LogInService } from '../services/log-in.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';
import { PatientDTO } from '../models/patientDTO.model';


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
    sessionStorage.setItem("user",JSON.stringify(user) );
   ///---------להוציא מההערה אחרי שנפתור את הבעיה!!!!!---------------------
    //////////////איך בדוק איזה סוג המשתמש
      // if(this.user instanceof User) 
      //  this.router.navigate(["/admin"])
      // else if(this.user instanceof SpeechTherapistDTO)
      // this.router.navigateByUrl("/speechTherapist")
      // else if(this.user instanceof PatientDTO)
      //   this.router.navigateByUrl("/patient")
      // else
      //   {
      //     alert("הפרטים שהזנת שגויים")
      //     this.router.navigate(["/login"])
      //   }
     },
      err=>{alert("error accured with server connect")}
    )
   
  }
}
