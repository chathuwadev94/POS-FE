import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './core/enums/auth/role.enum';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./theme/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },
            {
                path: 'sign-in',
                loadComponent: () => import('./pages/sign-in/sign-in.component').then(c => c.SignInComponent)
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./theme/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'terminal',
                pathMatch: 'full'
            },
            {
                path: 'terminal',
                loadComponent: () => import('./pages/payment-terminal/payment-terminal.component').then(c => c.PaymentTerminalComponent),
                canActivate: [RoleGuard],
                data: {
                    roles: [Role.DEFAULT, Role.CASHIER]
                }
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
                canActivate: [RoleGuard],
                data: {
                    roles: [Role.ADMIN]
                }
            },
            {
                path: 'user',
                loadComponent: () => import('./pages/user/user.component').then(c => c.UserComponent),
                canActivate: [RoleGuard],
                data: {
                    roles: [Role.ADMIN]
                }
            }
        ]
    },
    {
        path: '**',
        children: [
            {
                path: '**',
                redirectTo: '404',
                pathMatch: 'full'
            },
            {
                path: '404',
                loadComponent: () => import('./pages/404/notfound.component').then(c => c.NotfoundComponent)
            },
        ]

    }
];
