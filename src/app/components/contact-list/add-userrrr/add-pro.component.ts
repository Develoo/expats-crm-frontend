import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { PaysService } from '../../../_services/pays.service';
import { VilleService } from '../../../_services/ville.service';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LangueService } from '../../../_services/langue.service';
import { ReseauSociauxService } from '../../../_services/reseau-sociaux.service';
import { CentreIntereService } from '../../../_services/centre-intere.service';
import { MarquePrefereService } from '../../../_services/marque-prefere.service';
import { RecherchePlatformService } from '../../../_services/recherche-platform.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from 'src/app/_services/auth.service';
import { ServiceRechercheService } from 'src/app/_services/service-recherche.service';
import { FileService } from 'src/app/_services/file.service';

interface Pays {
    id: number;
    nom: string;
}

interface Ville {
    id: number;
    nom: string;
    pays: string;
}

@Component({
    selector: 'app-add-pro',
    templateUrl: './add-pro.component.html',
    styleUrls: ['./add-pro.component.scss'],
})
export class AddProComponent implements OnInit {
    selectedTabIndex: number = 0;
    formGroup: FormGroup;
    hide: boolean = true;
    hideConfirm: boolean = true;
    files: File[] = [];
    userForm: FormGroup;
    dataForm: FormGroup;
    //  form: any = {};
    user: any;
    public filename: string;
    event: any;
    form: any = {};
    // pays: Pays[] = [];
    // langues: any[] = [];
    // ville: Ville[] = [];
    selectedPays: string = '';
    selectedVille: string = '';
    //  filteredVilles: Ville[] = [];
    panelOpenState = false;
    namee = 'Angular ';
    // Méthode pour gérer la sélection de fichier
    pays: Pays[] = [];
    langues: any[] = [];
    marquePrefere: any[] = [];
    recherchePlatform: any[] = [];
    availableCentreInterets: any[] = []; // Initialiser comme tableau vide
    availableserviceRecherches: any[] = [];
    availablemarquesPreferees: any[] = [];
    reseau_sociaux: any[] = [];
    ville: Ville[] = [];
    filteredVilles: any[] = [];
    selectedcentreIntere: string[] = [];
    selectedCentreInteret: string[] = [];
    centreInteretNoms = [''];
    serviceRechercheNoms = [''];
    marquesPrefereesNoms = [''];
    languageForm: FormGroup;
    // isChecked: boolean = false;
    communicationOptions: string[] = ['SMS', 'Email', 'Notification Push'];
    preferCommOptions = ['sms', 'email', 'notification push'];

    isAccepted: boolean = false;
    isRefused: boolean = false;

    accountFields = [
        { label: 'Prénom', name: 'prenom', type: 'text' },
        { label: 'Nom', name: 'nom', type: 'text' },
        { label: 'Nom d’utilisateur', name: 'username', type: 'text' },
        { label: 'Adresse email', name: 'email', type: 'email' },
        { label: 'Mot de passe', name: 'password', type: 'password' },
        { label: 'Numéro de téléphone', name: 'numtele', type: 'text' },
        { label: 'Numéro WhatsApp', name: 'numwhats', type: 'text' },
        /*{
            label: 'prefe comunication',
            name: 'prefer_communi',
            type: 'text',
        },*/
    ];

    accountFieldcs = [
        { label: 'Question1', name: 'question1', type: 'text' },
        { label: 'Question2', name: 'question2', type: 'text' },
        { label: 'Question3', name: 'question3', type: 'text' },

        /*{
            label: 'prefe comunication',
            name: 'prefer_communi',
            type: 'text',
        },*/
    ];

    generalFields = [
        { label: 'Date de naissance', name: 'datenaiss', type: 'date' },
        {
            label: 'Genre',
            name: 'genre',
            type: 'radio',
            options: ['Masculin', 'Féminin', 'Autre'],
        },
        {
            label: 'Statut matrimonial',
            name: 'stat_matrim',
            type: 'radio',
            options: ['Célibataire', 'En couple', 'Marié(e)', 'Autre'],
        },
        { label: 'Nombre d’enfants', name: 'nbr_enf', type: 'number' },
        {
            label: 'Pays de résidence',
            name: 'pays',
            type: 'select',
            options: this.pays,
        },
        {
            label: 'Ville',
            name: 'ville',
            type: 'select',
            options: this.filteredVilles,
        },
        { label: 'Profession actuelle', name: 'prof_act', type: 'text' },
        { label: 'Secteur d’activité', name: 'sect_act', type: 'text' },
        { label: 'Employeur actuel', name: 'emp_act', type: 'text' },
    ];

    generalFieldss = [
        {
            label: 'Nombre de pays où j’ai été expatriés',
            name: 'nbr_pays_expat',
            type: 'number',
        },
    ];

    generalFieldsss = [
        {
            label: 'Je suis expatrié depuis',
            name: 'expat_depui',
            type: 'number',
        },
    ];

    constructor(
        public dialog: MatDialog,
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private userService: AuthService,
        public paysService: PaysService,
        public villeService: VilleService,
        public langueService: LangueService,
        public ReseauSociauService: ReseauSociauxService,
        public centreIntereService: CentreIntereService,
        public serviceRechercheService: ServiceRechercheService,
        public recherchePlatformService: RecherchePlatformService,
        public marquePrefereService: MarquePrefereService,
        private route: ActivatedRoute,
        private scroller: ViewportScroller,
        private router: Router,
        public fileService: FileService
    ) {}

    onCheckboxChange(option: string) {
        if (option === 'accept') {
            this.isAccepted = true;
            this.isRefused = false;
        } else if (option === 'refuse') {
            this.isAccepted = false;
            this.isRefused = true;
        }
    }

    /*onCheckboxChanges(option: string, event: any) {
        const preferCommArray = this.userForm.get(
            'prefer_communi'
        ) as FormArray;

        if (event.target.checked) {
            preferCommArray.push(this.fb.control(option));
        } else {
            const index = preferCommArray.controls.findIndex(
                (x) => x.value === option
            );
            preferCommArray.removeAt(index);
        }
    }*/

    onCheckboxChangess(event: any) {
        const preferCommArray: FormArray = this.userForm.get(
            'userPreferCommuni'
        ) as FormArray;

        if (event.target.checked) {
            preferCommArray.push(this.fb.control(event.target.value));
        } else {
            const index = preferCommArray.controls.findIndex(
                (x) => x.value === event.target.value
            );
            if (index !== -1) {
                preferCommArray.removeAt(index);
            }
        }
    }

    onCheckboxChanges(option: string, event: any) {
        const preferCommArray = this.userForm.get(
            'prefer_communi'
        ) as FormArray;

        if (event.target.checked) {
            preferCommArray.push(this.fb.control(event.target.value));
        } else {
            const index = preferCommArray.controls.findIndex(
                (x) => x.value === event.target.value
            );
            preferCommArray.removeAt(index);
        }
    }

    get userLangues() {
        return this.userForm.get('userLangues') as FormArray;
    }

    /* get userListPay() {
        return this.userForm.get('userListPay') as FormArray;
    }*/

    autoris_consent: 'accepter' | 'refuser' | null = null; // Propriété pour l'option sélectionnée

    selectOption(option: 'accepter' | 'refuser'): void {
        if (this.autoris_consent === option) {
            this.autoris_consent = null; // Désélectionner si la même option est cliquée
        } else {
            this.autoris_consent = option;
        }

        // Mettre à jour la valeur dans le formulaire réactif
        /*this.userForm.patchValue({
            autoris_consent: this.autoris_consent,
        });*/
    }

    /*getStatus(): any {
        if (this.autoris_consent === 'accepter') {
            return 'Accepté';
        } else if (this.autoris_consent === 'refuser') {
            return 'Refusé';
        }
    }*/

    addLangue() {
        const langueFormGroup = this.fb.group({
            langueNom: ['', Validators.required],
            nvComp: ['', Validators.required],
        });

        this.userLangues.push(langueFormGroup);
    }

    // Méthode pour supprimer une langue
    removeLangue(index: number) {
        this.userLangues.removeAt(index);
    }

    get userReseauSociaux() {
        return this.userForm.get('userReseauSociaux') as FormArray;
    }

    adduserReseauSociau() {
        const langueFormGroup = this.fb.group({
            reseauSociauNom: ['', Validators.required],
            lien: ['', Validators.required],
        });

        this.userReseauSociaux.push(langueFormGroup);
    }

    // Méthode pour supprimer une langue
    removeuserReseauSociau(index: number) {
        this.userReseauSociaux.removeAt(index);
    }

    get userCentreInteret(): FormArray {
        return this.userForm.get('centreInterets') as FormArray;
    }

    get userServiceRecherche(): FormArray {
        return this.userForm.get('ServiceRecherches') as FormArray;
    }

    get userMarquePreferee(): FormArray {
        return this.userForm.get('marquesPreferees') as FormArray;
    }

    createCentreInteretFormGroup(): FormGroup {
        return this.fb.group({
            centreInterets: [''],
        });
    }

    createServiceRechercheFormGroup(): FormGroup {
        return this.fb.group({
            ServiceRecherches: [''],
        });
    }

    createMarquePrfereeFormGroup(): FormGroup {
        return this.fb.group({
            marquesPreferees: [''],
        });
    }

    adduserCentreInteret(): void {
        this.availableCentreInterets.push(this.createCentreInteretFormGroup());
    }

    adduserServiceRecherche(): void {
        this.availableserviceRecherches.push(
            this.createServiceRechercheFormGroup()
        );
    }

    adduserMarquePrferee(): void {
        this.availablemarquesPreferees.push(
            this.createMarquePrfereeFormGroup()
        );
    }

    removeuserCentreInteret(index: number): void {
        if (this.availableCentreInterets.length > 1) {
            this.userCentreInteret.removeAt(index);
        }
    }

    addCentreInteret(value: string) {
        const centreInterets = this.userForm.get('centreInterets') as FormArray;
        centreInterets.push(this.fb.control(value));
    }
    removeCentreInteret(index: number) {
        const centreInterets = this.userForm.get('centreInterets') as FormArray;
        if (centreInterets.length > 1) {
            centreInterets.removeAt(index);
        }
    }

    addServiceRecherche() {
        this.serviceRechercheNoms.push('');
    }

    addMarquePreferee() {
        this.marquesPrefereesNoms.push('');
    }

    ngOnInit() {
        this.initForm();
        this.loadPays();
        this.loadLangue();
        this.loadReseauSociaux();
        this.loadCentreIntere();
        this.loadServiceRecherche();
        this.loadMarquePreferee();
    }

    initForm() {
        this.userForm = this.fb.group({
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            autoris_consent: ['', Validators.required], // Ajout du champ
            /*prefer_communi: ['', Validators.required],*/
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            numtele: ['', Validators.required],
            numwhats: ['', Validators.required],
            photo: ['', Validators.required],
            pays: ['', Validators.required],
            ville: ['', Validators.required],
            genre: ['', Validators.required],
            stat_matrim: ['', Validators.required],
            datenaiss: ['', Validators.required],
            nbr_enf: ['', Validators.required],
            nbr_pays_expat: ['', Validators.required],
            expat_depui: ['', Validators.required],
            prof_act: ['', Validators.required],
            sect_act: ['', Validators.required],
            emp_act: ['', Validators.required],
            question1: ['', Validators.required],
            question2: ['', Validators.required],
            question3: ['', Validators.required],
            userLangues: this.fb.array([]),
            //  userListPay: this.fb.array([]),
            userReseauSociaux: this.fb.array([]),
            userPreferCommuni: this.fb.array([]),
            centreInterets: this.fb.control([]), // Utiliser FormControl pour les valeurs multiples
            serviceRecherches: this.fb.control([]),
            marquesPreferees: this.fb.control([]),
        });

        // Initialize with one empty entry for each array
        this.addLangue();
        this.adduserReseauSociau();
        this.adduserCentreInteret();
    }

    loadPays() {
        this.paysService.getPays().subscribe((data) => {
            this.pays = data;
        });
    }

    loadLangue() {
        this.langueService.getLangue().subscribe((data) => {
            this.langues = data;
        });
    }

    loadCentreIntere() {
        this.centreIntereService.getCentreIntere().subscribe((data) => {
            this.availableCentreInterets = data;
            console.log(
                "Centre d'intérêts disponibles :",
                this.availableCentreInterets
            );
        });
    }

    loadServiceRecherche() {
        this.serviceRechercheService.getServiceRecherche().subscribe((data) => {
            this.availableserviceRecherches = data;
            console.log('Service disponibles :', this.serviceRechercheService);
        });
    }

    loadMarquePreferee() {
        this.marquePrefereService.getMarquePrefere().subscribe((data) => {
            this.availablemarquesPreferees = data;
            console.log(
                'Marque preferee ergfggtrg:',
                this.availablemarquesPreferees
            );
        });
    }

    /*onCheckboxChange(e: any): void {
        const centreInterets: FormArray = this.userForm.get(
            'centreInterets'
        ) as FormArray;

        if (e.target.checked) {
            centreInterets.push(this.fb.control(e.target.value));
        } else {
            const index = centreInterets.controls.findIndex(
                (x) => x.value === e.target.value
            );
            centreInterets.removeAt(index);
        }
    }*/

    loadRecherchePlatform() {
        this.recherchePlatformService
            .getRecherchePlatform()
            .subscribe((data) => {
                this.recherchePlatform = data;
            });
    }

    /*loadMarquePrefere() {
        this.marquePrefereService.getMarquePrefere().subscribe((data) => {
            this.marquePrefere = data;
        });
    }*/

    loadReseauSociaux() {
        this.ReseauSociauService.getResauSociaux().subscribe((data) => {
            this.reseau_sociaux = data;
        });
    }

    getVilleByPays(pays: string): void {
        this.selectedPays = pays;
        this.villeService.getVilleByPays(pays).subscribe((villes) => {
            this.filteredVilles = villes;
        });
    }

    goDown1() {
        this.scroller.scrollToAnchor('targetRed');
    }

    goDown2() {
        this.scroller.scrollToAnchor('targetGreen');
    }

    goDown3() {
        this.scroller.scrollToAnchor('targetBlue');
    }

    goDown4() {
        this.scroller.scrollToAnchor('targetsssBlue');
    }
    goDown5() {
        this.scroller.scrollToAnchor('targetsssnnBlue');
    }
    onSubmit(): void {
        if (this.userForm.valid) {
            this.userForm.patchValue({
                autoris_consent: this.autoris_consent,
            });
            console.log('Données du formulaire :', this.userForm.value);
            this.userService.registeruserole(this.userForm.value).subscribe(
                (response) => {
                    console.log('Utilisateur ajouté avec succès');
                },
                (error) => {
                    console.error(
                        "Erreur lors de l'ajout de l'utilisateur",
                        error
                    );
                }
            );
        }
    }

    // Si vous souhaitez réinitialiser le champ file après l'envoi du formulaire :
    resetFileInput() {
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Réinitialiser la valeur du champ file
        }
    }

    onStepChange(event: MatTabChangeEvent): void {
        console.log('Selected tab index:', event.index);
        this.selectedTabIndex = event.index;

        // Additional logic can be added here based on the selected tab
    }

    onSelect(event: any) {
        this.files.push(...event.addedFiles);
    }

    /* selectFiles(event: any) {
        console.log(event[0]);
        this.fileService.upload(event[0]).subscribe((a) => {
            this.filename = event[0].name;
            console.log('file');
        });
    }*/

    /*  selectFiles(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            console.log(file);
            this.fileService.upload(file).subscribe(() => {
                this.userForm.patchValue({
                    photo: file.name, 
                });
                console.log('File uploaded successfully');
            });
        } else {
            console.error('No file selected or input is null.');
        }
    }*/

    selectFiles(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const files = Array.from(input.files); // Permet la sélection de plusieurs fichiers

            files.forEach((file) => {
                this.fileService.upload(file).subscribe(() => {
                    this.userForm.patchValue({
                        photo: file.name, // Stockez le nom du fichier pour chaque fichier
                    });
                    console.log(`File ${file.name} uploaded successfully`);
                });
            });
        } else {
            console.error('No files selected or input is null.');
        }
    }
}
