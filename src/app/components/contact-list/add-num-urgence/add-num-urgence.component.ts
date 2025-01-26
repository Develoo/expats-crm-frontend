import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { NumUrgenceServiceService } from 'src/app/_services/num-urgence-service.service';
import { FileService } from 'src/app/_services/file.service';

@Component({
    selector: 'app-add-num-urgence',
    templateUrl: './add-num-urgence.component.html',
    styleUrls: ['./add-num-urgence.component.scss'],
})
export class AddNumUrgenceComponent implements OnInit {
    userForm: FormGroup;
    selectedFile: File | null = null;
    currentBook: any;
    numurgence: any = {
        titre: '',
        photo: '',
        description: '',
        num: '',
        lien: '',
        pays: '',
        //categorie: '',
    };
    public name: string;
    public filename: string;

    imagePreview: string | ArrayBuffer | null = null; // Variable to hold the image preview

    ngOnInit() {
        this.initForm();
    }

    accountFields = [
        { label: 'titre', name: 'titre', type: 'text' },
        //  { label: 'image', name: 'image', type: 'text' },
        { label: 'description', name: 'description', type: 'text' },
        { label: 'num', name: 'num', type: 'text' },
        { label: 'lien', name: 'lien', type: 'text' },
        //  { label: 'pays', name: 'pays', type: 'text' },

        /*{
      label: 'prefe comunication',
      name: 'prefer_communi',
      type: 'text',
  },*/
    ];

    constructor(
        public dialog: MatDialog,
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private scroller: ViewportScroller,
        private router: Router,
        private numurgenceService: NumUrgenceServiceService,
        public fileService: FileService
    ) {}

    initForm() {
        this.userForm = this.fb.group({
            titre: ['', Validators.required],
            photo: ['', Validators.required],
            description: ['', Validators.required], // Ajout du champ
            /*prefer_communi: ['', Validators.required],*/
            num: ['', Validators.required],
            lien: ['', Validators.required],
            pays: ['', Validators.required],
            categorie: ['', Validators.required],
        });
    }

    onSubmitff(): void {
        if (this.userForm.valid) {
            this.numurgenceService.numurgence(this.userForm.value).subscribe(
                (response) => {
                    console.log('Num urgence ajouté avec succès');
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

    onSubmit(): void {
        const numurgenceData = {
            photo: this.filename, // Utiliser le nom du fichier
            titre: this.numurgence.titre,
            description: this.numurgence.description,
            num: this.numurgence.num,
            lien: this.numurgence.lien,
            pays: this.numurgence.pays,
            //  categorie: this.numurgence.categorie,
        };
        this.numurgenceService.numurgence(numurgenceData).subscribe(
            (response) => {
                /*   this.produitService.getProduitByIdPro(this.currentUser.id).subscribe(data => {
                this.produits = data;
              });*/
            },
            (error) => {
                console.error('Erreur lors de la mise à jour', error);
            }
        );
    }

    selectFiles11(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const files = Array.from(input.files); // Permet la sélection de plusieurs fichiers

            files.forEach((file) => {
                this.fileService.upload(file).subscribe(() => {
                    // Utilisez replace pour enlever 'C:\\fakepath\\'
                    const cleanedFileName = file.name.replace(
                        'C:\fakepath\\',
                        ''
                    );

                    // Mettez à jour le formulaire avec uniquement le nom du fichier
                    this.userForm.patchValue({
                        photo: cleanedFileName, // Stockez le nom nettoyé du fichier
                    });
                    console.log(
                        `File ${cleanedFileName} uploaded successfully`
                    );
                });
            });
        } else {
            console.error('No files selected or input is null.');
        }
    }

    selectFiles(event: Event): void {
        const input = event.target as HTMLInputElement; // Récupérer l'élément input

        if (input && input.files && input.files.length > 0) {
            const file = input.files[0]; // Récupérer le premier fichier sélectionné
            this.filename = file.name; // Utiliser uniquement le nom du fichier
            this.numurgence.image = this.filename; // Mettez à jour l'objet produit avec le nom du fichier

            // Lire le fichier pour prévisualisation
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result; // Prévisualiser l'image
            };
            reader.readAsDataURL(file); // Lire le fichier
        } else {
            console.error('Aucun fichier sélectionné.');
        }
    }
}
