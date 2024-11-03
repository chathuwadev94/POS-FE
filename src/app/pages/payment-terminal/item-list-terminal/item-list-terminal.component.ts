import { Component, OnInit, inject } from '@angular/core';
import { CartStore, ICartItem } from '../../../core/signal-store/cart.store';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list-terminal',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,

  ],
  templateUrl: './item-list-terminal.component.html',
  styleUrl: './item-list-terminal.component.scss'
})
export class ItemListTerminalComponent implements OnInit {

  itemDialog: boolean = false;
  item!: ICartItem;
  cartStore = inject(CartStore);
  constructor() {

  }

  ngOnInit(): void {
    console.log('netCarts', this.cartStore.netCartList());
  }

  editProduct(item: ICartItem) {
    this.item = item;
    this.itemDialog = true;
  }

  deleteProduct(item: ICartItem) { }

  hideDialog() { }

  saveProduct() { }

}
