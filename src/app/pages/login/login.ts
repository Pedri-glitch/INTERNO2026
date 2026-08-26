import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  firebase = inject(FirestoreService);

  private fb = inject(FormBuilder);

  private router = inject(Router);

  successMessage: string = '';
  errorMessage: string = '';

  cargando: boolean = false;

  loginForm = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  async onSubmit(): Promise<void> {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.errorMessage =
        'Por favor, completa correctamente todos los campos.';

      return;
    }


    this.cargando = true;


    try {

      const emailIngresado =
        this.email.value.trim();

      const passwordIngresada =
        this.password.value;

      console.log('Email ingresado:', emailIngresado);

      const usuarios =
        await this.firebase.getAll<any>('Login');


      console.log('Usuarios encontrados en Firestore:', usuarios);

      const usuarioEncontrado =
        usuarios.find(usuario =>

          usuario.Email === emailIngresado &&
          usuario.Password === passwordIngresada

        );

      if (usuarioEncontrado) {

        console.log(
          'Usuario encontrado:',
          usuarioEncontrado
        );

        this.successMessage =
          'Inicio de sesión exitoso.';

        localStorage.setItem(
          'usuario',
          JSON.stringify(usuarioEncontrado)
        );

        await this.router.navigate([
          '/inicio'
        ]);

      }

      else {

        this.errorMessage =
          'El correo o la contraseña son incorrectos.';
      }
    }

    catch (error) {

      console.error(
        'Error al consultar Firestore:',
        error
      );

      this.errorMessage =
        'No se pudo conectar con la base de datos.';

    }
    
    finally {
      this.cargando = false;
    }

  }

}