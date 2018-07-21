import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingViewSamplePageComponent } from './tradingview-sample-page.component';

describe('TradingViewSamplePageComponent', () => {
  let component: TradingViewSamplePageComponent;
  let fixture: ComponentFixture<TradingViewSamplePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingViewSamplePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingViewSamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
