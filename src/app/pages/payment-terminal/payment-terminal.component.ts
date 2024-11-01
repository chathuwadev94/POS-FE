import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/http/auth/auth.service';

@Component({
  selector: 'app-payment-terminal',
  standalone: true,
  imports: [],
  templateUrl: './payment-terminal.component.html',
  styleUrl: './payment-terminal.component.scss'
})
export class PaymentTerminalComponent implements OnInit {

  authService = inject(AuthService);
  constructor() { }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(res => console.log(res));
  }
}
