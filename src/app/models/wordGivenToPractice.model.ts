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