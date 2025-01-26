import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { map, Observable, startWith, Subject } from 'rxjs';
import { ToggleService } from '../../common/header/toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/_services/auth.service';
import { CategorieService } from 'src/app/_services/categorie.service';
import { PaysService } from 'src/app/_services/pays.service';
import { VilleService } from 'src/app/_services/ville.service';
import { UserService } from 'src/app/_services/user.service';
import * as XLSX from 'xlsx';
import { DealService } from 'src/app/_services/deal.service';

interface Categorie {
    id: number;
    nom: string;
}

interface Sect_activite {
    id: number;
    nom: string;
}
interface Pays {
    id: number;
    nom: string;
}
interface Ville {
    id: number;
    nom: string;
    pays: string;
}

export interface Deal {
    id: number;
}

@Component({
    selector: 'app-list-deal',
    templateUrl: './list-deal.component.html',
    styleUrls: ['./list-deal.component.scss'],
})
export class ListDealComponent implements OnInit, OnDestroy {
    usersPro: any[] = [];
    utilisateurs: any[] = [];
    ambassadeurs: any[] = [];
    usersProActif: any[] = [];
    usersProEnattente: any[] = [];
    usersProRefuse: any[] = [];
    etats: string[] = ['En attente', 'Actif', 'Refusé'];
    @ViewChild(MatAccordion) accordion: MatAccordion;
    panelOpenState = false;
    showList = false;
    filteredNotifications: any[] = [];
    notifications: any[] = [];

    categories: string[] = [
        'Alimentation',
        'Art et culture',
        'Banques et assurances',
        'Le monde des enfants',
        'Loisirs et tourisme',
        'Manger, sortir, danser',
        'Mode et beauté',
        'Multimédia',
        'Pour la maison',
        'Se loger',
    ];

    proCount: number = 0;
    userCount: number = 0;
    ambassadeurCount: number = 0;
    ActifCount: number = 0;
    EnattenteCount: number = 0;
    RefuseCount: number = 0;
    categorie: Categorie[] = [];
    sect_activite: Sect_activite[] = [];
    pays: Pays[] = [];
    ville: Ville[] = [];
    isToggled = false;

    selectedCategories: string[] = [];

    searchTerm: string = '';
    selectedVilles: string[] = [];

    filteredVilles: Ville[] = [];
    selectedPays: string | null = null;
    selectedPayss: string[] = [];
    fileName = 'liste-users.xlsx';

    getVilleByPays(pays: string): void {
        const index = this.selectedPayss.indexOf(pays);
        if (index === -1) {
            this.selectedPayss.push(pays);
        } else {
            this.selectedPayss.splice(index, 1);
        }

        // Réinitialiser la liste des villes filtrées
        this.filteredVilles = [];

        // Récupérer les villes pour chaque pays sélectionné
        this.selectedPayss.forEach((selectedPays) => {
            this.villeService
                .getVilleByPays(selectedPays)
                .subscribe((villes) => {
                    this.filteredVilles = [...this.filteredVilles, ...villes];
                    // Retirer les doublons en utilisant Set
                    this.filteredVilles = Array.from(
                        new Set(this.filteredVilles.map((v) => v.nom))
                    ).map(
                        (nom) => this.filteredVilles.find((v) => v.nom === nom)!
                    );
                });
        });
    }

    toggleCategory(categoryName: string): void {
        const index = this.selectedCategories.indexOf(categoryName);
        if (index === -1) {
            this.selectedCategories.push(categoryName);
        } else {
            this.selectedCategories.splice(index, 1);
        }
    }
    togglePays(pays: string): void {
        const index = this.selectedPayss.indexOf(pays);
        if (index === -1) {
            this.selectedPayss.push(pays);
        } else {
            this.selectedPayss.splice(index, 1);
        }
    }
    toggleVille(ville: string): void {
        const index = this.selectedVilles.indexOf(ville);
        if (index >= 0) {
            this.selectedVilles.splice(index, 1);
        } else {
            this.selectedVilles.push(ville);
        }
    }

    onSearch(event: Event): void {
        event.preventDefault();
    }
    get filteredUtilisateurs(): any[] {
        let filtered = this.utilisateurs;
        if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.username
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
        }

        return filtered;
    }
    get filteredUsers(): any[] {
        let filtered = this.usersPro;

        // Filtrage par villes
        if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        // Filtrage par pays
        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        // Filtrage par recherche sur le nom d'utilisateur
        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.titre
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégories (dans les utilisateurs)
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(
                (user) => this.selectedCategories.includes(user.sect_activite) // Si "categorie" est une propriété de user
            );
        }

        return filtered;
    }
    get filteredUsersProActif(): any[] {
        let filtered = this.usersProActif;
         // Filtrage par villes
         if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        

        // Filtrage par pays
        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        // Filtrage par recherche sur le nom d'utilisateur
        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.titre
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégories (dans les utilisateurs)
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(
                (user) => this.selectedCategories.includes(user.sect_activite) // Si "categorie" est une propriété de user
            );
        }

        return filtered;
    }
    get filteredUsersProEnAttente(): any[] {
        let filtered = this.usersProEnattente;
        // Filtrage par villes
        if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        // Filtrage par pays
        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        // Filtrage par recherche sur le nom d'utilisateur
        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.titre
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégories (dans les utilisateurs)
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(
                (user) => this.selectedCategories.includes(user.sect_activite) // Si "categorie" est une propriété de user
            );
        }

        return filtered;
    }
    get filteredUsersProRefuse(): any[] {
        let filtered = this.usersProRefuse;
        // Filtrage par villes
        if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        // Filtrage par pays
        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        // Filtrage par recherche sur le nom d'utilisateur
        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.titre
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
            
        }

        // Filtrage par catégories (dans les utilisateurs)
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(
                (user) => this.selectedCategories.includes(user.sect_activite) // Si "categorie" est une propriété de user
            );
        }

        return filtered;
    }
    get filteredAmbassadeur(): any[] {
        let filtered = this.ambassadeurs;

        if (this.selectedVilles.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedVilles.includes(user.ville)
            );
        }

        if (this.selectedPayss.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedPayss.includes(user.pays)
            );
        }

        if (this.searchTerm.trim() !== '') {
            filtered = filtered.filter((user) =>
                user.username
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
            );
        }

        return filtered;
    }
    resetFilter(): void {
        this.selectedCategories = [];
        this.selectedVilles = [];
        this.selectedPayss = [];
        this.searchTerm = '';
    }
    categoryControl = new FormControl();
    categoryFilterCtrl = new FormControl();
    paysFilterCtrl = new FormControl();
    filteredCategories: Observable<Categorie[]>;
    filteredPays$: Observable<Pays[]>;
    villeFilterCtrl = new FormControl();
    filteredVille: Observable<Ville[]>;
    private _onDestroy = new Subject<void>();
    constructor(
        public dialog: MatDialog,
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        public categorieservice: CategorieService,
        public paysService: PaysService,
        public villeService: VilleService,
        public userService: UserService,
        private dealService: DealService
    ) {
        this.toggleService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }
    getRole(role: string): string {
        const name = role.substring(role.indexOf('_') + 1);
        return name;
    }
    ngOnInit(): void {
        this.dealService.getdeal().subscribe((data) => {
            this.usersPro = data;
            this.proCount = this.usersPro.length; // Compter le nombre total d'utilisateurs
            console.log("nbre total deal" +this.usersPro);
        });
        this.authService.getRoleUserEtEmbassadeur().subscribe((data) => {
            this.utilisateurs = data;
            this.userCount = this.utilisateurs.length; // Compter le nombre total d'utilisateurs
        });
        this.authService.getRoleEmbassadeur().subscribe((data) => {
            this.ambassadeurs = data;
            this.ambassadeurCount = this.ambassadeurs.length; // Compter le nombre total d'utilisateurs
        });
        this.dealService.getDealetatActif().subscribe((data) => {
            this.usersProActif = data;
            this.ActifCount = this.usersProActif.length; // Compter le nombre total d'utilisateurs
        });
        this.dealService.getDealetatEn_attente().subscribe((data) => {
            this.usersProEnattente = data;
            this.EnattenteCount = this.usersProEnattente.length; // Compter le nombre total d'utilisateurs
        });
        this.dealService.getDealetatRefuse().subscribe((data) => {
            this.usersProRefuse = data;
            this.RefuseCount = this.usersProRefuse.length; // Compter le nombre total d'utilisateurs
        });
        this.categorieservice.getCategorie().subscribe((data) => {
            this.categorie = data;
        });
        this.filteredCategories = this.categoryFilterCtrl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCategories(value))
        );
        this.filteredPays$ = this.paysFilterCtrl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPays(value))
        );
        this.paysService.getPays().subscribe((data) => {
            this.pays = data;
        });
    }

    getNotificationByCategorie(cat: string): number {
        const filteredUsers = this.usersPro.filter(
            (user) =>
                user.sect_activite &&
                user.sect_activite.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        console.log(`Catégorie: ${cat}, Nombre: ${filteredUsers.length}`);
        return filteredUsers.length;
    }

    getDealActifByCateg(cat: string): number {
        const filteredUsers = this.usersProActif.filter(
            (user) =>
                user.sect_activite &&
                user.sect_activite.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        console.log(`Catégorie: ${cat}, Nombre: ${filteredUsers.length}`);
        return filteredUsers.length;
    }

    getDealEnattenteByCateg(cat: string): number {
        const filteredUsers = this.usersProEnattente.filter(
            (user) =>
                user.sect_activite &&
                user.sect_activite.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        console.log(`Catégorie: ${cat}, Nombre: ${filteredUsers.length}`);
        return filteredUsers.length;
    }

    getDealRefuseByCateg(cat: string): number {
        const filteredUsers = this.usersProRefuse.filter(
            (user) =>
                user.sect_activite &&
                user.sect_activite.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        console.log(`Catégorie: ${cat}, Nombre: ${filteredUsers.length}`);
        return filteredUsers.length;
    }

    onCategorieChange(categorie: string): void {
        // 'categorie' est bien défini comme étant de type string
        if (this.selectedCategories.includes(categorie)) {
            this.selectedCategories = this.selectedCategories.filter(
                (cat) => cat !== categorie
            );
        } else {
            this.selectedCategories.push(categorie);
        }
        this.filterNotifications();
    }

    filterNotifications(): void {
        if (this.selectedCategories.length > 0) {
            // Filtrer les notifications par les catégories sélectionnées
            this.filteredNotifications = this.notifications.filter(
                (notification) =>
                    this.selectedCategories.includes(notification.categorie)
            );
        } else {
            // Si aucune catégorie n'est sélectionnée, afficher toutes les notifications
            this.filteredNotifications = this.notifications;
        }
    }

    removeData(id: number) {
        if (window.confirm('Are sure you want to delete this Notification ?')) {
            this.dealService.deleteData(id).subscribe(
                (data) => {
                    console.log(data);
                    //this.toastr.warning(" data successfully deleted!");
                    // this.getData();
                    window.location.reload();
                },
                (error) => console.log(error)
            );
        }
    }

    toggleList() {
        this.showList = !this.showList;
    }

    exportexcel(): void {
        /* pass here the table id */
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    private _filterCategories(value: string): Categorie[] {
        const filterValue = value.toLowerCase();
        return this.categorie.filter((cat) =>
            cat.nom.toLowerCase().includes(filterValue)
        );
    }
    private _filterVilles(value: string): Ville[] {
        const filterValue = value.toLowerCase();
        return this.ville.filter((ville) =>
            ville.nom.toLowerCase().includes(filterValue)
        );
    }
    private _filterPays(value: string): Pays[] {
        const filterValue = value.toLowerCase();
        return this.pays.filter((pays) =>
            pays.nom.toLowerCase().includes(filterValue)
        );
    }
    onChangeEtat(user: any, event: any): void {
        user.etat = event.value;
        this.dealService.updateDealr(user.id, user).subscribe();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    toggle(nom: string) {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }
    openCreateUserDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        this.dialog.open(CreateUserDialogBox, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

    showAmbassadeurTab: boolean = false;

    // Fonction pour afficher l'onglet Ambassadeur
    onTabChange2(event: any) {
        const selectedIndex = event.index;
        const tabLabel = event.tab.textLabel;

        if (tabLabel === 'Ambassadeur') {
            this.showAmbassadeurTab = true;
        } else {
            this.showAmbassadeurTab = false;
        }
    }

    showActifTab: boolean = false;
    showEnAttenteTab: boolean = false;
    showRefuseTab: boolean = false;

    // Fonction pour afficher l'onglet Ambassadeur
    onTabChange3(event: any) {
        const selectedIndex = event.index;
        const tabLabel = event.tab.textLabel;

        if (tabLabel === 'Actif') {
            this.showActifTab = true;
            this.showEnAttenteTab = false;
            this.showRefuseTab = false;
        } else if (tabLabel === 'En attente') {
            this.showEnAttenteTab = true;
            this.showActifTab = false;
            this.showRefuseTab = false;
        } else if (tabLabel === 'Refusé') {
            this.showRefuseTab = true;
            this.showActifTab = false;
            this.showEnAttenteTab = false;
        } else {
            this.showActifTab = false;
            this.showEnAttenteTab = false;
            this.showRefuseTab = false;
        }
    }

    selectedTab: number = 0;

    onTabChange(event: any): void {
        this.selectedTab = event.index;
    }
    // Méthode pour obtenir la longueur des utilisateurs ayant une catégorie spécifique
    getUsersByCategory(category: string): number {
        return this.usersPro.filter((user) => user.categorie === category)
            .length;
    }
    getUsersByPays(p: string): number {
        return this.usersPro.filter((user) => user.pays === p).length;
    }
    getUsersByVille(ville: string): number {
        return this.usersPro.filter((user) => user.ville === ville).length;
    }

    getUsersProActifByCategory(category: string): number {
        return this.usersProActif.filter((user) => user.categorie === category)
            .length;
    }
    getusersProActifByPays(p: string): number {
        return this.usersProActif.filter((user) => user.pays === p).length;
    }
    getUsersProActifByVille(ville: string): number {
        return this.usersProActif.filter((user) => user.ville === ville).length;
    }

    getUsersProEnAttenteByCategory(category: string): number {
        return this.usersProEnattente.filter(
            (user) => user.categorie === category
        ).length;
    }
    getusersProEnAttenteByPays(p: string): number {
        return this.usersProEnattente.filter((user) => user.pays === p).length;
    }
    getUsersProEnAttenteByVille(ville: string): number {
        return this.usersProEnattente.filter((user) => user.ville === ville)
            .length;
    }
    getUsersProRefuseByCategory(category: string): number {
        return this.usersProRefuse.filter((user) => user.categorie === category)
            .length;
    }
    getusersProRefuseByPays(p: string): number {
        return this.usersProRefuse.filter((user) => user.pays === p).length;
    }
    getUsersProRefuseByVille(ville: string): number {
        return this.usersProRefuse.filter((user) => user.ville === ville)
            .length;
    }
    getUserAndEmbByPays(p: string): number {
        return this.utilisateurs.filter((user) => user.pays === p).length;
    }
    getUsersAndEmbByVille(ville: string): number {
        return this.utilisateurs.filter((user) => user.ville === ville).length;
    }

    getEmbByPays(p: string): number {
        return this.ambassadeurs.filter((user) => user.pays === p).length;
    }
    getEmbByVille(ville: string): number {
        return this.ambassadeurs.filter((user) => user.ville === ville).length;
    }
}

/*@Component({
    selector: 'create-user-dialog',
    templateUrl: './create-user-dialog.html',
})*/
export class CreateUserDialogBox {
    constructor(public dialogRef: MatDialogRef<CreateUserDialogBox>) {}

    close() {
        this.dialogRef.close(true);
    }
}
