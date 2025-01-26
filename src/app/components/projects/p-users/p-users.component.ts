import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NumUrgenceServiceService } from 'src/app/_services/num-urgence-service.service';
import { VilleService } from 'src/app/_services/ville.service';
import { PaysService } from 'src/app/_services/pays.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Pays {
    id: number;
    nom: string;
}

interface Ville {
    id: number;
    nom: string;
    pays: string;
}
export interface NumeroUrgence {
    id: number;
    num: string;
    pays: string;
    // Ajoutez ici d'autres propriétés de 'NumeroUrgence' selon votre besoin
    titre: string;
    description: string;
    photo: string;
    lien: string;
}

@Component({
    selector: 'app-p-users',
    templateUrl: './p-users.component.html',
    styleUrls: ['./p-users.component.scss'],
})
export class PUsersComponent implements OnInit {
    availableNumUrgences: any[] = [];
    usersPro: any[] = [];
    NumeroUrgence: any[] = [];
    panelOpenState = false;
    pays: Pays[] = [];
    selectedPayss: string[] = [];
    filteredVilles: Ville[] = [];
    selectedVilles: string[] = [];
    filteredPays$: Observable<Pays[]>;
    paysFilterCtrl = new FormControl();
    proCount: number = 0;
    utilisateurs: any[] = [];
    searchTerm: string = '';
    filteredNumUrgences: NumeroUrgence[] = []; // Liste filtrée des numéros d'urgence
    /* displayedColumns: string[] = [
        'user',
        'email',
        'role',
        'status',
        'projects',
        'action',
    ];*/
    displayedColumns: string[] = [
        'titre',
        'photo',
        'description',
        'num',
        'lien',
        'pays',
        'action',
    ];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    resetFilter(): void {}

    ngOnInit() {
        this.loadNumUrgence();
        this.paysService.getPays().subscribe((data) => {
            this.pays = data;
        });
        this.filteredPays$ = this.paysFilterCtrl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPays(value))
        );

        this.numUrgenceService.getnumurgence().subscribe((data) => {
            this.usersPro = data;
            this.proCount = this.usersPro.length; // Compter le nombre total d'utilisateurs
            //console.log('jnvijnvjnv' + this.usersPro.length);
            console.log('nombre numero urgence' + this.proCount);
        });

        // Par défaut, afficher toute la liste après le chargement
        this.numUrgenceService.getnumurgence().subscribe((data) => {
            this.usersPro = data; // Récupérer la liste des numéros d'urgence
            this.filteredNumUrgences = this.usersPro; // Initialiser la liste filtrée
            this.proCount = this.usersPro.length; // Compter le nombre total d'utilisateurs
        });
    }

    removeData(id: number) {
        if (window.confirm('Are sure you want to delete this Article ?')) {
            this.numUrgenceService.deleteData(id).subscribe(
                (data) => {
                    console.log(data);
                    // this.toastr.warning(" data successfully deleted!");
                    // this.getData();
                    window.location.reload();
                },
                (error) => console.log(error)
            );
        }
    }

    editNumUrgence(id: number) {
        // Naviguer vers le composant d'édition en passant l'ID du numéro d'urgence
        this.router.navigate(['/edit-num-urgence', id]);
    }

    onSearch() {
        if (this.searchTerm) {
            // Si un terme de recherche est présent, filtrer la liste des numéros d'urgence
            this.filteredNumUrgences = this.usersPro.filter(
                (urgence) =>
                    urgence.titre
                        .toLowerCase()
                        .includes(this.searchTerm.toLowerCase()) ||
                    urgence.num
                        .toLowerCase()
                        .includes(this.searchTerm.toLowerCase()) ||
                    urgence.pays
                        .toLowerCase()
                        .includes(this.searchTerm.toLowerCase())
            );
        } else {
            // Si aucun terme de recherche, afficher toute la liste
            this.filteredNumUrgences = this.usersPro;
        }
    }

    // Fonction appelée lorsque la sélection d'un pays change
    onPaysSelectionChange(event: any, pays: string) {
        if (event.target.checked) {
            // Ajouter le pays sélectionné
            this.selectedPayss.push(pays);
        } else {
            // Retirer le pays désélectionné
            this.selectedPayss = this.selectedPayss.filter((p) => p !== pays);
        }

        console.log('pays séléctionné' + this.selectedPayss);
        // Filtrer la liste des numéros d'urgence en fonction des pays sélectionnés
        this.filterNumUrgencesByPays();
    }

    // Filtrer les numéros d'urgence en fonction des pays sélectionnés
    filterNumUrgencesByPays() {
        if (this.selectedPayss.length > 0) {
            this.filteredNumUrgences = this.usersPro.filter((numUrgence) =>
                this.selectedPayss.includes(numUrgence.pays)
            );
        } else {
            // Si aucun pays n'est sélectionné, afficher tous les numéros
            this.filteredNumUrgences = this.usersPro;
        }
    }

    private _filterPays(value: string): Pays[] {
        const filterValue = value.toLowerCase();
        return this.pays.filter((pays) =>
            pays.nom.toLowerCase().includes(filterValue)
        );
    }

    toggleVille(ville: string): void {
        const index = this.selectedVilles.indexOf(ville);
        if (index >= 0) {
            this.selectedVilles.splice(index, 1);
        } else {
            this.selectedVilles.push(ville);
        }
    }

    getUsersByVille(ville: string): number {
        return this.usersPro.filter(
            (NumeroUrgence) => NumeroUrgence.ville === ville
        ).length;
    }

    getUsersByPays(p: string): number {
        return this.usersPro.filter((NumeroUrgence) => NumeroUrgence.pays === p)
            .length;
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

    loadNumUrgence() {
        this.numUrgenceService.getnumurgence().subscribe((data) => {
            this.usersPro = data;
            console.log('Numero Urgence disponible :', this.usersPro);
        });
    }

    active = true;
    inactive = true;

    constructor(
        public dialog: MatDialog,
        public numUrgenceService: NumUrgenceServiceService,
        public villeService: VilleService,
        public paysService: PaysService,
        private router: Router
    ) {}

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
}

export interface PeriodicElement {
    email: string;
    role: string;
    projects: string;
    user: any;
    action: string;
    status: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            userName: 'Lucile Young',
            userImage: 'assets/img/user/user8.jpg',
            userDesignation: '@lyoung4a',
        },
        email: 'lyoung4a@tagus.com',
        role: 'Editor',
        status: {
            active: 'Active',
        },
        projects: '165',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Jordan Stevenson',
            userImage: 'assets/img/user/user9.jpg',
            userDesignation: '@jstevenson5c',
        },
        email: 'jstevenson5c@tagus.com',
        role: 'Admin',
        status: {
            inactive: 'Inactive',
        },
        projects: '99',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Francis Frank',
            userImage: 'assets/img/user/user10.jpg',
            userDesignation: '@ffrank7e',
        },
        email: 'ffrank7e@tagus.com',
        role: 'Maintainer',
        status: {
            active: 'Active',
        },
        projects: '75',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Phoebe Patterson',
            userImage: 'assets/img/user/user11.jpg',
            userDesignation: '@ppatterson2g',
        },
        email: 'ppatterson2g@tagus.com',
        role: 'Author',
        status: {
            active: 'Active',
        },
        projects: '100',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'James Andy',
            userImage: 'assets/img/user/user1.jpg',
            userDesignation: '@andyjm32',
        },
        email: 'andyjm32@tagus.com',
        role: 'Admin',
        status: {
            inactive: 'Inactive',
        },
        projects: '32',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Sarah Taylor',
            userImage: 'assets/img/user/user2.jpg',
            userDesignation: '@taylors32',
        },
        email: 'taylors32@tagus.com',
        role: 'Editor',
        status: {
            active: 'Active',
        },
        projects: '145',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'David Warner',
            userImage: 'assets/img/user/user3.jpg',
            userDesignation: '@davidwabc2',
        },
        email: 'davidwabc2@tagus.com',
        role: 'Author',
        status: {
            active: 'Active',
        },
        projects: '111',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Steven Smith',
            userImage: 'assets/img/user/user4.jpg',
            userDesignation: '@ssmith542',
        },
        email: 'ssmith542@tagus.com',
        role: 'Maintainer',
        status: {
            active: 'Active',
        },
        projects: '18',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Lucile Young',
            userImage: 'assets/img/user/user8.jpg',
            userDesignation: '@lyoung4a',
        },
        email: 'lyoung4a@tagus.com',
        role: 'Editor',
        status: {
            active: 'Active',
        },
        projects: '165',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Jordan Stevenson',
            userImage: 'assets/img/user/user9.jpg',
            userDesignation: '@jstevenson5c',
        },
        email: 'jstevenson5c@tagus.com',
        role: 'Admin',
        status: {
            inactive: 'Inactive',
        },
        projects: '99',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Francis Frank',
            userImage: 'assets/img/user/user10.jpg',
            userDesignation: '@ffrank7e',
        },
        email: 'ffrank7e@tagus.com',
        role: 'Maintainer',
        status: {
            active: 'Active',
        },
        projects: '75',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Phoebe Patterson',
            userImage: 'assets/img/user/user11.jpg',
            userDesignation: '@ppatterson2g',
        },
        email: 'ppatterson2g@tagus.com',
        role: 'Author',
        status: {
            active: 'Active',
        },
        projects: '100',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'James Andy',
            userImage: 'assets/img/user/user1.jpg',
            userDesignation: '@andyjm32',
        },
        email: 'andyjm32@tagus.com',
        role: 'Admin',
        status: {
            inactive: 'Inactive',
        },
        projects: '32',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Sarah Taylor',
            userImage: 'assets/img/user/user2.jpg',
            userDesignation: '@taylors32',
        },
        email: 'taylors32@tagus.com',
        role: 'Editor',
        status: {
            active: 'Active',
        },
        projects: '145',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'David Warner',
            userImage: 'assets/img/user/user3.jpg',
            userDesignation: '@davidwabc2',
        },
        email: 'davidwabc2@tagus.com',
        role: 'Author',
        status: {
            active: 'Active',
        },
        projects: '111',
        action: 'ri-more-fill',
    },
    {
        user: {
            userName: 'Steven Smith',
            userImage: 'assets/img/user/user4.jpg',
            userDesignation: '@ssmith542',
        },
        email: 'ssmith542@tagus.com',
        role: 'Maintainer',
        status: {
            active: 'Active',
        },
        projects: '18',
        action: 'ri-more-fill',
    },
];

@Component({
    selector: 'create-user-dialog',
    templateUrl: './create-user-dialog.html',
})
export class CreateUserDialogBox {
    constructor(public dialogRef: MatDialogRef<CreateUserDialogBox>) {}

    close() {
        this.dialogRef.close(true);
    }
}
