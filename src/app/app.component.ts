import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from './services/audio-recording-service.service';
// import Swal from 'sweetalert2\dist\sweetalert2.js';  


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {
  title = 'Project_client';
  
 
 
      
  //   simpleAlert(){  
  //     Swal.fire('Hello Angular');  
  //   }  
      
  //   alertWithSuccess(){  
  //     Swal.fire('Thank you...', 'You submitted succesfully!', 'success')  
  //   }  
  //   erroalert()  
  //   {  
  //     Swal.fire({  
  //       icon: 'error',  
  //       title: 'Oops...',  
  //       text: 'Something went wrong!',  
  //       footer: '<a href>Why do I have this issue?</a>'  
  //     })  
  //   }  
  //   topend()  
  //   {  
  //     Swal.fire({  
  //       position: 'top-end',  
  //       icon: 'success',  
  //       title: 'Your work has been saved',  
  //       showConfirmButton: false,  
  //       timer: 1500  
  //     })  
  //   }  
  //   confirmBox(){  
  //     Swal.fire({  
  //       title: 'Are you sure want to remove?',  
  //       text: 'You will not be able to recover this file!',  
  //       icon: 'warning',  
  //       showCancelButton: true,  
  //       confirmButtonText: 'Yes, delete it!',  
  //       cancelButtonText: 'No, keep it'  
  //     }).then((result:any) => {  
  //       if (result.value) {  
  //         Swal.fire(  
  //           'Deleted!',  
  //           'Your imaginary file has been deleted.',  
  //           'success'  
  //         )  
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {  
  //         Swal.fire(  
  //           'Cancelled',  
  //           'Your imaginary file is safe :)',  
  //           'error'  
  //         )  
  //       }  
  //     })  
  //   }  
  // }  
}
