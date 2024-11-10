import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeTerminalComponent } from './barcode-terminal.component';

describe('BarcodeTerminalComponent', () => {
  let component: BarcodeTerminalComponent;
  let fixture: ComponentFixture<BarcodeTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarcodeTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
