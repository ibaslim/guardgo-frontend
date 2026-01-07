import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface MultiSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-base-multi-select',
  standalone: true,
  imports: [CommonModule],
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
      <div [class]="containerClasses">
        @for (option of options; track option.value) {
          <label [class]="optionClasses">
            <input
              type="checkbox"
              [value]="option.value"
              [checked]="isSelected(option.value)"
              [disabled]="disabled"
              (change)="onOptionChange(option.value, $event)"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150"
              [class.cursor-not-allowed]="disabled"
              [class.cursor-pointer]="!disabled"
            />
            <span [class]="optionLabelClasses">{{ option.label }}</span>
          </label>
        }
      </div>
      @if (selectedCount > 0) {
        <p class="mt-1 text-xs text-gray-600">{{ selectedCount }} selected</p>
      }
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
      useExisting: forwardRef(() => BaseMultiSelect),
      multi: true
    }
  ]
})
export class BaseMultiSelect implements ControlValueAccessor {
  @Input() id = `multiselect-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() options: MultiSelectOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';

  value: string[] = [];
  onChangeCallback: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  get selectedCount(): number {
    return this.value.length;
  }

  get containerClasses(): string {
    const baseClasses = 'border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto';
    const stateClasses = this.disabled
      ? 'bg-gray-100 border-gray-200'
      : this.error
      ? 'border-red-300 bg-white'
      : 'border-gray-300 bg-white';
    
    return `${baseClasses} ${stateClasses}`;
  }

  get optionClasses(): string {
    const baseClasses = 'flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition duration-150';
    return this.disabled
      ? `${baseClasses} cursor-not-allowed opacity-60`
      : `${baseClasses} cursor-pointer`;
  }

  get optionLabelClasses(): string {
    return this.disabled
      ? 'text-sm text-gray-400'
      : 'text-sm text-gray-700';
  }

  isSelected(value: string): boolean {
    return this.value.includes(value);
  }

  onOptionChange(optionValue: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.value = [...this.value, optionValue];
    } else {
      this.value = this.value.filter(v => v !== optionValue);
    }
    this.onChangeCallback(this.value);
    this.onTouched();
  }

  writeValue(value: string[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
