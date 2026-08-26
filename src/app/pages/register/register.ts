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

    // 1. Comprobar campos vacíos
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    // 2. Comprobar contraseñas
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // 3. Comprobar longitud de contraseña
    if (this.password.length < 6) {
      this.errorMessage =
        'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    try {

      // 4. Obtener usuarios existentes
      const usuarios = await this.firebase.getAll<any>('Login');

      // 5. Comprobar si el correo ya existe
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

      // 6. Crear nuevo usuario
      await this.firebase.add('Login', {
        Name: this.name,
        Email: this.email,
        Password: this.password
      });

      // 7. Mostrar mensaje
      this.successMessage =
        'Cuenta creada correctamente.';

      // 8. Esperar un momento y regresar al Login
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