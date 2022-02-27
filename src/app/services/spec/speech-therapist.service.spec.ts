import { TestBed } from '@angular/core/testing';

import { SpeechTherapistService } from '../speech-therapist.service';

describe('SpeechTherapistService', () => {
  let service: SpeechTherapistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechTherapistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
