import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cliente } from './pages/cliente/cliente';
import { Inicio } from './pages/inicio/inicio';
import { Credito } from './pages/credito/credito';
import { Amortizacion } from './pages/amortizacion/amortizacion';
import { Simulador } from './pages/simulador/simulador';
import { Resultado } from './pages/resultado/resultado';
import { Historial } from "./pages/historial/historial";


export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'historial', component: Historial},
    {path: 'cliente', component: Cliente},
    {path: 'inicio', component: Inicio},
    {path: 'credito', component: Credito},
    {path: 'amortizacion', component: Amortizacion},
    {path: 'simulador', component: Simulador},
    {path: 'resultado', component: Resultado},
    
]
