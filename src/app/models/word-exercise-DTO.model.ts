

export  class WordExerciseDTO{
    /**
     *  public int Id { get; set; }
        public int WordId { get; set; }
        public int ExerciseId { get; set; }
        public string WordText { get; set; }
        public string WordRecording { get; set; }
        public int DifficultyLevelId { get; set; }
     */
    constructor(
        id:number,
        wordId:number,
        exerciseId:number,
        wordText:string,
        wordRecording:string,
        difficultyLevelId:number
    ) {      
    }
}