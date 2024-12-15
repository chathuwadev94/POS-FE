import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { IStock } from '../../../core/interfaces/stock/stock.interface';
import { StockService } from '../../../core/services/http/stock/stock.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageStockComponent } from './manage-stock/manage-stock.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {

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

  stockList: IStock[] = [];
  selectedStockList: IStock[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly stockServ: StockService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchStockList();
  }

  fetchStockList() {
    this.spinnerServ.showSpinner(true);
    this.stockServ.getStockListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((stockListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (stockListResponse) {
          this.stockList = stockListResponse?.data;
          updatedPaginateOptions(
            stockListResponse,
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
    this.dialogService.open(ManageStockComponent, {
      header: 'Add Stock',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', stock: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: IStock) {
    this.dialogService.open(ManageStockComponent, {
      header: 'Edit Stock',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', stock: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: IStock) {
    this.dialogService.open(ManageStockComponent, {
      header: 'View Stock',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', stock: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchUserListByLocation();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchStockList();
  }

  fetchUserListByLocation() {
    // this.spinnerServ.showSpinner(true);
    // this.stockServ.getShowroomListByNameWithPaginate({ ...this.filters, name: this.selectedKeyword }).pipe(
    //   takeUntilDestroyed(this.destroyRef),
    //   tap((showroomListResponse: IPagination) => {
    //     this.spinnerServ.showSpinner(false);
    //     if (showroomListResponse) {
    //       this.stockList = showroomListResponse?.data;
    //       updatedPaginateOptions(
    //         showroomListResponse,
    //         this.paginateOptions
    //       );
    //     }
    //   }),
    //   catchError((err: HttpErrorResponse) => {
    //     this.spinnerServ.showSpinner(false);
    //     const message = err?.error?.message || 'Failed to Fetch!';
    //     this.toastMessageServ.addNotification('error', message);
    //     return of();
    //   }
    //   ))
    //   .subscribe();
  }

}
