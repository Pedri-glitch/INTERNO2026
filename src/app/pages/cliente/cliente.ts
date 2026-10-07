import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class Cliente implements OnInit {

  firebase = inject(FirestoreService);
  router = inject(Router);

  private changeDetector = inject(ChangeDetectorRef);


  cliente = {
    nombre: '',
    cedula: '',
    sueldo: 0,
    tipoPersona: 'Natural'
  };


  clientes: any[] = [];

  errorMessage: string = '';

  isLoading: boolean = false;

  isLoadingClientes: boolean = false;


  async ngOnInit(): Promise<void> {

    await this.cargarClientes();

  }


  async cargarClientes(): Promise<void> {

    this.isLoadingClientes = true;

    try {

      const datos =
        await this.firebase.getAll<any>('Clientes');

      this.clientes = [...datos];

      this.changeDetector.detectChanges();

    } catch (error) {

      console.error(
        'Error al cargar clientes:',
        error
      );

      this.errorMessage =
        'No se pudieron cargar los clientes.';

    } finally {

      this.isLoadingClientes = false;

      this.changeDetector.detectChanges();

    }

  }


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

      const fechaRegistro = new Date();

      const documento =
        await this.firebase.add(
          'Clientes',
          {
            nombre: this.cliente.nombre,
            cedula: this.cliente.cedula,
            sueldo: this.cliente.sueldo,
            tipoPersona: this.cliente.tipoPersona,
            fechaRegistro: fechaRegistro
          }
        );


      console.log(
        'Cliente guardado correctamente:',
        documento.id
      );


      const clienteActual = {

        id: documento.id,

        nombre: this.cliente.nombre,

        cedula: this.cliente.cedula,

        sueldo: this.cliente.sueldo,

        tipoPersona: this.cliente.tipoPersona,

        fechaRegistro: fechaRegistro.toISOString()

      };


      localStorage.setItem(
        'cliente_id',
        documento.id
      );


      localStorage.setItem(
        'cliente',
        JSON.stringify(clienteActual)
      );


      console.log(
        'Cliente guardado en localStorage:',
        clienteActual
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


  async eliminarCliente(id: string): Promise<void> {

    const confirmar =
      confirm(
        '¿Estás seguro de que deseas eliminar este cliente?'
      );


    if (!confirmar) {
      return;
    }


    try {

      await this.firebase.delete(
        'Clientes',
        id
      );


      this.clientes =
        this.clientes.filter(
          cliente =>
            cliente.id !== id
        );

      const clienteActualId =
        localStorage.getItem('cliente_id');


      if (clienteActualId === id) {

        localStorage.removeItem(
          'cliente_id'
        );

        localStorage.removeItem(
          'cliente'
        );

      }


      this.changeDetector.detectChanges();


      console.log(
        'Cliente eliminado correctamente:',
        id
      );


    } catch (error) {

      console.error(
        'Error al eliminar cliente:',
        error
      );


      this.errorMessage =
        'No se pudo eliminar el cliente.';


      this.changeDetector.detectChanges();

    }

  }


  volverInicio(): void {

    this.router.navigate([
      '/inicio'
    ]);

  }

}