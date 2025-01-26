import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Pipe, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDistanceToNow } from 'date-fns';
import { Validators } from 'ngx-editor';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import { CentreIntereService } from 'src/app/_services/centre-intere.service';
import { LangueService } from 'src/app/_services/langue.service';
import { LogService } from 'src/app/_services/log.service';
import { MarquePrefereService } from 'src/app/_services/marque-prefere.service';
import { PrefereCommunService } from 'src/app/_services/prefere-commun.service';
import { RaisonexpatService } from 'src/app/_services/raisonexpat.service';
import { ReseauSociauxService } from 'src/app/_services/reseau-sociaux.service';
import { ServiceRechercheService } from 'src/app/_services/service-recherche.service';
import { UserService } from 'src/app/_services/user.service';
import { ColumnChangeLog } from 'src/app/model/columnchangelog';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserLangue } from 'src/app/model/Userlangue';
import { ProRoleDTO } from 'src/app/model/ProRoleDTO';
import { MoyenPaymentService } from 'src/app/_services/moyen-payment.service';
import { CompagnSouhaitService } from 'src/app/_services/compagn-souhait.service';
import { AuthService } from 'src/app/_services/auth.service';

interface User {
    id: number;
    userLangues: UserLangue[];
    // autres champs nécessaires
}

interface MoyenPayement {
    id: number; // ou string, selon votre structure
    nom: string;
}

interface UserCompagnSouhait {
    id: number; // ou string, selon votre structure
    nom: string;
}

@Component({
    selector: 'app-edit-pro-role',
    templateUrl: './edit-pro-role.component.html',
    styleUrls: ['./edit-pro-role.component.scss'],
})
export class EditProRoleComponent {
    users: User[] = [];
    editForm: FormGroup;
    user: any = {};
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
    isEditingsectcateg: boolean = false;
    isEditingcompagnmark: boolean = false;
    isEditinglivraison: boolean = false;
    isEditingmodapaiem: boolean = false;
    isEditingserviexpat: boolean = false;
    isEditingperscont: boolean = false;
    isEditingloca: boolean = false;
    isEditinginflegale: boolean = false;
    isEditingparr: boolean = false;
    isEditingg: boolean = false;
    isEditinginfgen: boolean = false;
    isEditingresesocia: boolean = false;
    isEditingexper: boolean = false;
    isEditingpref: boolean = false;
    isEditingGenre: boolean = false;
    isEditingcommentperso: boolean = false;
    isEditingLangue: boolean[] = [];
    moyensPayementOptions: any[] = [];
    compagnSouhaitOptions: any[] = [];
    etats: string[] = ['Actif', 'Refusé', 'En attente'];

    /* moyensPayementOptions = [
        { id: 1, nom: 'PayPal' },
        { id: 2, nom: 'Carte de Crédit' },
        { id: 3, nom: 'Virement Bancaire' },
    ];*/

    livrai_dispo = [];

    proRole: any = {
        moyenPayement: [
            { id: 1, nom: 'PayPal' },
            { id: 2, nom: 'Carte de Crédit' },
        ],
    };

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
        private formBuilder: FormBuilder,
        private moyenPaymentService: MoyenPaymentService,
        private compagnSouhaitService: CompagnSouhaitService,
        private authService: AuthService
    ) {
        this.userUpdateForm = this.fb.group({
            username: ['', Validators.required],
            //email: ['', [Validators.required, Validators.email]],
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
    editFields = [
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'numtel', label: 'Téléphone', type: 'text' },
        { name: 'numwhats', label: 'WhatsApp', type: 'text' },
        { name: 'site_web', label: 'Site web', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn', type: 'text' },
        { name: 'facebook', label: 'Facebook', type: 'text' },
        { name: 'twitter', label: 'X', type: 'text' },
    ];

    editFieldsectcateg = [
        { name: 'secteuractivite', label: 'Secteur activité', type: 'text' },
        { name: 'categorie', label: 'Catégories', type: 'text' },
    ];

    editFieldsloca = [
        { name: 'rue', label: 'Rue', type: 'text' },
        { name: 'ville', label: 'ville', type: 'text' },
        { name: 'codepostal', label: 'codepostal', type: 'text' },
        { name: 'pays', label: 'pays', type: 'text' },
        { name: 'liengooglemap', label: 'Google Maps', type: 'text' },
    ];

    editFieldsinflegale = [
        { name: 'num_siret', label: 'Numéro de SIRET', type: 'text' },
        { name: 'num_tva', label: 'Numéro de TVA', type: 'text' },
        {
            name: 'certif_accred',
            label: 'Certifications et accréditations',
            type: 'text',
        },
    ];

    editFieldsperscont = [
        { name: 'nom_pers_cont', label: 'Nom', type: 'text' },
        { name: 'prenom_pers_cont', label: 'Prenom', type: 'text' },
        { name: 'foncti_pers_cont', label: 'Fonction', type: 'text' },
        { name: 'email_pers_cont', label: 'Email', type: 'text' },
        { name: 'num_tel_pers_cont', label: 'Téléphone', type: 'text' },
        { name: 'num_what_pers_cont', label: 'WhatsApp', type: 'text' },
    ];

    editFieldsserviexpat = [
        { name: 'servic_spec_expat', label: '', type: 'text' },
    ];

    editFieldsparr = [
        { name: 'premierparrain', label: 'Premier parrain:', type: 'text' },
        { name: 'secondparrain', label: 'Second parrain', type: 'text' },
    ];

    editFieldscommentperso = [
        { name: 'commentperso', label: '', type: 'text' },
    ];

    editFieldslivraison = [
        { name: 'livrai_dispo', label: 'Livraison disponible :', type: 'text' },
    ];

    editFieldslivraisons = [
        { name: 'frai_livrais', label: 'Frais de livraison', type: 'text' },
        {
            name: 'condit_livrai',
            label: 'Conditions livraison :',
            type: 'text',
        },
    ];

    editFieldscompagnmark = [
        {
            name: 'interet_compag_mark',
            label: 'Intérêt pour les campagnes marketing ciblées',
            type: 'text',
        },
    ];

    editFieldscompagnmarks = [
        {
            name: 'budg_pub_mensuel',
            label: 'Budget publicitaire mensuel :',
            type: 'text',
        },
    ];

    editFieldsmodapaiem = [
        {
            name: 'moyenPayement',
            label: 'Moyens paiement acceptés :',
            type: 'text',
        },
    ];

    editFieldscompagnSouhait = [
        {
            name: 'userCompagnSouhait',
            label: 'Types de campagnes souhaitées :',
            type: 'text',
        },
    ];

    ngOnInit(): void {
        // Initialisation du formulaire
        this.editForm = this.formBuilder.group({
            username: ['', Validators.required],
            //prenom: ['', Validators.required],
            email: ['', Validators.required],
            numtel: ['', Validators.required],
            numwhats: ['', Validators.required],
            site_web: ['', Validators.required],
            linkedin: ['', Validators.required],
            facebook: ['', Validators.required],
            twitter: ['', Validators.required],
            rue: ['', Validators.required],
            ville: ['', Validators.required],
            codepostal: ['', Validators.required],
            pays: ['', Validators.required],
            liengooglemap: ['', Validators.required],
            num_siret: ['', Validators.required],
            num_tva: ['', Validators.required],
            certif_accred: ['', Validators.required],
            nom_pers_cont: ['', Validators.required],
            prenom_pers_cont: ['', Validators.required],
            foncti_pers_cont: ['', Validators.required],
            email_pers_cont: ['', Validators.required],
            num_tel_pers_cont: ['', Validators.required],
            num_what_pers_cont: ['', Validators.required],
            servic_spec_expat: ['', Validators.required],
            premierparrain: ['', Validators.required],
            secondparrain: ['', Validators.required],
            // moyenPayement: ['', Validators.required],
            moyenPayement: [[]],
            livrai_dispo: ['', Validators.required],
            frai_livrais: ['', Validators.required],
            condit_livrai: ['', Validators.required],
            interet_compag_mark: ['', Validators.required],
            budg_pub_mensuel: ['', Validators.required],
            userCompagnSouhait: [[]],
            commentperso: ['', Validators.required],
            etat: ['', Validators.required],
            secteuractivite: ['', Validators.required],
            categorie: ['', Validators.required],
        });

        // Récupération de l'ID depuis l'URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;

            this.userService.getUserRoleById(this.id).subscribe(
                (data) => {
                    if (data) {
                        this.editForm.patchValue({
                            username: data.username,
                            etat: data.etat,
                            email: data.email,
                            numtel: data.numtel,
                            numwhats: data.numwhats,
                            site_web: data.site_web,
                            linkedin: data.linkedin,
                            facebook: data.facebook,
                            twitter: data.twitter,
                            rue: data.rue,
                            ville: data.ville,
                            codepostal: data.codepostal,
                            pays: data.pays,
                            liengooglemap: data.liengooglemap,
                            num_siret: data.num_siret,
                            num_tva: data.num_tva,
                            certif_accred: data.certif_accred,
                            nom_pers_cont: data.nom_pers_cont,
                            prenom_pers_cont: data.prenom_pers_cont,
                            foncti_pers_cont: data.foncti_pers_cont,
                            email_pers_cont: data.email_pers_cont,
                            num_tel_pers_cont: data.num_tel_pers_cont,
                            num_what_pers_cont: data.num_what_pers_cont,
                            servic_spec_expat: data.servic_spec_expat,
                            premierparrain: data.premierparrain,
                            secondparrain: data.secondparrain,
                            moyenPayement: data.moyenPayement,
                            livrai_dispo: data.livrai_dispo,
                            frai_livrais: data.frai_livrais,
                            condit_livrai: data.condit_livrai,
                            interet_compag_mark: data.interet_compag_mark,
                            budg_pub_mensuel: data.budg_pub_mensuel,
                            userCompagnSouhait: data.userCompagnSouhait,
                            commentperso: data.commentperso,
                            secteuractivite: data.secteuractivite,
                            categorie: data.categorie,
                        });
                        this.user = data;
                        console.log('titre:' + data.username);
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

        if (idParam) {
            this.id = +idParam; // Assurez-vous que l'ID est bien défini
            console.log("ID récupéré depuis l'URL :", this.id); // Ajoutez un log ici pour vérifier
        } else {
            console.error('No ID provided in the route');
        }

        this.loadMoyensPayement();
        this.loadCompagnSouhait();
    }

    /*   onChangeEtat(user: any, event: any): void {
        if (!user.id) {
            console.error("L'ID de l'utilisateur est manquant.");
            return;
        }

        user.etat = event.value;
        this.authService.updateUser(user.id, user).subscribe(
            (response) => {
                console.log('Mise à jour réussie', response);
            },
            (error) => {
                console.error(
                    "Erreur lors de la mise à jour de l'état de l'utilisateur:",
                    error
                );
            }
        );
    }*/

    onChangeEtat(etat: string): void {
        if (this.id) {
            console.log(
                "Modification de l'état pour l'ID utilisateur :",
                this.id
            );
            // Ici, vous pouvez utiliser this.id pour vos opérations
            // Par exemple, une requête pour mettre à jour l'état d'un utilisateur
            this.authService.updateUserr(this.id, etat).subscribe(
                (response) => {
                    console.log('État mis à jour avec succès', response);
                },
                (error) => {
                    console.error(
                        "Erreur lors de la mise à jour de l'état :",
                        error
                    );
                }
            );
        } else {
            console.error("L'ID de l'utilisateur est manquant.");
        }
    }

    loadCompagnSouhait(): void {
        this.compagnSouhaitService.getCompagnSouhait().subscribe(
            (data: UserCompagnSouhait[]) => {
                this.compagnSouhaitOptions = data;
            },

            (error) => {
                console.error(
                    'Erreur lors du chargement des moyens de paiement',
                    error
                );
            }
        );
    }

    loadMoyensPayement(): void {
        this.moyenPaymentService.getMoyenPayment().subscribe(
            (data: MoyenPayement[]) => {
                this.moyensPayementOptions = data;
            },
            (error) => {
                console.error(
                    'Erreur lors du chargement des moyens de paiement',
                    error
                );
            }
        );
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

    /* saveChanges() {
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
    }*/

    saveChanges(): void {
        const user = this.editForm.value;
        console.log('Données mises à jour :', user);
        this.userService.updatesUser(this.id, user).subscribe(
            (response) => {
                console.log('Utilisateur mis à jour avec succès:', response);
            },
            (error) => {
                console.error(
                    "Erreur lors de la mise à jour de l'utilisateur:",
                    error
                );
            }
        );
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

    toggleEditsectcateg() {
        if (this.isEditingsectcateg) {
            this.saveChanges();
        }
        this.isEditingsectcateg = !this.isEditingsectcateg;
    }

    toggleEditcompagnmark() {
        if (this.isEditingcompagnmark) {
            this.saveChanges();
        }
        this.isEditingcompagnmark = !this.isEditingcompagnmark;
    }

    toggleEditlivraison() {
        if (this.isEditinglivraison) {
            this.saveChanges();
        }
        this.isEditinglivraison = !this.isEditinglivraison;
    }

    toggleEditmodapaiem() {
        if (this.isEditingmodapaiem) {
            this.saveChanges();
        }
        this.isEditingmodapaiem = !this.isEditingmodapaiem;
    }

    toggleEditserviexpat() {
        if (this.isEditingserviexpat) {
            this.saveChanges();
        }
        this.isEditingserviexpat = !this.isEditingserviexpat;
    }

    toggleEditperscont() {
        if (this.isEditingperscont) {
            this.saveChanges();
        }
        this.isEditingperscont = !this.isEditingperscont;
    }

    toggleEditloca() {
        if (this.isEditingloca) {
            this.saveChanges();
        }
        this.isEditingloca = !this.isEditingloca;
    }

    toggleEditinflegale() {
        if (this.isEditinginflegale) {
            this.saveChanges();
        }
        this.isEditinginflegale = !this.isEditinginflegale;
    }

    toggleEditparr() {
        if (this.isEditingparr) {
            this.saveChanges();
        }
        this.isEditingparr = !this.isEditingparr;
    }

    /*toggleEdit() {
        this.isEditing = !this.isEditing;
    }*/

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

    toggleEditcommentperso() {
        if (this.isEditingcommentperso) {
            this.saveChanges();
        }
        this.isEditingcommentperso = !this.isEditingcommentperso;
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

    form = new FormGroup({
        username: new FormControl(''),
    });

    getFormControl(name: string): FormControl {
        return this.editForm.get(name) as FormControl;
    }

    getMoyenPayementNom(fieldName: string): string {
        const moyenPayement = this.getFormControl(fieldName).value;

        if (Array.isArray(moyenPayement)) {
            // Retourne une chaîne de noms, séparée par des virgules
            return moyenPayement.map((mp) => mp.nom).join(', ');
        } else if (moyenPayement && moyenPayement.nom) {
            return moyenPayement.nom;
        }

        return '';
    }

    getCompagnSouhaitNom(fieldName: string): string {
        const compagnSouhait = this.getFormControl(fieldName).value;

        if (Array.isArray(compagnSouhait)) {
            // Retourne une chaîne de noms, séparée par des virgules
            return compagnSouhait.map((mp) => mp.nom).join(', ');
        } else if (compagnSouhait && compagnSouhait.nom) {
            return compagnSouhait.nom;
        }

        return '';
    }

    isMoyenPayementSelected(moyenPayement: MoyenPayement): boolean {
        const moyenPayementList: MoyenPayement[] =
            this.getFormControl('moyenPayement').value || [];
        return moyenPayementList.some(
            (mp: MoyenPayement) => mp.id === moyenPayement.id
        );
    }

    isCompagnSouhaitSelected(userCompagnSouhait: UserCompagnSouhait): boolean {
        const userCompagnSouhaitList: UserCompagnSouhait[] =
            this.getFormControl('userCompagnSouhait').value || [];
        return userCompagnSouhaitList.some(
            (mp: UserCompagnSouhait) => mp.id === userCompagnSouhait.id
        );
    }

    onMoyenPayementChange(moyenPayement: MoyenPayement): void {
        const moyenPayementList: MoyenPayement[] =
            this.getFormControl('moyenPayement').value || [];
        const index = moyenPayementList.findIndex(
            (mp: MoyenPayement) => mp.id === moyenPayement.id
        );

        if (index === -1) {
            moyenPayementList.push(moyenPayement);
        } else {
            moyenPayementList.splice(index, 1);
        }
        this.getFormControl('moyenPayement').setValue(moyenPayementList);
    }

    onCompagnSouhaitChange(userCompagnSouhait: UserCompagnSouhait): void {
        const compagnSouhaitList: UserCompagnSouhait[] =
            this.getFormControl('userCompagnSouhait').value || [];
        const index = compagnSouhaitList.findIndex(
            (mp: UserCompagnSouhait) => mp.id === userCompagnSouhait.id
        );

        if (index === -1) {
            compagnSouhaitList.push(userCompagnSouhait);
        } else {
            compagnSouhaitList.splice(index, 1);
        }
        this.getFormControl('userCompagnSouhait').setValue(compagnSouhaitList);
    }

    // Vérifie si un moyen de paiement est sélectionné
}
