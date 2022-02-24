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
    
    return this._http.get<Lesson[]>("api/Lesson/"+patientId);
}

getWordsToLesson(lessonId:number):Observable<WordGivenToPractice[]>{
  return this._http.get<WordGivenToPractice[]>("api/Lesson/"+lessonId);
}

}
