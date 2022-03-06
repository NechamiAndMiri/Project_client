import { TestBed } from '@angular/core/testing';

import { AudioRecordingService } from 'src/app/services/audio-recording-service.service';

describe('AudioRecordingServiceService', () => {
  let service: AudioRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecordingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
