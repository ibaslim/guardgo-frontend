import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface MultiSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-base-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      
      <!-- Multi-select container with card-like appearance -->
      <div [class]="containerClasses">
        <!-- Search bar -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-3 z-10">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                class="h-4 w-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              placeholder="Search options..."
              [disabled]="disabled"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
              [class.cursor-not-allowed]="disabled"
              [class.cursor-pointer]="!disabled"
            />
            @if (searchTerm) {
              <button
                type="button"
                (click)="clearSearch()"
                [disabled]="disabled"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                [attr.aria-label]="'Clear search'"
              >
                <svg 
                  class="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            }
          </div>
        </div>

        <!-- Options list -->
        <div class="p-2 max-h-64 overflow-y-auto" role="listbox">
          @if (filteredOptions.length > 0) {
            @for (option of filteredOptions; track option.value) {
              <label 
                [class]="optionClasses"
                role="option"
                [attr.aria-selected]="isSelected(option.value)"
              >
                <input
                  type="checkbox"
                  [value]="option.value"
                  [checked]="isSelected(option.value)"
                  [disabled]="disabled"
                  (change)="onOptionChange(option.value, $event)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                  [class.cursor-not-allowed]="disabled"
                  [class.cursor-pointer]="!disabled"
                />
                <span [class]="optionLabelClasses">{{ option.label }}</span>
              </label>
            }
          } @else {
            <div class="px-3 py-8 text-center text-sm text-gray-500">
              <svg 
                class="mx-auto h-12 w-12 text-gray-400 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No options found</p>
              @if (searchTerm) {
                <p class="text-xs mt-1">Try adjusting your search</p>
              }
            </div>
          }
        </div>
      </div>

      <!-- Selected count and messages -->
      @if (selectedCount > 0) {
        <p class="mt-1.5 text-xs text-blue-600 font-medium">{{ selectedCount }} selected</p>
      }
      @if (hint) {
        <p class="mt-1.5 text-xs text-gray-500">{{ hint }}</p>
      }
      @if (error) {
        <p class="mt-1.5 text-xs text-red-600">{{ error }}</p>
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
export class BaseMultiSelect implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id = `multiselect-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() options: MultiSelectOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';

  value: string[] = [];
  searchTerm = '';
  filteredOptions: MultiSelectOption[] = [];
  onChangeCallback: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filterOptions();
    }
  }

  get selectedCount(): number {
    return this.value.length;
  }

  get containerClasses(): string {
    const baseClasses = 'border rounded-lg p-3 space-y-2.5 max-h-60 overflow-y-auto shadow-sm transition-all duration-200';
    const stateClasses = this.disabled
      ? 'bg-gray-50 border-gray-200'
      : this.error
      ? 'border-red-300 bg-white hover:border-red-400'
      : 'border-gray-300 bg-white hover:border-gray-400';
    
    return `${baseClasses} ${stateClasses} transition-all duration-200`;
  }

  get optionClasses(): string {
    const baseClasses = 'flex items-center space-x-3 p-2.5 rounded-md transition-all duration-200';
    return this.disabled
      ? `${baseClasses} cursor-not-allowed opacity-60`
      : `${baseClasses} cursor-pointer hover:bg-blue-50`;
  }

  get optionLabelClasses(): string {
    return this.disabled
      ? 'text-sm text-gray-400'
      : 'text-sm text-gray-700 font-medium';
  }

  isSelected(value: string): boolean {
    return this.value.includes(value);
  }

  onSearchChange(): void {
    this.filterOptions();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterOptions();
  }

  filterOptions(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(search) ||
        option.value.toLowerCase().includes(search)
      );
    }
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
