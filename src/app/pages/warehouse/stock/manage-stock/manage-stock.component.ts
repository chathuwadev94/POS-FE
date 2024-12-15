import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { ICreateStockDto, IStock } from '../../../../core/interfaces/stock/stock.interface';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { IWarehouse } from '../../../../core/interfaces/warehouse/warehouse.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { WarehouseService } from '../../../../core/services/http/warehouse/warehouse.service';
import { StockService } from '../../../../core/services/http/stock/stock.service';
import { catchError, of, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { IPaginationFilter } from '../../../../core/interfaces/pagination/page.interface';
import { BarcodeFormat } from '@zxing/library';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ItemService } from '../../../../core/services/http/item/item.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { IItem } from '../../../../core/interfaces/item/item-response.interface';

@Component({
  selector: 'app-manage-stock',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    ZXingScannerModule
  ],
  templateUrl: './manage-stock.component.html',
  styleUrl: './manage-stock.component.scss'
})
export class ManageStockComponent implements OnInit {

  selectedStock: IStock;
  sId: number = 0;
  stockForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isEditableItemDisable: boolean = false;
  warehouseList: IWarehouse[] = [];
  selectedItemList: IItem[] = [];


  selectedItem: any;
  suggestions: any[] = [];
  selectedItemKey: any;
  filters: IPaginationFilter = {
    page: 1,
    limit: 10
  };
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private wHService: WarehouseService,
    private stockServ: StockService,
    private itemServ: ItemService
  ) {
    this.sId = this.dynamicDialogConfig?.data.id;
    this.selectedStock = this.dynamicDialogConfig?.data.stock;
    if (this.selectedStock.id)
      this.getById(this.selectedStock.id);
    if (this.sId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.sId == -1) {
        this.formType = FormType.VIEW
        this.isDisable = true;
        this.isVisible = false;
        this.isEditableItemDisable = true;

      } else {
        this.formType = FormType.UPDATE
        this.isEditableItemDisable = true;
        this.isVisible = false;
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.formType != FormType.ADD) {
      this.patchForm(this.selectedStock);
    }
    this.fetchWarehouses();
    console.log('valll', this.selectedStock)
  }

  initForm() {
    this.stockForm = new FormGroup({
      qty: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      itemId: new FormControl({ value: '', disabled: this.isEditableItemDisable }, [Validators.required]),
      unitPrice: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      warehouseId: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.stockForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  fetchWarehouses() {
    this.wHService.getWarehouseList()
      .pipe(
        tap(),
        takeUntilDestroyed(this.destroyRef),
        catchError((err: HttpErrorResponse) => {
          const message = err?.error?.message || 'Failed to Fetch!';
          this.toastMessageService.addNotification('error', message);
          return of();
        })
      ).subscribe(res => {
        this.warehouseList = res;
      });
  }

  patchForm(stock: IStock) {
    this.stockForm.patchValue({
      qty: stock?.qty,
      itemId: stock?.itemId,
      unitPrice: stock?.unitPrice,
      warehouseId: stock?.warehouse?.id,
    })
  }

  async getById(id: number) {
    this.stockServ.getById(id).subscribe(res => {
      if (res)
        this.selectedStock = res;
    })
  }

  saveInfo() {
    if (this.stockForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createDto: ICreateStockDto = {
        qty: this.stockForm.value.qty,
        unitPrice: this.stockForm.value.unitPrice,
        warehouseId: this.stockForm.value.warehouseId,

      }
      if (this.stockForm.valid) {
        if (this.formType == FormType.ADD) {
          createDto.itemId = this.stockForm.value.itemId,
            this.stockServ.create(createDto)
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  this.spinnerServ.showSpinner(false);
                  const message = err?.error?.message || 'Failed to Create Warehouse!';
                  this.toastMessageService.addNotification('error', message);
                  return of();
                })
              ).subscribe(response => {
                if (response) {
                  this.spinnerServ.showSpinner(false);
                  this.dynamicDialogRef.close();
                }
              })
        }
        if (this.formType == FormType.UPDATE) {
          if (this.selectedStock.id)
            createDto.itemId = this.selectedStock.itemId;
          this.stockServ.update(this.selectedStock.id, createDto)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.spinnerServ.showSpinner(false);
                const message = err?.error?.message || 'Failed to Update User!';
                this.toastMessageService.addNotification('error', message);
                return of();
              })
            ).subscribe(response => {
              if (response) {
                this.spinnerServ.showSpinner(false);
                this.dynamicDialogRef.close();
              }
            })

        }
      }
    } else {
      this.stockForm.markAllAsTouched();
    }
  }


  search(event: AutoCompleteCompleteEvent) {
    this.itemServ.getPaginatedItemByBcode({ ...this.filters, bcode: event.query }).pipe(takeUntilDestroyed(this.destroyRef),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageService.addNotification('error', message);
        return of();
      })
    ).subscribe(res => {
      this.suggestions = res.data.map((item: any) => item.barcode.code)
      this.selectedItemList = res.data;
    })
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (devices.length > 0) {
      // this.selectedDevice = devices[0]; // Select the first camera
    }
  }

  onKeydown(event: any) {
    const findItem: IItem = this.selectedItemList.find(item => item.barcode?.code === this.selectedItemKey)!;
    if (findItem) {
      this.stockForm.patchValue({
        itemId: findItem.id,
      })
    }
  }

  onBarcodeScanned(result: string): void {
    this.itemServ.getPaginatedItemByBcode({ ...this.filters, bcode: result }).pipe(takeUntilDestroyed(this.destroyRef),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageService.addNotification('error', message);
        return of();
      })
    ).subscribe(res => {
      this.selectedItemList = res.data;
    })
    const findItem: IItem = this.selectedItemList.find(item => item.barcode?.code === result)!;
    if (findItem) {
      this.stockForm.patchValue({
        itemId: findItem.id,
      })
    }
  }

}
