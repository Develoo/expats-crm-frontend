import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/_services/file.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
    selector: 'app-edit-notification',
    templateUrl: './edit-notification.component.html',
    styleUrls: ['./edit-notification.component.scss'],
})
export class EditNotificationComponent {
    urgenceId: number;
    numUrgence: any;
    editForm: FormGroup;
    id: number;
    selectedFile: File;
    name: string;
    form: any = {};

    // Définir les champs à éditer dans un tableau
    editFields = [
        { name: 'titre', label: 'Titre', type: 'text' },
        { name: 'description', label: 'description', type: 'text' },
    ];

    constructor(
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private router: Router,
        private fb: FormBuilder,
        private formBuilder: FormBuilder,
        private fileservice: FileService
    ) {}

    ngOnInit(): void {
        // Initialisation du formulaire
        this.editForm = this.formBuilder.group({
            titre: ['', Validators.required],
            pays: ['', Validators.required],
            categorie: ['', Validators.required],
            description: ['', Validators.required],
            photo: [''],
        });

        // Récupération de l'ID depuis l'URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;

            // Appeler le service pour obtenir le numéro d'urgence par ID
            this.notificationService.getNotificationById(this.id).subscribe(
                (data) => {
                    if (data) {
                        // Mettre à jour le formulaire avec les données reçues
                        this.editForm.patchValue({
                            titre: data.titre,
                            pays: data.pays,
                            categorie: data.categorie,
                            //  photo: data.photo,
                            description: data.description,
                        });
                        console.log('titre:' + data.titre);
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
    onUpdate(): void {
        if (this.editForm.valid) {
            const updatedData = this.editForm.value;
            this.notificationService
                .updateNotification(this.id, updatedData)
                .subscribe(
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

    // Fonction pour gérer la sélection de fichiers
    selectFiles(event: any): void {
        const file = event.target.files[0];
        this.editForm.patchValue({ photo: file });
    }
}
