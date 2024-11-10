import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTerminalComponent } from './action-terminal.component';

describe('ActionTerminalComponent', () => {
  let component: ActionTerminalComponent;
  let fixture: ComponentFixture<ActionTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
