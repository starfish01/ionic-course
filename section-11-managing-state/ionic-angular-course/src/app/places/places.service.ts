import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
    providedIn: 'root',
})
export class PlacesService {
    private _places: Place[] = [
        new Place(
            'p1',
            'Manhatten Mansion',
            'Nice house',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            100.99,
            new Date(),
            new Date('2022-12-31')
        ),
        new Place(
            'p2',
            'Brisbane Mansion',
            'Nicer house',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            200.99,
            new Date(),
            new Date('2022-12-31')
        ),
        new Place(
            'p3',
            'The Foggy Mansion',
            'A weird place to stay',
            'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBXGOzl.img?h=832&w=1598&m=6&q=60&u=t&o=f&l=f',
            90.99,
            new Date(),
            new Date('2022-12-31')
        ),
    ];


    constructor() {}

    get places() {
        return [...this._places];
    }

    getPlace(id: string) {
        return { ...this._places.find((p) => p.id === id) };
    }

}
