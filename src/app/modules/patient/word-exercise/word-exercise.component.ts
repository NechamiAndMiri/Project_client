import { ChangeDetectionStrategy, ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { PatientService } from 'src/app/services/patient.service';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';

import {MenuItem} from 'primeng/api';
import { LessonService } from 'src/app/services/lesson.service';
@Component({
  selector: 'app-word-exercise',
  templateUrl: './word-exercise.component.html',
  styleUrls: ['./word-exercise.component.css']
})
export class WordExerciseComponent implements OnInit {
 
  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;

  audioRecordedTime!: any;

  audioBlobUrl!: any;

  audioBlob!: any;

  audioName!: any;
 
  audioStream!: any;
 
  audioConf = { audio: true}


  LessonWords:WordGivenToPracticeDTO[]=[];
  scrollableItems!: MenuItem[];
  recording:boolean=false;
  activeIndex2: number = 0;
  scrollableTabs!: any[];
 
  constructor(private _patientService:PatientService,private router:Router,private _lessonService:LessonService,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    
    private sanitizer: DomSanitizer) {
    
   

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
 });

    this.audioRecordingService.getRecordedTime().subscribe((time: any) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data: any) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
   }

  

  allLessons(){
    this.router.navigate(["/patient"])
  }
  ngOnInit(): void {
    this.LessonWords=this._patientService.LessonWords;
    this.scrollableTabs= Array.from({ length: this.LessonWords.length }, (_, i) => ({ title: `מילה מס'  ${i + 1}`, content: this.LessonWords[i] }));
  console.log( this.LessonWords.length)
 
  } 

getSelectedLesson(){
 return this._lessonService.getSelectedLesson();
}

startAudioRecording() {
  if (!this.isAudioRecording) {
    this.isAudioRecording = true;
    this.audioRecordingService.startRecording();
  }
}

abortAudioRecording() {
  if (this.isAudioRecording) {
    this.isAudioRecording = false;
    this.audioRecordingService.abortRecording();
  }
}

stopAudioRecording() {
  if (this.isAudioRecording) {
    this.audioRecordingService.stopRecording();
    this.isAudioRecording = false;

  }
}

restartAudioRecordedData() {
  this.audioBlobUrl = null;
  this.startAudioRecording();
}

downloadAudioRecordedData() {
  this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
}

ngOnDestroy(): void {
  this.abortAudioRecording();
}

saveRecording(){
  if(!(this._lessonService.getSelectedLesson()?.isChecked))
  {
   let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
  this.audioRecordingService.saveRecording(blob, 'audio/mp3', this.audioName,this.LessonWords[this.activeIndex2].id).subscribe();
  }
  
}

_downloadFile(data: any, type: string, filename: string): any {
  const blob = new Blob([data], { type: type });
  const url = window.URL.createObjectURL(blob);
  //this.video.srcObject = stream;
  //const url = data;
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = url;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
calcAutoMark(){
  return Math.random()*100;
}

}
