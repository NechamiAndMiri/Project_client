import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Lesson } from '../models/lesson.model';
import { WordGivenToPractice, WordGivenToPracticeDTO } from '../models/wordGivenToPractice.model';
@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private _http:HttpClient) { }
  
  
  getLessonsByPatient(patientId:number ):Observable<Lesson[]>{
    
    return this._http.get<Lesson[]>("api/Lesson/"+patientId);
}

getWordsToLesson(lessonId:number):Observable<WordGivenToPracticeDTO[]>{
  //debugger;
  return this._http.get<WordGivenToPracticeDTO[]>("/api/Lesson/get_all_WORDS_FOR_lesson/"+lessonId);
}
 
}
