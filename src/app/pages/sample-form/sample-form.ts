import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  BaseInput,
  BaseCheckbox,
  BaseRadio,
  BaseDropdown,
  BaseMultiSelect,
  BasePhoneInput,
  BaseTextArea,
  RadioOption,
  DropdownOption,
  MultiSelectOption,
  PhoneValue
} from '../../partials';

@Component({
  selector: 'app-sample-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BaseInput,
    BaseCheckbox,
    BaseRadio,
    BaseDropdown,
    BaseMultiSelect,
    BasePhoneInput,
    BaseTextArea
  ],
  templateUrl: './sample-form.html',
  styleUrl: './sample-form.css',
})
export class SampleForm {
  // Form field values
  fullName = '';
  email = '';
  password = '';
  readonlyField = 'This is a readonly field';
  agreeToTerms = false;
  subscribeNewsletter = false;
  gender = '';
  country = '';
  interests: string[] = [];
  phone: PhoneValue = {
    countryCode: 'US',
    dialCode: '+1',
    nationalNumber: ''
  };
  bio = '';

  // Form state
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Dropdown options
  genderOptions: RadioOption[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  countryOptions: DropdownOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'se', label: 'Sweden' }
  ];

  interestOptions: MultiSelectOption[] = [
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'music', label: 'Music & Concerts' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'technology', label: 'Technology & Gadgets' },
    { value: 'reading', label: 'Reading & Literature' },
    { value: 'cooking', label: 'Cooking & Culinary Arts' },
    { value: 'photography', label: 'Photography & Visual Arts' },
    { value: 'gaming', label: 'Gaming & Esports' },
    { value: 'movies', label: 'Movies & Cinema' },
    { value: 'art', label: 'Art & Painting' },
    { value: 'dance', label: 'Dance & Performance' },
    { value: 'yoga', label: 'Yoga & Meditation' },
    { value: 'hiking', label: 'Hiking & Outdoor Activities' },
    { value: 'cycling', label: 'Cycling & Biking' },
    { value: 'swimming', label: 'Swimming & Water Sports' },
    { value: 'gardening', label: 'Gardening & Plants' },
    { value: 'fashion', label: 'Fashion & Style' },
    { value: 'writing', label: 'Writing & Blogging' },
    { value: 'volunteering', label: 'Volunteering & Community Service' },
    { value: 'science', label: 'Science & Research' }
  ];

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'You must agree to the terms and conditions';
      return;
    }

    // Simulate form submission
    this.isSubmitting = true;
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Form submitted successfully!';
      
      // Log form data to console
      console.log('Form Data:', {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        agreeToTerms: this.agreeToTerms,
        subscribeNewsletter: this.subscribeNewsletter,
        gender: this.gender,
        country: this.country,
        interests: this.interests,
        phone: this.phone,
        bio: this.bio
      });
    }, 1500);
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.agreeToTerms = false;
    this.subscribeNewsletter = false;
    this.gender = '';
    this.country = '';
    this.interests = [];
    this.phone = {
      countryCode: 'US',
      dialCode: '+1',
      nationalNumber: ''
    };
    this.bio = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
