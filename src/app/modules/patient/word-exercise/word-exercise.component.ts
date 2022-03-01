import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'app-word-exercise',
  templateUrl: './word-exercise.component.html',
  styleUrls: ['./word-exercise.component.css']
})
export class WordExerciseComponent implements OnInit {

  scrollableItems!: MenuItem[];
  activeItem2!: MenuItem; 
  slideIndex:number = 1;
  constructor() { }

  ngOnInit(): void {
    this.scrollableItems = Array.from({ length: 10 }, (_, i) => ({ label: `Tab ${i + 1}`, icon: `pi pi-fw pi-display` }));
    this.activeItem2 = this.scrollableItems[0];
    //this.showSlides(this.slideIndex);
  }

 
  //  plusSlides(n:number) {
  //   this.showSlides(this.slideIndex += n);
  // }
  

  //  currentSlide(n:number) {
  //   this.showSlides(this.slideIndex = n);
  // }
  
  // showSlides(n:number) {
  //   var i;
  //   var slides = document.getElementsByClassName("mySlides");
  //   var dots = document.getElementsByClassName("dot");
  //   if (n > slides.length) {this.slideIndex = 1}
  //   if (n < 1) {this.slideIndex = slides.length}
  //   for (i = 0; i < slides.length; i++) {
  //       //slides[i].style.display = "none";
  //   }
  //   for (i = 0; i < dots.length; i++) {
  //       dots[i].className = dots[i].className.replace(" active", "");
  //   }
  //   // slides[slideIndex-1].style.display = "block";
  //   // dots[slideIndex-1].className += " active";
  // }

  k:string[]=['aaaa','bbbbb','cccccc','ddddddd']

  activeIndex1: number = 0;

  activeIndex2: number = 0;

  scrollableTabs: any[] = Array.from({ length: this.k.length }, (_, i) => ({ title: `מילה מס'  ${i + 1}`, content: this.k[i] }));

}
