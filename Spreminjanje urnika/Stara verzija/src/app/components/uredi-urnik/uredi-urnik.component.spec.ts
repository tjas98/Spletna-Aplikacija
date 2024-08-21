import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrediUrnikComponent } from './uredi-urnik.component';

describe('UrediUrnikComponent', () => {
  let component: UrediUrnikComponent;
  let fixture: ComponentFixture<UrediUrnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrediUrnikComponent]
    });
    fixture = TestBed.createComponent(UrediUrnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
