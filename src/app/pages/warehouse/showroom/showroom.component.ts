import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PaginationComponent } from '../../../core/shared/pagination/pagination.component';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../../core/interfaces/pagination/page.interface';
import { IShowroom } from '../../../core/interfaces/user/user.interface';
import { ShowroomService } from '../../../core/services/http/warehouse/showroom.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { updatedPaginateOptions } from '../../../core/utilities/pagination.utill';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageShowroomComponent } from './manage-showroom/manage-showroom.component';

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './showroom.component.html',
  styleUrl: './showroom.component.scss'
})
export class ShowroomComponent implements OnInit {

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

  showroomList: IShowroom[] = [];
  selectedShowroomList: IShowroom[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly showroomServ: ShowroomService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchShowroomList();
  }

  fetchShowroomList() {
    this.spinnerServ.showSpinner(true);
    this.showroomServ.getShowroomListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.showroomList = userListResponse?.data;
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
    this.dialogService.open(ManageShowroomComponent, {
      header: 'Add Showroom',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', showroom: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEdit(value: IShowroom) {
    this.dialogService.open(ManageShowroomComponent, {
      header: 'Edit Showroom',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', showroom: value }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onView(value: IShowroom) {
    this.dialogService.open(ManageShowroomComponent, {
      header: 'View Showroom',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', showroom: value }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchUserListByLocation();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchShowroomList();
  }

  fetchUserListByLocation() {
    this.spinnerServ.showSpinner(true);
    this.showroomServ.getShowroomListByNameWithPaginate({ ...this.filters, name: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((showroomListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (showroomListResponse) {
          this.showroomList = showroomListResponse?.data;
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
