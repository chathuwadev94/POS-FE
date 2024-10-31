import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StateService } from '../../core/store/state.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from '../../core/interfaces/user/user.interface';
import * as userSelector from '../../core/state/user/user.selector'
import { AsyncPipe } from '@angular/common';
import { UserStore } from '../../core/signal-store/user.store';
import { CookieManageService } from '../../core/services/cookie/cookie-manage.service';
import { Router } from '@angular/router';
const authCookieName = 'AUTH_USER';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PrimengModule,
    ButtonModule,
    MenubarModule,
    SidebarComponent,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  // loggedInUser?: ILoginResponse;
  loggedInUser?: any;
  sidebarVisible: boolean = false;
  shopName: string = 'K Super Mart';
  user$!: Observable<IUser | undefined>;

  readonly uStore = inject(UserStore);

  constructor(
    @Inject(StateService)
    private readonly stateService: StateService,
    private store: Store,
    private readonly cookieManageService: CookieManageService,
    private readonly router: Router
  ) {
    this.user$ = this.store.select(userSelector.selectLoggedInUser);
  }

  ngOnInit(): void {
    this.loggedInUser = this.stateService.loggedInUser();
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['profile'],
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout()
        }
      }
    ];
  }

  sidebar(): void {
    this.sidebarVisible = true;
  }

  logout(): void {
    this.cookieManageService.deleteCookie(authCookieName);
    this.router.navigateByUrl('auth');
  }
}
