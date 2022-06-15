import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private rotaAtiva: ActivatedRoute) {}

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras) {
      this.data = this.router.getCurrentNavigation().extras;
    }

    console.log(this.data);

    console.log(this.data.generos[0]['id']);
  }
}
