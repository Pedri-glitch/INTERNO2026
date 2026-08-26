import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-credito',
  imports: [],
  templateUrl: './credito.html',
  styleUrl: './credito.css',
})
export class Credito {

  firebase = inject(FirestoreService);
  router = inject(Router);

  isLoading: boolean = false;

  errorMessage: string = '';


  async seleccionarCredito(
    tipoCredito: string,
    tasaAnual: number
  ): Promise<void> {

    this.isLoading = true;
    this.errorMessage = '';

    try {

      const clienteId = localStorage.getItem('cliente_id');

      const documento = await this.firebase.add(
        'Creditos',
        {
          cliente_id: clienteId,
          tipoCredito: tipoCredito,
          tasaAnual: tasaAnual,
          fechaSeleccion: new Date()
        }
      );


      console.log(
        'Crédito seleccionado y guardado:',
        documento.id
      );

      localStorage.setItem(
        'simulacion_id',
        documento.id
      );

      await this.router.navigate([
        '/datos-credito'
      ]);


    } catch (error) {

      console.error(
        'Error al guardar el crédito:',
        error
      );

      this.errorMessage =
        'No se pudo guardar el tipo de crédito.';

    } finally {

      this.isLoading = false;

this.router.navigate([
      '/amortizacion'
])
    }

  }

}