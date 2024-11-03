import { Component, OnInit, inject } from '@angular/core';
import { CartStore } from '../../../core/signal-store/cart.store';

@Component({
  selector: 'app-item-list-terminal',
  standalone: true,
  imports: [],
  templateUrl: './item-list-terminal.component.html',
  styleUrl: './item-list-terminal.component.scss'
})
export class ItemListTerminalComponent implements OnInit {

  cartStore = inject(CartStore);
  constructor() {

  }

  ngOnInit(): void {
    console.log('netCarts', this.cartStore.netCartList());
  }

}
