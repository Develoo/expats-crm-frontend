import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { UserLangue } from 'src/app/model/Userlangue';
import { ColumnChangeLog } from 'src/app/model/columnchangelog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/_services/user.service';
import { LogService } from 'src/app/_services/log.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LangueService } from 'src/app/_services/langue.service';
import { RaisonexpatService } from 'src/app/_services/raisonexpat.service';
import { CentreIntereService } from 'src/app/_services/centre-intere.service';
import { MarquePrefereService } from 'src/app/_services/marque-prefere.service';
import { PrefereCommunService } from 'src/app/_services/prefere-commun.service';
import { ReseauSociauxService } from 'src/app/_services/reseau-sociaux.service';
import { ServiceRechercheService } from 'src/app/_services/service-recherche.service';
import { formatDistanceToNow } from 'date-fns';
import Quill from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Sort } from '@angular/material/sort';

interface User {
    id: number;
    userLangues: UserLangue[];
    // autres champs nécessaires
}

@Component({
    selector: 'app-products-order-details',
    templateUrl: './products-order-details.component.html',
    styleUrls: ['./products-order-details.component.scss'],
})
export class ProductsOrderDetailsComponent implements OnInit {
    users: User[] = [];
    editForm: FormGroup;
    user: any;
    data: any;
    subscription: any;
    languages: any[] = []; // Liste des langues disponibles
    reseausociaux: any[] = [];
    preferecommuns: any[] = [];
    marqueprefere: any[] = [];
    servicerecherplat: any[] = [];
    centreinterets: any[] = [];
    raisonexpats: any[] = [];
    raisonsExpat: any[] = [];
    raisonOptions: string[] = ['voyage', 'loisirs', 'travail', 'tourisme'];
    preferCommuniOptions: string[] = [
        'email',
        'sms',
        'notification push',
        'test',
    ];
    availableCentresInteret: any[] = [];
    allCentreInterets: any[] = [];
    //raisonexpats = ['voyage', 'loisirs', 'travail'];
    blurred = false;
    focused = false;
    ColumnChangeLogs: ColumnChangeLog[] = [];
    columnchangelogs: any;
    userUpdateForm: FormGroup;

    displayedColumns: string[] = ['name', 'time_diff'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<ColumnChangeLog>();

    isEditing: boolean = false;
    isEditingg: boolean = false;
    isEditinginfgen: boolean = false;
    isEditingresesocia: boolean = false;
    isEditingexper: boolean = false;
    isEditingpref: boolean = false;
    isEditingGenre: boolean = false;
    isEditingLangue: boolean[] = [];

    constructor(
        public themeService: CustomizerSettingsService,
        private userService: UserService,
        private logService: LogService,
        private router: Router,
        private _liveAnnouncer: LiveAnnouncer,
        private fb: FormBuilder,
        private langueservice: LangueService,
        private raisonexpatservice: RaisonexpatService,
        private centreintereservice: CentreIntereService,
        private servicerechercheservice: ServiceRechercheService,
        private marquepreferservice: MarquePrefereService,
        private preferecommunservice: PrefereCommunService,
        private reseausociauxservice: ReseauSociauxService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.userUpdateForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            etat: ['', Validators.required],
            roles: ['', Validators.required],
            ville: ['', Validators.required],
            pays: ['', Validators.required],
            age: ['', Validators.required],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            datenaiss: ['', Validators.required],
            genre: ['', Validators.required],
            numtele: ['', Validators.required],
            numwhats: ['', Validators.required],
            stat_matrim: ['', Validators.required],
            nbr_enf: ['', Validators.required],
            prof_act: ['', Validators.required],
            sect_act: ['', Validators.required],
            emp_act: ['', Validators.required],
            autorisConsent: ['', Validators.required],
            preferComm: ['', Validators.required],
            nbrPays: ['', Validators.required],
            userLangues: this.fb.array([this.createUserLangue()]),
        });
    }
    createUserLangue(): FormGroup {
        return this.fb.group({
            langue: this.fb.group({
                nom: ['', Validators.required],
            }),
            nv_comp: ['', Validators.required],
        });
    }

    get userLangues(): FormArray {
        return this.userUpdateForm.get('userLangues') as FormArray;
    }

    onSubmit(): void {
        if (this.userUpdateForm.valid) {
            console.log('Form data:', this.userUpdateForm.value); // Vérifiez les valeurs ici
            this.userService
                .updatesUser(this.user.id, this.userUpdateForm.value)
                .subscribe(
                    (response) => {
                        console.log('User updated successfully', response);
                    },
                    (error) => {
                        console.error('Error updating user', error);
                    }
                );
        }
    }

    /*ngOnInit(): void {
        this.getUser(49); 
        this.getLogUserById(3);
        this.getAvailableLangues();
        this.getAvailableRaisonexpat();
        this.getAvailableCentreinteret();
        this.getAvailableservrecherplatfo();
        this.getAvailablemarqueprefer();
        this.getAvailablepreferecommun();
        this.getAvailablereseauxsociaux();
    }*/

    // formBuilder: any;
    id: number;

    // Définir les champs à éditer dans un tableau
    editFields = [{ name: 'username', label: 'username', type: 'text' }];

    ngOnInit(): void {
        // Initialisation du formulaire
        this.editForm = this.formBuilder.group({
            //  titre: ['', Validators.required],
            //  pays: ['', Validators.required],
            //  categorie: ['', Validators.required],
            //  description: ['', Validators.required],
            //  photo: [''],
            username: ['', Validators.required],
        });

        // Récupération de l'ID depuis l'URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;

            // Appeler le service pour obtenir le numéro d'urgence par ID
            this.userService.getUserRoleById(this.id).subscribe(
                (data) => {
                    if (data) {
                        // Mettre à jour le formulaire avec les données reçues
                        this.editForm.patchValue({
                            username: data.username,
                            // titre: data.titre,
                            //  pays: data.pays,
                            //  categorie: data.categorie,
                            //  photo: data.photo,
                            //  description: data.description,
                        });
                        console.log('titre:' + data.username);
                        console.log('titre:' + data.photo);
                    } else {
                        console.error('No data found for the specified ID');
                    }
                },
                (error) => {
                    console.error(
                        'Error fetching numero urgence by ID:',
                        error
                    );
                }
            );
        } else {
            console.error('No ID provided in the route');
        }
    }

    // Fonction pour gérer la soumission du formulaire
    onUpdate(): void {}

    // Méthode pour récupérer la liste des langues disponibles
    getAvailableLangues(): void {
        this.langueservice.getLangue().subscribe((response) => {
            this.languages = response;
            console.log('Langues disponibles:', this.languages);
        });
    }

    getAvailablereseauxsociaux(): void {
        this.reseausociauxservice.getResauSociaux().subscribe((response) => {
            this.reseausociaux = response;
            console.log('Langues disponibles:', this.reseausociaux);
        });
    }

    getAvailablepreferecommun(): void {
        this.preferecommunservice.getpreferecommuni().subscribe((response) => {
            this.preferecommuns = response;
            console.log('Langues disponibles:', this.preferecommuns);
        });
    }

    getAvailablemarqueprefer(): void {
        this.marquepreferservice.getMarquePrefere().subscribe((response) => {
            this.marqueprefere = response;
            console.log('marque prefere disponible:', this.marqueprefere);
        });
    }

    // Méthode pour récupérer la liste des langues disponibles
    getAvailableservrecherplatfo(): void {
        this.servicerechercheservice
            .getServiceRecherche()
            .subscribe((response) => {
                this.servicerecherplat = response;
                console.log(
                    'service recherche platform:',
                    this.servicerecherplat
                );
            });
    }

    getAvailableCentreinteret(): void {
        this.centreintereservice.getCentreIntere().subscribe((response) => {
            this.centreinterets = response;
            console.log('centre interet disponibles:', this.centreinterets);
        });
    }

    getAvailableRaisonexpat(): void {
        this.raisonexpatservice.getRaisonexpat().subscribe((response) => {
            this.raisonexpats = response;
            console.log('Raison expat disponibles:', this.raisonexpats);
        });
    }

    /*  getlangue(): void{
    this.langueservice.getLangue.subscribe((response) => {
        this.languages = response;
    });}*/

    getUser(id: number): void {
        this.subscription = this.userService.getUserRoleById(id).subscribe(
            (data) => {
                this.user = data;
                this.isEditingLangue = this.user.userLangues.map(() => false);
                console.log('User data:', this.user);
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );
    }

    toggleEditLangue(index: number) {
        if (this.isEditingLangue[index]) {
            this.saveChanges();
        }
        this.isEditingLangue[index] = !this.isEditingLangue[index];
    }

    /*saveChanges() {
        console.log('Updated user data:', this.user);
        console.log(
            'Updating user with raisons expat:',
            this.user.userRaisonExpat
        );
        this.userService
            .updatesUser(this.user.id, this.user)
            .subscribe((response) => {
                console.log('User updated successfully', response);
            });
    }*/

    saveChanges() {
        if (this.editForm.valid) {
            const updatedData = this.editForm.value;
            this.userService.updatesUser(this.id, updatedData).subscribe(
                (response) => {
                    console.log(
                        'Numéro d’urgence mis à jour avec succès:',
                        response
                    );
                },
                (error) => {
                    console.error(
                        'Erreur lors de la mise à jour du numéro d’urgence:',
                        error
                    );
                }
            );
        }
    }

    getLogUserById(userRoleId: number): void {
        this.subscription = this.logService
            .getLogUserById(userRoleId)
            .subscribe(
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

    toggleEdit() {
        if (this.isEditing) {
            this.saveChanges();
        }
        this.isEditing = !this.isEditing;
    }

    toggleEditinfgen() {
        if (this.isEditinginfgen) {
            this.saveChanges();
        }
        this.isEditinginfgen = !this.isEditinginfgen;
    }

    toggleEditresesocia() {
        if (this.isEditingresesocia) {
            this.saveChanges();
        }
        this.isEditingresesocia = !this.isEditingresesocia;
    }

    toggleEditexper() {
        if (this.isEditingexper) {
            this.saveChanges();
        }
        this.isEditingexper = !this.isEditingexper;
    }

    toggleEditprefer() {
        if (this.isEditingpref) {
            this.saveChanges();
        }
        this.isEditingpref = !this.isEditingpref;
    }

    toggleEditt() {
        if (this.isEditingg) {
            this.saveChanges();
        }
        this.isEditingg = !this.isEditingg;
    }

    toggleEditGenre() {
        if (this.isEditingGenre) {
            this.saveChanges();
        }
        this.isEditingGenre = !this.isEditingGenre;
    }

    navigateToForm() {
        this.router.navigate(['/forms/basic']);
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

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

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
}
