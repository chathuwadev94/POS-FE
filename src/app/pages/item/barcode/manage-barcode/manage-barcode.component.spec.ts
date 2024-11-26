import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBarcodeComponent } from './manage-barcode.component';

describe('ManageBarcodeComponent', () => {
  let component: ManageBarcodeComponent;
  let fixture: ComponentFixture<ManageBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBarcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
