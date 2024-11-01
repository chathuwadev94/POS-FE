import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/http/auth/auth.service';
import { PrimengModule } from './core/modules/primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { ToastMessageService } from './core/services/toast-message/toast-message.service';
import { SpinnerService } from './core/services/toast-message/spinner.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrimengModule],
  providers: [
    AuthService,
    MessageService,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  display: boolean = false;
  destroyRef = inject(DestroyRef)
  constructor(
    private messageService: MessageService,
    private readonly toastService: ToastMessageService,
    private readonly spinnerService: SpinnerService
  ) { }


  ngOnInit(): void {
    this.toastService.getNotification().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.messageService.add(res);
    })
    this.spinnerService.visible.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => this.display = res);
  }
}
