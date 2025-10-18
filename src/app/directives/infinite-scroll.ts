import {Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Signal} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScroll implements OnInit, OnDestroy {

  private element = inject(ElementRef<HTMLElement>);
  private observer!: IntersectionObserver;

  // loadMore = input.required<() => void>();
  loading = input.required<boolean>();
  rootMargin = input('200px');

  refresh = output();

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if(!entry.isIntersecting) return;
        if(this.loading()) return;
        this.refresh.emit()
        // this.loadMore()();
      },
      {
        root: null,
        rootMargin: this.rootMargin()
      }
    );
    this.observer.observe(this.element.nativeElement)
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

}
