import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { IItem } from '../../../core/interfaces/item/item-response.interface';
import { CategoryService } from '../../../core/services/http/item/category.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { ItemService } from '../../../core/services/http/item/item.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageItemComponent } from './manage-item/manage-item.component';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {

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

  itemList: IItem[] = [];
  selectedItemList: IItem[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly categoryServ: CategoryService,
    private readonly itemServ: ItemService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchItemList();
  }

  fetchItemList() {
    this.spinnerServ.showSpinner(true);
    this.itemServ.getListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((ItemListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (ItemListResponse) {
          this.itemList = ItemListResponse?.data;
          updatedPaginateOptions(
            ItemListResponse,
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
    this.dialogService.open(ManageItemComponent, {
      header: 'Add Item',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', item: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: IItem) {
    this.dialogService.open(ManageItemComponent, {
      header: 'Edit Item',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', item: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: IItem) {
    this.dialogService.open(ManageItemComponent, {
      header: 'View Item',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', item: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchCategoryListByName();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchItemList();
  }

  fetchCategoryListByName() {
    this.spinnerServ.showSpinner(true);
    this.itemServ.getListByNameWithPaginate({ ...this.filters, name: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((showroomListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (showroomListResponse) {
          this.itemList = showroomListResponse?.data;
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
