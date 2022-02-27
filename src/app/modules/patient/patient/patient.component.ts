import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Lesson } from 'src/app/models/lesson.model';
import { PatientDTO } from 'src/app/models/patientDTO.model';
import { PronunciationProblemsType } from 'src/app/models/pronunciation-problems-type.model';
import { LessonService } from 'src/app/services/lesson.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  lessonNum:number=1;
  selectedLesson!:Lesson;
  user!:PatientDTO
  pronunciationProblemsType!: PronunciationProblemsType;
  difficultyLevel!:DifficultyLevel;
  


  lessons:Lesson[]=[
 
]


  constructor(private _lessonService:LessonService) { 
   
  }   
  
  ngOnInit(): void {
     var u=sessionStorage.getItem("user");
    if(u)
      this.user=JSON.parse(u); 
   
    this._lessonService.getLessonsByPatient(this.user.patient.id).subscribe(data=>{this.lessons=data
     console.log(this.lessons)
    });
  }  


    selectLesson(lesson:Lesson){
        this.selectedLesson=lesson;
        
    }

   

    
  panelOpenState = false;
}


