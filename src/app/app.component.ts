import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterOutlet } from '@angular/router';

// ✅ Interfaces
export interface Social {
  platform: 'Facebook' | 'Twitter' | 'LinkedIn' | 'YouTube';
  email: string;
  username: string;
  channelName?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  dob: Date;
  age: number;
  address: string;
  city: string;
  pincode: number;
  pan: string;
  gender: 'male' | 'female';
  education: string[];
  salary: number;
  social: Social[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: this.fb.control<string>('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastName: this.fb.control<string>('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      dob: this.fb.control<Date | null>(null, [Validators.required]),
      age: this.fb.control<number>(0),
      address: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      city: this.fb.control<string>('', [Validators.required]),
      pincode: this.fb.control<number | null>(null, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
      pan: this.fb.control<string>('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
      gender: this.fb.control<'male' | 'female'>('male', [Validators.required]),
      education: this.fb.control<string[]>([], [Validators.required]),
      salary: this.fb.control<number>(0, [Validators.required]),
      social: this.fb.array<FormGroup>([]),
    });

    // Auto age calculation
    this.userForm.get('dob')?.valueChanges.subscribe((dobValue) => {
      if (dobValue) {
        const today = new Date();
        const birthDate = new Date(dobValue);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        this.userForm.patchValue({ age }, { emitEvent: false });
      }
    });
  }

  // Get Social FormArray
  get socialArray(): FormArray<FormGroup> {
    return this.userForm.get('social') as FormArray<FormGroup>;
  }

  // Add social form group
  addSocial(): void {
    const socialGroup = this.fb.group({
      platform: this.fb.control<'Facebook' | 'Twitter' | 'LinkedIn' | 'YouTube'>('Facebook'),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      username: this.fb.control<string>('', [Validators.required]),
      channelName: this.fb.control<string>(''),
    });
    this.socialArray.push(socialGroup);
  }

  removeSocial(index: number): void {
    this.socialArray.removeAt(index);
  }

  toggleEducation(event: any, edu: string) {
    const current = this.userForm.get('education')?.value || [];
    if (event.target.checked) current.push(edu);
    else current.splice(current.indexOf(edu), 1);
    this.userForm.patchValue({ education: current });
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    console.log('✅ User Form Data:', this.userForm.getRawValue());
    alert('Form submitted successfully!');
  }
}