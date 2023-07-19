import { Component, OnInit } from '@angular/core';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  
  LessonWords: WordGivenToPracticeDTO[] = [];
                          // (
                          //   id:number;
                          //       lessonId:number;
                          //       patientRecording:string;
                          //       score?:number;
                          //       difficultyLevelId:number;
                          //       isValid?:boolean;
                          //       wordText:string;
                          //       wordRecording?:string
                          //       wordId:number
                          // )
  
  currentWord: WordGivenToPracticeDTO;
  curentWordIndex: number;


  constructor(private _patientService: PatientService,) { }

  ngOnInit(): void {
    this.LessonWords = this._patientService.LessonWords;
    this.currentWord= this.LessonWords[0];
    this.curentWordIndex = 1;
  }

  moveRight(){
    if(this.curentWordIndex > 1){
      this.currentWord= this.LessonWords[--this.curentWordIndex-1];
    }
  }

  moveLeft(){
    if(this.curentWordIndex < this.LessonWords.length){
      this.currentWord= this.LessonWords[this.curentWordIndex++];
    }

  }

}
