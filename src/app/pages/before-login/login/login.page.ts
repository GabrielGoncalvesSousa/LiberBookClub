import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';
import { controlMailExistsWhenLoggingIn } from './email-validator';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

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

  constructor(
    public formBuilder: FormBuilder,
    public firebaseDataService: FirebaseDataService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.formGroup = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.email,
          Validators.required,
        ],
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

    console.log(this.formGroup.controls.email.errors == null);
    // this.formGroup.valid
    //   ? () => {
    //       let banana = this.firebaseDataService.signin(this.formGroup.value.email, this.formGroup.value.password);
    //       console.log(banana);
    //     }
    //   : console.log('dd');

    if (this.formGroup.valid) {
      console.log(this.formGroup.value);

      this.firebaseDataService
        .signin(this.formGroup.value.email, this.formGroup.value.password)
        .pipe(
          this.toast.observe({
            success: 'Successfully loggen in',
            loading: 'Logging in...',
            error: 'Error Logging in',
          })
        )
        .subscribe((res) => {
          this.router.navigate([
            '/main-page',
          ]);
        });
    }
  }
}
