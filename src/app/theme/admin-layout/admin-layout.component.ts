import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    PrimengModule,
    ButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
  sidebarVisible: boolean = false;
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
     this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.generateBreadcrumbs();
    });
    this.generateBreadcrumbs();
   
  }

  generateBreadcrumbs() {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment !== '');

    this.items = segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      return {
        label: this.formatLabel(segment),
        routerLink: path
      };
    });
  }

  formatLabel(segment: string): string {
    // Convert URL segment to a readable label
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
