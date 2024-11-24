import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { IWarehouse } from '../../../core/interfaces/warehouse/warehouse.interface';
import { WarehouseService } from '../../../core/services/http/warehouse/warehouse.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, of } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { ManageWarehouseComponent } from './manage-warehouse/manage-warehouse.component';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {

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

  warehouseList: IWarehouse[] = [];
  selectedWarehouseList: IWarehouse[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly warehouseSer: WarehouseService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchWarehouseList();
  }

  fetchWarehouseList() {
    this.spinnerServ.showSpinner(true);
    this.warehouseSer.getWarehouseListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.warehouseList = userListResponse?.data;
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
    this.dialogService.open(ManageWarehouseComponent, {
      header: 'Add Warehouse',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', user: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: IWarehouse) {
    this.dialogService.open(ManageWarehouseComponent, {
      header: 'Edit Warehouse',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', user: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: IWarehouse) {
    this.dialogService.open(ManageWarehouseComponent, {
      header: 'View Warehouse',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', user: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchUserListByLocation();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchWarehouseList();
  }

  fetchUserListByLocation() {
    this.spinnerServ.showSpinner(true);
    this.warehouseSer.getWarehouseListByNameWithPaginate({ ...this.filters, location: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((warehouseListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (warehouseListResponse) {
          this.warehouseList = warehouseListResponse?.data;
          updatedPaginateOptions(
            warehouseListResponse,
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
