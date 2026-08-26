import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class Cliente {

  firebase = inject(FirestoreService);
  router = inject(Router);


  cliente = {
    nombre: '',
    cedula: '',
    sueldo: 0,
    tipoPersona: 'Natural'
  };


  errorMessage: string = '';

  isLoading: boolean = false;


  async continuar(): Promise<void> {

    this.errorMessage = '';

    if (this.isLoading) {
      return;
    }

    if (!this.cliente.nombre.trim()) {

      this.errorMessage =
        'Por favor, ingresa el nombre del cliente.';

      return;
    }

    if (!this.cliente.cedula.trim()) {

      this.errorMessage =
        'Por favor, ingresa la cédula o identificación.';

      return;
    }


    if (this.cliente.cedula.length !== 10) {

      this.errorMessage =
        'La cédula debe tener 10 dígitos.';

      return;
    }

    if (this.cliente.sueldo <= 0) {

      this.errorMessage =
        'El sueldo debe ser mayor a $0.';

      return;
    }

    this.isLoading = true;

    try {

      const documento =
        await this.firebase.add(
          'Clientes',
          {
            nombre: this.cliente.nombre,
            cedula: this.cliente.cedula,
            sueldo: this.cliente.sueldo,
            tipoPersona: this.cliente.tipoPersona,
            fechaRegistro: new Date()
          }
        );

      console.log(
        'Cliente guardado correctamente:',
        documento.id
      );

      localStorage.setItem(
        'cliente_id',
        documento.id
      );

      localStorage.setItem(
        'cliente',
        JSON.stringify(this.cliente)
      );

      await this.router.navigate([
        '/inicio'
      ]);


    } catch (error) {

      console.error(
        'Error al guardar cliente:',
        error
      );

      this.errorMessage =
        'No se pudo guardar la información del cliente.';

    } finally {

      this.isLoading = false;

    }

  }

}