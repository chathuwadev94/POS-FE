import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { UserService } from '../../core/services/http/user/user.service';
import { IPagination, IPaginationFilter, IPaginationOptions } from '../../core/interfaces/pagination/page.interface';
import { PaginationComponent } from '../../core/shared/pagination/pagination.component';
import { IUser } from '../../core/interfaces/user/user.interface';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { DialogService } from 'primeng/dynamicdialog';
import { updatedPaginateOptions } from '../../core/utilities/pagination.utill';
import { ConfirmationService } from 'primeng/api';
import { SpinnerService } from '../../core/services/toast-message/spinner.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessageService } from '../../core/services/toast-message/toast-message.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    PrimengModule,
    PaginationComponent
  ],
  providers: [
    DialogService,
    ConfirmationService
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

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

  userList: IUser[] = [];
  selectedUserList: IUser[] = [];
  selectedKeyword: string = '';

  destroyRef = inject(DestroyRef);

  constructor(
    private readonly userService: UserService,
    private dialogService: DialogService,
    private readonly spinnerServ: SpinnerService,
    private confirmationService: ConfirmationService,
    private readonly toastMessageServ: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.fetchUserList();
  }

  fetchUserList() {
    this.spinnerServ.showSpinner(true);
    this.userService.getUserListWithPaginate({ ...this.filters }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.userList = userListResponse?.data;
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

  onAddUser() {
    this.dialogService.open(ManageUserComponent, {
      header: 'Add User',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '0', user: {} }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onEditUser(user: IUser) {
    this.dialogService.open(ManageUserComponent, {
      header: 'Edit User',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '1', user: user }
    }).onClose.subscribe((res: any) => {
      this.onClearSearch();
    })
  }

  onViewUser(user: IUser) {
    this.dialogService.open(ManageUserComponent, {
      header: 'View User',
      width: '70%',
      styleClass: 'air-model',
      data: { id: '-1', user: user }
    }).onClose.subscribe((res: any) => {
      this.onEnterSearch(this.selectedKeyword)
    })
  }

  onEnterSearch(value: any) {
    this.fetchUserListByNic();
  }

  onClearSearch() {
    this.selectedKeyword = '';
    this.fetchUserList();
  }


  fetchUserListByNic() {
    this.spinnerServ.showSpinner(true);
    this.userService.searchUserByNic({ ...this.filters, nic: this.selectedKeyword }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((userListResponse: IPagination) => {
        this.spinnerServ.showSpinner(false);
        if (userListResponse) {
          this.userList = userListResponse?.data;
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

}
