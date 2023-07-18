import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private showErrorMessageSubject = new BehaviorSubject<any>(null);
    showErrorMessage$ = this.showErrorMessageSubject.asObservable();

    setShowErrorMessage(value: any) {
        this.showErrorMessageSubject.next(value);
    }

    resetSharedValue() {
        this.showErrorMessageSubject.next(false);
    }
}