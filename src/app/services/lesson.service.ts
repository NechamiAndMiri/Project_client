import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Lesson } from '../models/lesson.model';
import { WordGivenToPractice } from '../models/wordGivenToPractice.model';
@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private _http:HttpClient) { }
  
  
  getLessonsByPatient(patientId:number ):Observable<Lesson[]>{
    
    return this._http.get<Lesson[]>("api/User/"+patientId);
}

getWordsToLesson(lessonId:number):Observable<WordGivenToPractice[]>{
  return this._http.get<WordGivenToPractice[]>("api/User/"+lessonId);
}

}
