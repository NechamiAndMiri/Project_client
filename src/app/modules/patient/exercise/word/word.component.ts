import { Component, Input, OnInit } from '@angular/core';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  @Input() lessonWord: WordGivenToPracticeDTO;
  @Input() wordNumber: number;
  @Input() allWordsNumber: number;

  constructor() { }

  ngOnInit(): void {
  }

}
