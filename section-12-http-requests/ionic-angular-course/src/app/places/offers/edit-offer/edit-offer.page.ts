import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
    form: FormGroup;

    place: Place;
    placeSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private router: Router,
        private loadingController: LoadingController
    ) {}

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap) => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }
            this.placeSub = this.placesService
                .getPlace(paramMap.get('placeId'))
                .subscribe((place) => {
                    this.place = place;
                    this.form = new FormGroup({
                        title: new FormControl(this.place.title, {
                            updateOn: 'blur',
                            validators: [Validators.required],
                        }),
                        description: new FormControl(this.place.description, {
                            updateOn: 'blur',
                            validators: [
                                Validators.required,
                                Validators.maxLength(180),
                            ],
                        }),
                    });
                });
        });
    }

    onUpdateOffer() {
        if (this.form.invalid) {
            return;
        }
        this.loadingController.create({ message: 'Updating' }).then((lc) => {
            lc.present();
            this.placesService
                .updatePlace(
                    this.place.id,
                    this.form.value.title,
                    this.form.value.description
                )
                .subscribe(() => {
                    lc.dismiss();
                    this.form.reset();
                    this.router.navigate(['/places/tabs/offers']);
                });
        });
    }
}
