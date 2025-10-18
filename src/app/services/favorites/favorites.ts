import {inject, Injectable, signal} from '@angular/core';
import {LocalStorage} from '../local-storage/local-storage';
import {FAV_PHOTOS} from '../../constants';
import {Photo} from '../../interfaces/photo';

@Injectable({
  providedIn: 'root'
})
export class Favorites {

  private readonly localStorageService = inject(LocalStorage);
  private readonly favoritesPhotos = signal<Photo[]>([]);

  private readonly _selectedPhoto = signal<Photo | null>(null);
  readonly selectedPhoto = this._selectedPhoto.asReadonly();

  getFavorites(){
    try{
      return JSON.parse(this.localStorageService.getItem(FAV_PHOTOS));
    } catch {
      console.log('Error handler while loading favorite photos from local storage');
      return []
    }
  }

  setFavorites(photo: Photo){
    const exists = this.favoritesPhotos().find(p => p.id === photo.id);
    if (exists) {
      return;
    }
    this.favoritesPhotos.update(photos => [...photos, photo]);
    this.localStorageService.setItem(FAV_PHOTOS, JSON.stringify(this.favoritesPhotos()));
  }

  getSelectedPhoto(){
    return this._selectedPhoto();
  }

 setSelectedPhoto(photo: Photo){
    this._selectedPhoto.set(photo);
 }
}
