import { Component, OnInit, inject } from '@angular/core';
import { CartStore, ICartItem } from '../../../core/signal-store/cart.store';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../core/services/http/stock/stock.service';
import { catchError, concatMap, of, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemService } from '../../../core/services/http/item/item.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { IStock } from '../../../core/interfaces/item/item-response.interface';

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
  selectedItem!: ICartItem;
  newQty!:number;
  cartStore = inject(CartStore);
  constructor(
    private readonly stockServ: StockService,
    private readonly itemServ: ItemService,
    private readonly spinnerServ: SpinnerService,
    private readonly toastMessageServ: ToastMessageService
  ) {

  }

  ngOnInit(): void {
    console.log('netCarts', this.cartStore.netCartList());
  }

  editProduct(item: ICartItem) {
    this.selectedItem = item;
    this.itemDialog = true;
  }

  deleteProduct(item: ICartItem) {
    this.cartStore.removeItem(item.itemId);
  }

  hideDialog() {
    this.itemDialog = false;
  }

  saveProduct() {
    const param: any = { stockId: this.selectedItem.stockId, itemId: this.selectedItem.itemId, qty: this.newQty }
    this.spinnerServ.showSpinner(true);
    this.stockServ.incrementItemCount(param).pipe(
      take(1),
      tap(res => {
        this.spinnerServ.showSpinner(false)
        let item: ICartItem = {
          itemId: res.itemId,
          name: this.selectedItem.name,
          stockId: res.stockId,
          qty: res.qty,
          unitPrice: res.unitPrice
        }
        this.cartStore.incrementItem(item);
        this.itemDialog = false;
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageServ.addNotification('error', message);
        return of();
      })
    ).subscribe();
  }

}
