import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechTherapistComponent } from './speech-therapist.component';

describe('SpeechTherapistComponent', () => {
  let component: SpeechTherapistComponent;
  let fixture: ComponentFixture<SpeechTherapistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechTherapistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
