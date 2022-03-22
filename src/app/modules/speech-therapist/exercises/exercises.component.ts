import { Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { WordService } from 'src/app/services/word.service';
import { PronunciationProblemsType } from 'src/app/models/pronunciation-problems-type.model';
import { DifficultyLevel } from 'src/app/models/difficulty-level.model';
import { Word } from 'src/app/models/word.model';
import { BehaviorSubject } from 'rxjs';
import { SpeechTherapistService } from 'src/app/services/speech-therapist.service';

export class ProblemNode {
  problemName: string;
  problemId:number;
  children?: ProblemNode[];
 
  
  constructor(problemName: string='',problemId:number=0) {
    this.problemName=problemName;
    this.problemId=problemId;
  }

}
// export class ProblemNode {
//   problem: PronunciationProblemsType;
//   children?: LevelNode[];
// }

export class ProblemFlatNode {
  problemName: string;
  problemId:number;
  level: number;
  expandable: boolean;
}


export class LevelNode{
  difficultyLevel:DifficultyLevel;
  children?: Word[];
}


const TREE_DATA: ProblemNode[] = [];

          interface ExampleFlatNode {
            expandable: boolean;
            name: string;
            level: number;
          }


  //------------------------------------------------------------------------------------------------------------------------

  @Injectable( )
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ProblemNode[]>([]);

  get data(): ProblemNode[] {
    return this.dataChange.value;
  }


  constructor() {
    this.initialize();


  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): ProblemNode[] {
    return Object.keys(obj).reduce<ProblemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ProblemNode();
      node.problemName = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.problemName = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  // insertItem(parent: ProblemNode, level: LevelNode) {
  //   if (parent.children) {
  //     parent.children.push(level);
  //     this.dataChange.next(this.data);
  //   }
  // }
  insertItem(parent: ProblemNode, level: ProblemNode) {
    if (parent.children) {
      parent.children.push(level);
      this.dataChange.next(this.data);
    }
  }
  updateItem(node: ProblemNode, name: string) {
    node.problemName=name;
    this.dataChange.next(this.data);
  }
}

  
  
//------------------------------------------------------------------------------------------------------------------------


@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
  providers: [ChecklistDatabase]
})
export class ExercisesComponent implements OnInit {

  problems:PronunciationProblemsType[]=[];
  selectedProblem:PronunciationProblemsType; //לשנות- לבעיה בחורה מהמסך
  selectedLevel:DifficultyLevel;
  levelsOfSelectedProblem:DifficultyLevel[];
  initVal:number;

  constructor(private _database: ChecklistDatabase,private _wordService:WordService,private _speechTherapistService:SpeechTherapistService) {
      
    this.start.then(()=>{
      console.log("inside promise");
      // this.continue()
    }).catch(err=>alert(err)).finally(()=>{console.log("done promise")})
  }
 async ngOnInit(): Promise<void> {
     
  }


  async loadLevels(){
   //move to its right place
    this.selectedProblem=this.problems![0];
   await  this._wordService.getProblemDifficultyLevels(this.selectedProblem.id,this._speechTherapistService.getSpeechTherapist().speechTherapist.id).subscribe(data=>this.levelsOfSelectedProblem=data);
  /////////////end
  console.log(this.levelsOfSelectedProblem)
}


initValue(){
  this.initVal=this.nextLevelName();


}



  start=new Promise<void>(async (resolve,reject)=>{
  await  this._wordService.getPronunciationProblems().subscribe(data=>{this.problems=data;  console.log(this.problems,"  ", data)});

  if(this.problems.length>=0){
      resolve();
  }
  else{
    reject('failed to load Pronunciation Problems');
  }
})
  

saveNewLevel(val:number){
  this._wordService.addLevelToProblem(new DifficultyLevel("id": 0,
    "pronunciationProblemId": this.selectedProblem.id,
    "difficultyLevel": 0,
    "speechTherapistId": this._speechTherapistService.speechTherapist.id))
  {
    
  }
}

  // async start(){



  //   await  this._wordService.getPronunciationProblems().subscribe(data=>{this.problems=data;  console.log(this.problems,"  ", data)});
  //   this.continue()
  //   //this.problems=await this._wordService.getPronunciationProblems();
  //   //this.problems=await this._wordService.getPronunciationProblems().toPromise<PronunciationProblemsType[]>();
  // }

  async loadTree(){
    
  for (let index = 0; index < this.problems!.length; index++) {
    this.dataSource.data[index]=new ProblemNode();
    debugger;
      }
  
      this.treeFlattener = new MatTreeFlattener(
        this.transformer,
        this.getLevel,
        this.isExpandable,
        this.getChildren,
  
      );
      this.treeControl = new FlatTreeControl<ProblemFlatNode>(this.getLevel, this.isExpandable);
       this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
   
     await this._database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
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


  async all()
{
  await this.loadLevels()
  // await this.loadTree();
 await this.initValue();
 console.log("end")
}



 /** Map from flat node to nested node. This helps us finding the nested node to be modified */
 flatNodeMap = new Map<ProblemFlatNode, ProblemNode>();

 /** Map from nested node to flattened node. This helps us to keep the same object for selection */
 nestedNodeMap = new Map<ProblemNode, ProblemFlatNode>();

 /** A selected parent node to be inserted */
 selectedParent: ProblemFlatNode | null = null;

 /** The new item's name */
 newItemName = '';

 treeControl: FlatTreeControl<ProblemFlatNode>;

 treeFlattener: MatTreeFlattener<ProblemNode, ProblemFlatNode>;

 dataSource: MatTreeFlatDataSource<ProblemNode, ProblemFlatNode>;



 getLevel = (node: ProblemFlatNode) => node.level;

 isExpandable = (node: ProblemFlatNode) => node.expandable;

 getChildren = (node: ProblemNode): ProblemNode[]|undefined => node.children;

 hasChild = (_: number, _nodeData: ProblemFlatNode) => _nodeData.expandable;

 hasNoContent = (_: number, _nodeData: ProblemFlatNode) => _nodeData.problemName === '';

 /**
  * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  */
 transformer = (node: ProblemNode, level: number) => {
   const existingNode = this.nestedNodeMap.get(node);
   const flatNode =
     existingNode && existingNode.problemName === node.problemName ? existingNode : new ProblemFlatNode();
   flatNode.problemName = node.problemName;
   flatNode.level = level;
   flatNode.expandable = !!node.children?.length;
   this.flatNodeMap.set(flatNode, node);
   this.nestedNodeMap.set(node, flatNode);
   return flatNode;
 };



 /* Get the parent node of a node */
 getParentNode(node: ProblemFlatNode): ProblemFlatNode | null {
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
 addNewItem(node: ProblemFlatNode) {
   const parentNode = this.flatNodeMap.get(node);
   this._database.insertItem(parentNode!, new ProblemNode());
   this.treeControl.expand(node);
 }

 /** Save the node to database */
 saveNode(node: ProblemFlatNode, itemValue: string) {
   const nestedNode = this.flatNodeMap.get(node);
   this._database.updateItem(nestedNode!, itemValue);
 }







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


}
  


