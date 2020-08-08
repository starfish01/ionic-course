import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    NavController,
    ModalController,
    ActionSheetController,
    LoadingController,
} from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    place: Place;
    placeSub: Subscription; 
    isBookable = false;

    constructor(
        private router: Router,
        private navCtrl: NavController,
        private route: ActivatedRoute,
        private placesService: PlacesService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private bookingService: BookingService,
        private loadingCtrl: LoadingController,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap) => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/discover');
                return;
            }
            this.placeSub = this.placesService
                .getPlace(paramMap.get('placeId'))
                .subscribe((place) => {
                    this.place = place;
                    this.isBookable = place.userId !== this.authService.userId;
                });
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

    onBookPlace() {
        this.actionSheetCtrl
            .create({
                header: 'Choose an action',
                buttons: [
                    {
                        text: 'Select Date',
                        handler: () => {
                            this.openBookingModal('select');
                        },
                    },
                    {
                        text: 'Random Date',
                        handler: () => {
                            this.openBookingModal('random');
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                ],
            })
            .then((actionSheetEl) => {
                actionSheetEl.present();
            });
    }

    openBookingModal(mode: 'select' | 'random') {
        console.log(mode);

        this.modalCtrl
            .create({
                component: CreateBookingComponent,
                componentProps: {
                    selectedPlace: this.place,
                    selectedMode: mode,
                },
            })
            .then((modalElement) => {
                modalElement.present();
                return modalElement.onDidDismiss();
            })
            .then((resultData) => {
                console.log(resultData.data.bookingData, resultData.role);
                if (resultData.role === 'confirm') {
                    this.loadingCtrl
                        .create({ message: 'Adding Booking...' })
                        .then((lc) => {
                            lc.present();
                            this.bookingService
                                .addBooking(
                                    this.place.id,
                                    this.place.title,
                                    this.place.imgUrl,
                                    resultData.data.bookingData.firstName,
                                    resultData.data.bookingData.lastName,
                                    resultData.data.bookingData.guestNumber,
                                    resultData.data.bookingData.startDate,
                                    resultData.data.bookingData.endDate
                                )
                                .subscribe(() => {
                                    lc.dismiss();
                                });
                        });
                }
            });
    }
}
