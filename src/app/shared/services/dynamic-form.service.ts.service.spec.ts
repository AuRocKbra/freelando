import { TestBed } from '@angular/core/testing';

import { DynamicFormServiceTsService } from './dynamic-form.service.ts.service';

describe('DynamicFormServiceTsService', () => {
  let service: DynamicFormServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
