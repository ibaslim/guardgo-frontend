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
        <label [for]="id" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <select
        [id]="id"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (change)="onChange($event)"
        (blur)="onTouched()"
        [class]="selectClasses"
      >
        @if (placeholder) {
          <option value="" disabled [selected]="!value">{{ placeholder }}</option>
        }
        @for (option of options; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
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
    const baseClasses = 'appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm transition duration-150 bg-white';
    const stateClasses = this.disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
      : this.error
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500';
    
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
