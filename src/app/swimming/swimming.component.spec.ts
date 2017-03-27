import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmingComponent } from './swimming.component';

describe('SwimmingComponent', () => {
  let component: SwimmingComponent;
  let fixture: ComponentFixture<SwimmingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
