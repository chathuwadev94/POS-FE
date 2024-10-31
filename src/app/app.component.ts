import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/http/auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { TokenInterceptorService } from './core/interceptors/token-interceptor.service';
import { ResponseBodyModifyInterceptorService } from './core/interceptors/response-body-refact-interceptor.service';
import { PrimengModule } from './core/modules/primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { ToastMessageService } from './core/services/toast-message/toast-message.service';
import { SpinnerService } from './core/services/toast-message/spinner.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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

  display:boolean=false;
  constructor(
    private messageService: MessageService,
    private readonly toastService: ToastMessageService,
    private readonly spinnerService: SpinnerService
  ) { }
  title = 'Pos-fe';

  ngOnInit(): void {
    this.toastService.getNotification().subscribe(res => {
      this.messageService.add(res);
    })
    this.spinnerService.visible.subscribe(res=> this.display=res);
  }
}
