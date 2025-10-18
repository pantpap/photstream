import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Photo} from '../../interfaces/photo';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {Favorites} from '../../services/favorites/favorites';

@Component({
  selector: 'app-favourites-list',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './favourites-list.html',
  styleUrl: './favourites-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesList {

  private readonly favoriteService = inject(Favorites);
  private readonly router = inject(Router);

  favoritesPhotos = signal<Photo[]>(this.favoriteService.getFavorites())

  viewPhoto(photo: Photo) {
    this.favoriteService.setSelectedPhoto(photo);
    this.router.navigateByUrl(`/photos/${photo.id}`);
  }
}
