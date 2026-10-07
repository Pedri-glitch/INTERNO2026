import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {

  firebase = inject(FirestoreService);
  router = inject(Router);

  private changeDetector = inject(ChangeDetectorRef);

  simulaciones: any[] = [];

  errorMessage: string = '';
  isLoading: boolean = false;


  async ngOnInit(): Promise<void> {

    await this.cargarHistorial();

  }


  async cargarHistorial(): Promise<void> {

    this.isLoading = true;
    this.errorMessage = '';

    try {

      const datos =
        await this.firebase.getAll<any>('Simulaciones');

      this.simulaciones = [...datos];

      this.changeDetector.detectChanges();

    }

    catch (error) {

      console.error(
        'Error al cargar historial:',
        error
      );

      this.errorMessage =
        'No se pudieron cargar las simulaciones.';

    }

    finally {

      this.isLoading = false;

      this.changeDetector.detectChanges();

    }

  }


  verSimulacion(simulacion: any): void {

    localStorage.setItem(
      'simulacionHistorial',
      JSON.stringify(simulacion)
    );

    this.router.navigate([
      '/resultado'
    ]);

  }


  async eliminarSimulacion(id: string): Promise<void> {

    const confirmar =
      confirm(
        '¿Estás seguro de que deseas eliminar esta simulación?'
      );

    if (!confirmar) {

      return;

    }

    try {

      await this.firebase.delete(
        'Simulaciones',
        id
      );

      this.simulaciones =
        this.simulaciones.filter(
          simulacion =>
            simulacion.id !== id
        );

      this.changeDetector.detectChanges();

    }

    catch (error) {

      console.error(
        'Error al eliminar simulación:',
        error
      );

      this.errorMessage =
        'No se pudo eliminar la simulación.';

      this.changeDetector.detectChanges();

    }

  }


  volverInicio(): void {

    this.router.navigate([
      '/inicio'
    ]);

  }

}