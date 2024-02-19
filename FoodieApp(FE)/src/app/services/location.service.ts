import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locationSubject = new BehaviorSubject<string | undefined>(undefined);
  location$: Observable<string | undefined> = this.locationSubject.asObservable();

  setLocation(location: string | undefined) {
    this.locationSubject.next(location);
  }

  
  getLocation(): string | undefined {
    return this.locationSubject.value;
  }
  
}


