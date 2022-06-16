import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  public formData: FormGroup;
  constructor(public formBuilder: FormBuilder) {
    this.formData = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      rememberMe: new FormControl(),
    });
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
        ],
      ],
      rememberMe: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }

  loginButton(event: any) {
    console.log(event);
  }

  get errorControl() {
    return this.formData.controls;
  }

  onSubmit(event: any) {
    console.log(this.formData.value);
    console.log(this.formData.valid);

    this.isSubmited = true;
  }
}
