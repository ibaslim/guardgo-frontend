import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-base-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label [for]="id" class="block text-sm font-medium text-gray-700 mb-2">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <div class="relative">
        <select
          [id]="id"
          [required]="required"
          [disabled]="disabled"
          [value]="value"
          (change)="onChange($event)"
          (blur)="onTouched()"
          [class]="selectClasses"
          [attr.aria-label]="label || placeholder"
          [attr.aria-required]="required"
          [attr.aria-invalid]="!!error"
        >
          @if (placeholder) {
            <option value="" disabled [selected]="!value">{{ placeholder }}</option>
          }
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
      @if (hint) {
        <p class="mt-1.5 text-xs text-gray-500">{{ hint }}</p>
      }
      @if (error) {
        <p class="mt-1.5 text-xs text-red-600 flex items-center">
          <svg class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseDropdown),
      multi: true
    }
  ]
})
export class BaseDropdown implements ControlValueAccessor {
  @Input() id = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() options: DropdownOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';

  value = '';
  onChangeCallback: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get selectClasses(): string {
    const baseClasses = 'appearance-none relative block w-full px-4 py-2.5 pr-10 border rounded-lg shadow-sm focus:outline-none sm:text-sm transition-all duration-200 bg-white';
    const stateClasses = this.disabled
      ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200 opacity-75'
      : this.error
      ? 'border-red-300 text-red-900 focus:ring-2 focus:ring-red-100 focus:border-red-500'
      : 'border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500';
    
    return `${baseClasses} ${stateClasses}`;
  }

  onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.onChangeCallback(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
