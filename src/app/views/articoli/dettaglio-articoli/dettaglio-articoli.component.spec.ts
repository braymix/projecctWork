import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioArticoliComponent } from './dettaglio-articoli.component';

describe('DettaglioArticoliComponent', () => {
  let component: DettaglioArticoliComponent;
  let fixture: ComponentFixture<DettaglioArticoliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioArticoliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioArticoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
