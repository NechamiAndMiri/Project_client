import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SpeechTherapist } from '../models/speechTherapist.model';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';
import { LogInService } from '../services/log-in.service';

@Injectable({
  providedIn: 'root'
})
export class SpeechTherapistGuard implements CanActivate {

  constructor(private router: Router, private _loginService:LogInService) {
   

  }
  canActivate(): boolean
  {
    
   let user=this._loginService.getTheUser() as SpeechTherapistDTO;
   if(user!=null&&user.user.permissionLevelId==2)
      return true;
    alert("אין לך הרשאת גישה")
    this.router.navigateByUrl("/login")
     return false;
    
 }
  
}
