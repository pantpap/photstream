import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoList } from './photo-list';
import { FetchPhotoList } from '../../services/fetch-photo-list/fetch-photo-list';
import { Favorites } from '../../services/favorites/favorites';
import { of } from 'rxjs';

describe('PhotoList', () => {
  let component: PhotoList;
  let fixture: ComponentFixture<PhotoList>;
  let fetchPhotoListService: jasmine.SpyObj<FetchPhotoList>;
  let favoritesService: jasmine.SpyObj<Favorites>;

  const mockPhotos = [
    { id: 1, thumbUrl: 'thumb1.jpg', download_url: 'url1.jpg', width: 200, height: 300 },
    { id: 2, thumbUrl: 'thumb2.jpg', download_url: 'url2.jpg', width: 200, height: 300 }
  ];

  beforeEach(async () => {
    const fetchPhotoListSpy = jasmine.createSpyObj('FetchPhotoList', ['getPhotos']);
    const favoritesSpy = jasmine.createSpyObj('Favorites', ['setFavorites', 'getFavorites']);

    await TestBed.configureTestingModule({
      imports: [PhotoList],
      providers: [
        { provide: FetchPhotoList, useValue: fetchPhotoListSpy },
        { provide: Favorites, useValue: favoritesSpy }
      ]
    }).compileComponents();

    fetchPhotoListService = TestBed.inject(FetchPhotoList) as jasmine.SpyObj<FetchPhotoList>;
    favoritesService = TestBed.inject(Favorites) as jasmine.SpyObj<Favorites>;
    fetchPhotoListService.getPhotos.and.returnValue(of(mockPhotos));

    fixture = TestBed.createComponent(PhotoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with page 1', () => {
    expect(component.page()).toBe(1);
  });

  it('should initialize with default page size', () => {
    expect(component.pageSize()).toBe(30);
  });

  it('should initialize with empty photos array', () => {
    expect(component.photos()).toEqual([]);
  });

  it('should initialize with no error', () => {
    expect(component.error()).toBeNull();
  });

  it('should increment page when loadMore is called', () => {
    const initialPage = component.page();
    component.loadMore();
    expect(component.page()).toBe(initialPage + 1);
  });

  it('should call setFavorites when selectedPhoto is called', () => {
    const photo = mockPhotos[0];
    component.selectedPhoto(photo);
    expect(favoritesService.setFavorites).toHaveBeenCalledWith(photo);
  });

  it('should load photos on initialization', () => {
    expect(fetchPhotoListService.getPhotos).toHaveBeenCalled();
  });

  it('should have photosResource defined', () => {
    expect(component.photosResource).toBeDefined();
  });
});
