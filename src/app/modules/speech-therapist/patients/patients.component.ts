import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MyErrorStateMatcher } from 'src/app/log-in/log-in.component';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Lesson } from 'src/app/models/lesson.model';
import { PatientDTO } from 'src/app/models/patientDTO.model';
import { WordGivenToPracticeDTO } from 'src/app/models/wordGivenToPractice.model';
import { LessonService } from 'src/app/services/lesson.service';
import { PatientService } from 'src/app/services/patient.service';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';
import { WordService } from 'src/app/services/word.service';
import { ConfirmationService, PrimeNGConfig } from "primeng/api";
import { Word } from 'src/app/models/word.model';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface FlatPatient {

  id: number;
  userId: number;
  speechTherapistId: number;
  dateOfBirth: Date;
  pronunciationProblemId: number;
  firstName: string;
  lastName: string;
  identityNumber: string;
  email: string;
  permissionLevelId: number;
  password: string;
  phone: string;

}
const scoreThreshold = 56;

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  providers: [ConfirmationService]
})

export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'identityNumber', 'email', 'phone', 'dateOfBirth'];
  rightDisplayedColumns: string[] = ['fullName']
  dataSource: MatTableDataSource<FlatPatient>;
  patients: PatientDTO[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedPatient: FlatPatient;
  difficultyLevelsOfSelectedPatient: DifficultyLevel[];
  selectedPatientLessons: Lesson[];
  selectedLessonWords: WordGivenToPracticeDTO[] = [];
  selectedLessonWordsToShow: Word[] = [];
  //maybe to delet later selectedLesson
  selectedLesson: Lesson;
  selectedLevel: DifficultyLevel;
  levelWords: Word[] = []
  selectedLevelsWords: Word[] = [];
  submitted: boolean;
  displayLessonDialogToCheck: boolean;
  displayLessonDialog: boolean;
  displayLessonDialogToUpdate: boolean;
  today = new Date();

  lessonForm: FormGroup = new FormGroup({
    "level": new FormControl("", [Validators.required]),
    "date": new FormControl("", Validators.required),
    "description": new FormControl("", [Validators.required, Validators.minLength(15)])
  });

  matcher = new MyErrorStateMatcher();

  constructor(private _patientService: PatientService, private _speechTherapistService: SpeechTherapistService,
    private _lessonService: LessonService, private _wordService: WordService, private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService, private audioRecordingService: AudioRecordingService
    , private sanitizer: DomSanitizer) {

    this._patientService.getSpeechTerapistPatients(this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(data => {
      this.patients = data; console.log(data);
      this.dataSource = new MatTableDataSource(this.patients.map(p => {
        return <FlatPatient>{
          id: p.patient.id, userId: p.patient.userId, speechTherapistId: p.patient.speechTherapistId, dateOfBirth: p.patient.dateOfBirth,
          pronunciationProblemId: p.patient.pronunciationProblemId, firstName: p.user.firstName, lastName: p.user.lastName, permissionLevelId: p.user.permissionLevelId,
          identityNumber: p.user.identityNumber, email: p.user.email, password: p.user.password, phone: p.user.phone
        }
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })

  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateAge(birthDate: Date): number {
    const current = new Date();
    const birthDate1 = new Date(birthDate)
    return current.getFullYear() - (birthDate1).getFullYear();
  }

  selectPatient(patient: FlatPatient) {
    this.selectedPatient = patient;
    this._lessonService.getLessonsByPatient(patient.id).subscribe((data) => {
      this._wordService.getProblemDifficultyLevels(patient.pronunciationProblemId, patient.speechTherapistId)
        .subscribe((levels) => {
          this.difficultyLevelsOfSelectedPatient = levels; console.log(levels);
        })
      this.selectedPatientLessons = data;
    })
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
    this._lessonService.getWordsByLessonId(lesson.id).subscribe((data) => {
      this.selectedLessonWords = data;
    })
  }

  mapLessonWords() {
    this.selectedLessonWordsToShow = this.selectedLessonWords.map((word) => {
      return <Word>{
        id: word.wordId,
        wordText: word.wordText,
        wordRecording: word.wordRecording
      }
    });
  }

  submitCheckLesson() {
    this._lessonService.updateLesson(this.selectedLesson).subscribe(
      () => {
        this._lessonService.putWordsToLesson(this.selectedLesson.id, this.selectedLessonWords).subscribe(() => {
          this._lessonService.getLessonsByPatient(this.selectedPatient.id).subscribe(() => { this.displayLessonDialogToCheck = false; });

        })
      }
    )
  }

  checkLesson(lesson: Lesson) {
    this.selectLesson(lesson);
    this.displayLessonDialogToCheck = true;
  }

  deleteLesson(lesson: Lesson) {
    this.confirmationService.confirm({
      message: 'לא יהיה ניתן לשחזר את השיעור!',
      header: 'מחיקת שיעור',
      icon: 'pi pi-info-circle',
      rejectLabel: ` ביטול`,
      acceptLabel: ' אישור ',
      accept: () => {
        this._lessonService.deleteLesson(lesson.id).subscribe(() =>
          this._lessonService.getLessonsByPatient(this.selectedPatient.id).subscribe((data) => {
            this.selectedPatientLessons = data;
          }
          )
        );
      },
      reject: () => {
        console.log("שיעור not removed");
      }
    });
  }

  updateLesson(lesson: Lesson) {
    //this.selectedLesson = lesson;
    this.selectLesson(lesson);
    this.mapLessonWords();
    this.getWordsForLevel(this.selectedLesson.difficultyLevelId);// get the word when the level change-do it  this.selectedLevel.id
    this.displayLessonDialogToUpdate = true;
  }

  updateLevelToLesson(level: DifficultyLevel) {
    this.selectedLesson.difficultyLevelId = level.id;
    this.selectedLesson.difficultyLevelName = level.difficultyLevel
  }

  finishUpdateLesson() {

    //הקריאה לשרת היא רק בגלל שזה בתוך אינפלייס שיש לו נגמודל עם הסלקטד לסון
    this._lessonService.updateLesson(this.selectedLesson).subscribe(() =>
      this._lessonService.getLessonsByPatient(this.selectedPatient.id).subscribe((data) => { this.selectedPatientLessons = data; })
    );

    let newWords = this.selectedLessonWordsToShow.map((word) => {
      return <WordGivenToPracticeDTO>{
        lessonId: this.selectedLesson.id,
        patientRecording: '',
        score: undefined,
        difficultyLevelId: word.difficultyLevelId,
        isValid: undefined,
        wordText: word.wordText,
        wordRecording: word.wordRecording,
        wordId: word.id
      }
    });

    if (this.selectedLessonWords?.length > 0) {
      //put lesson words
      this._lessonService.putWordsToLesson(this.selectedLesson.id, newWords).subscribe(() => {
        this.displayLessonDialogToUpdate = false;
        //?האם לבחור עכשיו שוב את השיעור או לשחרר את הבחירה בכלל?
        //this.selectedLesson=undefined;
        this.selectedLessonWordsToShow = [];
      });
    }
    else {
      //post lesson words
      this._lessonService.postWordsToLesson(newWords).subscribe(() => {
        this.displayLessonDialogToUpdate = false;
        //?האם לבחור עכשיו שוב את השיעור או לשחרר את הבחירה בכלל?
        //this.selectedLesson=undefined;
        this.selectedLessonWordsToShow = [];
      });
    }

  }

  openAddLessonDialog() {
    this.displayLessonDialog = true;
  }
  
  addLesson() {
    const newLesson = {
      "id": 0,
      "patientId": this.selectedPatient.id,
      "date": this.lessonForm.get('date')?.value,
      "isChecked": false,
      "difficultyLevelId": this.lessonForm.get('level')?.value.id,
      "lessonDescription": this.lessonForm.get('description')?.value,
      "isDone": false

    }

    this._lessonService.addLesson(newLesson).subscribe((lesson) => {
      this.selectedPatientLessons.push(lesson);
    })


    this.displayLessonDialog = false;


  }

  getWordsForLevel(levelId: number) {
    this._wordService.getLevelWords(levelId).subscribe((words) => {
      this.levelWords = words.map((word) => {
        return <Word>{
          id: word.id,
          wordText: word.wordText,
          wordRecording: word.wordRecording,
          // difficultyLevelId: word.difficultyLevelId
        }
      });;
    })
  }

  removeWordFromLesson(wordId: number) {
    this.selectedLessonWordsToShow.forEach((w, i) => { if (w.id == wordId) this.selectedLessonWordsToShow.splice(i, 1); })
  }

  changeIsValid(index: number) {
    let score = this.selectedLessonWords[index].score || 0;
    if (score > scoreThreshold) {
      this.selectedLessonWords[index].isValid = true;
    }
    else {
      this.selectedLessonWords[index].isValid = false;
    }
  }
  recalculateLessonScore() {
    let sum = 0;
    for (let i = 0; i < this.selectedLessonWords.length; i++) {
      sum += this.selectedLessonWords[i].score || 0;
    }
    this.selectedLesson.weightedScore = sum / this.selectedLessonWords.length;
  }
  playWordRecord(word: WordGivenToPracticeDTO) {
    let blob;
    this.audioRecordingService.getPatientRecording(word.id).subscribe((b: any) => {
      // this.isDownloadaudio = true;
      blob = new Blob([b], { type: 'audio/mp3' });

      let audioBlob1 = b.body;
      let audioName1 = b.title;
      let audioBlobUrl1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

      let audio1 = new Audio();
      // this.audio.srcObject = blob as MediaProvider;
      audio1.src = (audioBlobUrl1 as any).changingThisBreaksApplicationSecurity
      audio1.play();
      //this will make sure to update when time updates.
      audio1.ontimeupdate = (event) => {
        var currentTime = audio1.currentTime;
        // this.ref.detectChanges();
      }
    });
  }
}

