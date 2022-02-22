import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  /**
   *
   */
  constructor(private router: Router) {
   

  }
  canActivate(): boolean
  {
   let user=sessionStorage.getItem('user')
   if(user!=null&&JSON.parse(user).user.permissionLevelId==1)
      return true;
    alert("אין לך הרשאת גישה")
    this.router.navigateByUrl("/login")
     return false;
    
 }
  
}
