import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisiOrdiniComponent } from './analisi-ordini.component';

describe('AnalisiOrdiniComponent', () => {
  let component: AnalisiOrdiniComponent;
  let fixture: ComponentFixture<AnalisiOrdiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisiOrdiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisiOrdiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
