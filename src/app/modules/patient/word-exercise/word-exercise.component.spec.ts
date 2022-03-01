import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordExerciseComponent } from './word-exercise.component';

describe('WordExerciseComponent', () => {
  let component: WordExerciseComponent;
  let fixture: ComponentFixture<WordExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
