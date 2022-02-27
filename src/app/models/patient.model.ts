

export class Patient{
    /**
     *  public int Id { get; set; }
        public int UserId { get; set; }
        public int SpeechTherapistId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int PronunciationProblemId { get; set; }
     */

        id:number;
        userId:number;
        speechTherapistId:number;
        dateOfBirth:Date;
        pronunciationProblemId:number;

   constructor(
        id:number,
        userId:number,
        speechTherapistId:number,
        dateOfBirth:Date,
        pronunciationProblemId:number
   ) 
   {
      this.id=id;
      this.userId=userId;
      this.speechTherapistId=speechTherapistId;
      this.dateOfBirth=dateOfBirth;
      this.pronunciationProblemId=pronunciationProblemId;

   }
    
}