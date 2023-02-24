import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActlistQueryComponent } from './actlist-query.component';

describe('ActivityComponent', () => {
  let component: ActlistQueryComponent;
  let fixture: ComponentFixture<ActlistQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActlistQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActlistQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
