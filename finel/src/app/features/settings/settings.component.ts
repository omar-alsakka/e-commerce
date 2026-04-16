import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  isLoadingProfile = signal(false);
  isLoadingPassword = signal(false);
  
  userName = this.authService.userName;
  userEmail = this.authService.userEmail;

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      rePassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private loadUserData(): void {
    const userJson = localStorage.getItem('freshUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('rePassword')?.value
      ? null : { 'mismatch': true };
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoadingProfile.set(true);
      this.authService.updateUserData(this.profileForm.value).subscribe({
        next: (res) => {
          this.isLoadingProfile.set(false);
          if (res.message === 'success') {
            this.toastr.success(this.translate.instant('SETTINGS.PROFILE_SUCCESS'));

            const user = JSON.parse(localStorage.getItem('freshUser') || '{}');
            const updatedUser = { ...user, ...this.profileForm.value };
            localStorage.setItem('freshUser', JSON.stringify(updatedUser));
            this.authService.userName.set(updatedUser.name);
            this.authService.userEmail.set(updatedUser.email);
          }
        },
        error: (err) => {
          this.isLoadingProfile.set(false);
          this.toastr.error(err.error?.message || this.translate.instant('SETTINGS.PROFILE_FAILED'));
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoadingPassword.set(true);
      this.authService.updateUserPassword(this.passwordForm.value).subscribe({
        next: (res) => {
          this.isLoadingPassword.set(false);
          if (res.message === 'success') {
            this.toastr.success(this.translate.instant('SETTINGS.PASSWORD_SUCCESS'));
            this.passwordForm.reset();

            if (res.token) {
              localStorage.setItem('freshToken', res.token);
            }
          }
        },
        error: (err) => {
          this.isLoadingPassword.set(false);
          this.toastr.error(err.error?.message || this.translate.instant('SETTINGS.PASSWORD_FAILED'));
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
