

export class Message{
    /**
     *  public int Id { get; set; }
        public int PatientId { get; set; }
        public string MessageText { get; set; }
        public bool IsAnswer { get; set; }
        public DateTime DateOfWriting { get; set; }
        public bool IsRead { get; set; }
     */
    constructor(
        id:number,
        patientId:number,
        messageText:string,
        isAnswer:boolean,
        dateOfWriting:Date,
        isRead:boolean
        ) { }
}

