import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-word-exercise',
  templateUrl: './word-exercise.component.html',
  styleUrls: ['./word-exercise.component.css']
})
export class WordExerciseComponent implements OnInit {

  LessonWords:WordGivenToPracticeDTO[]=[];

  constructor(private _patientService:PatientService,private router:Router) { }

  ngOnInit(): void {
    this.LessonWords=this._patientService.LessonWords;
    console.log("wordsssssssss:")
    console.log(this.LessonWords)
  }

  allLessons(){
    this.router.navigate(["/patient"])
  }

  



}
