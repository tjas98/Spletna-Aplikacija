import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OknoSpremembaComponent } from './okno-sprememba.component';

describe('OknoSpremembaComponent', () => {
  let component: OknoSpremembaComponent;
  let fixture: ComponentFixture<OknoSpremembaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OknoSpremembaComponent]
    });
    fixture = TestBed.createComponent(OknoSpremembaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
