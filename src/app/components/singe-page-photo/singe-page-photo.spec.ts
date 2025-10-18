import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingePagePhoto } from './singe-page-photo';

describe('SingePagePhoto', () => {
  let component: SingePagePhoto;
  let fixture: ComponentFixture<SingePagePhoto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingePagePhoto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingePagePhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
