import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';

export function controlMailExists(firebaseDataService: FirebaseDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    let idk = firebaseDataService.getUserByEmail(control.value).pipe(
      map((data) => {
        return data.length > 0 ? { emailExists: true } : null;
      })
    );
    console.log(idk);

    return idk.toPromise();
  };
}
