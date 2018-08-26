import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3PageComponent } from './d3-page.component';

describe('D3PageComponent', () => {
  let component: D3PageComponent;
  let fixture: ComponentFixture<D3PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
