import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzletComponent } from './izlet.component';

describe('IzletComponent', () => {
  let component: IzletComponent;
  let fixture: ComponentFixture<IzletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IzletComponent]
    });
    fixture = TestBed.createComponent(IzletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
