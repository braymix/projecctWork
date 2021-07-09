import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisiComponent } from './analisi.component';

describe('AnalisiComponent', () => {
  let component: AnalisiComponent;
  let fixture: ComponentFixture<AnalisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
