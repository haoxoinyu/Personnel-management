import { FormControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static fiveDigitNumberStartingWith(id: number): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && typeof value === 'string') {
        const regex = new RegExp(`^${id}\\d{4}$`);
        if (!regex.test(value)) {
          return { fiveDigitNumberStartingWith: true };
        }
      }
      return null;
    };
  }
}
