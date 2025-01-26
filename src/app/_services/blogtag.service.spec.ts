import { TestBed } from '@angular/core/testing';

import { BlogtagService } from './blogtag.service';

describe('BlogtagService', () => {
  let service: BlogtagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogtagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
