import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import { AuthService } from 'src/app/_services/auth.service';
import { LogService } from 'src/app/_services/log.service';
import { OpeninhoursService } from 'src/app/_services/openinhours.service';
import { UserService } from 'src/app/_services/user.service';
import { CustomizerSettingsService } from 'src/app/components/customizer-settings/customizer-settings.service';
import { ColumnChangeLog } from 'src/app/model/columnchangelog';
import { openinghours } from 'src/app/model/openinghours';
import { User } from 'src/app/model/user';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';

@Component({
    selector: 'app-products-orders',
    templateUrl: './products-orders.component.html',
    styleUrls: ['./products-orders.component.scss'],
})
export class ProductsOrdersComponent implements OnInit, AfterViewInit {
    /*dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);*/
    /* displayedColumns: string[] = ['name'];*/
    displayedColumns: string[] = ['name', 'time_diff'];
    /*@ViewChild(MatPaginator) paginator!: MatPaginator;*/

    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource = new MatTableDataSource<ColumnChangeLog>();
    users: User[] = [];
    openinghourss: openinghours[] = [];
    user: any;
    openinghours: any;
    ColumnChangeLogs: ColumnChangeLog[] = [];
    columnchangelogs: any;
    isEditingg: boolean = false;
    isEditingcompmark: boolean = false;
    isEditingmodpaie: boolean = false;
    isEditingperscon: boolean = false;
    isEditingloc: boolean = false;
    isEditinginfleg: boolean = false;
    isEditingserexp: boolean = false;
    isEditingparrai: boolean = false;
    isEditinglivrdisp: boolean = false;
    subscription: any;
    blurred = false;
    focused = false;
    etats: string[] = ['En attente', 'Actif', 'Refusé'];

    typecompagnsouhaitsOptions: string[] = ['email', 'promotion speciale'];

    // Dateg = new Date();

    ngOnInit(): void {
        this.getUser(19); // Appel de la méthode avec l'ID 3 au moment de l'initialisation du composant
        this.getUserhorr(1);
        this.getLogById(5);
    }

    toggleEditt() {
        if (this.isEditingg) {
            this.saveChanges();
        }
        this.isEditingg = !this.isEditingg;
    }

    toggleEditcompmark() {
        if (this.isEditingcompmark) {
            this.saveChanges();
        }
        this.isEditingcompmark = !this.isEditingcompmark;
    }

    toggleEditlivrdisp() {
        if (this.isEditinglivrdisp) {
            this.saveChanges();
        }
        this.isEditinglivrdisp = !this.isEditinglivrdisp;
    }

    toggleEditmodpaie() {
        if (this.isEditingmodpaie) {
            this.saveChanges();
        }
        this.isEditingmodpaie = !this.isEditingmodpaie;
    }

    toggleEditserexp() {
        if (this.isEditingserexp) {
            this.saveChanges();
        }
        this.isEditingserexp = !this.isEditingserexp;
    }

    toggleEditparrai() {
        if (this.isEditingparrai) {
            this.saveChanges();
        }
        this.isEditingparrai = !this.isEditingparrai;
    }

    toggleEditperscon() {
        if (this.isEditingperscon) {
            this.saveChanges();
        }
        this.isEditingperscon = !this.isEditingperscon;
    }

    toggleEditloc() {
        if (this.isEditingloc) {
            this.saveChanges();
        }
        this.isEditingloc = !this.isEditingloc;
    }

    toggleEditinfleg() {
        if (this.isEditinginfleg) {
            this.saveChanges();
        }
        this.isEditinginfleg = !this.isEditinginfleg;
    }

    saveChanges() {
        console.log('Updated user data:', this.user); // Vérifiez les valeurs ici
        console.log(
            'Updating user with raisons expat:',
            this.user.userRaisonExpat
        );
        this.userService.updatesUserPro(this.user.id, this.user).subscribe(
            (response) => {
                console.log('User updated successfully', response);
            }
            /*  (error) => {
                console.error('Error updating user', error);
            }*/
        );
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        console.log('Paginator initialized', this.paginator);
    }

    created(event: Quill) {}

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {}

    focus($event: any) {
        this.focused = true;
        this.blurred = false;
    }

    blur($event: any) {
        this.focused = false;
        this.blurred = true;
    }

    getUserhorr(proRoleId: number): void {
        this.subscription = this.openinhoursService
            .getUserById(proRoleId)
            .subscribe(
                (data) => {
                    this.openinghours = data;
                    console.log('Horraire', this.openinghours);
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                }
            );
    }

    /*getLogById(proRoleId: number): void {
        this.subscription = this.logService.getLogById(proRoleId).subscribe(
            (data) => {
                this.columnchangelogs = data;
                this.dataSource.data = data;
                console.log('log', this.columnchangelogs);
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );
    }*/

    getLogById(proRoleId: number): void {
        this.subscription = this.logService.getLogById(proRoleId).subscribe(
            (data: ColumnChangeLog[]) => {
                this.columnchangelogs = data;
                this.columnchangelogs.forEach((log: ColumnChangeLog) => {
                    log.time_diff = formatDistanceToNow(
                        new Date(log.change_timestamp)
                        /* { locale: fr }*/
                    );
                });
                this.dataSource.data = this.columnchangelogs;
            },
            (error) => {
                console.error('Error fetching log data:', error);
            }
        );
    }

    getFormattedDistanceToNow(date: string): string {
        return (
            'il y a ' + formatDistanceToNow(new Date(date) /*{ locale: fr }*/)
        );
    }

    getUser(id: number): void {
        this.subscription = this.userService.getUserById(id).subscribe(
            (data) => {
                this.user = data;
                console.log('User data:', this.user);
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );
    }

    onChangeEtat(user: any, event: any): void {
        user.etat = event.value;
        this.authService.updateUser(user.id, user).subscribe();
    }

    navigateToForm() {
        this.router.navigate(['/forms/basic']);
    }

    constructor(
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        private openinhoursService: OpeninhoursService,
        private logService: LogService,
        private router: Router,
        private _liveAnnouncer: LiveAnnouncer,
        private authService: AuthService
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onPageChange(event: PageEvent) {
        this.dataSource.paginator!.pageIndex = event.pageIndex;
    }

    getPaginationNumbers(): number[] {
        if (!this.paginator) {
            return [];
        }
        const totalPages = Math.ceil(
            this.dataSource.data.length / this.paginator.pageSize
        );
        return Array(totalPages)
            .fill(0)
            .map((x, i) => i);
    }

    /*getPaginationNumbers(): (number | string)[] {
        if (!this.paginator) {
            return [];
        }

        const totalPages = Math.ceil(
            this.dataSource.data.length / this.paginator.pageSize
        );

        const paginationArray: (number | string)[] = [];

        if (totalPages <= 7) {
            return Array(totalPages)
                .fill(0)
                .map((x, i) => i); // Renvoie tous les numéros de page si <= 7
        }

        for (let i = 0; i < 3; i++) {
            paginationArray.push(i);
        }

        paginationArray.push('...');

        for (let i = totalPages - 3; i < totalPages; i++) {
            paginationArray.push(i);
        }

        return paginationArray;
    }*/

    goToPage(pageIndex: number) {
        if (
            !this.paginator ||
            pageIndex < 0 ||
            pageIndex >= this.paginator.getNumberOfPages()
        ) {
            return;
        }
        this.paginator.pageIndex = pageIndex;
        this.paginator._changePageSize(this.paginator.pageSize); // Trigger a page change event
        console.log('Navigated to page', pageIndex);
    }

    /* goToPage(pageIndex: number) {
        if (
            !this.paginator ||
            pageIndex < 0 ||
            pageIndex >= this.paginator.getNumberOfPages()
        ) {
            return;
        }
        this.paginator.pageIndex = pageIndex;
        this.paginator._changePageSize(this.paginator.pageSize); // Trigger a page change event
        console.log('Navigated to page', pageIndex);
    }

    isNumber(value: any): boolean {
        return typeof value === 'number';
    }*/
}
