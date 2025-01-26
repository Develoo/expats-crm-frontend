import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { ReseauSociauxService } from 'src/app/_services/reseau-sociaux.service';
import { FileService } from 'src/app/_services/file.service';

@Component({
    selector: 'app-add-user-pro',
    templateUrl: './add-user-pro.component.html',
    styleUrls: ['./add-user-pro.component.scss'],
})
export class AddUserProComponent {
    goDown1() {
        this.scroller.scrollToAnchor('targetRedss');
    }

    goDown2() {
        this.scroller.scrollToAnchor('targetRed');
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
    goDown6() {
        this.scroller.scrollToAnchor('servexpat');
    }
    goDown7() {
        this.scroller.scrollToAnchor('parrai');
    }
    goDown8() {
        this.scroller.scrollToAnchor('perscontact');
    }
    goDown9() {
        this.scroller.scrollToAnchor('commentperso');
    }

    userForm: FormGroup;
    openingHours: FormArray;
    // secteurs = ['assurance', 'banque']; // Les options du multiselect
    reseau_sociaux: any[] = [];
    daysOfWeek: string[] = [
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
        'dimanche',
    ];

    accountFields = [
        { label: 'Nom entreprise', name: 'nomentreprise', type: 'text' },

        { label: 'Nom d’utilisateur', name: 'username', type: 'text' },
        { label: 'Adresse email', name: 'email', type: 'email' },
        { label: 'Mot de passe', name: 'password', type: 'password' },
        { label: 'Numéro de téléphone', name: 'numtel', type: 'text' },
        { label: 'Numéro WhatsApp', name: 'numwhats', type: 'text' },

        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    accountFieldspc = [
        { label: 'Prénom ', name: 'prenom_pers_cont', type: 'text' },

        { label: 'Nom ', name: 'nom_pers_cont', type: 'text' },
        { label: 'Fonction', name: 'foncti_pers_cont', type: 'text' },
        { label: 'Adresse email', name: 'email_pers_cont', type: 'email' },
        {
            label: 'Numéro de téléphone',
            name: 'num_tel_pers_cont',
            type: 'text',
        },
        { label: 'Numéro WhatsApp', name: 'num_what_pers_cont', type: 'text' },

        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    accountFieldspp = [
        { label: 'Premier parrain ', name: 'premierparrain', type: 'text' },

        { label: 'Second parrain ', name: 'secondparrain', type: 'text' },
        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    accountFieldsppnour = [
        { label: ' ', name: 'premierparrain', type: 'text' },

        { label: 'Second parrain ', name: 'secondparrain', type: 'text' },
        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    /*accountFieldspc = [
        { label: 'Prénom', name: 'prenom_pers_cont', type: 'text' },

        { label: 'Nom', name: 'username', type: 'text' },
        { label: 'Adresse email', name: 'email', type: 'email' },
        { label: 'Mot de passe', name: 'password', type: 'password' },
        { label: 'Numéro de téléphone', name: 'numtel', type: 'text' },
        { label: 'Numéro WhatsApp', name: 'numwhats', type: 'text' },

        
    ];*/

    accountFieldslo = [
        { label: 'Rue', name: 'rue', type: 'text' },
        { label: 'ville', name: 'ville', type: 'text' },
        { label: 'Code postal', name: 'codepostal', type: 'text' },
        { label: 'Google Maps', name: 'liengooglemap', type: 'text' },

        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    accountFieldsexp = [
        {
            label: 'Services spécifiques pour les expatriés',
            name: 'servic_spec_expat',
            type: 'text',
        },

        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    accountFieldcommpers = [
        {
            label: 'Services spécifiques pour les expatriés',
            name: 'commentperso',
            type: 'text',
        },

        /*{
        label: 'prefe comunication',
        name: 'prefer_communi',
        type: 'text',
    },*/
    ];

    /* accountFieldsho = [
        {
            label: 'Services spécifiques pour les expatriés',
            name: 'openingTime',
            type: 'time',
        },
        {
            label: 'Services spécifiques pour les expatriés',
            name: 'closingTime',
            type: 'time',
        },
    ];*/

    accountFieldsen = [
        { label: 'Frais de livraison', name: 'frai_livrais', type: 'text' },

        {
            label: 'Conditions de livraison',
            name: 'condit_livrai',
            type: 'text',
        },

        /*{
      label: 'prefe comunication',
      name: 'prefer_communi',
      type: 'text',
  },*/
    ];

    accountFieldsss = [
        {
            label: 'Budget publicitaire mensuel',
            name: 'budg_pub_mensuel',
            type: 'text',
        },
    ];

    accountFieldss = [
        {
            label: 'Description de lentreprise',
            name: 'descriptionentre',
            type: 'text',
        },

        {
            label: 'Numéro de SIRET',
            name: 'num_siret',
            type: 'text',
        },
        {
            label: 'Numéro de TVA',
            name: 'num_tva',
            type: 'text',
        },
        {
            label: 'Certifications et accréditations',
            name: 'certif_accred',
            type: 'text',
        },
        {
            label: 'Site web',
            name: 'site_web',
            type: 'text',
        },
    ];

    ngOnInit() {
        this.initForm();
        this.loadReseauSociaux();
    }
    form: any = {};
    /* livrai_dispo: 'oui' | 'non' | null = null;

    selectOptionssm(option: 'oui' | 'non'): void {
        this.livrai_dispo = option;
        this.form.get('livrai_dispo')?.setValue(option); // Met à jour la valeur du formulaire
    }*/

    constructor(
        private fb: FormBuilder,
        private userService: AuthService,
        public ReseauSociauService: ReseauSociauxService,
        private scroller: ViewportScroller,
        public themeService: CustomizerSettingsService,
        public fileService: FileService
    ) {}

    initForm() {
        this.userForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            pays: ['', Validators.required],
            nomentreprise: ['', Validators.required],
            accept_platf: ['', Validators.required],
            servic_spec_expat: ['', Validators.required],
            numtel: ['', Validators.required],
            numwhats: ['', Validators.required],
            commentperso: ['', Validators.required],
            photo: ['', Validators.required],
            photoentre: ['', Validators.required],
            secteuractivite: ['', Validators.required],
            descriptionentre: ['', Validators.required],
            /*openingTime: ['', Validators.required],
            closingTime: ['', Validators.required],*/
            num_siret: ['', Validators.required],
            liengooglemap: ['', Validators.required],
            num_tva: ['', Validators.required],
            certif_accred: ['', Validators.required],
            site_web: ['', Validators.required],
            moy_payem: ['', Validators.required],
            rue: ['', Validators.required],
            ville: ['', Validators.required],
            prenom_pers_cont: ['', Validators.required],
            nom_pers_cont: ['', Validators.required],
            foncti_pers_cont: ['', Validators.required],
            email_pers_cont: ['', Validators.required],
            num_tel_pers_cont: ['', Validators.required],
            num_what_pers_cont: ['', Validators.required],
            premierparrain: ['', Validators.required],
            secondparrain: ['', Validators.required],
            codepostal: ['', Validators.required],
            livrai_dispo: ['', Validators.required],
            frai_livrais: ['', Validators.required],
            condit_livrai: ['', Validators.required],
            interet_compag_mark: ['', Validators.required],
            budg_pub_mensuel: ['', Validators.required],
            userReseauSociaux: this.fb.array([]),
            /*userTypeCompagnSouhait: this.fb.array([]),*/
            //  openingHours: this.fb.array([this.createOpeningHour()]),
        });

        this.adduserReseauSociau();
    }

    /* createOpeningHour(): FormGroup {
        return this.fb.group({
            dayOfWeek: [''],
            openingTime: [''],
            closingTime: [''],
        });
    }

    addOpeningHour() {
        this.openingHours.push(this.createOpeningHour());
    }

    removeOpeningHour(index: number) {
        this.openingHours.removeAt(index);
    }*/

    get userReseauSociaux() {
        return this.userForm.get('userReseauSociaux') as FormArray;
    }

    removeuserReseauSociau(index: number) {
        this.userReseauSociaux.removeAt(index);
    }

    adduserReseauSociau() {
        const langueFormGroup = this.fb.group({
            reseauSociauNom: ['', Validators.required],
            lien: ['', Validators.required],
        });

        this.userReseauSociaux.push(langueFormGroup);
    }

    loadReseauSociaux() {
        this.ReseauSociauService.getResauSociaux().subscribe((data) => {
            this.reseau_sociaux = data;
            console.log('reseaux sociaux' + this.reseau_sociaux);
        });
    }

    livrai_dispo: 'oui' | 'non' | null = null;

    selectOption(option: 'oui' | 'non'): void {
        if (this.livrai_dispo === option) {
            this.livrai_dispo = null;
        } else {
            this.livrai_dispo = option;
        }
    }

    interet_compag_mark: 'oui' | 'non' | null = null;

    selectOptions(option: 'oui' | 'non'): void {
        if (this.interet_compag_mark === option) {
            this.interet_compag_mark = null; // Désélectionner si la même option est cliquée
        } else {
            this.interet_compag_mark = option;
        }

        // Mettre à jour la valeur dans le formulaire réactif
        /*this.userForm.patchValue({
          autoris_consent: this.autoris_consent,
      });*/
    }

    onCheckboxChangess(event: any) {
        const preferCommArray: FormArray = this.userForm.get(
            'userTypeCompagnSouhait'
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

    onSubmit(): void {
        //console.log('Données du formulaire :', this.userForm.value);
        //this.form.photo = this.filename;
        /* this.userForm.patchValue({
            secteuractivite: this.userForm
                .get('secteuractivite')
                ?.value.join(','),
        });*/
        this.userService.registerprorole(this.userForm.value).subscribe(
            (response) => {
                console.log(
                    'Valeur de prefer_communi :',
                    this.userForm.get('PreferComm')
                );

                console.log('Utilisateur ajouté avec succès');
            },
            (error) => {
                console.error("Erreur lors de l'ajout de l'utilisateur", error);
            }
        );
    }

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

    selectFilesphentr(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const files = Array.from(input.files); // Permet la sélection de plusieurs fichiers

            files.forEach((file) => {
                this.fileService.upload(file).subscribe(() => {
                    this.userForm.patchValue({
                        photoentre: file.name, // Stockez le nom du fichier pour chaque fichier
                    });
                    console.log(`File ${file.name} uploaded successfully`);
                });
            });
        } else {
            console.error('No files selected or input is null.');
        }
    }
}
