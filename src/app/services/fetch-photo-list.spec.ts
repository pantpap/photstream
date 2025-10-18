import { TestBed } from '@angular/core/testing';

import {FetchPhotoList} from './fetch-photo-list';

describe('PhotoList', () => {
  let service: FetchPhotoList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchPhotoList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
