import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { IBarcode, ICategory, ICreateItemDto, IItem } from '../../../../core/interfaces/item/item-response.interface';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/http/item/category.service';
import { ItemService } from '../../../../core/services/http/item/item.service';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BarcodeService } from '../../../../core/services/http/item/barcode.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-manage-item',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    ZXingScannerModule
  ],
  templateUrl: './manage-item.component.html',
  styleUrl: './manage-item.component.scss'
})
export class ManageItemComponent implements OnInit {

  selectedItem: IItem;
  itemId: number = 0;
  itemForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isEditableItemDisable: boolean = false;
  categoryList: ICategory[] = [];
  barcodeList: IBarcode[] = [];
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private catService: CategoryService,
    private itemService: ItemService,
    private barcodeServ: BarcodeService,
  ) {
    this.itemId = this.dynamicDialogConfig?.data.id;
    this.selectedItem = this.dynamicDialogConfig?.data.item;
    if (this.selectedItem.id)
      this.getById(this.selectedItem.id);
    if (this.itemId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.itemId == -1) {
        this.formType = FormType.VIEW
        this.isDisable = true;
        this.isVisible = false;

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
      this.patchForm(this.selectedItem);
    }
    this.fetchCategories();
    this.fetchBarcodes();
  }

  fetchCategories() {
    this.catService.getList()
      .pipe(
        tap(),
        takeUntilDestroyed(this.destroyRef),
        catchError((err: HttpErrorResponse) => {
          const message = err?.error?.message || 'Failed to Fetch Categories!';
          this.toastMessageService.addNotification('error', message);
          return of();
        })
      ).subscribe(res => {
        this.categoryList = res;
      });
  }

  fetchBarcodes() {
    this.barcodeServ.getList()
      .pipe(
        tap(),
        takeUntilDestroyed(this.destroyRef),
        catchError((err: HttpErrorResponse) => {
          const message = err?.error?.message || 'Failed to Fetch Barcodes!';
          this.toastMessageService.addNotification('error', message);
          return of();
        })
      ).subscribe(res => {
        this.barcodeList = res;
      });
  }

  initForm() {
    this.itemForm = new FormGroup({
      name: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      description: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      categoryId: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      manufactur: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      barcodeId: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.itemForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  patchForm(value: IItem) {
    this.itemForm.patchValue({
      name: value?.name,
      description: value?.description,
      categoryId: value?.category?.id,
      manufactur: value?.manufactur,
      barcodeId: value?.barcode?.id,
    })
  }

  async getById(id: number) {
    this.itemService.getById(id).subscribe(res => {
      if (res)
        this.selectedItem = res;
    })
  }

  saveInfo() {
    if (this.itemForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createItemDto: ICreateItemDto = {
        name: this.itemForm.value.name,
        description: this.itemForm.value.description,
        categoryId: this.itemForm.value.categoryId,
        manufactur: this.itemForm.value.manufactur,
        barcodeId: this.itemForm.value.barcodeId,
      }
      if (this.itemForm.valid) {
        if (this.formType == FormType.ADD) {
          this.itemService.create(createItemDto)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.spinnerServ.showSpinner(false);
                const message = err?.error?.message || 'Failed to Create Item!';
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
          if (this.selectedItem.id)
            this.itemService.update(this.selectedItem.id, createItemDto)
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  this.spinnerServ.showSpinner(false);
                  const message = err?.error?.message || 'Failed to Update Item!';
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
      this.itemForm.markAllAsTouched();
    }
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (devices.length > 0) {
      // this.selectedDevice = devices[0]; // Select the first camera
    }
  }

  onBarcodeScanned(result: string): void {
    let barcode: IBarcode | undefined = this.barcodeList.find(item => item.code === result);
    if (barcode) {
      this.itemForm.patchValue({
        barcodeId: barcode.id,
      })
    } else {
      this.toastMessageService.addNotification('error', "Barcode Unavailble In Database...");
      this.itemForm.patchValue({
        barcodeId: null,
      })
    }

  }

}