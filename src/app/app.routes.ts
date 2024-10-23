import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './theme/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./theme/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
        children:[
            {
                path: 'signin',
                loadComponent: () => import('./pages/sign-in/sign-in.component').then(c => c.SignInComponent)
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./theme/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
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
