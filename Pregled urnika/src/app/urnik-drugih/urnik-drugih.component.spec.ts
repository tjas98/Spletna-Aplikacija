import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrnikDrugihComponent } from './urnik-drugih.component';

describe('UrnikDrugihComponent', () => {
  let component: UrnikDrugihComponent;
  let fixture: ComponentFixture<UrnikDrugihComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrnikDrugihComponent]
    });
    fixture = TestBed.createComponent(UrnikDrugihComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
