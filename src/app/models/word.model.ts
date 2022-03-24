export class Word{
    id: number;
    wordText: string;
    wordRecording: string;
    difficultyLevelId: number;
/**
 *
 */
    constructor(
        id:number,
        wordText:string,
        wordRecording:string,
        difficultyLevelId:number
    ) {
        this.id=id;
        this.wordText=wordText;
        this.wordRecording=wordRecording;
        this.difficultyLevelId=difficultyLevelId;
    }
}