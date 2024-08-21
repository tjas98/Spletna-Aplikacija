import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaciloComponent } from './placilo.component';

describe('PlaciloComponent', () => {
  let component: PlaciloComponent;
  let fixture: ComponentFixture<PlaciloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaciloComponent]
    });
    fixture = TestBed.createComponent(PlaciloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
