import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-resultado',
  imports: [CommonModule],
  templateUrl: './resultado.html',
  styleUrl: './resultado.css'
})
export class Resultado implements OnInit {

  cliente: any = null;
  credito: any = null;
  amortizacion: any = null;
  simulacion: any = null;

  tablaAmortizacion: any[] = [];

  fecha: string = '';

  modoHistorial: boolean = false;

  isSaving: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private firebase: FirestoreService
  ) {}

  ngOnInit(): void {

    this.cargarDatos();

    if (!this.modoHistorial) {

      this.fecha = new Date().toLocaleDateString(
        'es-EC',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );

      if (
        this.credito &&
        this.amortizacion &&
        this.simulacion
      ) {

        this.generarAmortizacion();

      }

    }

  }

  cargarDatos(): void {

    const simulacionHistorial =
      localStorage.getItem('simulacionHistorial');

    if (simulacionHistorial) {

      const datos =
        JSON.parse(simulacionHistorial);

      this.modoHistorial = true;

      this.cliente = datos.cliente;

      this.credito = datos.credito;

      this.amortizacion =
        datos.amortizacion;

      this.simulacion =
        datos.simulacion;

      this.fecha =
        datos.fecha;

      this.tablaAmortizacion =
        datos.tablaAmortizacion || [];

      console.log(
        'Simulación cargada desde historial:',
        datos
      );

      return;
    }

    const clienteGuardado =
      localStorage.getItem('cliente');

    if (clienteGuardado) {

      this.cliente =
        JSON.parse(clienteGuardado);

    }


    const creditoGuardado =
      localStorage.getItem('creditoSeleccionado');

    if (creditoGuardado) {

      this.credito =
        JSON.parse(creditoGuardado);

    }


    const amortizacionGuardada =
      localStorage.getItem('amortizacionSeleccionada');

    if (amortizacionGuardada) {

      this.amortizacion =
        JSON.parse(amortizacionGuardada);

    }


    const simulacionGuardada =
      localStorage.getItem('datosSimulacion');

    if (simulacionGuardada) {

      this.simulacion =
        JSON.parse(simulacionGuardada);

    }

  }

  generarAmortizacion(): void {

    this.tablaAmortizacion = [];

    if (
      this.amortizacion.tipo === 'frances'
    ) {

      this.calcularSistemaFrances();

    }

    else if (
      this.amortizacion.tipo === 'aleman'
    ) {

      this.calcularSistemaAleman();

    }

  }

  obtenerConfiguracionPago(): {
    periodosPorAnio: number,
    mesesPorPeriodo: number
  } {

    switch (
      this.simulacion.formaPago
    ) {

      case 'mensual':

        return {
          periodosPorAnio: 12,
          mesesPorPeriodo: 1
        };


      case 'bimestral':

        return {
          periodosPorAnio: 6,
          mesesPorPeriodo: 2
        };


      case 'trimestral':

        return {
          periodosPorAnio: 4,
          mesesPorPeriodo: 3
        };


      case 'semestral':

        return {
          periodosPorAnio: 2,
          mesesPorPeriodo: 6
        };


      case 'anual':

        return {
          periodosPorAnio: 1,
          mesesPorPeriodo: 12
        };


      default:

        return {
          periodosPorAnio: 12,
          mesesPorPeriodo: 1
        };

    }

  }

  calcularSistemaFrances(): void {

    const capitalInicial =
      Number(this.simulacion.monto);

    const configuracion =
      this.obtenerConfiguracionPago();

    const numeroPeriodos =
      Number(this.simulacion.plazoAnios) *
      configuracion.periodosPorAnio;

    const tasaPeriodo =
      (
        Number(this.credito.tasaAnual) / 100
      ) /
      configuracion.periodosPorAnio;

    const cuota =
      capitalInicial *
      (
        (
          tasaPeriodo *
          Math.pow(
            1 + tasaPeriodo,
            numeroPeriodos
          )
        ) /
        (
          Math.pow(
            1 + tasaPeriodo,
            numeroPeriodos
          ) - 1
        )
      );

    let saldo =
      capitalInicial;


    for (
      let periodo = 1;
      periodo <= numeroPeriodos;
      periodo++
    ) {

      const interes =
        saldo *
        tasaPeriodo;

      let capital =
        cuota -
        interes;

      let cuotaFinal =
        cuota;

      if (
        periodo === numeroPeriodos
      ) {

        capital =
          saldo;

        cuotaFinal =
          capital +
          interes;

      }


      saldo =
        saldo -
        capital;


      if (
        saldo < 0.01
      ) {

        saldo = 0;

      }


      this.tablaAmortizacion.push({

        periodo: periodo,

        saldo: saldo,

        capital: capital,

        interes: interes,

        cuota: cuotaFinal

      });

    }

  }

  calcularSistemaAleman(): void {

    const capitalInicial =
      Number(this.simulacion.monto);

    const configuracion =
      this.obtenerConfiguracionPago();

    const numeroPeriodos =
      Number(this.simulacion.plazoAnios) *
      configuracion.periodosPorAnio;

    const tasaPeriodo =
      (
        Number(this.credito.tasaAnual) / 100
      ) /
      configuracion.periodosPorAnio;

    const capitalFijo =
      capitalInicial /
      numeroPeriodos;

    let saldo =
      capitalInicial;


    for (
      let periodo = 1;
      periodo <= numeroPeriodos;
      periodo++
    ) {

      const interes =
        saldo *
        tasaPeriodo;

      let capital =
        capitalFijo;

      if (
        periodo === numeroPeriodos
      ) {

        capital =
          saldo;

      }

      const cuota =
        capital +
        interes;


      saldo =
        saldo -
        capital;


      if (
        saldo < 0.01
      ) {

        saldo = 0;

      }

      this.tablaAmortizacion.push({

        periodo: periodo,

        saldo: saldo,

        capital: capital,

        interes: interes,

        cuota: cuota

      });

    }

  }

  async guardar(): Promise<void> {

    if (this.isSaving) {

      return;

    }

    if (
      !this.cliente ||
      !this.credito ||
      !this.amortizacion ||
      !this.simulacion
    ) {

      this.errorMessage =
        'No se encontraron todos los datos de la simulación.';

      return;

    }

    this.isSaving = true;

    this.errorMessage = '';


    try {

      const simulacionCompleta = {

        cliente: this.cliente,

        credito: this.credito,

        amortizacion:
          this.amortizacion,

        simulacion:
          this.simulacion,

        fecha:
          this.fecha,

        tablaAmortizacion:
          this.tablaAmortizacion

      };

      const documento =
        await this.firebase.add(
          'Simulaciones',
          simulacionCompleta
        );

      console.log(
        'SIMULACIÓN GUARDADA:',
        documento.id
      );

      const comprobacion =
        await this.firebase.getAll<any>(
          'Simulaciones'
        );

      console.log(
        'SIMULACIONES DESPUÉS DE GUARDAR:',
        comprobacion
      );

      console.log(
        'CANTIDAD DESPUÉS DE GUARDAR:',
        comprobacion.length
      );

      await this.router.navigate([
        '/inicio'
      ]);

    }

    catch (error) {

      console.error(
        'Error al guardar la simulación:',
        error
      );


      this.errorMessage =
        'No se pudo guardar la simulación. Inténtalo nuevamente.';

    }

    finally {

      this.isSaving = false;

    }

  }

  imprimir(): void {

    window.print();

  }

  volver(): void {

    if (this.modoHistorial) {

      this.router.navigate([
        '/historial'
      ]);

    }

    else {

      this.router.navigate([
        '/simulador'
      ]);

    }

  }

}
