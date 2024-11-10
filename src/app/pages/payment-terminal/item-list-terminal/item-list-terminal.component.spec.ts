import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListTerminalComponent } from './item-list-terminal.component';

describe('ItemListTerminalComponent', () => {
  let component: ItemListTerminalComponent;
  let fixture: ComponentFixture<ItemListTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemListTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
