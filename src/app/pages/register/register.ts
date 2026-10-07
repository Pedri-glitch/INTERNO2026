import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  firebase = inject(FirestoreService);
  router = inject(Router);

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  async onRegister() {

    this.errorMessage = '';
    this.successMessage = '';


    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }


    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }


    if (this.password.length < 6) {
      this.errorMessage =
        'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    try {


      const usuarios = await this.firebase.getAll<any>('Login');


      const usuarioExistente = usuarios.find(
        usuario =>
          usuario.Email?.toLowerCase() ===
          this.email.toLowerCase()
      );

      if (usuarioExistente) {
        this.errorMessage =
          'Este correo ya está registrado.';
        return;
      }


      await this.firebase.add('Login', {
        Name: this.name,
        Email: this.email,
        Password: this.password
      });


      this.successMessage =
        'Cuenta creada correctamente.';


        setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);

    } catch (error) {

      console.error(
        'Error al registrar usuario:',
        error
      );

      this.errorMessage =
        'No se pudo crear la cuenta.';
    }
  }
}