export interface WordGivenToPractice
{
    /**
     *
     */

        id:number,
        lessonId:number,
        wordId:number,
        patientRecording:string,
        score?:number,
        isValid?:boolean

}

export interface WordGivenToPracticeDTO
{
    /**
     *
     */

        id:number;
        lessonId:number;
        patientRecording:string;
        score?:number;
        isValid?:boolean;
        wordText:string;
        wordRecording?:string


}