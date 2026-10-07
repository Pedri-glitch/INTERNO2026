import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-simulador',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './simulador.html',
  styleUrl: './simulador.css',
})

export class Simulador implements OnInit {
  cdr = inject(ChangeDetectorRef)

  firebase = inject(FirestoreService);

  users: any[] = [];

  cliente: any = null;

  clienteSeleccionadoId: string = '';


  credito: any = null;

  amortizacion: any = null;


  monto: number | null = null;

  plazo: number = 1;

  formaPago: string = 'mensual';



  errorMessage: string = '';

  isLoading: boolean = false;


  constructor(
    private router: Router
  ) {}


  async ngOnInit(): Promise<void> {

    try {

      this.users =
        await this.firebase.getAll<any>(
          'Clientes'
        );

      console.log(
        'Clientes encontrados:',
        this.users
      );

    } catch (error) {

      console.error(
        'Error al obtener los clientes:',
        error
      );

      this.errorMessage =
        'No se pudieron cargar los clientes.';

    }

    const creditoGuardado =
      localStorage.getItem(
        'creditoSeleccionado'
      );


    if (creditoGuardado) {

      this.credito =
        JSON.parse(
          creditoGuardado
        );

    }

    const amortizacionGuardada =
      localStorage.getItem(
        'amortizacionSeleccionada'
      );


    if (amortizacionGuardada) {

      this.amortizacion =
        JSON.parse(
          amortizacionGuardada
        );

    }

    this.cdr.detectChanges();
  
  }

  seleccionarCliente(): void {

    const clienteEncontrado =
      this.users.find(
        cliente =>
          cliente.id ===
          this.clienteSeleccionadoId
      );


    if (clienteEncontrado) {

      this.cliente =
        clienteEncontrado;

      localStorage.setItem(
        'cliente',
        JSON.stringify(
          this.cliente
        )
      );


      localStorage.setItem(
        'cliente_id',
        this.cliente.id
      );


      console.log(
        'Cliente seleccionado:',
        this.cliente
      );

    }

  }

  calcular(): void {

    this.errorMessage = '';

    if (!this.cliente) {

      this.errorMessage =
        'Selecciona un cliente antes de realizar la simulación.';

      return;

    }

    if (
      !this.monto ||
      this.monto <= 0
    ) {

      this.errorMessage =
        'Ingresa un monto válido.';

      return;

    }

    if (this.cliente.sueldo) {

      const montoMaximo =
        Number(this.cliente.sueldo) * 0.45;


      if (
        this.monto >
        montoMaximo
      ) {

        this.errorMessage =
          `El monto solicitado no puede superar $${montoMaximo.toFixed(2)}.`;

        return;

      }

    }

    const datosSimulacion = {

      cliente: this.cliente,

      clienteId:
        this.cliente.id,

      credito:
        this.credito,

      amortizacion:
        this.amortizacion,

      monto:
        this.monto,

      plazoAnios:
        this.plazo,

      formaPago:
        this.formaPago

    };


    localStorage.setItem(
      'datosSimulacion',
      JSON.stringify(
        datosSimulacion
      )
    );


    console.log(
      'Datos guardados:',
      datosSimulacion
    );


    this.router.navigate([
      '/resultado'
    ]);

  }

  volver(): void {

    this.router.navigate([
      '/amortizacion'
    ]);

  }
}