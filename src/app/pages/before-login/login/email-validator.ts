import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, take } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';

//Isto nao faz sentido absolutamente nenhum, porque a logica disto era davamos return do observable
//coisa que so funciona em condicoes se usarmos o debounce time e o take 1, mas logicamente nao
//deveriamos precisar disto visto que o observer retorna o ultimo next e com o so temos 1 deveria de retornar
//esse valor, idk, funciona, sao 5 da manha e passei o dia todo nisto, vou dormir


//Se o mail existir retorna o parametro:emailExists:true , else retorna null, é assim que os validators funcionam,
//com parametro se a constraint do validator que estamos a criar estiver a ser violada ou null se a constraint nao estiver a ser violada 
export function controlMailExistsWhenSigningUp(firebaseDataService: FirebaseDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return firebaseDataService
      .getUserByEmail(control.value)
      .pipe(debounceTime(500), take(1), map((arr) => (arr.length > 0 ? { emailExists: true } : null)));
  };
}

//Se o mail existir retorna null senao retorna parametro emailExists:true
export function controlMailExistsWhenLoggingIn(firebaseDataService: FirebaseDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return firebaseDataService
      .getUserByEmail(control.value)
      .pipe(debounceTime(500), take(1), map((arr) => (arr.length > 0 ? null : { emailExists: true })));
  };
}
