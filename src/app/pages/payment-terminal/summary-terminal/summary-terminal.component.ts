import { Component, inject } from '@angular/core';
import { CartStore } from '../../../core/signal-store/cart.store';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';

@Component({
  selector: 'app-summary-terminal',
  standalone: true,
  imports: [
    PrimengModule
  ],
  templateUrl: './summary-terminal.component.html',
  styleUrl: './summary-terminal.component.scss'
})
export class SummaryTerminalComponent {
  cartStore = inject(CartStore);
}
