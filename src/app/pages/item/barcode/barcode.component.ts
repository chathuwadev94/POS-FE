import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { IBarcode } from '../../../core/interfaces/item/item-response.interface';
import { BarcodeService } from '../../../core/services/http/item/barcode.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageBarcodeComponent } from './manage-barcode/manage-barcode.component';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.scss'
})
export class BarcodeComponent implements OnInit {

  filters: IPaginationFilter = {
    page: 1,
    limit: 10,
  };
  paginateOptions: IPaginationOptions = {
    firstIndex: 0,
    lastIndex: 0,
    totalRecords: 0,
    pageRecordCountOptions: [5, 10, 15, 20],
    selectedPageRecordCount: this.filters.limit,
  };

  barcodeList: IBarcode[] = [];
  selectedBarcodeList: IBarcode[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly bacodeServ: BarcodeService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchCategoryList();
  }

  fetchCategoryList() {
    this.spinnerServ.showSpinner(true);
    this.bacodeServ.getListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.barcodeList = userListResponse?.data;
          updatedPaginateOptions(
            userListResponse,
            this.paginateOptions
          );
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageServ.addNotification('error', message);
        return of();
      }
      ))
      .subscribe();
  }

  onAdd() {
    this.dialogService.open(ManageBarcodeComponent, {
      header: 'Add Barcode',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', barcode: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: IBarcode) {
    this.dialogService.open(ManageBarcodeComponent, {
      header: 'Edit Barcode',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', barcode: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: IBarcode) {
    this.dialogService.open(ManageBarcodeComponent, {
      header: 'View Barcode',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', barcode: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchBarcodeListBycode();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchCategoryList();
  }

  fetchBarcodeListBycode() {
    this.spinnerServ.showSpinner(true);
    this.bacodeServ.getListByCodeWithPaginate({ ...this.filters, code: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((showroomListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (showroomListResponse) {
          this.barcodeList = showroomListResponse?.data;
          updatedPaginateOptions(
            showroomListResponse,
            this.paginateOptions
          );
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinnerServ.showSpinner(false);
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageServ.addNotification('error', message);
        return of();
      }
      ))
      .subscribe();
  }

}
