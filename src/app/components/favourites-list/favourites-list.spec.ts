import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesList } from './favourites-list';
import { Favorites } from '../../services/favorites/favorites';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('FavouritesList', () => {
  let component: FavouritesList;
  let fixture: ComponentFixture<FavouritesList>;
  let favoritesService: jasmine.SpyObj<Favorites>;
  let router: Router;

  const mockPhotos = [
    { id: 1, thumbUrl: 'thumb1.jpg', download_url: 'url1.jpg', width: 200, height: 300 },
    { id: 2, thumbUrl: 'thumb2.jpg', download_url: 'url2.jpg', width: 200, height: 300 }
  ];

  beforeEach(async () => {
    const favoritesSpy = jasmine.createSpyObj('Favorites', ['getFavorites', 'setSelectedPhoto']);
    favoritesSpy.getFavorites.and.returnValue(mockPhotos);

    await TestBed.configureTestingModule({
      imports: [FavouritesList],
      providers: [
        { provide: Favorites, useValue: favoritesSpy },
        provideRouter([])
      ]
    }).compileComponents();

    favoritesService = TestBed.inject(Favorites) as jasmine.SpyObj<Favorites>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(FavouritesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with favorites from service', () => {
    expect(component.favoritesPhotos()).toEqual(mockPhotos);
  });

  it('should call getFavorites on initialization', () => {
    expect(favoritesService.getFavorites).toHaveBeenCalled();
  });

  it('should set selected photo and navigate when viewPhoto is called', () => {
    const photo = mockPhotos[0];
    component.viewPhoto(photo);

    expect(favoritesService.setSelectedPhoto).toHaveBeenCalledWith(photo);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/photos/${photo.id}`);
  });

  it('should navigate to correct photo id', () => {
    const photo = mockPhotos[1];
    component.viewPhoto(photo);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/photos/${photo.id}`);
  });
});
