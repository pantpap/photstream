import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import { NgOptimizedImage} from '@angular/common';
import {FetchPhotoList} from '../../services/fetch-photo-list/fetch-photo-list';
import {Photo} from '../../interfaces/photo';
import {rxResource} from '@angular/core/rxjs-interop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {InfiniteScroll} from '../../directives/infinite-scroll';
import {DEFAULT_PAGE_SIZE} from '../../constants';
import {Favorites} from '../../services/favorites/favorites';

@Component({
  selector: 'app-photo-list',
  imports: [
    NgOptimizedImage,
    MatProgressSpinner,
    InfiniteScroll,
  ],
  templateUrl: './photo-list.html',
  styleUrl: './photo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoList {
  private readonly photoService = inject(FetchPhotoList);
  private readonly favoriteService = inject(Favorites)

  error = signal<unknown>(null);
  page = signal(1);
  pageSize = signal(DEFAULT_PAGE_SIZE);
  private lastAppendedPage = signal(0);

  constructor() {
    effect(() => {
     this.handleScrollReload()
    })
  }


  photosResource = rxResource({
    params: () => ({ page: this.page(), size: this.pageSize() }),
    stream: () => {
      return this.photoService.getPhotos(this.pageSize());
    },
  });


  photos = signal<Photo[]>([]);
  loadMore() {
    this.page.update(p => p + 1);
  }

  selectedPhoto(photo: Photo) {
    this.favoriteService.setFavorites(photo);
  }

  private handleScrollReload(){
    const err = this.photosResource.error();
    if (err) {
      this.error.set(err);
      return;
    }
    const data = this.photosResource.value(); // Photo[] | null
    const page = this.page();

    if (!data) return;
    if (page === this.lastAppendedPage()) return;

    if (page === 1) {
      this.photos.set(data);
    } else {
      this.photos.update(prev => [...prev, ...data]);
    }

    this.lastAppendedPage.set(page);
  }
}
