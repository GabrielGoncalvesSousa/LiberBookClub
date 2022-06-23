import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';
import { controlMailExistsWhenSigningUp } from '../login/email-validator';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    '../login/login.page.scss',
  ],
})
export class SignupPage implements OnInit {
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
        controlMailExistsWhenSigningUp(firebaseDataService)
      ),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),

      agreePolicy: new FormControl(false, Validators.requiredTrue),
    });
  }

  ngOnInit() {}
  get emailTitle() {
    return this.formGroup.controls['email'];
  }
  async onSubmit(event: any) {
    this.formGroup.markAllAsTouched();
    console.log(this.formGroup.value);
    console.log(this.formGroup.valid);
    console.log(this.formGroup);
    console.log('HEY');
    console.log(this.formGroup.controls.email.errors);

    console.log(this.formGroup.controls.agreePolicy.errors);
    console.log(this.formGroup.controls.agreePolicy.value);

    if (this.formGroup.valid) {
      console.log('valid');
      const { email, password } = this.formGroup.value;

      this.firebaseDataService
        .register(email, password)
        .pipe(
          this.toast.observe({
            success: 'User created successfully',
            loading: 'Creating user...',
            error: ({ message }) => `Error: ${message}`,
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.firebaseDataService.registerUser(email, password, res.user.uid);
          this.router.navigate([
            '/main-page',
          ]);
        });
    }
  }
}
