import { Component } from '@angular/core';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';

@Component({
  selector: 'app-action-terminal',
  standalone: true,
  imports: [
    PrimengModule
  ],
  templateUrl: './action-terminal.component.html',
  styleUrl: './action-terminal.component.scss'
})
export class ActionTerminalComponent {


  cashPayment() {
    // Implement cash payment logic
  }

  cardPayment() {
    // Implement card payment logic
  }

  upiPayment() {
    // Implement UPI payment logic
  }

  bankPayment() {
    // Implement bank transfer logic
  }

  splitPayment() {
    // Implement split payment logic
  }

  otherPayment() {
    // Implement other payment logic
  }
}
