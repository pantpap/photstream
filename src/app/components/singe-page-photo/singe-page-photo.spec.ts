import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingePagePhoto } from './singe-page-photo';
import { Favorites } from '../../services/favorites/favorites';
import { LocalStorage } from '../../services/local-storage/local-storage';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('SingePagePhoto', () => {
  let component: SingePagePhoto;
  let fixture: ComponentFixture<SingePagePhoto>;
  let favoritesService: jasmine.SpyObj<Favorites>;
  let localStorageService: jasmine.SpyObj<LocalStorage>;
  let router: Router;

  const mockPhoto = {
    id: 1,
    thumbUrl: 'thumb1.jpg',
    download_url: 'url1.jpg',
    width: 200,
    height: 300
  };

  const mockFavorites = [
    mockPhoto,
    { id: 2, thumbUrl: 'thumb2.jpg', download_url: 'url2.jpg', width: 200, height: 300 },
    { id: 3, thumbUrl: 'thumb3.jpg', download_url: 'url3.jpg', width: 200, height: 300 }
  ];

  beforeEach(async () => {
    const favoritesSpy = jasmine.createSpyObj('Favorites', ['getSelectedPhoto', 'getFavorites']);
    const localStorageSpy = jasmine.createSpyObj('LocalStorage', ['setItem', 'getItem']);

    favoritesSpy.getSelectedPhoto.and.returnValue(mockPhoto);
    favoritesSpy.getFavorites.and.returnValue(mockFavorites);

    await TestBed.configureTestingModule({
      imports: [SingePagePhoto],
      providers: [
        { provide: Favorites, useValue: favoritesSpy },
        { provide: LocalStorage, useValue: localStorageSpy },
        provideRouter([])
      ]
    }).compileComponents();

    favoritesService = TestBed.inject(Favorites) as jasmine.SpyObj<Favorites>;
    localStorageService = TestBed.inject(LocalStorage) as jasmine.SpyObj<LocalStorage>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(SingePagePhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with selected photo from service', () => {
    expect(component.favoritePhoto()).toEqual(mockPhoto);
  });

  it('should compute favorite url from photo', () => {
    expect(component.favoriteUrl()).toBe('url1.jpg');
  });

  it('should return empty string when photo is null', () => {
    component.favoritePhoto.set(null);
    expect(component.favoriteUrl()).toBe('');
  });

  it('should remove photo from favorites and update local storage', () => {
    component.removeFromFavorites(1);

    expect(favoritesService.getFavorites).toHaveBeenCalled();
    expect(localStorageService.setItem).toHaveBeenCalledWith(
      'favourite_photos',
      jasmine.any(String)
    );
  });

  it('should filter out removed photo from favorites list', () => {
    component.removeFromFavorites(1);

    const savedData = localStorageService.setItem.calls.mostRecent().args[1];
    const parsedData = JSON.parse(savedData);

    expect(parsedData.length).toBe(2);
    expect(parsedData.find((p: any) => p.id === 1)).toBeUndefined();
  });

  it('should set favorite photo to null after removal', () => {
    component.removeFromFavorites(1);
    expect(component.favoritePhoto()).toBeNull();
  });

  it('should navigate to favorites page after removal', () => {
    component.removeFromFavorites(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/favorites');
  });
});
