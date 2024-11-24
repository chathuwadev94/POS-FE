import { Component, OnInit, model, inject } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserStore } from '../../core/signal-store/user.store';
import { Role } from '../../core/enums/auth/role.enum';
import { CookieManageService } from '../../core/services/cookie/cookie-manage.service';
import { environment } from '../../../environments/environment.development';


@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        PrimengModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    sidebarVisible = model(false);
    items: MenuItem[] = [];
    readonly uStore = inject(UserStore);
    cookieManageService = inject(CookieManageService);

    constructor(private readonly router: Router) { }

    
    ngOnInit(): void {
        this.sideBar();
    }

    sideBarTabVisible = (acceptedRoles: string[]): boolean => {
        const userRoles: string[] = this.cookieManageService.getCookie(environment.cookies.authCookieName).roles;
        if (userRoles && userRoles.length > 0) {
            let isExist: string[] = userRoles.filter(r => acceptedRoles.includes(r));
            if (isExist.length > 0) {
                return true;
            }
        }
        return false;
    }

    sideBar() {
        this.items = [
            {
                label: 'Casheir',
                icon: 'pi pi-desktop',
                visible: this.sideBarTabVisible([Role.CASHIER,Role.ADMIN]),
                command: () => {
                    this.router.navigate(['terminal']);
                    this.sidebarVisible.set(false);
                },
            },
            {
                label: 'Dashboard',
                icon: 'pi pi-chart-line',
                visible: this.sideBarTabVisible([Role.DEFAULT,Role.CASHIER,Role.ADMIN]),
                command: () => {
                    this.router.navigate(['dashboard']);
                    this.sidebarVisible.set(false);
                }
            },
            {
                label: 'Warehouse',
                icon: 'pi pi-home',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                items: [
                    {
                        label: 'Warehouse',
                        icon: 'pi pi-home',
                    },
                    {
                        label: 'Showroom',
                        icon: 'pi pi-shopping-cart',
                    },
                    {
                        label: 'Stock',
                        icon: 'pi pi-shopping-cart',
                    }
                ]
            },
            {
                label: 'User',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                icon: 'pi pi-user-edit',
                command: () => {
                    this.router.navigate(['user']);
                    this.sidebarVisible.set(false);
                }
            },
            {
                label: 'Sale',
                icon: 'pi pi-user',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                items: [
                    {
                        label: 'Sales',
                        icon: 'pi pi-cog',
                    },
                    {
                        label: 'Sales Items',
                        icon: 'pi pi-shield',
                    }
                ]
            },
            {
                label: 'Items',
                icon: 'pi pi-user',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                items: [
                    {
                        label: 'Category',
                        icon: 'pi pi-cog',
                    },
                    {
                        label: 'Items',
                        icon: 'pi pi-shield',
                    }
                ]
            },
            {
                label: 'Customer',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                icon: 'pi pi-envelope',
            },
            {
                label: 'Reports',
                visible: this.sideBarTabVisible([Role.ADMIN]),
                icon: 'pi pi-envelope',
            }
        ];
    }

    toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.items = this.toggleAllRecursive(this.items, expanded);
    }

    private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
            }
            return menuItem;
        });
    }

    private areAllItemsExpanded(): boolean {
        return this.items.every((menuItem) => menuItem.expanded);
    }

}
