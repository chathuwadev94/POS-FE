import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        // canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'terminal',
                pathMatch: 'full'
            },
            {
                path: 'terminal',
                loadComponent: () => import('./pages/payment-terminal/payment-terminal.component').then(c => c.PaymentTerminalComponent)
            }
        ]
    }
];
