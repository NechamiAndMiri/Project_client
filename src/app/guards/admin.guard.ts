import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LogInService } from '../services/log-in.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  /**
   *
   */
  constructor(private router: Router,private _loginService: LogInService) {
   

  }
  canActivate(): boolean
  {
   
  

    let user=this._loginService.getTheUser() as User;
    if(user!=null&&user.permissionLevelId==1)
      return true;
    alert("אין לך הרשאת גישה")
    this.router.navigateByUrl("/login")
     return false;
    
 }
  
}
