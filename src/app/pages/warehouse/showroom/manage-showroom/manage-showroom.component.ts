import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { IShowroom } from '../../../../core/interfaces/user/user.interface';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { WarehouseService } from '../../../../core/services/http/warehouse/warehouse.service';
import { ShowroomService } from '../../../../core/services/http/warehouse/showroom.service';
import { ICreateShowroom, IWarehouse } from '../../../../core/interfaces/warehouse/warehouse.interface';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-showroom',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-showroom.component.html',
  styleUrl: './manage-showroom.component.scss'
})
export class ManageShowroomComponent implements OnInit {

  selectedShowroom: IShowroom = {}
  sRId: number = 0;
  sRoomForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isEditableItemDisable: boolean = false;
  warehouseList: IWarehouse[] = [];

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private wHService: WarehouseService,
    private sRService: ShowroomService,
  ) {
    this.sRId = this.dynamicDialogConfig?.data.id;
    this.selectedShowroom = this.dynamicDialogConfig?.data.showroom;
    if (this.selectedShowroom.id)
      this.getById(this.selectedShowroom.id);
    if (this.sRId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.sRId == -1) {
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
      this.patchForm(this.selectedShowroom);
    }
    this.fetchShowrooms();
  }

  initForm() {
    this.sRoomForm = new FormGroup({
      name: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      location: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      address: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      warehouseId: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      phoneNumber: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.sRoomForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  fetchShowrooms() {
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

  patchForm(showroom: IShowroom) {
    this.sRoomForm.patchValue({
      name: showroom?.name,
      location: showroom?.location,
      address: showroom?.address,
      warehouseId: showroom?.warehouseId,
      phoneNumber: showroom?.phoneNumber,
    })
  }

  async getById(id: number) {
    this.sRService.getById(id).subscribe(res => {
      if (res)
        this.selectedShowroom = res;
    })
  }

  saveInfo() {
    if (this.sRoomForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createDto: ICreateShowroom = {
        name: this.sRoomForm.value.name,
        location: this.sRoomForm.value.location,
        address: this.sRoomForm.value.address,
        warehouseId: this.sRoomForm.value.warehouseId,
        phoneNumber: this.sRoomForm.value.phoneNumber,

      }
      if (this.sRoomForm.valid) {
        if (this.formType == FormType.ADD) {
          this.sRService.create(createDto)
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
          if (this.selectedShowroom.id)
            this.sRService.update(this.selectedShowroom.id, createDto)
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
      this.sRoomForm.markAllAsTouched();
    }
  }

}
