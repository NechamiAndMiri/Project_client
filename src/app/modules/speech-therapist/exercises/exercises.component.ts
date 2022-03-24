import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { WordService } from 'src/app/services/word.service';
import { PronunciationProblemsType } from 'src/app/models/pronunciation-problems-type.model';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Word } from 'src/app/models/word.model';
import { BehaviorSubject } from 'rxjs';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { SelectionModel } from '@angular/cdk/collections';

export class ProblemNode {
  problemName: string;
  problemId:number;
  children?: ProblemNode[];
 
  
  constructor(problemName: string='',problemId:number=0) {
    this.problemName=problemName;
    this.problemId=problemId;
  }

}

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}
let TREE_DATA = {
 
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  node1:TodoItemNode=new TodoItemNode();
  problemsTodoItemNodes:TodoItemNode[]=[];
  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(private _wordService:WordService ) {
    this.initialize();
  }

  initialize() {
    let data;
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    this._wordService.getPronunciationProblems().subscribe(
      data1=>{
       
        data1.forEach(e=>{ this.node1.item=e.problemName;this.node1.children=[new TodoItemNode()]; this.problemsTodoItemNodes.push(this.node1)});
        TREE_DATA=JSON.stringify(data1);
         data = this.buildFileTree(TREE_DATA, 0);  
         this.dataChange.next(data);

      });
    
debugger
    // Notify the change.
  
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
  
//------------------------------------------------------------------------------------------------------------------------


@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
  providers: [ChecklistDatabase,ConfirmationService,MessageService]
})
export class ExercisesComponent implements OnInit {

  problems:PronunciationProblemsType[]=[];
  selectedProblem:PronunciationProblemsType; //לשנות- לבעיה בחורה מהמסך
 problemsTodoItemNodes:TodoItemNode[]=[];
  levelsOfSelectedProblem:DifficultyLevel[]; 
  selectedLevel:DifficultyLevel;
  node1:TodoItemNode = new TodoItemNode() 
  levelWords:Word[];
  selectedWord:Word;

  initVal:number;

  wordText:string;

  //------------records var:-----------
  
  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;

  audioRecordedTime!: any;

  audioBlobUrl!: any;

  audioBlob!: any;

  audioName!: any;
 
  audioStream!: any;
 
  audioConf = { audio: true}
  //-----------------------------------

  constructor(private _database: ChecklistDatabase,private _wordService:WordService,private _speechTherapistService:SpeechTherapistService,
    private ref: ChangeDetectorRef,private audioRecordingService: AudioRecordingService,private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService, private messageService: MessageService)
  {
   
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
 });

    this.audioRecordingService.getRecordedTime().subscribe((time: any) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data: any) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data1 => {
      debugger
          this.dataSource.data = data1;
    });
    this._wordService.getPronunciationProblems().subscribe(
      data=>{
       
        data.forEach(e=>{ this.node1.item=e.problemName;this.node1.children=[new TodoItemNode()]; this.problemsTodoItemNodes.push(this.node1)});
        this.dataSource.data = this.problemsTodoItemNodes;
        debugger
         this.problems=data;  console.log(this.problems,"  ", data);
      this.selectedProblem=this.problems![0];
      this.loadLevels();
      });
  }
 async ngOnInit() {
     

  }
  existLevelName( name:number):boolean{
    for (let index = 0; index < this.levelsOfSelectedProblem.length; index++) {
         if(name==this.levelsOfSelectedProblem[index].difficultyLevel)
             return true;
    }
    return false;
  }
 
  nextLevelName():number{
    this.levelsOfSelectedProblem.sort((a,b)=>{return a.difficultyLevel - b.difficultyLevel;})
    return this.levelsOfSelectedProblem[this.levelsOfSelectedProblem.length-1].difficultyLevel+1;
  }
loadLevels(){
  this._wordService.getProblemDifficultyLevels(this.selectedProblem.id,this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(
      data=>{this.levelsOfSelectedProblem=data;
      this.selectedLevel=this.levelsOfSelectedProblem![0];
        this.initVal=this.nextLevelName(); 
        //this.loadTree();
        this.loadWords();
      });
    }
  
    loadWords(){
      this._wordService.getLevelWords(this.selectedLevel.id).subscribe(data=>{
        this.levelWords=data;
        this.selectedWord=this.levelWords![0];
      });
    }

saveNewLevel(){
  this._wordService.addLevelToProblem(
      new DifficultyLevel (0,
      this.selectedProblem.id,
      this.initVal,
      this._speechTherapistService.getSpeechTherapist().speechTherapist.id)
    ).subscribe(data=>{
      console.log("AAAAAA");
      this.levelsOfSelectedProblem.push(data);
      this.initVal=this.nextLevelName(); 

    })}

    confirmLevelDelete() {
      this.confirmationService.confirm({
          message: ` האם אתה רוצה למחוק את רמה מספר ${this.selectedLevel.difficultyLevel}??
        במחיקת הרמה ימחקו אוטומטית כל המילים השייכות לרמה זו`,
          header: 'מחיקת רמה',
          icon: 'pi pi-info-circle',
          rejectLabel:` ביטול` ,
          acceptLabel:' אישור ',
          accept: () => {
             this._wordService.deleteLevel(this.selectedLevel.id).subscribe(
               ()=>this.loadLevels());
          },
          reject: () => {console.log("level not removed");
          }
      });

  }

  confirmWordDelete()
  {
    this.confirmationService.confirm({
      message: ` האם אתה רוצה למחוק את המילה ${this.selectedWord.wordText}??`,
      header: 'מחיקת מילה',
      icon: 'pi pi-info-circle',
      rejectLabel:` ביטול` ,
      acceptLabel:' אישור ',
      accept: () => {
         this._wordService.deleteWord(this.selectedWord.id).subscribe(()=>this.loadWords());
      },
      reject: () => {console.log("word not removed");
      }
  });
  }

  //// -----------------------------records:---------------------------------


  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }
  
  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }
  
  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
  
    }
  }
  
  restartAudioRecordedData() {
    this.audioBlobUrl = null;
    this.startAudioRecording();
  }
  
  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }
  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  
  
  saveWord(){

    if(this.audioBlob&&this.audioBlobUrl)
    {
     let blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
    let w=new Word(0,this.wordText,"",this.selectedLevel.id)
    this.audioRecordingService.saveSpeechTherapistRecording(blob, 'audio/mp3', this.audioName,w).subscribe(
      ()=>this.loadWords()
    );
    }
    this.wordText="";
    this.audioBlobUrl=undefined;
   
  }

ngOnDestroy(): void {
  this.abortAudioRecording();
}


  //-------------------------------------------------------------------------


    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  
    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  
    /** A selected parent node to be inserted */
    selectedParent: TodoItemFlatNode | null = null;
  
    /** The new item's name */
    newItemName = '';
  
    treeControl: FlatTreeControl<TodoItemFlatNode>;
  
    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  
    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  
    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
 
    getLevel = (node: TodoItemFlatNode) => node.level;
  
    isExpandable = (node: TodoItemFlatNode) => node.expandable;
  
    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  
    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  
    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  
    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode =
        existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
      flatNode.item = node.item;
      flatNode.level = level;
      flatNode.expandable = !!node.children?.length;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    };
  
    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected =
        descendants.length > 0 &&
        descendants.every(child => {
          return this.checklistSelection.isSelected(child);
        });
      return descAllSelected;
    }
  
    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const result = descendants.some(child => this.checklistSelection.isSelected(child));
      return result && !this.descendantsAllSelected(node);
    }
  
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
  
      // Force update for the parent
      descendants.forEach(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
    }
  
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
    }
  
    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
      let parent: TodoItemFlatNode | null = this.getParentNode(node);
      while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
      }
    }
  
    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
      const nodeSelected = this.checklistSelection.isSelected(node);
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected =
        descendants.length > 0 &&
        descendants.every(child => {
          return this.checklistSelection.isSelected(child);
        });
      if (nodeSelected && !descAllSelected) {
        this.checklistSelection.deselect(node);
      } else if (!nodeSelected && descAllSelected) {
        this.checklistSelection.select(node);
      }
    }
  
    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
      const currentLevel = this.getLevel(node);
  
      if (currentLevel < 1) {
        return null;
      }
  
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
  
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
      return null;
    }
  
    /** Select the category so we can insert the new item. */
    addNewItem(node: TodoItemFlatNode) {
      debugger
      const parentNode = this.flatNodeMap.get(node);
      this._database.insertItem(parentNode!, '');
      this.treeControl.expand(node);
    }
  
    /** Save the node to database */
    saveNode(node: TodoItemFlatNode, itemValue: string) {
      const nestedNode = this.flatNodeMap.get(node);
      this._database.updateItem(nestedNode!, itemValue);
    }
  
  }
//------------------------------------------
//   async loadTree(){
    
//   for (let index = 0; index < this.problems!.length; index++) {
//     this.dataSource.data[index]=new ProblemNode();
//     debugger;
//       }
  
//       this.treeFlattener = new MatTreeFlattener(
//         this.transformer,
//         this.getLevel,
//         this.isExpandable,
//         this.getChildren,
  
//       );
//       this.treeControl = new FlatTreeControl<ProblemFlatNode>(this.getLevel, this.isExpandable);
//        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
   
//      await this._database.dataChange.subscribe(data => {
//         this.dataSource.data = data;
//       });
//   }
 
 

//  existLevelName( name:number):boolean{
//    for (let index = 0; index < this.levelsOfSelectedProblem.length; index++) {
//         if(name==this.levelsOfSelectedProblem[index].difficultyLevel)
//             return true;
//    }
//    return false;
//  }

//  nextLevelName():number{
//    this.levelsOfSelectedProblem.sort((a,b)=>{return a.difficultyLevel - b.difficultyLevel;})
//    return this.levelsOfSelectedProblem[this.levelsOfSelectedProblem.length-1].difficultyLevel+1;
//  }





//  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
//  flatNodeMap = new Map<ProblemFlatNode, ProblemNode>();

//  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
//  nestedNodeMap = new Map<ProblemNode, ProblemFlatNode>();

//  /** A selected parent node to be inserted */
//  selectedParent: ProblemFlatNode | null = null;

//  /** The new item's name */
//  newItemName = '';

//  treeControl: FlatTreeControl<ProblemFlatNode>;

//  treeFlattener: MatTreeFlattener<ProblemNode, ProblemFlatNode>;

//  dataSource: MatTreeFlatDataSource<ProblemNode, ProblemFlatNode>;



//  getLevel = (node: ProblemFlatNode) => node.level;

//  isExpandable = (node: ProblemFlatNode) => node.expandable;

//  getChildren = (node: ProblemNode): ProblemNode[]|undefined => node.children;

//  hasChild = (_: number, _nodeData: ProblemFlatNode) => _nodeData.expandable;

//  hasNoContent = (_: number, _nodeData: ProblemFlatNode) => _nodeData.problemName === '';

//  /**
//   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
//   */
//  transformer = (node: ProblemNode, level: number) => {
//    const existingNode = this.nestedNodeMap.get(node);
//    const flatNode =
//      existingNode && existingNode.problemName === node.problemName ? existingNode : new ProblemFlatNode();
//    flatNode.problemName = node.problemName;
//    flatNode.level = level;
//    flatNode.expandable = !!node.children?.length;
//    this.flatNodeMap.set(flatNode, node);
//    this.nestedNodeMap.set(node, flatNode);
//    return flatNode;
//  };



//  /* Get the parent node of a node */
//  getParentNode(node: ProblemFlatNode): ProblemFlatNode | null {
//    const currentLevel = this.getLevel(node);

//    if (currentLevel < 1) {
//      return null;
//    }

//    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

//    for (let i = startIndex; i >= 0; i--) {
//      const currentNode = this.treeControl.dataNodes[i];

//      if (this.getLevel(currentNode) < currentLevel) {
//        return currentNode;
//      }
//    }
//    return null;
//  }

//  /** Select the category so we can insert the new item. */
//  addNewItem(node: ProblemFlatNode) {
//    const parentNode = this.flatNodeMap.get(node);
//    this._database.insertItem(parentNode!, new ProblemNode());
//    this.treeControl.expand(node);
//  }

//  /** Save the node to database */
//  saveNode(node: ProblemFlatNode, itemValue: string) {
//    const nestedNode = this.flatNodeMap.get(node);
//    this._database.updateItem(nestedNode!, itemValue);
//  }







///////////////////////////////////////////////////////////////////////////////



                    // private _transformer = (node: ProblemNode, level: number) => {
                    //   return {
                    //     expandable: !!node.children && node.children.length > 0,
                    //     name: node.problem.problemName,
                    //     level: level,
                    //   };
                    // };

                    // treeControl = new FlatTreeControl<ExampleFlatNode>(
                    //   node => node.level,
                    //   node => node.expandable,
                    // );

                    // treeFlattener = new MatTreeFlattener(
                    //   this._transformer,
                    //   node => node.level,
                    //   node => node.expandable,
                    //   node => node.children,
                    // );

                    // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

                    // hasChild = (_: number, node: ExampleFlatNode) => node.expandable;



///////////////////////////////////////////////////////////////////////////////////////////



  


