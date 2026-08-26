import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {

  nombreCliente: string = 'Cliente';


  constructor(private router: Router) {}


  ngOnInit(): void {
    window.localStorage.setItem("nombre", "pedro")
    let test = window.localStorage.getItem("nombre")
    console.log(test)

    const datosCliente =
      localStorage.getItem('cliente');

    if (datosCliente) {

      const cliente =
        JSON.parse(datosCliente);

      this.nombreCliente =
        cliente.nombre || 'Cliente';

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

    this.router.navigate([
      '/login'
    ]);

  }

}