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
  activeItem2!: MenuItem; 
  slideIndex:number = 1;
 
  constructor(private _patientService:PatientService,private router:Router) { }


  allLessons(){
    this.router.navigate(["/patient"])
  }
  ngOnInit(): void {
    this.LessonWords=this._patientService.LessonWords;
    this.scrollableItems = Array.from({ length: 10 }, (_, i) => ({ label: `Tab ${i + 1}`, icon: `pi pi-fw pi-display` }));
    this.activeItem2 = this.scrollableItems[0];
    
  }


  k:string[]=['aaaa','bbbbb','cccccc','ddddddd']

  activeIndex1: number = 0;

  activeIndex2: number = 0;

  scrollableTabs: any[] = Array.from({ length: this.k.length }, (_, i) => ({ title: `מילה מס'  ${i + 1}`, content: this.k[i] }));

}
