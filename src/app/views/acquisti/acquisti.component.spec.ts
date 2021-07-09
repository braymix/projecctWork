import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquistiComponent } from './acquisti.component';

describe('AcquistiComponent', () => {
  let component: AcquistiComponent;
  let fixture: ComponentFixture<AcquistiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquistiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquistiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
