import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrnikDesktopComponent } from './urnik-desktop.component';

describe('UrnikDesktopComponent', () => {
  let component: UrnikDesktopComponent;
  let fixture: ComponentFixture<UrnikDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrnikDesktopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrnikDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
