import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShowroomComponent } from './manage-showroom.component';

describe('ManageShowroomComponent', () => {
  let component: ManageShowroomComponent;
  let fixture: ComponentFixture<ManageShowroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageShowroomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageShowroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
