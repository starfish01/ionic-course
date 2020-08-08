import { Component, OnInit, OnDestroy } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
    offers: Place[];
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private router: Router) {}

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe((places) => {
            this.offers = places;
        });
    }

    onEdit(offerId: string, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.router.navigate([
            '/',
            'places',
            'tabs',
            'offers',
            'edit',
            offerId,
        ]);
        console.log('Editing item', offerId);
    }
}
