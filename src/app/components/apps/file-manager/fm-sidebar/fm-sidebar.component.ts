import {Component, OnInit} from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import {CategorieService} from "../../../../_services/categorie.service";

@Component({
    selector: 'app-fm-sidebar',
    templateUrl: './fm-sidebar.component.html',
    styleUrls: ['./fm-sidebar.component.scss']
})
export class FmSidebarComponent implements OnInit{
    categorie: any[] = [];

    constructor(
        public themeService: CustomizerSettingsService,
        public categorieservice: CategorieService
    ) {}
    ngOnInit(): void {

        this.categorieservice.getCategorie().subscribe((data) => {
            this.categorie = data;
        });
    }
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}
