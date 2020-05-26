import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  private subscriptions: Subscription[] = [];
  private returnUrl: string;
  private socialActive: boolean = false;
  public user : User;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user = new User();
   }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }

  validateLogin() {
    this.user.email = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;
  	if(this.loginForm.valid) {
  		this.auth.validateLogin(this.user).subscribe(result => {
        this.auth.currentUser = result['data']
        console.log('result is ', result);
        if(result['status'] === 'success') {
          this.router.navigate(['/profile']);
        } else {
          alert('Пароль введен неправильно');
        }
        
      }, error => {
        console.log('error is ', error);
      });
  	} else {
  		alert('Неправильный адрес');
  	}
  }

  public submitServiceGoogle(): void {
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
