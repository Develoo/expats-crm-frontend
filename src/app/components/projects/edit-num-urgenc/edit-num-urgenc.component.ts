import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/_services/file.service';
import { NumUrgenceServiceService } from 'src/app/_services/num-urgence-service.service';

@Component({
    selector: 'app-edit-num-urgenc',
    templateUrl: './edit-num-urgenc.component.html',
    styleUrls: ['./edit-num-urgenc.component.scss'],
})
export class EditNumUrgencComponent implements OnInit {
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
        { name: 'num', label: 'Numéro', type: 'text' },
        { name: 'description', label: 'description', type: 'text' },
    ];

    constructor(
        private route: ActivatedRoute,
        private numUrgenceService: NumUrgenceServiceService,
        private router: Router,
        private fb: FormBuilder,
        private formBuilder: FormBuilder,
        private fileservice: FileService
    ) {}

    /*  ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.urgenceId = +id; 
            this.numUrgenceService
                .getNumUrgenceById(this.urgenceId)
                .subscribe((data) => {
                    this.numUrgence = data;
                    this.numUrgence.num;
                    this.numUrgence.titre;
                    this.numUrgence.description;
                    console.log(
                        "le numero d'urgence" + this.numUrgence.num,
                        this.numUrgence.titre,
                        this.numUrgence.description
                    );
                });
        } else {
            
            console.error('ID is null or undefined');
        }
        this.editForm = this.fb.group({
            titre: ['', Validators.required],
            num: ['', Validators.required],
            pays: ['', Validators.required],
            photo: [''],
        });
        this.numUrgenceService.getNumUrgenceById(this.id).subscribe((data) => {
            this.editForm.patchValue(data); 
        });
    }*/

    ngOnInit(): void {
        // Initialisation du formulaire
        this.editForm = this.formBuilder.group({
            titre: ['', Validators.required],
            num: ['', Validators.required],
            pays: ['', Validators.required],
            description: ['', Validators.required],
            photo: [''],
        });

        // Récupération de l'ID depuis l'URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;

            // Appeler le service pour obtenir le numéro d'urgence par ID
            this.numUrgenceService.getNumUrgenceById(this.id).subscribe(
                (data) => {
                    if (data) {
                        // Mettre à jour le formulaire avec les données reçues
                        this.editForm.patchValue({
                            titre: data.titre,
                            num: data.num,
                            pays: data.pays,
                            photo: data.photo,
                            description: data.description,
                        });
                        console.log('titre:' + data.titre);
                        console.log('titre:' + data.photo);
                    } else {
                        console.error('No data found for the specified ID');
                    }
                    console.log('num urgence est' + data.pays);
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
            this.numUrgenceService
                .updateNumUrgence(this.id, updatedData)
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
