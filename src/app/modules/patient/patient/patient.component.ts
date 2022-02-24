import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { PatientDTO } from 'src/app/models/patientDTO.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
user!:PatientDTO
items: MenuItem[] | undefined;
  constructor() { 
    var u=sessionStorage.getItem("user");
    if(u)
      this.user=JSON.parse(u); 
  }   
  
  ngOnInit(): void {
    
 
 
  }  

  panelOpenState = false;
}








