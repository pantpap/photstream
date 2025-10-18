import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect favorites context when url starts with /favorites', () => {
    Object.defineProperty(router, 'url', {
      value: '/favorites',
      writable: true
    });

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isFavoritesContext()).toBeTruthy();
  });

  it('should detect favorites context when url starts with /photos/', () => {
    Object.defineProperty(router, 'url', {
      value: '/photos/123',
      writable: true
    });

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isFavoritesContext()).toBeTruthy();
  });

  it('should not detect favorites context for other urls', () => {
    Object.defineProperty(router, 'url', {
      value: '/home',
      writable: true
    });

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isFavoritesContext()).toBeFalsy();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('[routerLink]');
    expect(links.length).toBeGreaterThan(0);
  });
});
