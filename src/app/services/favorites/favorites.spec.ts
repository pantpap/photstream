import { TestBed } from '@angular/core/testing';
import { Favorites } from './favorites';
import { LocalStorage } from '../local-storage/local-storage';
import {FAV_PHOTOS} from '../../constants';

describe('Favorites', () => {
  let service: Favorites;
  let localStorageService: jasmine.SpyObj<LocalStorage>;

  const mockPhoto = {
    id: 1,
    thumbUrl: 'thumb1.jpg',
    download_url: 'url1.jpg',
    width: 200,
    height: 300
  };

  const mockPhotos = [
    mockPhoto,
    { id: 2, thumbUrl: 'thumb2.jpg', download_url: 'url2.jpg', width: 200, height: 300 }
  ];

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorage', ['getItem', 'setItem']);
    localStorageSpy.getItem.and.returnValue(JSON.stringify(mockPhotos));

    TestBed.configureTestingModule({
      providers: [
        Favorites,
        { provide: LocalStorage, useValue: localStorageSpy }
      ]
    });

    service = TestBed.inject(Favorites);
    localStorageService = TestBed.inject(LocalStorage) as jasmine.SpyObj<LocalStorage>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get favorites from local storage', () => {
    const favorites = service.getFavorites();

    expect(localStorageService.getItem).toHaveBeenCalledWith(FAV_PHOTOS);
    expect(favorites).toEqual(mockPhotos);
  });

  it('should add photo to favorites', () => {
    const newPhoto = { id: 3, thumbUrl: 'thumb3.jpg', download_url: 'url3.jpg', width: 200, height: 300 };

    service.setFavorites(newPhoto);

    expect(localStorageService.setItem).toHaveBeenCalledWith(
      FAV_PHOTOS,
      jasmine.any(String)
    );
  });

  it('should not add duplicate photo to favorites', () => {
    localStorageService.setItem.calls.reset();

    service.setFavorites(mockPhoto); // attempt 1
    expect(localStorageService.setItem).not.toHaveBeenCalled();

    service.setFavorites(mockPhoto); // attempt 2
    expect(localStorageService.setItem).not.toHaveBeenCalled();
  });

  it('should set selected photo', () => {
    service.setSelectedPhoto(mockPhoto);

    expect(service.getSelectedPhoto()).toEqual(mockPhoto);
  });

  it('should get selected photo', () => {
    service.setSelectedPhoto(mockPhoto);
    const selected = service.getSelectedPhoto();

    expect(selected).toEqual(mockPhoto);
  });

  it('should have readonly selectedPhoto signal', () => {
    service.setSelectedPhoto(mockPhoto);

    expect(service.selectedPhoto()).toEqual(mockPhoto);
  });

  it('should initialize selected photo as null', () => {
    expect(service.getSelectedPhoto()).toBeNull();
  });
});
