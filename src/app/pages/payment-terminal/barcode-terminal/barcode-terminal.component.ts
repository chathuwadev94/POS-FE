import { Component, DestroyRef, inject } from '@angular/core';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../core/services/http/stock/stock.service';
import { IPaginationFilter } from '../../../core/interfaces/pagination/page.interface';
import { ItemService } from '../../../core/services/http/item/item.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { catchError, of, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CartStore, ICartItem } from '../../../core/signal-store/cart.store';
import { IStock } from '../../../core/interfaces/item/item-response.interface';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-barcode-terminal',
  standalone: true,
  imports: [PrimengModule, FormsModule, ZXingScannerModule],
  templateUrl: './barcode-terminal.component.html',
  styleUrl: './barcode-terminal.component.scss'
})
export class BarcodeTerminalComponent {

  selectedItem: any;
  suggestions: any[] = [];
  filters: IPaginationFilter = {
    page: 1,
    limit: 10
  };
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];
  destroyRef = inject(DestroyRef);
  cartStore = inject(CartStore);

  constructor(
    private readonly stockServ: StockService,
    private readonly itemServ: ItemService,
    private readonly spinnerServ: SpinnerService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit() {

  }

  search(event: AutoCompleteCompleteEvent) {
    this.itemServ.getPaginatedItemByBcode({ ...this.filters, bcode: event.query }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.suggestions = res.data.map((item: any) => item.barcode.code)
    })
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (devices.length > 0) {
      // this.selectedDevice = devices[0]; // Select the first camera
    }
  }

  onKeydown(event: any) {
    let param = { barcode: this.selectedItem }
    this.spinnerServ.showSpinner(true);
    this.stockServ.getStockItemByBarcodea(param).pipe(
      tap(
        (res: any) => {
          this.spinnerServ.showSpinner(false)
          let item: ICartItem = {
            itemId: res.item.id,
            name: res.item?.name,
            stockId: res.id,
            qty: 1,
            unitPrice: res.unitPrice
          }
          this.cartStore.addItem(item);
        }
      ),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageServ.addNotification('error', message);
        return of();
      })
    ).subscribe();
    this.selectedItem = null;
  }

  onBarcodeScanned(result: string): void {
    console.log('Barcode scanned:', result);
    let param = { barcode: result }
    this.stockServ.getStockItemByBarcodea(param).pipe(takeUntilDestroyed(this.destroyRef)).pipe(
      take(1),
      tap((res: IStock) => {
        this.spinnerServ.showSpinner(false)
        let item: ICartItem = {
          itemId: res.item.id,
          name: res.item?.name,
          stockId: res.id,
          qty: 1,
          unitPrice: res.unitPrice
        }
        this.cartStore.addItem(item);
        this.toastMessageServ.addNotification('success', 'Item Scaned successfully...');
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
