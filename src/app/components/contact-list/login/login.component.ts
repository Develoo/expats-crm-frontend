import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];

    constructor(
        private authService: AuthService,
        private tokenStorage: TokenStorageService,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            this.reloadPage1();
        }
    }

    onSubmit() {
        this.authService.login(this.form).subscribe(
            (data) => {
                this.tokenStorage.saveToken(data.accessToken);
                this.tokenStorage.saveUser(data);

                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = this.tokenStorage.getUser().roles;
                this.reloadPage();
            },
            (err) => {
                this.errorMessage = err.error.message;
                this.isLoginFailed = true;
            }
        );
    }
    reloadPage() {
        window.location.reload();
        // this.router.navigate(['/']);
    }
    reloadPage1() {
        this.router.navigate(['/']);
    }
    ngOnDestroy() {}
}
