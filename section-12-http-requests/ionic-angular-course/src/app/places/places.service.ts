import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PlacesService {
    private _places = new BehaviorSubject<Place[]>([
        new Place(
            'p1',
            'Manhatten Mansion',
            'Nice house',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            100.99,
            new Date(),
            new Date('2022-12-31'),
            'abc'
        ),
        new Place(
            'p2',
            'Brisbane Mansion',
            'Nicer house',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            200.99,
            new Date(),
            new Date('2022-12-31'),
            '1111'
        ),
        new Place(
            'p3',
            'The Foggy Mansion',
            'A weird place to stay',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            90.99,
            new Date(),
            new Date('2022-12-31'),
            'abc'
        ),
    ]);

    constructor(private authService: AuthService) {}

    get places() {
        return this._places.asObservable();
    }

    getPlace(id: string) {
        return this.places.pipe(
            take(1),
            map((places) => {
                return { ...places.find((p) => p.id === id) };
            })
        );
    }

    addPlace(
        title: string,
        description: string,
        price: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        const newPlace = new Place(
            Math.random.toString(),
            title,
            description,
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );

        return this.places.pipe(
            take(1),
            delay(1000),
            tap((places) => {
                this._places.next(places.concat(newPlace));
            })
        );
    }

    updatePlace(placeId: string, title: string, description: string) {
        return this.places.pipe(
            take(1),
            delay(1000),
            tap((places) => {
                const updatedPlaceIndex = places.findIndex(
                    (pl) => pl.id === placeId
                );
                const updatedPlaces = [...places];
                const oldPlace = updatedPlaces[updatedPlaceIndex];
                updatedPlaces[updatedPlaceIndex] = new Place(
                    oldPlace.id,
                    title,
                    description,
                    oldPlace.imgUrl,
                    oldPlace.price,
                    oldPlace.availableFrom,
                    oldPlace.availableTo,
                    oldPlace.userId
                );
                this._places.next(updatedPlaces);
            })
        );
    }
}
