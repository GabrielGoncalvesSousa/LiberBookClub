import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';
import { controlMailExists } from './email-validator';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
  ],
})
export class LoginPage implements OnInit {
  public data: any;
  public isSubmited: boolean = false;
  public formGroup: FormGroup;

  public password: string;
  public doesMailExist: boolean = true;

  constructor(public formBuilder: FormBuilder, public firebaseDataService: FirebaseDataService) {
    this.formGroup = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.email,
          Validators.required,
        ],
        controlMailExists(firebaseDataService)
      ),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),

      rememberMe: new FormControl(false, [
        Validators.required,
      ]),
    });
  }

  ngOnInit() {}
  get emailTitle() {
    return this.formGroup.controls['email'];
  }
  async onSubmit(event: any) {
    console.log(this.formGroup.value);
    console.log(this.formGroup.valid);
    console.log(this.formGroup);
    console.log('HEY');
    console.log(this.formGroup.controls.email.errors);

    console.log(this.formGroup.errors);

    this.isSubmited = true;
  }

  //   public controlMailExists(email: string): AsyncValidatorFn {
  //    return  async (control: AbstractControl) => {
  //     const formGroup = control as FormGroup;
  //     const emailControl = formGroup.get('email')?.value;
  // return this.firebaseDataService.getUserByEmail(emailControl).pipe(
  //   map((data) => {
  //     return (data.length > 0 ? { emailExists:true }: null );
  //   })
  // )
  //   }}

  public fuckingQuery(email: string) {
    return new Observable((observer) => {
      this.firebaseDataService.getUserByEmail(email).subscribe((data) => {
        if (data.length > 0) {
          observer.next({
            emailExists: true,
          });
        } else {
          observer.next(null);
        }
      });
    });
  }
}
