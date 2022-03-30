import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogInUser } from '../models/log-in-user.model';
import { PatientDTO } from '../models/patientDTO.model';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';
import { User } from '../models/user.model';

@Injectable()
export class LogInService {
  /**
   *
   */
  user!: User | PatientDTO | SpeechTherapistDTO;
  adminUser!: User;
  constructor(private _http: HttpClient) {}
  getTheUser(): User | SpeechTherapistDTO | PatientDTO {
    return this.user;
  }
  getUser(user: LogInUser): Observable<User | SpeechTherapistDTO | PatientDTO> {
    return this._http.post<User | SpeechTherapistDTO | PatientDTO>(
      'api/User/',
      user
    );
  }
}
