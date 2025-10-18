import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScroll } from './infinite-scroll';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [InfiniteScroll],
  template: `
    <div
      appInfiniteScroll
      [loading]="isLoading"
      [rootMargin]="margin"
      (refresh)="onRefresh()">
      Test Content
    </div>
  `
})
class TestComponent {
  isLoading = false;
  margin = '200px';
  refreshCalled = false;

  onRefresh() {
    this.refreshCalled = true;
  }
}

describe('InfiniteScroll', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directive: InfiniteScroll;
  let mockObserver: jasmine.SpyObj<IntersectionObserver>;
  let observerSpy: jasmine.Spy;

  beforeEach(async () => {
    mockObserver = jasmine.createSpyObj('IntersectionObserver', ['observe', 'disconnect']);

    observerSpy = jasmine.createSpy('IntersectionObserver').and.returnValue(mockObserver);
    (window as any).IntersectionObserver = observerSpy;

    await TestBed.configureTestingModule({
      imports: [InfiniteScroll, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(InfiniteScroll));
    directive = directiveElement.injector.get(InfiniteScroll);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should create IntersectionObserver on init', () => {
    expect(observerSpy).toHaveBeenCalled();
  });

  it('should observe element on init', () => {
    expect(mockObserver.observe).toHaveBeenCalledWith(directiveElement.nativeElement);
  });

  it('should use provided rootMargin', () => {
    component.margin = '300px';
    fixture.detectChanges();

    const observerCall = observerSpy.calls.mostRecent();
    const options = observerCall.args[1];

    expect(options.rootMargin).toBeDefined();
  });

  it('should disconnect observer on destroy', () => {
    directive.ngOnDestroy();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('should emit refresh when intersecting and not loading', () => {
    const observerCallback = observerSpy.calls.mostRecent().args[0];

    component.isLoading = false;
    fixture.detectChanges();

    observerCallback([{ isIntersecting: true }]);

    expect(component.refreshCalled).toBeTruthy();
  });

  it('should not emit refresh when not intersecting', () => {
    const observerCallback = observerSpy.calls.mostRecent().args[0];

    component.isLoading = false;
    component.refreshCalled = false;
    fixture.detectChanges();

    observerCallback([{ isIntersecting: false }]);

    expect(component.refreshCalled).toBeFalsy();
  });

  it('should not emit refresh when loading', () => {
    const observerCallback = observerSpy.calls.mostRecent().args[0];

    component.isLoading = true;
    component.refreshCalled = false;
    fixture.detectChanges();

    observerCallback([{ isIntersecting: true }]);

    expect(component.refreshCalled).toBeFalsy();
  });
});
