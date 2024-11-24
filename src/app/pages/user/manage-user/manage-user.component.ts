import { Component, DestroyRef, inject } from '@angular/core';
import { ICreateUserDto, IUser } from '../../../core/interfaces/user/user.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormType, Gender, UserStatus } from '../../../core/enums/common/gender.enum';
import { Role } from '../../../core/enums/auth/role.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/http/user/user.service';
import { PrimengModule } from '../../../core/modules/primeng/primeng.module';
import { PhoneNoValidator } from '../../../core/validators/phoneNumber.validator';
import { IPaginationFilter } from '../../../core/interfaces/pagination/page.interface';
import { ShowroomService } from '../../../core/services/http/warehouse/showroom.service';
import { catchError, of, Subscription, tap } from 'rxjs';
import { IShowroom } from '../../../core/interfaces/warehouse/warehouse.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent {

  selectedUser: IUser = {}
  userId: number = 0;
  userForm: FormGroup = new FormGroup({});
  formType: string = FormType.ADD;
  isDisable: boolean = false;
  isVisible: boolean = true;
  isEditableItemDisable: boolean = false;
  genders: any[] = [{ key: "Female", value: Gender.FEMALE }, { key: "Male", value: Gender.MALE }];
  statusList: any[] = [{ key: "Pending", value: UserStatus.PENDING }, { key: "Approved", value: UserStatus.APPROVED }, { key: "Hold", value: UserStatus.HOLD }];
  roles: any[] = [{ key: "Cashier", value: Role.CASHIER }, { key: "Default", value: Role.DEFAULT }, { key: "Admin", value: Role.ADMIN }];
  selectedShowroom: any;
  subscription: Subscription = new Subscription();

  showroomList: IShowroom[] = [];
  srName: string = ''
  filters: IPaginationFilter = {
    page: 1,
    limit: 10
  };

  destroyRef = inject(DestroyRef);

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private toastMessageService: ToastMessageService,
    public dynamicDialogRef: DynamicDialogRef,
    private readonly spinnerServ: SpinnerService,
    public router: Router,
    private userService: UserService,
    private showroomServ: ShowroomService
  ) {
    this.userId = this.dynamicDialogConfig?.data.id;
    this.selectedUser = this.dynamicDialogConfig?.data.user;
    if (this.selectedUser.id)
      this.getUserById(this.selectedUser.id);
    if (this.userId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.userId == -1) {
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
      this.patchForm(this.selectedUser);
    }
    this.fetchShowrooms();
  }

  async getUserById(id: number) {
    this.userService.getUserById(id).subscribe(res => {
      if (res)
        this.selectedUser = res;
    })
  }

  initForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      lastName: new FormControl({ value: '', disabled: this.isDisable }, []),
      nic: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      role: new FormControl({ value: [], disabled: this.isDisable }, [Validators.required]),
      gender: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      email: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required, Validators.email]),
      address: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      userName: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      showroom: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      password: new FormControl({ value: '', disabled: (this.formType == FormType.VIEW ? this.isDisable : this.isEditableItemDisable) }, [Validators.required]),
      status: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      contacts: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required, PhoneNoValidator]),
      confirmPassword: new FormControl({ value: '', disabled: (this.formType == FormType.VIEW ? this.isDisable : this.isEditableItemDisable) }, [Validators.required]),
    },
      this.MustMatch('password', 'confirmPassword')
    );
  }

  get f(): any {
    return this.userForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  patchForm(user: IUser) {
    if (user.roles) {
      this.userForm.controls['role'].setValue(user.roles);
    }
    if (user.phoneNumber) {
      this.userForm.controls['contacts'].setValue(user?.phoneNumber);
    }
    this.userForm.patchValue({
      firstName: user?.firstName,
      lastName: user?.lastName,
      nic: user?.nic,
      role: user?.roles,
      gender: user?.gender,
      email: user?.email,
      status: user.status,
      address: user.address,
      userName: user.userName,
      showroom: user?.showroomId
    })
  }

  MustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  fetchShowrooms() {
    this.showroomServ.getShowroomList()
    .pipe(
      tap(),
      takeUntilDestroyed(this.destroyRef),
      catchError((err: HttpErrorResponse) => {
        const message = err?.error?.message || 'Failed to Fetch!';
        this.toastMessageService.addNotification('error', message);
        return of();
      })
    ).subscribe(res => {
      this.showroomList = res;
    });
  }

  saveInfo() { 
    if (this.userForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createUserDto: ICreateUserDto = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        address: this.userForm.value.address,
        gender: this.userForm.value.gender,
        email: this.userForm.value.email,
        showroomId:this.userForm.value.showroom,
        phoneNumber: this.userForm.value.contacts ,
        roles: this.userForm.value.role,
        status: this.userForm.value.status,

      }
      if (this.userForm.valid) {
        if (this.formType == FormType.ADD) {
          createUserDto = { ...createUserDto, userName: this.userForm.value.userName,
            nic: this.userForm.value.nic,  password: this.userForm.value.password};
          this.userService.create(createUserDto)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.spinnerServ.showSpinner(false);
                const message = err?.error?.message || 'Failed to Create User!';
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
          if (this.selectedUser.id)
            this.userService.update(this.selectedUser.id, createUserDto)
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
      this.userForm.markAllAsTouched();
    }
  }


}
