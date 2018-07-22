import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexTradingViewComponent } from './ccex-tradingview.component';

describe('CcexTradingViewComponent', () => {
  let component: CcexTradingViewComponent;
  let fixture: ComponentFixture<CcexTradingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexTradingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexTradingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
