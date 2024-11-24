import { AbstractControl } from "@angular/forms";
import { isValidPhoneNumber } from 'libphonenumber-js';

export function PhoneNoValidator(c: AbstractControl) {
    if (!isValidPhoneNumber(c.value)) {
        return { 'invalidPhoneNumber': true };
    } else {
        return null;
    }
}