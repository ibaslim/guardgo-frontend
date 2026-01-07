import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-input',
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
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="inputClasses"
      />
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
      useExisting: forwardRef(() => BaseInput),
      multi: true
    }
  ]
})
export class BaseInput implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() hint = '';
  @Input() error = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
