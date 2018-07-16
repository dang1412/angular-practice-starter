import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexOrderbookComponent } from './ccex-orderbook.component';

describe('CcexOrderbookComponent', () => {
  let component: CcexOrderbookComponent;
  let fixture: ComponentFixture<CcexOrderbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexOrderbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexOrderbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
