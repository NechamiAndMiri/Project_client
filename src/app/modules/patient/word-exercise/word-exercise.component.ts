import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { PatientService } from 'src/app/services/patient.service';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';

import { MenuItem } from 'primeng/api';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientRecordingDetails } from 'src/app/models/patient-recording-details.model';
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

  audioConf = { audio: true }


  LessonWords: WordGivenToPracticeDTO[] = [];
  scrollableItems!: MenuItem[];
  recording: boolean = false;
  activeIndex2: number = 0;
  currentIndex: number = 0;
  scrollableTabs!: any[];

  constructor(private _patientService: PatientService, private router: Router, private _lessonService: LessonService,
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



  allLessons() {
    this.router.navigate(["/patient"])
  }
  ngOnInit(): void {
    this.LessonWords = this._patientService.LessonWords;
    this.scrollableTabs = Array.from({ length: this.LessonWords.length }, (_, i) => ({ title: `מילה מס'  ${i + 1}`, content: this.LessonWords[i] }));
    this.playWordRecord();
    console.log(this.LessonWords.length)
    // this.audioRecordingService.initRecordDetailsArray(this.LessonWords.length);
  }

  getSelectedLesson() {
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
  recordDetails: PatientRecordingDetails = new PatientRecordingDetails();
  saveRecording() {

    if (!(this._lessonService.getSelectedLesson()?.isChecked) && this.audioBlob && this.audioBlobUrl) {
      let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
      this.audioRecordingService.savePatientRecording(blob, 'audio/mp3', this.audioName, this.LessonWords[this.currentIndex]).subscribe();
    }

    this.currentIndex = this.activeIndex2;
    this.audioBlobUrl = undefined;

  }

  playWordRecord() {
    let word = this.LessonWords[this.activeIndex2];
    let blob;
    this.audioRecordingService.getSpeechTherapistWordRecord(word.wordId, word.wordText).subscribe((b: any) => {
      //check if we need:
      //this.isDownloadaudio = true;
      blob = new Blob([b], { type: 'audio/mp3' });

      let audioBlob1 = b.body;
      let audioName1 = b.title;
      let audioBlobUrl1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

      let audio1 = new Audio();
      audio1.src = (audioBlobUrl1 as any).changingThisBreaksApplicationSecurity
      audio1.play();
      //this will make sure to update when time updates.
      audio1.ontimeupdate = (event) => {
        var currentTime = audio1.currentTime;
        this.ref.detectChanges();
      }
    });
  }

  initPatientRecordingDetails() {
    let word = this.LessonWords[this.activeIndex2];
    let blob;
    this.audioRecordingService.getPatientRecording(word.id).subscribe((b: any) => {

      blob = new Blob([b], { type: 'audio/mp3' });
      this.audioBlob = b.body;
      this.audioName = b.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));
    });
  }

  playPatientRecord() {
    let word = this.LessonWords[this.activeIndex2];
    let blob;
    this.audioRecordingService.getPatientRecording(word.id).subscribe((b: any) => {

      blob = new Blob([b], { type: 'audio/mp3' });
      this.audioBlob = b.body;
      this.audioName = b.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

      let audio1 = new Audio();
      audio1.src = (this.audioBlobUrl as any).changingThisBreaksApplicationSecurity
      audio1.play();
      //this will make sure to update when time updates.
      audio1.ontimeupdate = (event) => {
        var currentTime = audio1.currentTime;
        this.ref.detectChanges();
      }
    });
  }


  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  calcAutoMark() {
    return Math.random() * 100;
  }

}
