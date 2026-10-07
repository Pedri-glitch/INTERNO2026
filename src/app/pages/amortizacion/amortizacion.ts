import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amortizacion',
  imports: [],
  templateUrl: './amortizacion.html',
  styleUrl: './amortizacion.css',
})
export class Amortizacion {

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router
  ) {}

  seleccionarAmortizacion(opcion: number): void {

    this.errorMessage = '';
    this.isLoading = true;

    const sistemas = [

      {
        nombre: 'Francés',
        tipo: 'frances'
      },

      {
        nombre: 'Alemán',
        tipo: 'aleman'
      }

    ];

    const sistemaSeleccionado = sistemas[opcion];


    if (!sistemaSeleccionado) {

      this.isLoading = false;

      this.errorMessage =
        'No se pudo seleccionar el sistema de amortización.';

      return;

    }

    localStorage.setItem(
      'amortizacionSeleccionada',
      JSON.stringify(sistemaSeleccionado)
    );


    console.log(
      'Sistema guardado en localStorage:',
      sistemaSeleccionado
    );

    this.router.navigate([
      '/simulador'
    ]);

  }

  volver(): void {

    this.router.navigate([
      '/credito'
    ]);

  }

}