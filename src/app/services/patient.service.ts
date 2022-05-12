import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PatientDTO } from '../models/patientDTO.model';
import { WordGivenToPracticeDTO } from '../models/wordGivenToPractice.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  patient!:PatientDTO;

  LessonWords!:WordGivenToPracticeDTO[];

  constructor(private _http:HttpClient) { }

  getSpeechTerapistPatients(speechTherapistId: number):Observable<PatientDTO[]> {
      
    return this._http.get<PatientDTO[]>(`api/Patient/${speechTherapistId}`)
  }


  
}
