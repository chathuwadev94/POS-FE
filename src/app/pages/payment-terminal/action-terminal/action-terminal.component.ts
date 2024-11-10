import { Component, DestroyRef, inject } from '@angular/core';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { CartStore, ICartItem } from '../../../core/signal-store/cart.store';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { ConfirmationService } from 'primeng/api';
import { NumpadComponent } from '../../../core/shared/num-pad.component';
import { IItemSale, ISaleItem, ISaleItemList } from '../../../core/interfaces/sales/sale.interface';
import { SaleService } from '../../../core/services/http/sales/sale.service';
import { catchError, of, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InvoiceService } from '../../../core/services/invoice/invoice.service';

@Component({
  selector: 'app-action-terminal',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    NumpadComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './action-terminal.component.html',
  styleUrl: './action-terminal.component.scss'
})
export class ActionTerminalComponent {

  cartStore = inject(CartStore);
  destroyRef = inject(DestroyRef);
  cashBalanceDialog: boolean = false;
  closeTraDialog: boolean = false;
  cartClearDialog: boolean = false;
  cashAmount: number = 0;
  cashBalance: number = 0;
  keypadEntry: string = '';

  constructor(
    private readonly toastMessageServ: ToastMessageService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly saleService: SaleService,
    private printService: InvoiceService
  ) { }

  cashPayment() {
    if (!(this.cartStore.netAmmount() > 0)) {
      this.toastMessageServ.addNotification('error', 'Please Select Items...');
      return
    }
    this.cashBalanceDialog = true;
  }

  hideDialog() {
    this.cashBalanceDialog = true;
  }

  payment() {
    if (this.cashAmount < this.cartStore.netAmmount()) {
      this.toastMessageServ.addNotification('error', 'Cash Insuficient...');
      return
    }
    this.cashBalance = this.cashAmount - this.cartStore.netAmmount();
    this.cashBalanceDialog = false;
    this.closeTraDialog = true;
  }

  closeTransaction() {
    this.closeTraDialog = false;
    this.cashService();
  }

  cashService(): void {

    let saleItemList: ISaleItemList[] = this.cartStore.iCartItem().map((item: ICartItem) => ({
      itemId: item.itemId,
      qty: item.qty,
      stockId: item.stockId
    }));
    let saleDto: IItemSale = { itemCount: saleItemList.length, saleItemsList: saleItemList, payment: this.cashAmount };
    this.spinnerServ.showSpinner(true);
    this.saleService.createSale(saleDto).pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
      tap((res: any) => {
        this.spinnerServ.showSpinner(false)
        this.toastMessageServ.addNotification('success', 'Sale  Successfully...');
        this.cashBalanceDialog = false;
        this.cashAmount = 0;
        this.closeTraDialog = true;
        this.cartStore.clearCart();
        this.printService.printBill(res);
        // Print Invoice and Open cash tray
      }),
      catchError(error => {
        this.spinnerServ.showSpinner(false)
        this.toastMessageServ.addNotification('error', 'Error Occurred while Creating Sale...');
        return of(error);
      })
    ).subscribe()
  }

  memo(no: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to save or dispatch cart Memory?',
      header: `Cart Memory Slot 0${no}`,
      icon: 'pi pi-save',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.cartStore.saveCartList(no);
        this.cartStore.clearCart();
        this.toastMessageServ.addNotification('info', 'Cart Saved...');
      },
      reject: () => {
        this.cartStore.removeCartFromCartList(no);
        this.toastMessageServ.addNotification('info', 'Cart Dispatched...');
      }
    });
  }

  cardPayment() {
    // Implement card payment logic
  }

  clearCartDialog() {
    this.cartClearDialog = true;
  }

  clearCart() {
    this.cartClearDialog = false;
    this.cartStore.clearCart();
  }

  onKeydown(event: any) {
    if (event.key === 'F1') {
      event.preventDefault();
      this.cashPayment();
    }
    if (event.key === 'F2') {
      event.preventDefault();
      this.cardPayment();
    }
    if (event.key === 'F3') {
      event.preventDefault();
      this.cashPayment();
    }
    if (event.key === 'F4') {
      event.preventDefault();
      this.memo(1);
    }
    if (event.key === 'F5') {
      event.preventDefault();
      this.memo(2);
    }
    if (event.key === 'F12') {
      event.preventDefault();
      this.clearCartDialog();
    }
  }

  enterDigit(digit: number) {
    this.keypadEntry += digit.toString();
  }

  submitKeypadEntry() {
    console.log('Keypad entry submitted:', this.keypadEntry);
    this.keypadEntry = '';
  }

  onNumpadValueChange(value: string) {
    console.log('Current value:', value);
  }

  onNumpadEnter(value: string) {
    console.log('Final value:', value);

  }


}
