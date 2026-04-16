import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TranslatePipe],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  formData = {
    fullName: '',
    email: '',
    subject: '',
    message: '',
  };

  subjects = [
    'Order Issue',
    'Payment Problem',
    'Product Return / Refund',
    'Shipping & Delivery',
    'Account Issue',
    'Technical Support',
    'Product Inquiry',
    'Feedback & Suggestions',
    'Other',
  ];

  submitted = false;

  onSubmit() {
    if (
      this.formData.fullName &&
      this.formData.email &&
      this.formData.subject &&
      this.formData.message
    ) {
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
        this.formData = { fullName: '', email: '', subject: '', message: '' };
      }, 3000);
    }
  }
}
