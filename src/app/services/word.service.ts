import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PronunciationProblemsType } from '../models/pronunciation-problems-type.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  pronunciationProblems:PronunciationProblemsType[]

  constructor(private _http:HttpClient) { }

  getPronunciationProblems():Observable<PronunciationProblemsType[]>{
    return this._http.get<PronunciationProblemsType[]>("api/Word/");
  }




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
