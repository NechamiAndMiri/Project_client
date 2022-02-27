import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Lesson } from 'src/app/models/lesson.model';
import { PatientDTO } from 'src/app/models/patientDTO.model';
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
  lessons:Lesson[]=[
  {id: 2,patientId: 2,date:new Date(),isChecked: false,difficultyLevelId: 2,lessonDescription: "התחלנו לעבוד",weightedScore: undefined, isDone: false}
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

  lessonnum():number{
      return this.lessonNum++;
    }


  
    selectLesson(lesson:Lesson){
        this.selectedLesson=lesson;
    }

  initLessons(){

  }
  panelOpenState = false;
}








function lessonnum() {
  throw new Error('Function not implemented.');
}

