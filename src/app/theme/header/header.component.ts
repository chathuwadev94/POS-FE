import { Component, OnInit, signal } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PrimengModule,
    ButtonModule,
    MenubarModule,
    SidebarComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  // loggedInUser?: ILoginResponse;
  loggedInUser?: any;
  sidebarVisible: boolean = false;
  shopName: string = 'K Super Mart'



  constructor() { }

  ngOnInit(): void {
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
    // TODO: Implement logout logic
    console.log('User logged out');
  }
}
