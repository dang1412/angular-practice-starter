import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcexPageComponent } from './ccex-page.component';

describe('CcexPageComponent', () => {
  let component: CcexPageComponent;
  let fixture: ComponentFixture<CcexPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcexPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
