import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseComponent } from './phase.component';

describe('PhaseComponent', () => {
  let component: PhaseComponent;
  let fixture: ComponentFixture<PhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
