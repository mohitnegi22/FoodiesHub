// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTextSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchText$: Observable<string> = this.searchTextSubject.asObservable();

  setSearchText(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }
}
