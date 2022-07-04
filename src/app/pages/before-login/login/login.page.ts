import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';
import { controlMailExistsWhenLoggingIn } from './email-validator';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  public data: any;
  public isSubmited: boolean = false;
  public formGroup: FormGroup;
  public password: string;
  public doesMailExist: boolean = true;

  //Construtor com o hotToast (toast com animacoes e verificacao in real time da execucao de um observer consoante o estado do observer)
  
  constructor(
    public formBuilder: FormBuilder,
    public firebaseDataService: FirebaseDataService,
    private toast: HotToastService,
    private router: Router
  ) {
    //FormGroup com as constraints
    this.formGroup = new FormGroup({
      email: new FormControl(
        '',
        [
          //Verificador se a string corresponde a um mail
          Validators.email,

          //Verificador que obriga ao input do email
          Validators.required,
        ],

        //Costum async validator que faz querie ao firebase , deu um trabalho isto
        controlMailExistsWhenLoggingIn(firebaseDataService)
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

  @HostListener('unloaded ')
  ngOnDestroy(): void {
    console.log('LOGIN PAGE DESTRUIDOa');
  }

  ngOnInit() {
    console.log(this.router);
  }

  get emailTitle() {
    return this.formGroup.controls['email'];
  }

  onSubmit(event: any) {

    //Se o formGroup estiver valido ao clicar em login faz login
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      this.firebaseDataService
        .signin(this.formGroup.value.email, this.formGroup.value.password)
        .pipe(
          this.toast.observe({
            success: 'Successfully loggen in',
            loading: 'Logging in...',
            error: 'Invalid Password',
          }),
          take(1)
        )
        .subscribe((res) => {
          console.log('LOGIN PAGE BEFORE LOGGING OUT');
          this.router
            .navigate([
              '/main-page',
            ])
            .then(() => {
              this.ngOnDestroy();
            });
        });
    }
  }
}
