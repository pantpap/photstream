import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {delay, forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {Photo} from '../../interfaces/photo';

@Injectable({
  providedIn: 'root'
})
export class FetchPhotoList {
  private readonly httpClient = inject(HttpClient);
  private api = 'https://picsum.photos/200/300';

  getPhotos(pageSize: number): Observable<Photo[]> {
    const requests = Array.from({ length: pageSize }, () => this.fetchOne());
    return forkJoin(requests);
  }

  private readonly INFO_URL = (id: string) => `https://picsum.photos/id/${id}/info`;

  private fetchOne(): Observable<Photo> {
    const randomDelay = 200 + Math.random() * 100;
    return this.httpClient
      .get(this.api, { responseType: 'blob', observe: 'response' })
      .pipe(
        map((res: HttpResponse<Blob>) => {
          const thumbUrl = res.url ?? this.api;
          const id = this.extractId(thumbUrl);
          if (!id) throw new Error('Could not extract id from ' + thumbUrl);
          return { id, thumbUrl };
        }),
        switchMap(({ id, thumbUrl }) =>
          this.httpClient
            .get<Photo>(`${this.INFO_URL(id)}`)
            .pipe(
              map((info) => {
                const photo: Photo = {
                  id: +info.id,
                  thumbUrl,
                  download_url: info.download_url,
                  width: info.width,
                  height: info.height,
                };
                return photo;
              })
            )
        ),
        delay(randomDelay)
      );
  }

  private extractId(url: string): string | null {
    const match = url.match(/\/id\/(\d+)\//);
    return match ? match[1] : null;
  }
}
