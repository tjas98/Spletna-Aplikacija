import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotrdiComponent } from './potrdi.component';

describe('PotrdiComponent', () => {
  let component: PotrdiComponent;
  let fixture: ComponentFixture<PotrdiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotrdiComponent]
    });
    fixture = TestBed.createComponent(PotrdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
