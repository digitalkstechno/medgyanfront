import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptioncontrolComponent } from './subscriptioncontrol.component';

describe('SubscriptioncontrolComponent', () => {
  let component: SubscriptioncontrolComponent;
  let fixture: ComponentFixture<SubscriptioncontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptioncontrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptioncontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
