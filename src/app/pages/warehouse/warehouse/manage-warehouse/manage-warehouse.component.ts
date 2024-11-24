import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { ICreateWarehouseDto, IWarehouse } from '../../../../core/interfaces/warehouse/warehouse.interface';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { WarehouseService } from '../../../../core/services/http/warehouse/warehouse.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-warehouse',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-warehouse.component.html',
  styleUrl: './manage-warehouse.component.scss'
})
export class ManageWarehouseComponent {

  selectedWarehouse: IWarehouse = {}
  wHId: number = 0;
  wHouseForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isEditableItemDisable: boolean = false;

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private wHService: WarehouseService,
  ) {
    this.wHId = this.dynamicDialogConfig?.data.id;
    this.selectedWarehouse = this.dynamicDialogConfig?.data.user;
    if (this.selectedWarehouse.id)
      this.getById(this.selectedWarehouse.id);
    if (this.wHId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.wHId == -1) {
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
      this.patchForm(this.selectedWarehouse);
    }

  }

  initForm() {
    this.wHouseForm = new FormGroup({
      name: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      location: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      address: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      capacity: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.wHouseForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  patchForm(warehouse: IWarehouse) {
    this.wHouseForm.patchValue({
      name: warehouse?.name,
      location: warehouse?.location,
      address: warehouse?.address,
      capacity: warehouse?.capacity,
    })
  }

  async getById(id: number) {
    this.wHService.getById(id).subscribe(res => {
      if (res)
        this.selectedWarehouse = res;
    })
  }

  saveInfo() {
    if (this.wHouseForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createUserDto: ICreateWarehouseDto = {
        name: this.wHouseForm.value.name,
        location: this.wHouseForm.value.location,
        address: this.wHouseForm.value.address,
        capacity: this.wHouseForm.value.capacity

      }
      if (this.wHouseForm.valid) {
        if (this.formType == FormType.ADD) {
          this.wHService.create(createUserDto)
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
          if (this.selectedWarehouse.id)
            this.wHService.update(this.selectedWarehouse.id, createUserDto)
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
      this.wHouseForm.markAllAsTouched();
    }
  }

}
