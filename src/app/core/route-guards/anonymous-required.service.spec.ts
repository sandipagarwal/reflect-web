import { TestBed, inject } from '@angular/core/testing';

import { AnonymousRequiredGuard } from './anonymous-required.service';

describe('AnonymousRequiredService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousRequiredGuard]
    });
  });

  it('should be created', inject([AnonymousRequiredGuard], (service: AnonymousRequiredGuard) => {
    expect(service).toBeTruthy();
  }));
});
