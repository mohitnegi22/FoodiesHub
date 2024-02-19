import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GeolocationData } from '../models/geolocation-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private geolocationSubject = new Subject<GeolocationData>();
  geolocation$: Observable<GeolocationData> = this.geolocationSubject.asObservable();
  private apiKey = '01d1ea3cd8ce432694425f15c9a56953'; 
  locationName: string | undefined;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  geoFindMe() {
    if (!navigator.geolocation) {
      this.showSnackbar("Geolocation is not supported by your browser");
      this.geolocationSubject.next({ error: "Geolocation is not supported by your browser" });
      return;
    }

    this.showSnackbar("Locating...");

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const latitude: number = position.coords.latitude;
        const longitude: number = position.coords.longitude;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        this.getPlaceName(latitude, longitude);
      },
      (error) => {
        this.showSnackbar("Error getting location:" + error);
        this.geolocationSubject.next({ error: "Unable to retrieve your location" });
      }
    );
  }

  private getPlaceName(latitude: number, longitude: number) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${this.apiKey}&q=${latitude}+${longitude}&pretty=1`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        const results = data.results;
        if (results && results.length > 0) {
          const placeName = results[0].formatted;
          console.log("Place Name:", placeName);

          this.geolocationSubject.next({ latitude, longitude, placeName });
        } else {
          this.showSnackbar("No results found for reverse geocoding");
          this.geolocationSubject.next({ error: "No results found for reverse geocoding" });
        }
      },
      (error) => {
        this.showSnackbar("Error in reverse geocoding:" + error);
        this.geolocationSubject.next({ error: "Error in reverse geocoding" });
      }
    );
  }
  getLocationName(): string | undefined {
    return this.locationName;
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}

// interface GeolocationData {
//   latitude?: number;
//   longitude?: number;
//   placeName?: string;
//   error?: string;
// }