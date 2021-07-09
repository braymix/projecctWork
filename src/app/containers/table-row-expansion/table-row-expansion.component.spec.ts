import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowExpansionComponent } from './table-row-expansion.component';

describe('TableRowExpansionComponent', () => {
  let component: TableRowExpansionComponent;
  let fixture: ComponentFixture<TableRowExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRowExpansionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
