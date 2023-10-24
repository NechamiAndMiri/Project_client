import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientService } from 'src/app/services/patient.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css'],
  providers: [ConfirmationService]
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
  difficultyLevelName :number|undefined;

  
  lessonIsDone: boolean | undefined = false;


  constructor(private _patientService: PatientService,
              private _wordService: WordService,
              private router:Router,
              private _lessonService: LessonService,
              private confirmationService: ConfirmationService,) { }

  ngOnInit(): void {
    this.lessonIsDone = this._lessonService.getSelectedLesson()?.isDone;
    this.LessonWords = this._patientService.LessonWords;
    this.difficultyLevelName = this._patientService.difficultyLevelName;
    this.currentWord= this.LessonWords[0];
    this.curentWordIndex = 1;
  }

  allLessons(){
    this.router.navigate(["patient"])
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

  updateWord(newWord: WordGivenToPracticeDTO){
    this.LessonWords[this.LessonWords.indexOf(this.currentWord)] = newWord;
    this.currentWord = newWord;
  }

  saveLesson(){    
    this.confirmationService.confirm({
    message: 'לאחר שמירת השיעור, לא יהיה באפשרותך לשנות את הנתונים, האם אתה מעוניין לשמור את השיעור כעת?',
    header: 'שמירת שיעור',
    rejectLabel: ` לא, אני מעוניין להמשיך לתרגל`,
    acceptLabel: ' כן, סיימתי לתרגל ',
    accept: () => {
          this._lessonService.saveLesson(this.currentWord.lessonId).subscribe(() =>{
            this.router.navigate(["patient"]);
      });
    },
    reject: () => {
      console.log("lesson not saved");
    }
  });

  }

}
