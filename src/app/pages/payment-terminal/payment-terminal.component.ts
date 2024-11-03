import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/http/auth/auth.service';
import { BarcodeTerminalComponent } from './barcode-terminal/barcode-terminal.component';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { ItemListTerminalComponent } from './item-list-terminal/item-list-terminal.component';

@Component({
  selector: 'app-payment-terminal',
  standalone: true,
  imports: [BarcodeTerminalComponent, ItemListTerminalComponent, PrimengModule],
  templateUrl: './payment-terminal.component.html',
  styleUrl: './payment-terminal.component.scss'
})
export class PaymentTerminalComponent implements OnInit {

  authService = inject(AuthService);
  constructor() { }

  ngOnInit(): void {
  }
}
