import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { ICategory } from '../../../core/interfaces/item/item-response.interface';
import { CategoryService } from '../../../core/services/http/item/category.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageCategoryComponent } from './manage-category/manage-category.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

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

  categoryList: ICategory[] = [];
  selectedCategoryList: ICategory[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly categoryServ: CategoryService,
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
    this.categoryServ.getListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.categoryList = userListResponse?.data;
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
    this.dialogService.open(ManageCategoryComponent, {
      header: 'Add Item Category',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', category: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: ICategory) {
    this.dialogService.open(ManageCategoryComponent, {
      header: 'Edit Item Category',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', category: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: ICategory) {
    this.dialogService.open(ManageCategoryComponent, {
      header: 'View Item Category',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', category: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchCategoryListByName();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchCategoryList();
  }

  fetchCategoryListByName() {
    this.spinnerServ.showSpinner(true);
    this.categoryServ.getListByNameWithPaginate({ ...this.filters, name: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((showroomListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (showroomListResponse) {
          this.categoryList = showroomListResponse?.data;
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
