import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminsidebar } from './adminsidebar';

describe('Adminsidebar', () => {
  let component: Adminsidebar;
  let fixture: ComponentFixture<Adminsidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminsidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminsidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
