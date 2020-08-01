import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading = false;
    isLogin = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController
    ) {}

    ngOnInit() {}

    onLogin() {
        this.isLoading = true;
        this.authService.login();
        this.loadingController
            .create({
                keyboardClose: true,
                message: 'logging in...',
            })
            .then((loadingEl) => {
                loadingEl.present();
                setTimeout(() => {
                    loadingEl.dismiss();
                    this.isLoading = false;
                    this.router.navigateByUrl('/places/tabs/discover');
                }, 1500);
            });
    }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }
        
        const email = form.value.email;
        const password = form.value.password;

        console.log(email, password);

        if (this.isLogin) {
            // Send Login Request
        } else {
            // Send Sign Up Request
        }


    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }

}
