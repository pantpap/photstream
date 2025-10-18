import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Favorites} from '../../services/favorites/favorites';
import {JsonPipe, NgOptimizedImage} from '@angular/common';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {LocalStorage} from '../../services/local-storage/local-storage';
import {FAV_PHOTOS} from '../../constants';
import {Photo} from '../../interfaces/photo';

@Component({
  selector: 'app-singe-page-photo',
  imports: [
    JsonPipe,
    NgOptimizedImage,
    MatFabButton,
    MatIcon,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './singe-page-photo.html',
  styleUrl: './singe-page-photo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingePagePhoto {

  private readonly favoriteService = inject(Favorites);
  private readonly localStorageService = inject(LocalStorage);
  private readonly router = inject(Router);

  favoritePhoto = signal(this.favoriteService.getSelectedPhoto());

  readonly favoriteUrl = computed(() => this.favoritePhoto()?.download_url ?? '');

  removeFromFavorites(id: number) {
    const favoritesList = this.favoriteService.getFavorites();
    const updatedList = favoritesList.filter((photo: Photo) => photo.id !== id);
    this.localStorageService.setItem(FAV_PHOTOS, JSON.stringify(updatedList));
    this.favoritePhoto.set(null);
    this.router.navigateByUrl(`/favorites`);
  }
}
