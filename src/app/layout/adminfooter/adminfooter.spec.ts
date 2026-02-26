import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminfooter } from './adminfooter';

describe('Adminfooter', () => {
  let component: Adminfooter;
  let fixture: ComponentFixture<Adminfooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminfooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminfooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
