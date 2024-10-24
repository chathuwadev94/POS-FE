import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, DoCheck, model } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        PrimengModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy, DoCheck {

    sidebarVisible = model(false);
    items: MenuItem[] = [];
    shopName:string='K Super Mart'

    ngOnChanges(changes: SimpleChanges): void {
    }
    

    ngOnInit(): void {
        this.items = [
            {
                label: 'Casheir',
                icon: 'pi pi-desktop'
            },
            {
                label: 'Dashboard',
                icon: 'pi pi-chart-line',
            },
            {
                label: 'Warehouse',
                icon: 'pi pi-home',
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
                icon: 'pi pi-user-edit',
            },
            {
                label: 'Sale',
                icon: 'pi pi-user',
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
                icon: 'pi pi-envelope',
            },
            {
                label: 'Reports',
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

    ngDoCheck(): void {
    }

    ngOnDestroy(): void {

    }
}
