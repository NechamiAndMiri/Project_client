export class User
{
    id:number;
    firstName:string;
    lastName:string;
    identityNumber:string;
    email:string;
    permissionLevelId: number;
    password:string;
    phone:string;
 
    /**
     *
     */
    constructor(
        id:number,
        firstName:string,
        lastName:string,
        identityNumber:string,
        email:string,
        permissionLevelId:number,
        password:string,
        phone:string
    ) {
        this.id=id;
        this.firstName=firstName;
        this.lastName=lastName;
        this.identityNumber=identityNumber;
        this.email=email;
        this.permissionLevelId=permissionLevelId;
        this.password=password;
        this.phone=phone;
    }
      

    
}