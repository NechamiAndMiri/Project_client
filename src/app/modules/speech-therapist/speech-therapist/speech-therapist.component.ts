import { Component, OnInit } from '@angular/core';
import { SpeechTherapistDTO } from 'src/app/models/speechTherapistDTO.model';
import { LogInService } from 'src/app/services/log-in.service';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';

@Component({
  selector: 'app-speech-therapist',
  templateUrl: './speech-therapist.component.html',
  styleUrls: ['./speech-therapist.component.css']
})
export class SpeechTherapistComponent implements OnInit {

  showExercise: boolean = false;

  constructor(private _speechTherapistService:SpeechTherapistService,private _loginService:LogInService) {
    this._speechTherapistService.speechTherapist=(this._loginService.getTheUser() as SpeechTherapistDTO);
  }



  ngOnInit(): void {

  }

}
