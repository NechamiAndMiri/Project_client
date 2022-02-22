import { SpeechTherapist } from "./speechTherapist.model";
import { User } from "./user.model";
import { UserDTO } from "./userDTO.model";

export class SpeechTherapistDTO extends UserDTO

{
    /**
     *
     */
     
     speechTherapist:SpeechTherapist
   constructor(
        user:User,
        speechTherapist:SpeechTherapist
   ) 
   {
        super(user); 
        this.speechTherapist=speechTherapist;
   }
}