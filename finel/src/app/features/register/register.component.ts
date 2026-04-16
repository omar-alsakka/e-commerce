import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registerForm: FormGroup = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
    rePassword: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, { validators: [this.confirmPassword] });

  confirmPassword(group: AbstractControl) {
    const password = group.get("password")?.value;
    const rePassword = group.get("rePassword")?.value;
    if (password !== rePassword && rePassword !== "") {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.message === "success") {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
