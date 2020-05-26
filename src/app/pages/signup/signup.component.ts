import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  public signupForm: FormGroup;
  private subscriptions: Subscription[] = [];
  public user: User
  firstName: string
  lastName: string
  fatherName: string

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,

    private router: Router
  ) {
    //this.createForm();
    this.user = new User;

  }

  ngOnInit() {
    this.signupForm = new FormGroup({
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

  validateSign() {
    this.user.username = this.firstName + ' ' + this.lastName + ' ' + this.fatherName
    if (this.user.email && this.user.password && this.user.username) {
      this.auth.validateSign(this.user).subscribe(res => {
        this.auth.currentUser = res['data']
        console.log('response is ', res)
        if (res['status'] === 'success') {
          this.router.navigate(['/profile']);
        } else {
          alert('Wrong username password');
        }
      });
    } else {
      alert('Title and Description required');
    }
    console.log(this.user)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
 
}
