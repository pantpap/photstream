import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    MatFabButton,
    MatIcon,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isFavoritesContext = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/favorites') || url.startsWith('/photos/');
  });
}
