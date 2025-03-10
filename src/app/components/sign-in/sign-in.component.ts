import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
  }

  async signIn(email, password) {
    // await this.afAuth.signInWithEmailAndPassword(email, password)
    //   .then((result) => {
    // this.ngZone.run(() => {
    if (email == 'admin' && password == 'admin') {
      this.dashboardService.setUserRole('admin');
      this.router.navigate(['dashboard']);
    } if (email == 'user' && password == 'user') {
      this.dashboardService.setUserRole('user');
      this.router.navigate(['dashboard']);
    }

    // });
    // this.SetUserData(result.user);
    // }).catch((error) => {
    //   window.alert(error.message);
    // });
  }
}
