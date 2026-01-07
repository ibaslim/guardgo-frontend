import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RadioOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-base-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <div [class]="orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'">
        @for (option of options; track option.value) {
          <div class="flex items-center">
            <input
              [id]="id + '-' + option.value"
              [name]="id"
              type="radio"
              [value]="option.value"
              [checked]="value === option.value"
              [required]="required"
              [disabled]="disabled"
              (change)="onChange($event)"
              (blur)="onTouched()"
              [class]="radioClasses"
            />
            <label
              [for]="id + '-' + option.value"
              [class]="labelClasses"
              class="ml-2 block text-sm"
            >
              {{ option.label }}
            </label>
          </div>
        }
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
      useExisting: forwardRef(() => BaseRadio),
      multi: true
    }
  ]
})
export class BaseRadio implements ControlValueAccessor {
  @Input() id = `radio-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() options: RadioOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() hint = '';
  @Input() error = '';

  value = '';
  onChangeCallback: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get radioClasses(): string {
    const baseClasses = 'h-4 w-4 border-gray-300 focus:ring-2 focus:ring-offset-2 transition duration-150';
    const stateClasses = this.disabled
      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
      : 'text-blue-600 focus:ring-blue-500 cursor-pointer';
    
    return `${baseClasses} ${stateClasses}`;
  }

  get labelClasses(): string {
    return this.disabled
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-gray-700 cursor-pointer';
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
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
