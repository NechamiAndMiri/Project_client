import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../models/lesson.model';
import { WordGivenToPractice, WordGivenToPracticeDTO } from '../models/wordGivenToPractice.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {


  private selectedLesson?: Lesson;

  constructor(private _http: HttpClient) {
  }

  getSelectedLesson() {
    return this.selectedLesson;
  }

  setSelectedLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
  }

  getLessonsByPatient(patientId: number): Observable<Lesson[]> {

    return this._http.get<Lesson[]>("api/Lesson/" + patientId);
  }

  getWordsToLesson(lessonId: number): Observable<WordGivenToPracticeDTO[]> {

    return this._http.get<WordGivenToPracticeDTO[]>("/api/Lesson/get_all_WORDS_FOR_lesson/" + lessonId);
  }
  addLesson(newLesson: { patientId: number; date: any; isChecked: boolean; lessonDescription: any; isDone: boolean; difficultyLevelId: any; }):Observable<Lesson> {
    return this._http.post<Lesson>(`/api/Lesson`,newLesson);
  }

  handLesson(){
    if(this.selectedLesson)
      {this.selectedLesson.isDone=true;}
      return this._http.put<void>(`/api/Lesson/lesson`,this.selectedLesson);
  }
  updateLesson(newLesson: { patientId: number; date: any; isChecked: boolean; lessonDescription: any; isDone: boolean; difficultyLevelId: any; }):Observable<void>{

    return this._http.put<void>(`/api/Lesson/lesson`,newLesson);
  }

  deleteLesson(id: number):Observable<void> {
    return this._http.delete<void>(`api/Lesson/${id}/DeleteLesson`);
  }
}

