import { TestBed } from '@angular/core/testing';

import { SpeechTherapistGuard } from './speech-therapist.guard';

describe('SpeechTherapistGuard', () => {
  let guard: SpeechTherapistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SpeechTherapistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
