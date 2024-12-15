import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IBarcode, ICreateBarcodeDto } from '../../../../core/interfaces/item/item-response.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { BarcodeService } from '../../../../core/services/http/item/barcode.service';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-manage-barcode',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    ZXingScannerModule
  ],
  templateUrl: './manage-barcode.component.html',
  styleUrl: './manage-barcode.component.scss'
})
export class ManageBarcodeComponent implements OnInit {

  selectedBarcode: IBarcode = {}
  bCodeId: number = 0;
  bCodeForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isCodeAvailable: boolean = false;
  isEditableItemDisable: boolean = false;
  bCodeType = [{ key: 'QR', value: BarcodeFormat.QR_CODE }, { key: 'EAN_13', value: BarcodeFormat.EAN_13 }, { key: 'CODE_128', value: BarcodeFormat.CODE_128 }, { key: 'DATA_MATRIX', value: BarcodeFormat.DATA_MATRIX }];
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private barcodeService: BarcodeService,
  ) {
    this.bCodeId = this.dynamicDialogConfig?.data.id;
    this.selectedBarcode = this.dynamicDialogConfig?.data.barcode;
    if (this.selectedBarcode.id)
      this.getById(this.selectedBarcode.id);
    if (this.bCodeId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.bCodeId == -1) {
        this.formType = FormType.VIEW
        this.isDisable = true;
        this.isVisible = false;
        this.isCodeAvailable = true;

      } else {
        this.formType = FormType.UPDATE
        this.isEditableItemDisable = true;
        this.isVisible = false;
        this.isCodeAvailable = true;
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.formType != FormType.ADD) {
      this.patchForm(this.selectedBarcode);
    }

  }

  initForm() {
    this.bCodeForm = new FormGroup({
      type: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      code: new FormControl({ value: '', disabled: this.isCodeAvailable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.bCodeForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  patchForm(value: IBarcode) {
    this.bCodeForm.patchValue({
      type: value?.type,
      code: value?.code,
    })
  }

  async getById(id: number) {
    this.barcodeService.getById(id).subscribe(res => {
      if (res)
        this.selectedBarcode = res;
    })
  }

  saveInfo() {
    if (this.bCodeForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createBarcodeDto: ICreateBarcodeDto = {
        type: this.bCodeForm.value.type,
        typeName: this.bCodeType.find(c => c.value === this.bCodeForm.value.type)?.key,
      }
      if (this.bCodeForm.valid) {
        if (this.formType == FormType.ADD) {
          const createDto: ICreateBarcodeDto = { ...createBarcodeDto, code: this.bCodeForm.value.code, }
          this.barcodeService.create(createDto)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.spinnerServ.showSpinner(false);
                const message = err?.error?.message || 'Failed to Create Barcode!';
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
          if (this.selectedBarcode.id)
            this.barcodeService.update(this.selectedBarcode.id, createBarcodeDto)
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  this.spinnerServ.showSpinner(false);
                  const message = err?.error?.message || 'Failed to Update Barcode!';
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
      this.bCodeForm.markAllAsTouched();
    }
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    if (devices.length > 0) {
      // this.selectedDevice = devices[0]; // Select the first camera
    }
  }

  onBarcodeScanned(result: string): void {
      this.bCodeForm.patchValue({
        code: result,
      })

  }

}
