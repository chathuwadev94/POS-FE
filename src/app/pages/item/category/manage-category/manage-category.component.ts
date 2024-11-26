import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../core/modules/primeng/primeng.module';
import { ICategory, ICreateCategoryDto } from '../../../../core/interfaces/item/item-response.interface';
import { FormType } from '../../../../core/enums/common/gender.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageService } from '../../../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../../../core/services/toast-message/spinner.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/http/item/category.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [
    FormsModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit {

  selectedCategory: ICategory = {}
  catId: number = 0;
  catForm: FormGroup = new FormGroup({});
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
    private catService: CategoryService,
  ) {
    this.catId = this.dynamicDialogConfig?.data.id;
    this.selectedCategory = this.dynamicDialogConfig?.data.category;
    if (this.selectedCategory.id)
      this.getById(this.selectedCategory.id);
    if (this.catId == 0) {
      this.formType = FormType.ADD
    } else {
      if (this.catId == -1) {
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
      this.patchForm(this.selectedCategory);
    }

  }

  initForm() {
    this.catForm = new FormGroup({
      name: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
      description: new FormControl({ value: '', disabled: this.isDisable }, [Validators.required]),
    },
    );
  }

  get f(): any {
    return this.catForm.controls;
  }
  onCancel() {
    this.dynamicDialogRef.close();
  }

  patchForm(category: ICategory) {
    this.catForm.patchValue({
      name: category?.name,
      description: category?.description,
    })
  }

  async getById(id: number) {
    this.catService.getById(id).subscribe(res => {
      if (res)
        this.selectedCategory = res;
    })
  }

  saveInfo() {
    if (this.catForm.valid) {
      this.spinnerServ.showSpinner(true);
      let createUserDto: ICreateCategoryDto = {
        name: this.catForm.value.name,
        description: this.catForm.value.description,
      }
      if (this.catForm.valid) {
        if (this.formType == FormType.ADD) {
          this.catService.create(createUserDto)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.spinnerServ.showSpinner(false);
                const message = err?.error?.message || 'Failed to Create Category!';
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
          if (this.selectedCategory.id)
            this.catService.update(this.selectedCategory.id, createUserDto)
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
      this.catForm.markAllAsTouched();
    }
  }

}
