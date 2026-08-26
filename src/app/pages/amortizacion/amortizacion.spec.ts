import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amortizacion } from './amortizacion';

describe('Amortizacion', () => {
  let component: Amortizacion;
  let fixture: ComponentFixture<Amortizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Amortizacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Amortizacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
