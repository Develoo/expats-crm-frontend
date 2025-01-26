import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { map, Observable, startWith, Subject } from 'rxjs';
import { ToggleService } from '../../common/header/toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BlogService } from 'src/app/_services/blog.service';
import { CategorieService } from 'src/app/_services/categorie.service';
import { PaysService } from 'src/app/_services/pays.service';
import { VilleService } from 'src/app/_services/ville.service';
import { Router } from '@angular/router';
import { NumUrgenceServiceService } from 'src/app/_services/num-urgence-service.service';
import * as XLSX from 'xlsx';

export interface Blog {
    id: number;
    pays: string;
    title: string;
    date: Date;
    content: string;
    photo: string;
    // categorie: string;
    //lien: string;
    blogScategories: BlogSCategorie[]; // Assume that BlogSCategorie is another interface
    blogCategorie: BlogCategorie; // Assume that BlogCategorie is another interface
    tag: Tag[];
}

export interface BlogCategorie {
    id: number;
    name: string;
}

export interface BlogSCategorie {
    id: number;
    nom: string;
}

export interface Tag {
    id: number;
    name: string;
}

interface Pays {
    id: number;
    nom: string;
}

interface Categorie {
    id: number;
    nom: string;
}

interface Ville {
    id: number;
    nom: string;
    pays: string;
}

@Component({
    selector: 'app-list-num-urgence',
    templateUrl: './list-num-urgence.component.html',
    styleUrls: ['./list-num-urgence.component.scss'],
})
export class ListNumUrgenceComponent implements OnInit, OnDestroy {
    blogs: Blog[] = []; // Stocke la liste des blogs
    filteredBlogs: Blog[] = [];
    scategorieId: number = 1; // ID de la BlogSCategorie à utiliser pour filtrer
    usersPro: any[] = [];
    utilisateurs: any[] = [];
    ambassadeurs: any[] = [];
    usersProActif: any[] = [];
    usersProEnattente: any[] = [];
    usersProRefuse: any[] = [];
    etats: string[] = ['En attente', 'Actif', 'Refusé'];
    @ViewChild(MatAccordion) accordion: MatAccordion;
    panelOpenState = false;
    categoryId: number;
    proCount: number = 0;
    userCount: number = 0;
    ambassadeurCount: number = 0;
    ActifCount: number = 0;
    EnattenteCount: number = 0;
    RefuseCount: number = 0;
    categorie: Categorie[] = [];
    pays: Pays[] = [];
    ville: Ville[] = [];
    isToggled = false;
    fileName = 'liste-num-urgence.xlsx';
    //categorie: Categorie[] = [];
    notifications: any[] = [];
    categories: string[] = [
        'Ambassades et consulats',
        'Assistance médicale',
        'Assistance routière',
        'Police secours',
        'Rapatriement',
        'Autre',
    ];
    filteredNotifications: any[] = [];

    blogScategories: BlogSCategorie[] = [
        { id: 1, nom: 'Guides pratiques' },
        { id: 2, nom: 'Démarches administratives' },
        { id: 3, nom: "Retour d'expatriation" },
        { id: 4, nom: "En cas d'urgence" },
        { id: 5, nom: 'La santé dans le monde' },
    ];

    // selectedCategories: number[] = [];
    selectedCategories: string[] = [];

    searchTerm: string = '';
    selectedVilles: string[] = [];

    filteredVilles: Ville[] = [];
    selectedPays: string | null = null;
    selectedPayss: string[] = [];

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

    /* toggleCategory(categoryName: string): void {
      const index = this.selectedCategories.indexOf(categoryName);
      if (index === -1) {
          this.selectedCategories.push(categoryName);
      } else {
          this.selectedCategories.splice(index, 1);
      }
  }*/
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
                user.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégories (dans les utilisateurs)
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(
                (user) => this.selectedCategories.includes(user.categorie) // Si "categorie" est une propriété de user
            );
        }

        return filtered;
    }

    onCategorieChange(categorie: string): void {
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
    get filteredUsersProActif(): any[] {
        let filtered = this.usersProActif;
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedCategories.includes(user.categorie)
            );
        }

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
    get filteredUsersProEnAttente(): any[] {
        let filtered = this.usersProEnattente;
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedCategories.includes(user.categorie)
            );
        }

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
    get filteredUsersProRefuse(): any[] {
        let filtered = this.usersProRefuse;
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter((user) =>
                this.selectedCategories.includes(user.categorie)
            );
        }

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
        private blogService: BlogService,
        public categorieservice: CategorieService,
        public paysService: PaysService,
        public villeService: VilleService,
        private router: Router,
        private numurgenceService: NumUrgenceServiceService
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
        this.numurgenceService.getnumurgence().subscribe((data) => {
            this.usersPro = data;
            this.proCount = this.usersPro.length;
            console.log('num urgence est' + this.usersPro);
        });
        /* this.getBlogsByCategorie(this.scategorieId);
        this.filterBlogs();
        this.authService.getRoleUserEtEmbassadeur().subscribe((data) => {
            this.utilisateurs = data;
            this.userCount = this.utilisateurs.length; 
        });
        this.authService.getRoleEmbassadeur().subscribe((data) => {
            this.ambassadeurs = data;
            this.ambassadeurCount = this.ambassadeurs.length; 
        });
        this.blogService.getBlogCtaegLire().subscribe((data) => {
            this.usersProActif = data;
            this.ActifCount = this.usersProActif.length; 
        });
        this.blogService.getBlogCtaegEcouter().subscribe((data) => {
            this.usersProEnattente = data;
            this.EnattenteCount = this.usersProEnattente.length; 
        });
        this.blogService.getBlogCtaegRegarder().subscribe((data) => {
            this.usersProRefuse = data;
            this.RefuseCount = this.usersProRefuse.length; 
        });
        this.categorieservice.getCategorie().subscribe((data) => {
            this.categorie = data;
        });
        this.filteredCategories = this.categoryFilterCtrl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterCategories(value))
        );*/
        this.filteredPays$ = this.paysFilterCtrl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPays(value))
        );
        this.paysService.getPays().subscribe((data) => {
            this.pays = data;
        });
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

    editNumUrgence(id: number) {
        // Naviguer vers le composant d'édition en passant l'ID du numéro d'urgence
        this.router.navigate(['/edit-num-urgence', id]);
    }

    removeData(id: number) {
        if (window.confirm('Are sure you want to delete this Notification ?')) {
            this.numurgenceService.deleteData(id).subscribe(
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

    // Méthode pour appeler le service et récupérer les blogs
    getBlogsByCategorie(scategorieId: number): void {
        this.blogService
            .getBlogsByBlogScategorie(scategorieId)
            .subscribe((data: Blog[]) => {
                this.blogs = data.map((blog) => ({
                    ...blog,
                    date: new Date(blog.date), // Conversion si nécessaire
                }));
                console.log('blog by scategorie blog' + this.blogs);
            });
    }

    // Ajoutez un log pour voir si la catégorie sélectionnée est correcte
    /*  onCategoryChange(categoryId: number): void {
        if (this.selectedCategories.includes(categoryId)) {
            this.selectedCategories = this.selectedCategories.filter(
                (c) => c !== categoryId
            );
        } else {
            this.selectedCategories.push(categoryId);
        }

        console.log('Selected Categories:', this.selectedCategories); 

        this.filterBlogs(); 
    }*/

    /*  filterBlogs(): void {
        if (this.selectedCategories.length === 0) {
            this.filteredBlogs = this.blogs; 
        } else {
            this.filteredBlogs = [];
            this.selectedCategories.forEach((categoryId) => {
                this.blogService
                    .getBlogsByBlogScategorie(categoryId)
                    .subscribe((blogs: Blog[]) => {
                        if (blogs.length > 0) {
                            console.log('Blogs fetched for category:', blogs); 
                            this.filteredBlogs.push(...blogs); 
                        } else {
                            console.log('No blogs found for this category');
                        }
                    });
            });
        }
    }*/

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /* private _filterCategories(value: string): Categorie[] {
        const filterValue = value.toLowerCase();
        return this.categorie.filter((cat) =>
            cat.nom.toLowerCase().includes(filterValue)
        );
    }*/
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
        this.authService.updateUser(user.id, user).subscribe();
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

    getNumurgenceByCategorie(cat: string): number {
        const filteredUsers = this.usersPro.filter(
            (user) =>
                user.categorie &&
                user.categorie.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        console.log(`Catégorie: ${cat}, Nombre: ${filteredUsers.length}`);
        return filteredUsers.length;
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

    /* categlir: number = 0;
  usersPro: any[] = [];
  filteredBlogs: Blog[] = [];
  blogcateglir: any[] = [];
  proCount: number = 0;
  searchTerm: string = '';
  panelOpenState = false;
  pays: Pays[] = [];
  categories: string[] = [
      'Offre spéciale',
      'Produit',
      'Article',
      'Evènement',
  ];
  selectedPayss: string[] = [];
  utilisateurs: any[] = [];
  selectedVilles: string[] = [];
  filteredPays$: Observable<Pays[]>;
  paysFilterCtrl = new FormControl();
  selectedCategories: string[] = [];

  constructor(
      public dialog: MatDialog,
      public blogService: BlogService,
      public paysService: PaysService,
      private router: Router
  ) {}

  ngOnInit() {
      this.loadblog();
      this.paysService.getPays().subscribe((data) => {
          this.pays = data;
      });
      this.filteredPays$ = this.paysFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterPays(value))
      );

      this.blogService.getblog().subscribe((data) => {
          this.usersPro = data;
          this.filteredBlogs = this.usersPro;
          this.proCount = this.usersPro.length;
      });

      this.blogService.getBlogCtaegLire().subscribe((data) => {
          this.blogcateglir = data;
          this.categlir = this.blogcateglir.length;
          console.log('nombre categorie lire' + this.categlir);
      });
  }

  get filteredUsersProActif(): any[] {
      let filtered = this.blogcateglir;
      if (this.selectedCategories.length > 0) {
          filtered = filtered.filter((user) =>
              this.selectedCategories.includes(user.categorie)
          );
      }

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

  private _filterPays(value: string): Pays[] {
      const filterValue = value.toLowerCase();
      return this.pays.filter((pays) =>
          pays.nom.toLowerCase().includes(filterValue)
      );
  }

  loadblog() {
      this.blogService.getblog().subscribe((data) => {
          this.usersPro = data;
          console.log('Blog disponible :', this.usersPro);
      });
  }

  onSearch() {
      if (this.searchTerm) {
          this.filteredBlogs = this.usersPro.filter(
              (blog) =>
                  blog.title
                      .toLowerCase()
                      .includes(this.searchTerm.toLowerCase()) ||
                  blog.date
                      .toLowerCase()
                      .includes(this.searchTerm.toLowerCase())
          );
      } else {
          this.filteredBlogs = this.usersPro;
      }
  }

  onPaysSelectionChange(event: any, pays: string) {
      if (event.target.checked) {
          this.selectedPayss.push(pays);
      } else {
          this.selectedPayss = this.selectedPayss.filter((p) => p !== pays);
      }

      console.log('pays séléctionné' + this.selectedPayss);
      this.filterNumUrgencesByPays();
  }

  onCategorieSelectionChange(event: any, categorie: string) {
      if (event.target.checked) {
          this.selectedCategories.push(categorie);
      } else {
          this.selectedCategories = this.selectedCategories.filter(
              (c) => c !== categorie
          );
      }

      this.filterNumUrgences();
  }

  filterNumUrgences() {
      this.filteredBlogs = this.usersPro;

      if (this.selectedPayss.length > 0) {
          this.filteredBlogs = this.filteredBlogs.filter((numUrgence) =>
              this.selectedPayss.includes(numUrgence.pays)
          );
      }
  }

  getUsersByCategorie(c: string): number {
      return this.usersPro.filter((numUrgence) => numUrgence.categorie === c)
          .length;
  }

  filterNumUrgencesByPays() {
      if (this.selectedPayss.length > 0) {
          this.filteredBlogs = this.usersPro.filter((numUrgence) =>
              this.selectedPayss.includes(numUrgence.pays)
          );
      } else {
          this.filteredBlogs = this.usersPro;
      }
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

  editNotification(id: number) {
      this.router.navigate(['/edit-notification', id]);
  }*/
}
