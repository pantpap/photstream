import { TestBed } from '@angular/core/testing';
import { FetchPhotoList } from './fetch-photo-list';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('FetchPhotoList', () => {
  let service: FetchPhotoList;
  let httpMock: HttpTestingController;

  const mockPhotoInfo = {
    id: '123',
    download_url: 'https://picsum.photos/id/123/2000/3000',
    width: 2000,
    height: 3000,
    author: 'Test Author',
    url: 'https://unsplash.com/photos/test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FetchPhotoList]
    });
    service = TestBed.inject(FetchPhotoList);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch photos with correct page size', () => {
    const pageSize = 3;

    service.getPhotos(pageSize).subscribe(photos => {
      expect(photos.length).toBe(pageSize);
    });

    const requests = httpMock.match(req =>
      req.url.includes('picsum.photos')
    );

    expect(requests.length).toBeGreaterThan(0);
  });

  it('should extract id from url correctly', () => {
    const url = 'https://picsum.photos/id/123/200/300';
    const id = service['extractId'](url);
    expect(id).toBe('123');
  });

  it('should return null for invalid url', () => {
    const url = 'https://invalid-url.com';
    const id = service['extractId'](url);
    expect(id).toBeNull();
  });

  it('should have correct INFO_URL format', () => {
    const id = '123';
    const infoUrl = service['INFO_URL'](id);
    expect(infoUrl).toBe('https://picsum.photos/id/123/info');
  });

});
