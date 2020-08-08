import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    loadedBookings: Booking[];
    private bookingSub: Subscription;

    constructor(
        private bookingService: BookingService,
        private loadingCtrl: LoadingController
    ) {}

    ngOnDestroy(): void {
        if (this.bookingSub) {
            this.bookingSub.unsubscribe();
        }
    }

    ngOnInit() {
        this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
            this.loadedBookings = bookings;
            console.log(bookings);
        });
    }

    onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
        slidingEl.close();

        this.loadingCtrl
            .create({ message: 'Canceling Booking...' })
            .then((lc) => {
                lc.present();
                this.bookingService.cancelBooking(bookingId).subscribe(() => {
                    lc.dismiss();
                });
            });
        // cancel booking wiht id offerId
    }
}
