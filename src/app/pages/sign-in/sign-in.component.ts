import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup = new FormGroup({});
  shopName:string = 'K Super Mart';

  constructor(
    private readonly fb:FormBuilder
  ){

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm():void {
    this.signInForm = this.fb.group({
      username:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required])
    })
  }

  get signInFormControl() {
    return this.signInForm.controls;
  }

  get f(): any {
    return this.signInForm.controls;
  }

  onSignIn():void {}

}
