import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackRails } from './rack-rails';

describe('RackRails', () => {
  let component: RackRails;
  let fixture: ComponentFixture<RackRails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RackRails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackRails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
