import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          [id]="id"
          type="checkbox"
          [checked]="value"
          [required]="required"
          [disabled]="disabled"
          (change)="onChange($event)"
          (blur)="onTouched()"
          [class]="checkboxClasses"
        />
      </div>
      @if (label) {
        <div class="ml-3 text-sm">
          <label [for]="id" [class]="labelClasses">
            {{ label }}
            @if (required) {
              <span class="text-red-500">*</span>
            }
          </label>
          @if (hint) {
            <p class="text-gray-500 text-xs mt-0.5">{{ hint }}</p>
          }
        </div>
      }
    </div>
    @if (error) {
      <p class="mt-1 text-xs text-red-600">{{ error }}</p>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseCheckbox),
      multi: true
    }
  ]
})
export class BaseCheckbox implements ControlValueAccessor {
  @Input() id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';

  value = false;
  onChangeCallback: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  get checkboxClasses(): string {
    const baseClasses = 'h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-2 transition duration-150';
    const stateClasses = this.disabled
      ? 'text-gray-400 cursor-not-allowed bg-gray-100'
      : 'text-blue-600 focus:ring-blue-500 cursor-pointer';
    
    return `${baseClasses} ${stateClasses}`;
  }

  get labelClasses(): string {
    return this.disabled
      ? 'font-medium text-gray-400 cursor-not-allowed'
      : 'font-medium text-gray-700 cursor-pointer';
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
    this.onChangeCallback(this.value);
  }

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
