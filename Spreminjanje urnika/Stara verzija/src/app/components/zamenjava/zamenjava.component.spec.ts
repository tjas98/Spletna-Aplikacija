import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZamenjavaComponent } from './zamenjava.component';

describe('ZamenjavaComponent', () => {
  let component: ZamenjavaComponent;
  let fixture: ComponentFixture<ZamenjavaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZamenjavaComponent]
    });
    fixture = TestBed.createComponent(ZamenjavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
