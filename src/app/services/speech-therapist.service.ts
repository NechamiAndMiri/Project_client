import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SpeechTherapistDTO } from '../models/speechTherapistDTO.model';

@Injectable({
  providedIn: 'root'
})
export class SpeechTherapistService {
  speechTherapist!:SpeechTherapistDTO;

  constructor(private _http:HttpClient) { }
}
