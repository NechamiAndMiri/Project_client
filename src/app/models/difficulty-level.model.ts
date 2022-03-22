

export class DifficultyLevel{
/**
 *      public int Id { get; set; }
        public int PronunciationProblemId { get; set; }
        public int DifficultyLevel { get; set; }
        public int SpeechTherapistId { get; set; }
 */

        id:number;
        pronunciationProblemId:number;
        difficultyLevel:number;
        speechTherapistId:number;

constructor(
    id:number,
    pronunciationProblemId:number,
    difficultyLevel:number,
    speechTherapistId:number
    ) {
        this.id=id;
        this.pronunciationProblemId=pronunciationProblemId;
        this.difficultyLevel=difficultyLevel;
        this.speechTherapistId=speechTherapistId;
    }
   


}