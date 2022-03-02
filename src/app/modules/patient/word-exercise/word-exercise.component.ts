import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { PatientService } from 'src/app/services/patient.service';

import {MenuItem} from 'primeng/api';
@Component({
  selector: 'app-word-exercise',
  templateUrl: './word-exercise.component.html',
  styleUrls: ['./word-exercise.component.css']
})
export class WordExerciseComponent implements OnInit {

  LessonWords:WordGivenToPracticeDTO[]=[];
  scrollableItems!: MenuItem[];
 
  constructor(private _patientService:PatientService,private router:Router) { }


  allLessons(){
    this.router.navigate(["/patient"])
  }
  ngOnInit(): void {
    this.LessonWords=this._patientService.LessonWords;
    this.scrollableTabs= Array.from({ length: this.LessonWords.length }, (_, i) => ({ title: `מילה מס'  ${i + 1}`, content: this.LessonWords[i] }));
  console.log( this.LessonWords.length)

   

   
  }



  activeIndex1: number = 0;

  activeIndex2: number = 0;

  scrollableTabs!: any[]; 

}
