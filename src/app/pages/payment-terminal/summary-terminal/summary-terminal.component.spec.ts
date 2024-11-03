import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTerminalComponent } from './summary-terminal.component';

describe('SummaryTerminalComponent', () => {
  let component: SummaryTerminalComponent;
  let fixture: ComponentFixture<SummaryTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
