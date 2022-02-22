import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { LogInUser } from '../models/log-in-user.model';
import { PatientDTO } from '../models/patientDTO.model';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';
import { User } from '../models/user.model';

@Injectable()
export class LogInService{
    /**
     *
     */
    constructor(private _http:HttpClient) {}
    
getUser(user:LogInUser ):Observable<User|SpeechTherapistDTO|PatientDTO>{
    
        return this._http.post<User|SpeechTherapistDTO|PatientDTO>("api/User/",user);
    }



}