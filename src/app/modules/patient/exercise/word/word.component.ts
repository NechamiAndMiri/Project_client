import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  @Input() lessonWord: WordGivenToPracticeDTO;
  @Input() wordNumber: number;
  @Input() allWordsNumber: number;

  
  isAudioRecording = false;
  audioBlobUrl!: any;
  audioRecordedTime!: any;
  audioBlob!: any;
  audioName!: any;

  lessonIsDone: boolean | undefined = false;

  constructor(private _patientService: PatientService, private router: Router, private _lessonService: LessonService,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
    ) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time: any) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

   }

  ngOnInit(): void {
   // this.playWordRecord();
    this.lessonIsDone = this._lessonService.getSelectedLesson()?.isDone;
  }

  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      
    this.audioRecordingService.getRecordedBlob().subscribe((data: any) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });

      this.isAudioRecording = false;
    }
  }

  restartAudioRecordedData() {
    this.audioBlobUrl = null;
    this.startAudioRecording();
  }

  saveRecording() {
    if (!(this._lessonService.getSelectedLesson()?.isChecked) && this.audioBlob && this.audioBlobUrl) {
      let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
      this.audioRecordingService.savePatientRecording(blob, 'audio/mp3', this.audioName, this.lessonWord).subscribe();
    }
    this.audioBlobUrl = undefined;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
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

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

}
