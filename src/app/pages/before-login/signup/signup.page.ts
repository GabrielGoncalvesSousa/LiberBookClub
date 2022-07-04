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

    //Se for valido, retiramos o email e a password , anexamos um hotToast e registamos de 2 formas diferentes,
    //primeiro registamos dentro da colecao de users e depois registamos atraves da autenticacao auth.firebase 
    //de forma ao utilizador poder entrar na aplicacao, registamos destas 2 formas porque, 1 guarda o user numa colecao
    //de forma a obtermos todos os dados associados a ele, nome, email, etc e de forma a permitir criar ligacoes com o user,
    // como os comentarios associados a ele, os livros que leu etc e registamos no auth.firebase porque o auth.firebase
    //so permite registar a password e o identifier mas precisamos de registar la para podermos ter acesso as funcoes auth.
    //assim primeiro registamos no auth, retiramos o userId criado automaticamente no auth e mandamos para a funcao de registo
    // da colecao user e registar um documento com o mesmo id que  userId do auth, nada confuso
    
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
