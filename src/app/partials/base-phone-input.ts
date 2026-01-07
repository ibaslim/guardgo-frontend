import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { COUNTRY_CODES, CountryCode } from './country-codes';

export interface PhoneValue {
  countryCode: string;
  dialCode: string;
  nationalNumber: string;
}

@Component({
  selector: 'app-base-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <div class="flex gap-2">
        <!-- Country Code Selector -->
        <div class="relative" style="width: 140px;">
          <button
            type="button"
            [disabled]="disabled"
            (click)="toggleDropdown()"
            [class]="countryButtonClasses"
          >
            <span class="text-lg mr-1">{{ selectedCountry.flag }}</span>
            <span class="text-sm">{{ selectedCountry.dialCode }}</span>
            <svg class="ml-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          @if (isDropdownOpen) {
            <div class="absolute z-10 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              <!-- Search Input -->
              <div class="p-2 border-b border-gray-200">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (input)="filterCountries()"
                  placeholder="Search country..."
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <!-- Country List -->
              <div class="overflow-y-auto max-h-48">
                @for (country of filteredCountries; track country.code) {
                  <button
                    type="button"
                    (click)="selectCountry(country)"
                    class="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 transition duration-150"
                  >
                    <span class="text-lg">{{ country.flag }}</span>
                    <span class="text-sm text-gray-700 flex-1">{{ country.name }}</span>
                    <span class="text-sm text-gray-500">{{ country.dialCode }}</span>
                  </button>
                }
                @if (filteredCountries.length === 0) {
                  <div class="px-3 py-2 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                }
              </div>
            </div>
          }
        </div>
        
        <!-- Phone Number Input -->
        <div class="flex-1">
          <input
            type="tel"
            [placeholder]="placeholder"
            [required]="required"
            [disabled]="disabled"
            [readonly]="readonly"
            [value]="phoneValue.nationalNumber"
            (input)="onPhoneInput($event)"
            (blur)="onTouched()"
            [class]="inputClasses"
          />
        </div>
      </div>
      
      @if (hint) {
        <p class="mt-1 text-xs text-gray-500">{{ hint }}</p>
      }
      @if (error) {
        <p class="mt-1 text-xs text-red-600">{{ error }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BasePhoneInput),
      multi: true
    }
  ]
})
export class BasePhoneInput implements ControlValueAccessor {
  @Input() id = `phone-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = 'Enter phone number';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() hint = '';
  @Input() error = '';

  phoneValue: PhoneValue = {
    countryCode: 'US',
    dialCode: '+1',
    nationalNumber: ''
  };

  countries = COUNTRY_CODES;
  filteredCountries = COUNTRY_CODES;
  selectedCountry: CountryCode = COUNTRY_CODES[0];
  isDropdownOpen = false;
  searchQuery = '';

  onChange: (value: PhoneValue) => void = () => {};
  onTouched: () => void = () => {};

  get countryButtonClasses(): string {
    const baseClasses = 'flex items-center justify-between w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition duration-150';
    const stateClasses = this.disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
      : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 cursor-pointer';
    
    return `${baseClasses} ${stateClasses}`;
  }

  get inputClasses(): string {
    const baseClasses = 'appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm transition duration-150';
    const stateClasses = this.disabled 
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
      : this.readonly
      ? 'bg-gray-50 text-gray-700 border-gray-200'
      : this.error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-blue-500 focus:border-blue-500';
    
    return `${baseClasses} ${stateClasses}`;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen) {
        this.searchQuery = '';
        this.filteredCountries = this.countries;
      }
    }
  }

  filterCountries(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.phoneValue.countryCode = country.code;
    this.phoneValue.dialCode = country.dialCode;
    this.isDropdownOpen = false;
    this.onChange(this.phoneValue);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.phoneValue.nationalNumber = input.value;
    this.onChange(this.phoneValue);
  }

  writeValue(value: PhoneValue): void {
    if (value) {
      this.phoneValue = value;
      const country = this.countries.find(c => c.code === value.countryCode);
      if (country) {
        this.selectedCountry = country;
      }
    }
  }

  registerOnChange(fn: (value: PhoneValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
