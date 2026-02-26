import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminheader } from './adminheader';

describe('Adminheader', () => {
  let component: Adminheader;
  let fixture: ComponentFixture<Adminheader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminheader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminheader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
