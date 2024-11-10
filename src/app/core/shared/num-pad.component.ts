import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-numpad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './num-pad.component.html',
  styleUrls: ['./num-pad.component.scss']
})
export class NumpadComponent {
  @Output() valueChange = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<string>();

  displayValue: string = '';
  numbers: string[] = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Handle numeric keys
    if (/^[0-9]$/.test(event.key)) {
      this.onButtonClick(event.key);
    }
    // Handle decimal point
    else if (event.key === '.') {
      this.onButtonClick('.');
    }
    // Handle enter
    else if (event.key === 'Enter') {
      this.enter();
    }
    // Handle backspace
    else if (event.key === 'Backspace') {
      this.backspace();
    }
    // Handle escape (clear)
    else if (event.key === 'Escape') {
      this.clear();
    }
  }

  onButtonClick(value: string) {
    // Prevent multiple decimal points
    if (value === '.' && this.displayValue.includes('.')) {
      return;
    }
    
    this.displayValue += value;
    this.valueChange.emit(this.displayValue);
  }

  clear() {
    this.displayValue = '';
    this.valueChange.emit(this.displayValue);
  }

  backspace() {
    this.displayValue = this.displayValue.slice(0, -1);
    this.valueChange.emit(this.displayValue);
  }

  enter() {
    if (this.displayValue) {
      this.enterPressed.emit(this.displayValue);
      this.clear();
    }
  }
}