import {
    ChangeDetectorRef,
    Component,
    HostListener,
    ViewEncapsulation,
} from '@angular/core';
import { ToggleService } from './toggle.service';
import { DatePipe } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    isMenuOpen: boolean = false;

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
    isSticky: boolean = false;
    showList = false;
    showListt = false;
    isAdminLoggedIn: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isToggled = false;

    constructor(
        private toggleService: ToggleService,
        private datePipe: DatePipe,
        public themeService: CustomizerSettingsService,
        private tokenStorageService: TokenStorageService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private authService: AuthService
    ) {
        this.toggleService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    /*logout() {
        this.tokenStorageService.signOut();
        localStorage.clear();
        this.reloadPage1();
        this.showList = false;
        window.location.reload();
    }*/

    logout() {
        // Déconnexion de l'utilisateur et nettoyage des données locales
        this.tokenStorageService.signOut();
        localStorage.clear(); // Supprimez les données locales

        // Assurez-vous que le menu déroulant est fermé
        this.showList = false;

        // Redirigez l'utilisateur vers la page de connexion
        this.router.navigate(['/connexionnn']).then(() => {
            // Après la redirection, utilisez setTimeout pour rafraîchir la page
            setTimeout(() => {
                window.location.reload(); // Rafraîchissez la page
            }, 1); // Un délai de 100 ms (vous pouvez ajuster si nécessaire)
        });

        // Mettre à jour l'état pour cacher le header sans recharger la page
        this.isAdminLoggedIn = false;

        // Forcer la détection des changements pour actualiser le template
        this.cdRef.detectChanges();
    }

    prof() {
        this.showList = false;
    }
    reloadPage1() {
        this.router.navigate(['/connexionnn']);
    }

    // Fonction pour basculer l'affichage de la liste
    toggleList() {
        this.showList = !this.showList;
    }

    // Fonction pour basculer l'affichage de la liste
    toggleListt() {
        this.showList = !this.showList;
        this.showListt = !this.showListt;
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(
        this.currentDate,
        'dd MMMM yyyy'
    );
}
