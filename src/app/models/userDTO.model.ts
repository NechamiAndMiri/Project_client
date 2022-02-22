
import { User } from "./user.model";

export class UserDTO
{
    /**
     *
     */
     user:User;
    
    constructor(
        user:User,
      
    ) 
    {
        this.user=user;
 
     }
}