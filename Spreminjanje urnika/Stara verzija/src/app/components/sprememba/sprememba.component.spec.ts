import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpremembaComponent } from './sprememba.component';

describe('SpremembaComponent', () => {
  let component: SpremembaComponent;
  let fixture: ComponentFixture<SpremembaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpremembaComponent]
    });
    fixture = TestBed.createComponent(SpremembaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
