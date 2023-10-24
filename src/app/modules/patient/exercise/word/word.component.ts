import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientService } from 'src/app/services/patient.service';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit,OnDestroy,OnChanges {

  @Input() lessonWord: WordGivenToPracticeDTO;
  @Input() wordNumber: number;
  @Input() allWordsNumber: number;
  @Output() onRecordAdded = new EventEmitter<WordGivenToPracticeDTO>();

  isAudioRecording = false;
  audioBlobUrl!: any;
  audioRecordedTime!: any;

  audio: HTMLAudioElement;

  blobData!: any;
  blob!: any;
  audioBlob!: any;
  audioName!: any;

  lessonIsDone: boolean | undefined = false;
  isServerRecording = false;
  isNewRecord = false;

  constructor(private _wordService: WordService, 
    private router: Router, private _lessonService: LessonService,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer){
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

  ngOnInit(): void {
    this.InitializesData();
  }

  ngOnChanges(){
    this.InitializesData();
  }

  InitializesData(){
    this.lessonIsDone = this._lessonService.getSelectedLesson()?.isDone;
    this.isServerRecording = false;
    this.audioRecordingService.abortRecording();
    if(this.lessonIsDone == false){//lesson not done yet
      //check if there is record to the word
      if(this.lessonWord.patientRecording != null && this.lessonWord.patientRecording != ""){
        //put record in the variables
        this.audioRecordingService.getPatientRecording(this.lessonWord.id).subscribe((b: any) => {
          this.blobData = b;
          this.blob = new Blob([b], { type: 'audio/mp3' });
          this.audioBlob = b.body;
          this.audioName = b.title;
          //let audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));
        });
        this.isServerRecording = true;
      }
      else{//there is not record to this word yet
        //initilize vars
        this.blobData = undefined;
        this.blob = undefined;
        this.audioBlob = undefined;
        this.audioName = undefined;
      }
    }
  }

  startNewRecord(){
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  stopNewRecord(){
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
      this.isNewRecord = true;
      this.isServerRecording = false;
    }
  }

  saveNewRecord(){
      if (this.audioBlob && this.audioBlobUrl) {
        let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
        this.audioRecordingService.savePatientRecording(blob, 'audio/mp3', this.audioName, this.lessonWord).subscribe(() => {
          this._wordService.getWordGivenToPractice(this.lessonWord.id).subscribe((word:WordGivenToPracticeDTO)=>{
            this.lessonWord.patientRecording = word.patientRecording;
            this.audioRecordingService.getPatientRecording(this.lessonWord.id).subscribe((b: any) => {
              this.blobData = b;
              this.blob = new Blob([b], { type: 'audio/mp3' });
              this.audioBlob = b.body;
              this.audioName = b.title;
            });
            this.onRecordAdded.emit(this.lessonWord);
            this.isServerRecording = true;
            this.isNewRecord = false;  
          });
        });
      }
      this.audioBlobUrl = undefined;
  }

  downloadWordRecord(){    
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }

  replayWordRecord(){
      if(this.isServerRecording){
        let audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.blobData.body));

        let audio1 = new Audio();
        audio1.src = (audioBlobUrl as any).changingThisBreaksApplicationSecurity
        audio1.play();
        //this will make sure to update when time updates.
        audio1.ontimeupdate = (event) => {
          var currentTime = audio1.currentTime;
          this.ref.detectChanges();
        }
      }
      if(this.isNewRecord){
        this.audio = new Audio();
        this.audio.src = this.audioBlobUrl.changingThisBreaksApplicationSecurity
        this.audio.play();
        //this will make sure to update when time updates.
        this.audio.ontimeupdate = (event) => {
          var currentTime = this.audio.currentTime;
          this.ref.detectChanges();
        }
      }
  }

  reRecerdingWordRecord(){
    this.blobData = undefined;
    this.blob = undefined;
    this.audioBlob = undefined;
    this.audioName = undefined;
    this.audioBlobUrl = null;
    this.isServerRecording = false;
    this.isNewRecord = true;
    this.startNewRecord();
  }

  playSpeechTherapistWordRecord() {
    let blob;
    this.audioRecordingService.getWordRecord(this.lessonWord.wordId).subscribe((b: any) => {
      //this.isDownloadaudio = true;
      blob = new Blob([b], { type: 'audio/mp3' });
      let audioBlobUrl1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));
      let audio1 = new Audio();
      audio1.src = (audioBlobUrl1 as any).changingThisBreaksApplicationSecurity
      audio1.play();
      audio1.ontimeupdate = (event) => {
        var currentTime = audio1.currentTime;
        this.ref.detectChanges();
      }
    });
  }

  playPatientRecord() {
    let blob;
    this.audioRecordingService.getPatientRecording(this.lessonWord.id).subscribe((b: any) => {

      blob = new Blob([b], { type: 'audio/mp3' });
      // this.audioBlob = b.body;
      // this.audioName = b.title;
      let audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

      let audio1 = new Audio();
      audio1.src = (audioBlobUrl as any).changingThisBreaksApplicationSecurity
      audio1.play();
      //this will make sure to update when time updates.
      audio1.ontimeupdate = (event) => {
        var currentTime = audio1.currentTime;
        this.ref.detectChanges();
      }
    });
  }

  /////

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

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }
  
  ngOnDestroy(): void {
    this.abortAudioRecording();
    //initilize variables
  }
}
