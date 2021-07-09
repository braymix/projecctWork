import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisiTotaleTortaComponent } from './analisi-totale-torta.component';

describe('AnalisiTotaleTortaComponent', () => {
  let component: AnalisiTotaleTortaComponent;
  let fixture: ComponentFixture<AnalisiTotaleTortaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisiTotaleTortaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisiTotaleTortaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
