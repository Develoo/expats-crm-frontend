import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Validators } from 'ngx-editor';
import { NotificationService } from 'src/app/_services/notification.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { FileService } from 'src/app/_services/file.service';

@Component({
    selector: 'app-add-notifi',
    templateUrl: './add-notifi.component.html',
    styleUrls: ['./add-notifi.component.scss'],
})
export class AddNotifiComponent {
    userForm: FormGroup;
    selectedFile: File | null = null;
    currentBook: any;

    public name: string;
    ngOnInit() {
        this.initForm();
    }

    accountFields = [
        { label: 'titre', name: 'titre', type: 'text' },
        //  { label: 'image', name: 'image', type: 'text' },
        { label: 'description', name: 'description', type: 'text' },
        //  { label: 'photo', name: 'photo', type: 'text' },
        // { label: 'categorie', name: 'categorie', type: 'text' },
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
        private notificationService: NotificationService,
        public fileService: FileService
    ) {}

    initForm() {
        this.userForm = this.fb.group({
            titre: ['', Validators.required],
            photo: ['', Validators.required],
            description: ['', Validators.required], // Ajout du champ
            /*prefer_communi: ['', Validators.required],*/
            categorie: ['', Validators.required],
            pays: ['', Validators.required],
            //lien: ['', Validators.required],
            // marquesPreferees: this.fb.control([]),
        });
    }

    onSubmit(): void {
        if (this.userForm.valid) {
            this.notificationService
                .addnotifications(this.userForm.value)
                .subscribe(
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

    selectFiles(event: Event) {
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
}
