import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {

  nombreCliente: string = '';

  hayCliente: boolean = false;


  constructor(private router: Router) {}


  ngOnInit(): void {
    

    const datosCliente =
      localStorage.getItem('cliente');


    if (datosCliente) {

      const cliente =
        JSON.parse(datosCliente);

      if (cliente && cliente.nombre) {

        this.nombreCliente =
          cliente.nombre;

        this.hayCliente =
          true;

      }

    }

  }

  crearCliente(): void {

    this.router.navigate([
      '/cliente'
    ]);

  }

  nuevaSimulacion(): void {

    this.router.navigate([
      '/credito'
    ]);

  }

  verHistorial(): void {

    this.router.navigate([
      '/historial'
    ]);

  }

  cerrarSesion(): void {

    localStorage.removeItem('cliente');
    localStorage.removeItem('cliente_id');

    localStorage.removeItem('creditoSeleccionado');
    localStorage.removeItem('amortizacionSeleccionada');
    localStorage.removeItem('datosSimulacion');

    this.router.navigate([
      '/login'
    ]);

  }

}