import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisiDettaglioArticoloComponent } from './analisi-dettaglio-articolo.component';

describe('AnalisiDettaglioArticoloComponent', () => {
  let component: AnalisiDettaglioArticoloComponent;
  let fixture: ComponentFixture<AnalisiDettaglioArticoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisiDettaglioArticoloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisiDettaglioArticoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
