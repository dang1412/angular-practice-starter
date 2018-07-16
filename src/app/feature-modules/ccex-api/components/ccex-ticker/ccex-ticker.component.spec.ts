import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexTickerComponent } from './ccex-ticker.component';

describe('CcexTickerComponent', () => {
  let component: CcexTickerComponent;
  let fixture: ComponentFixture<CcexTickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexTickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
