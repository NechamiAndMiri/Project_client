import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PronunciationProblemsType } from '../models/pronunciation-problems-type.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private _http:HttpClient) { }

  getUser(pronunciationProblemId:number ):Observable<PronunciationProblemsType>{
    
    return this._http.get<PronunciationProblemsType>("api/Word/");
}
}
