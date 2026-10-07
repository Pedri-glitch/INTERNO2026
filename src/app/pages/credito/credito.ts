
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-credito',
  imports: [],
  templateUrl: './credito.html',
  styleUrl: './credito.css',
})
export class Credito {
onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
subirImagen() {
throw new Error('Method not implemented.');
}

  volverInicio(): void {
    this.router.navigate(['/inicio']);
  }

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router
  ) {}

  tipoDeCredito(opcion: number): void {

    localStorage.removeItem('simulacionHistorial');
    this.errorMessage = '';
    this.isLoading = true;

    const creditos = [

      {
        nombre: 'Microcrédito',
        tasaAnual: 8.60
      },

      {
        nombre: 'Consumo',
        tasaAnual: 16.77
      },

      {
        nombre: 'PYME',
        tasaAnual: 10.19
      }

    ];

    const creditoSeleccionado = creditos[opcion];

    if (!creditoSeleccionado) {

      this.isLoading = false;

      this.errorMessage =
        'No se pudo seleccionar el tipo de crédito.';

      return;

    }

    localStorage.setItem(
      'creditoSeleccionado',
      JSON.stringify(creditoSeleccionado)
    );

    console.log(
      'Crédito guardado en localStorage:',
      creditoSeleccionado
    );

    this.router.navigate([
      '/amortizacion'
    ]);

  }

}

