import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { NgOptimizedImage} from '@angular/common';
import {FetchPhotoList} from '../../services/fetch-photo-list';
import {Photo} from '../../interfaces/photo';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {InfiniteScroll} from '../../directives/infinite-scroll';

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

  error = signal<unknown>(null);
  page = signal(1);
  pageSize = signal(30);


  photosResource = rxResource({
    params: () => ({ page: this.page(), size: this.pageSize() }),
    stream: () => {
      return this.photoService.getPhotos(this.pageSize());
    },
  });

  loadMore() {
    this.page.update(p => p + 1);
  }

  selectedPhoto(photo: Photo) {

  }
}
