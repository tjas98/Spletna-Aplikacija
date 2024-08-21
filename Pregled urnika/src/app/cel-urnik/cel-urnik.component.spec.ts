import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelUrnikComponent } from './cel-urnik.component';

describe('CelUrnikComponent', () => {
  let component: CelUrnikComponent;
  let fixture: ComponentFixture<CelUrnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CelUrnikComponent]
    });
    fixture = TestBed.createComponent(CelUrnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
