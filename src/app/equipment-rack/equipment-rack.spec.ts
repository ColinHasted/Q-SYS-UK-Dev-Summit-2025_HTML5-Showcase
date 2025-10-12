import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentRack } from './equipment-rack';

describe('EquipmentRack', () => {
  let component: EquipmentRack;
  let fixture: ComponentFixture<EquipmentRack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentRack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentRack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
