import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexChartComponent } from './ccex-chart.component';

describe('CcexChartComponent', () => {
  let component: CcexChartComponent;
  let fixture: ComponentFixture<CcexChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
