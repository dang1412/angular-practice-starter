import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexBinanceUserStreamComponent } from './ccex-binance-user-stream.component';

describe('CcexBinanceUserStreamComponent', () => {
  let component: CcexBinanceUserStreamComponent;
  let fixture: ComponentFixture<CcexBinanceUserStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexBinanceUserStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexBinanceUserStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
