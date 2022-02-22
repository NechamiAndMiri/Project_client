import { Patient } from "./patient.model";
import { User } from "./user.model";
import { UserDTO } from "./userDTO.model";

export class PatientDTO extends UserDTO
{
    /**
     *
     */
    
     patient:Patient 
    constructor(
        user:User,
        patient:Patient
    ) 
    {
        super(user);
        this.patient=patient;
     }
}