import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, take } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';

//Isto nao faz sentido absolutamente nenhum, porque a logica disto era davamos return do observable
//coisa que so funciona em condicoes se usarmos o debounce time e o take 1, mas logicamente nao
//deveriamos precisar disto visto que o observer retorna o ultimo next e com o so temos 1 deveria de retornar
//esse valor, idk, funciona, sao 5 da manha e passei o dia todo
export function controlMailExistsWhenSigningUp(firebaseDataService: FirebaseDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return firebaseDataService
      .getUserByEmail(control.value)
      .pipe(debounceTime(500), take(1), map((arr) => (arr.length > 0 ? { emailExists: true } : null)));
  };
}

export function controlMailExistsWhenLoggingIn(firebaseDataService: FirebaseDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return firebaseDataService
      .getUserByEmail(control.value)
      .pipe(debounceTime(500), take(1), map((arr) => (arr.length > 0 ? null : { emailExists: true })));
  };
}
