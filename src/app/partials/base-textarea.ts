import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-textarea',
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
      <textarea
        [id]="id"
        [placeholder]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [readonly]="readonly"
        [rows]="rows"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="textareaClasses"
      ></textarea>
      <div class="flex justify-between items-center mt-1">
        <div>
          @if (hint) {
            <p class="text-xs text-gray-500">{{ hint }}</p>
          }
          @if (error) {
            <p class="text-xs text-red-600">{{ error }}</p>
          }
        </div>
        @if (maxLength > 0) {
          <p class="text-xs text-gray-500">{{ value.length }}/{{ maxLength }}</p>
        }
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseTextArea),
      multi: true
    }
  ]
})
export class BaseTextArea implements ControlValueAccessor {
  @Input() id = `textarea-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() rows = 4;
  @Input() maxLength = 0;
  @Input() hint = '';
  @Input() error = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get textareaClasses(): string {
    const baseClasses = 'appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm transition duration-150 resize-y';
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
    const textarea = event.target as HTMLTextAreaElement;
    let inputValue = textarea.value;
    
    if (this.maxLength > 0 && inputValue.length > this.maxLength) {
      inputValue = inputValue.substring(0, this.maxLength);
      textarea.value = inputValue;
    }
    
    this.value = inputValue;
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
