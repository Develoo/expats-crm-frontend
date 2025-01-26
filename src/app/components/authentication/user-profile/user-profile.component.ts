import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
import { Role } from 'src/app/model/role';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    currentUser: any;
    message = '';
    roles: Role[] = [];

    constructor(
        private token: TokenStorageService,
        private booksService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        public themeService: CustomizerSettingsService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.token.getUser();
        this.message = '';
        this.getBook(this.route.snapshot.paramMap.get('id'));
        this.booksService.getRoleList().subscribe(
            (res) => (this.roles = res),
            (err) => console.log(err),
            () => {
                // console.log(this.roles);
            }
        );
    }

    getBook(id: string | null): void {
        this.booksService.getUserById(this.currentUser.id).subscribe(
            (book: null) => {
                this.currentUser = book;
                console.log(book);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    setAvailableStatus(): void {
        const data = {
            username: this.currentUser.username,
            email: this.currentUser.email,
            // password: this.currentUser.password,
            tel: this.currentUser.tel,
            role: this.currentUser.role,
        };

        this.booksService.updateUser4(this.currentUser.id, data).subscribe(
            (response) => {
                // this.currentBook.available = status;
                console.log(response);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    updateBook(): void {
        this.booksService
            .updateUser4(this.currentUser.id, this.currentUser)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.message = 'The product was updated!';
                },
                (error) => {
                    console.log(error);
                }
            );
        // location.reload();
        // this.reloadPage1();
    }

    compareFn(role1: any, role2: any) {
        return role1 && role2 ? role1.id === role2.id : role1 === role2;
    }
    getRole(role: string) {
        const name = role.substring(role.indexOf('_') + 1, role.length);
        return name;
        console.log(name);
    }
    reloadPage1() {
        this.router.navigate(['user-profile']);
    }
}
