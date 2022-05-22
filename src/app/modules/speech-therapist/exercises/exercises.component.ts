import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { WordService } from 'src/app/services/word.service';
import { PronunciationProblemsType } from 'src/app/models/pronunciation-problems-type.model';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Word } from 'src/app/models/word.model';
import { BehaviorSubject } from 'rxjs';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { SelectionModel } from '@angular/cdk/collections';

//gggggggg
class nProblem {
  id: number;
  ProblemName: string;
  Levels: nLevel[];
  showLevels: boolean;
  /**
   *
   */
  constructor(id: number, ProblemName: string, Levels: nLevel[], showLevels: boolean) {
    this.id = id;
    this.ProblemName = ProblemName;
    this.Levels = Levels;
    this.showLevels = showLevels;
  }

}

class nLevel {
  id: number;
  pronunciationProblemId: number;
  difficultyLevel: number;
  speechTherapistId: number;
  words: Word[];
  showWords: boolean;
  /**
   *
   */
  constructor(id: number, pronunciationProblemId: number, difficultyLevel: number,
    speechTherapistId: number, words: Word[], showWords: boolean) {
    this.difficultyLevel = difficultyLevel
    this.id = id
    this.pronunciationProblemId = pronunciationProblemId
    this.showWords = showWords
    this.speechTherapistId = speechTherapistId
    this.words = words

  }
}

// class nWord
// {
//   id:number;
//   wordText:string;
//   wordRecording:string;
//   difficultyLevelId:number
//   /**
//    *
//    */
//   constructor(id:number, wordText:string, wordRecording:string,difficultyLevelId:number) {
//     this.difficultyLevelId=difficultyLevelId
//     this.id=id
//     this.wordRecording=wordRecording
//     this.wordText=wordText
//   }
// }

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
  providers: [ConfirmationService]
})
export class ExercisesComponent implements OnInit {

  problems: PronunciationProblemsType[] = [];
  selectedProblem: PronunciationProblemsType; //לשנות- לבעיה בחורה מהמסך

  levelsOfSelectedProblem: DifficultyLevel[];
  selectedLevel: DifficultyLevel;

  levelWords: Word[];
  selectedWord: Word;

  initVal: number;
  currentLevelVal: number;

  wordToEdit:Word;

  wordText: string;

  problemsArr: nProblem[] = [];


  //------------records var:-----------

  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;

  audioRecordedTime!: any;

  audioBlobUrl!: any;

  audioBlob!: any;

  audioName!: any;

  audioStream!: any;

  audioConf = { audio: true }

  prev_url: any;

  // @ViewChild('myAudio') playerRef: ElementRef<HTMLAudioElement>;

  isDownloadaudio: boolean;
  audio: HTMLAudioElement;
  //-----------------------------------

  constructor(private _wordService: WordService, private _speechTherapistService: SpeechTherapistService,
    private ref: ChangeDetectorRef, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService) {

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


    this._wordService.getPronunciationProblems().subscribe(
      data => {

        this.problems = data; console.log(this.problems, "  ", data);
        this.problemsArr = this.problems.map(problem => { return new nProblem(problem.id, problem.problemName, [], false) })
        //להוריד את 2 השורות הבאות
        //this.selectedProblem=this.problems![0];

      });
  }
  async ngOnInit() {


  }
  existLevelName(problemIndex: number, name: number): boolean {
    for (let index = 0; index < this.problemsArr[problemIndex].Levels.length; index++) {
      if (name == this.problemsArr[problemIndex].Levels[index].difficultyLevel)
        return true;
    }
    return false;
  }




  nextLevelName(problemIndex: number): number {
    this.problemsArr[problemIndex].Levels.sort((a, b) => { return a.difficultyLevel - b.difficultyLevel; })
    return this.problemsArr[problemIndex].Levels[this.problemsArr[problemIndex].Levels.length - 1].difficultyLevel + 1;
  }


  loadLevels(problemIndex: number) {
    this._wordService.getProblemDifficultyLevels(this.problemsArr[problemIndex].id, this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(
      data => {
        var levelsArr = data.map((level: any) => { return new nLevel(level.id, level.pronunciationProblemId, level.difficultyLevel, level.speechTherapistId, [], false) });
        this.problemsArr[problemIndex].Levels = levelsArr;

        this.initVal = this.nextLevelName(problemIndex);

      });
  }



  loadWords(levelIndex: number, problemIndex: number) {
    this._wordService.getLevelWords(this.problemsArr[problemIndex].Levels[levelIndex].id).subscribe(data => {
      //var wordsArr=data.map((word)=>{return new Word(word.id,word.wordText,word.wordRecording,word.difficultyLevelId)});

      this.problemsArr[problemIndex].Levels[levelIndex].words = data;

    });
  }


  saveNewLevel(problemIndex: number) {
    this._wordService.addLevelToProblem(
      new DifficultyLevel(0,
        this.problemsArr[problemIndex].id,
        this.initVal,
        this._speechTherapistService.getSpeechTherapist().speechTherapist.id)
    ).subscribe(data => {
      this.problemsArr[problemIndex].Levels.push(new nLevel(data.id, data.pronunciationProblemId, data.difficultyLevel, data.speechTherapistId, [], false));
      this.initVal = this.nextLevelName(problemIndex);

    })
  }

  updateLevel(problemIndex: number, levelIndex: number) {
    this._wordService.updateLevel(this.problemsArr[problemIndex].Levels[levelIndex].id, this.currentLevelVal).subscribe((bool) => {
      console.log('apdate level');
      if (bool == true)
        this.problemsArr[problemIndex].Levels[levelIndex].difficultyLevel = this.currentLevelVal;
      this.initVal = this.nextLevelName(problemIndex);
    });
  }



  confirmLevelDelete(levelIndex: number, problemIndex: number) {
    this.confirmationService.confirm({
      message: ` האם אתה רוצה למחוק את רמה מספר ${this.problemsArr[problemIndex].Levels[levelIndex].difficultyLevel}??
      במחיקת הרמה ימחקו אוטומטית כל המילים השייכות לרמה זו`,
      header: 'מחיקת רמה',
      icon: 'pi pi-info-circle',
      rejectLabel: ` ביטול`,
      acceptLabel: ' אישור ',
      accept: () => {
        this._wordService.deleteLevel(this.problemsArr[problemIndex].Levels[levelIndex].id).subscribe(
          () => this.loadLevels(problemIndex));
      },
      reject: () => {
        console.log("level not removed");
      }
    });

  }


  confirmWordDelete(wordIndex: number, levelIndex: number, problemIndex: number) {
    this.confirmationService.confirm({
      message: ` האם אתה רוצה למחוק את המילה ${this.problemsArr[problemIndex].Levels[levelIndex].words[wordIndex].wordText}??`,
      header: 'מחיקת מילה',
      icon: 'pi pi-info-circle',
      rejectLabel: ` ביטול`,
      acceptLabel: ' אישור ',
      accept: () => {
        this._wordService.deleteWord(this.problemsArr[problemIndex].Levels[levelIndex].words[wordIndex].id).subscribe(() => this.loadWords(levelIndex, problemIndex));
      },
      reject: () => {
        console.log("word not removed");
      }
    });
  }



  //// -----------------------------records:---------------------------------


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



  saveWord(levelIndex: number, problemIndex: number) {

    if (this.audioBlob && this.audioBlobUrl) {
      let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
      let w = new Word(0, this.wordText, "", this.problemsArr[problemIndex].Levels[levelIndex].id)
      this.audioRecordingService.saveSpeechTherapistRecording(blob, 'audio/mp3', this.audioName, w).subscribe(
        () => this.loadWords(levelIndex, problemIndex)
      );
    }
    this.wordText = "";
    this.audioBlobUrl = undefined;

  }

  updateWord(levelIndex: number, problemIndex: number) {
    if (this.audioBlob && this.audioBlobUrl) {
      let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
      this.audioRecordingService.updateSpeechTherapistRecording(blob, 'audio/mp3', this.audioName, this.wordToEdit).subscribe(
        () => this.loadWords(levelIndex, problemIndex)
      );
    }
    this.wordText = "";
    this.audioBlobUrl = undefined;
  }

  // updateWordWithoutRecord(levelIndex: number, problemIndex: number){
  //   this.audioRecordingService.updateSpeechTherapistRecording(blob, 'audio/mp3', this.audioName, this.wordToEdit).subscribe(
  //     () => this.loadWords(levelIndex, problemIndex)
  //   );

  // }

  //of Tehila
  // playWordRecord(word: Word) {
  //   // this.isDownloadaudio = false;
  //   let blob;
  //   this.audioRecordingService.getWordRecord(word).subscribe((b: any) => {
  //     this.isDownloadaudio = true;
  //     blob = new Blob([b], { type: 'audio/mp3' });

  //     this.audioBlob = b.body;
  //     this.audioName = b.title;
  //     this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

  //     this.audio = new Audio();
  //     // this.audio.srcObject = blob as MediaProvider;
  //     this.audio.src =  this.audioBlobUrl.changingThisBreaksApplicationSecurity
  //     this.audio.play();
  //     //this will make sure to update when time updates.
  //     this.audio.ontimeupdate = (event) => {
  //        var currentTime = this.audio.currentTime;
  //        this.ref.detectChanges();
  //     }
  //   });
  // }

  playWordRecord(word: Word) {
    let blob;
    this.audioRecordingService.getWordRecord(word).subscribe((b: any) => {
      this.isDownloadaudio = true;
      blob = new Blob([b], { type: 'audio/mp3' });

      let audioBlob1 = b.body;
      let audioName1 = b.title;
      let audioBlobUrl1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(b.body));

      let audio1 = new Audio();
      // this.audio.srcObject = blob as MediaProvider;
      audio1.src =  (audioBlobUrl1 as any).changingThisBreaksApplicationSecurity
      audio1.play();
      //this will make sure to update when time updates.
      audio1.ontimeupdate = (event) => {
         var currentTime = audio1.currentTime;
         this.ref.detectChanges();
      }
    });
  }

  playNewWordRecord(){
    this.audio = new Audio();
    this.audio.src =  this.audioBlobUrl.changingThisBreaksApplicationSecurity
    this.audio.play();
    //this will make sure to update when time updates.
    this.audio.ontimeupdate = (event) => {
       var currentTime = this.audio.currentTime;
       this.ref.detectChanges();
    }
  }



  ngOnDestroy(): void {
    this.abortAudioRecording();
  }







  //-------------------------------------------------------------------------------------------------------------------

  // existLevelName( name:number):boolean{
  //     for (let index = 0; index < this.levelsOfSelectedProblem.length; index++) {
  //          if(name==this.levelsOfSelectedProblem[index].difficultyLevel)
  //              return true;
  //     }
  //     return false;
  //   }

  //   nextLevelName():number{
  //     this.levelsOfSelectedProblem.sort((a,b)=>{return a.difficultyLevel - b.difficultyLevel;})
  //     return this.levelsOfSelectedProblem[this.levelsOfSelectedProblem.length-1].difficultyLevel+1;
  //   }

  //   loadLevels(){
  //   this._wordService.getProblemDifficultyLevels(this.selectedProblem.id,this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(
  //       data=>{this.levelsOfSelectedProblem=data;
  //       this.selectedLevel=this.levelsOfSelectedProblem![0];
  //         this.initVal=this.nextLevelName();
  //         //this.loadTree();

  //         this.loadWords();
  //       });
  //     }

  //   loadWords(){
  //       this._wordService.getLevelWords(this.selectedLevel.id).subscribe(data=>{
  //         this.levelWords=data;
  //         this.selectedWord=this.levelWords![0];
  //       });
  //     }

  //     saveNewLevel(){
  //   this._wordService.addLevelToProblem(
  //       new DifficultyLevel (0,
  //       this.selectedProblem.id,
  //       this.initVal,
  //       this._speechTherapistService.getSpeechTherapist().speechTherapist.id)
  //     ).subscribe(data=>{
  //       console.log("AAAAAA");
  //       this.levelsOfSelectedProblem.push(data);
  //       this.initVal=this.nextLevelName();

  //     })}

  //     confirmLevelDelete() {
  //       this.confirmationService.confirm({
  //           message: ` האם אתה רוצה למחוק את רמה מספר ${this.selectedLevel.difficultyLevel}??
  //         במחיקת הרמה ימחקו אוטומטית כל המילים השייכות לרמה זו`,
  //           header: 'מחיקת רמה',
  //           icon: 'pi pi-info-circle',
  //           rejectLabel:` ביטול` ,
  //           acceptLabel:' אישור ',
  //           accept: () => {
  //              this._wordService.deleteLevel(this.selectedLevel.id).subscribe(
  //                ()=>this.loadLevels());
  //           },
  //           reject: () => {console.log("level not removed");
  //           }
  //       });

  //   }


  // confirmWordDelete()
  // {
  //   this.confirmationService.confirm({
  //     message: ` האם אתה רוצה למחוק את המילה ${this.selectedWord.wordText}??`,
  //     header: 'מחיקת מילה',
  //     icon: 'pi pi-info-circle',
  //     rejectLabel:` ביטול` ,
  //     acceptLabel:' אישור ',
  //     accept: () => {
  //        this._wordService.deleteWord(this.selectedWord.id).subscribe(()=>this.loadWords());
  //     },
  //     reject: () => {console.log("word not removed");
  //     }
  // });
  // }

  //   saveWord(){

  //     if(this.audioBlob&&this.audioBlobUrl)
  //     {
  //      let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
  //     let w=new Word(0,this.wordText,"",this.selectedLevel.id)
  //     this.audioRecordingService.saveSpeechTherapistRecording(blob, 'audio/mp3', this.audioName,w).subscribe(
  //       ()=>this.loadWords()
  //     );
  //     }
  //     this.wordText="";
  //     this.audioBlobUrl=undefined;

  //   }
}





