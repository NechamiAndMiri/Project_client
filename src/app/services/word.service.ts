import { Injectable } from '@angular/core';
import {catchError, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PronunciationProblemsType } from '../models/pronunciation-problems-type.model';
import { DifficultyLevel } from '../models/difficulty-level.model';
import { Word } from '../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  

  pronunciationProblems:PronunciationProblemsType[]

  constructor(private _http:HttpClient) { }

  getPronunciationProblems():Observable<PronunciationProblemsType[]>{
    return this._http.get<PronunciationProblemsType[]>("api/Word/");
  }


  getProblemDifficultyLevels( problemsTypeId:number,speechTherapistId:number):Observable<DifficultyLevel[]>{
      return this._http.get<DifficultyLevel[]>(`api/Word/${problemsTypeId}/${speechTherapistId}/PronunciationProblemLevels`)
  }

  getLevelWords(levelId: number):Observable<Word[]> {
    return this._http.get<Word[]>(`api/Word/${levelId}/LevelWords`);
  }

  addLevelToProblem(difficultyLevel:DifficultyLevel)
  {
    return this._http.post<DifficultyLevel>("api/Word/",difficultyLevel);
  }

  deleteLevel(levelId:number){
    
    return this._http.delete<void>(`api/Word/${levelId}/deleteAllLevelWords`);
  }

  deleteWord(wordId:number){
    return this._http.delete<void>(`api/Word/${wordId}/deleteWord`);
  }

  // `https://localhost:44353/api/AngularTest/CheckIfIDExists/${formattedNumber}/${vin}`).pipe(
  //     tap(data => console.log('Checked'),
  //     catchError(this.handleError))
  //   );


// getPronunciationProblems():PronunciationProblemsType[]{
//   if(this.pronunciationProblems==undefined)
//       this._getPronunciationProblems().subscribe(data=>{console.log(data);this.pronunciationProblems=data},err=>alert("err!"));
//       debugger
//   return this.pronunciationProblems;
// }

// private _getPronunciationProblems():Observable<PronunciationProblemsType[]>{
  
//   return this._http.get<PronunciationProblemsType[]>("api/Word/");
// }

}
