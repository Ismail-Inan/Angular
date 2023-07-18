import { Injectable } from '@angular/core';
import { CompanyDTO } from 'src/app/models/company-dto';
import { CompanyItemDTO } from 'src/app/models/company-item-dto';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly ACCESS_TOKEN_KEY = 'accessToken';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private readonly COMPANY_KEY = 'company';
    private readonly MY_ITEMS_KEY = 'myItems';
    private readonly NEWEST_ITEMS_KEY = 'newestItems';
    private readonly LAST_VIEWED_ITEMS_KEY = 'lastViewedItems';
    private readonly LAST_VIEWED_COMPANIES_KEY = 'lastViewedCompanies';
    private readonly MAX_LAST_VIEWED_ITEMS = 5;

    getCompanyParsed(): CompanyDTO {
        return JSON.parse(localStorage.getItem(this.COMPANY_KEY));
    }

    getCompany(): string {
        return localStorage.getItem(this.COMPANY_KEY);
    }

    setCompany(company: CompanyDTO) {
        localStorage.setItem(this.COMPANY_KEY, JSON.stringify(company));
    }

    setAccessToken(token: string) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    removeAccessToken(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }

    setRefreshToken(token: string) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    removeRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    setMyItems(items: CompanyItemDTO[]) {
        localStorage.setItem(this.MY_ITEMS_KEY, JSON.stringify(items));
    }

    getMyItems(): CompanyItemDTO[] {
        const itemsString = localStorage.getItem(this.MY_ITEMS_KEY);
        return JSON.parse(itemsString);
    }

    setNewestItems(items: CompanyItemDTO[]) {
        localStorage.setItem(this.NEWEST_ITEMS_KEY, JSON.stringify(items));
    }

    getNewestItems(): CompanyItemDTO[] {
        const itemsString = localStorage.getItem(this.NEWEST_ITEMS_KEY);
        return JSON.parse(itemsString);
    }

    addToLastViewedItems(item: CompanyItemDTO) {
        let lastViewedItems = this.getLastViewedItems();
        if (!lastViewedItems) {
            lastViewedItems = [];
        }

        // Check if the item is already in the array
        const index = lastViewedItems.findIndex((i: CompanyItemDTO) => i.id === item.id);
        if (index !== -1) {
            // If it's already in the array, remove the old entry so it can be added at the beginning
            lastViewedItems.splice(index, 1);
        }

        // Add the new item at the beginning
        lastViewedItems.unshift(item);

        // Remove the last item if there are too many
        if (lastViewedItems.length > this.MAX_LAST_VIEWED_ITEMS) {
            lastViewedItems.pop();
        }

        localStorage.setItem(this.LAST_VIEWED_ITEMS_KEY, JSON.stringify(lastViewedItems));
    }

    getLastViewedItems(): CompanyItemDTO[] {
        const itemsString = localStorage.getItem(this.LAST_VIEWED_ITEMS_KEY);
        return JSON.parse(itemsString);
    }

    addToLastViewedCompanies(company: CompanyDTO) {
        let lastViewedCompanies = this.getLastViewedCompanies();
        if (!lastViewedCompanies) {
            lastViewedCompanies = [];
        }

        // Check if the item is already in the array
        const index = lastViewedCompanies.findIndex((i: CompanyItemDTO) => i.id === company.id);
        if (index !== -1) {
            // If it's already in the array, remove the old entry so it can be added at the beginning
            lastViewedCompanies.splice(index, 1);
        }

        // Add the new item at the beginning
        lastViewedCompanies.unshift(company);

        // Remove the last item if there are too many
        if (lastViewedCompanies.length > this.MAX_LAST_VIEWED_ITEMS) {
            lastViewedCompanies.pop();
        }

        localStorage.setItem(this.LAST_VIEWED_COMPANIES_KEY, JSON.stringify(lastViewedCompanies));
    }

    getLastViewedCompanies(): CompanyDTO[] {
        const itemsString = localStorage.getItem(this.LAST_VIEWED_COMPANIES_KEY);
        return JSON.parse(itemsString);
    }

    removeItem(item: CompanyItemDTO) {
        const items = this.getMyItems();
        if (items) {
            const index = items.findIndex((i: CompanyItemDTO) => i.id === item.id);
            if (index !== -1) {
                items.splice(index, 1);
            }
        }

        const lastViewedItems = this.getLastViewedItems();
        if (lastViewedItems) {
            const index = lastViewedItems.findIndex((i: CompanyItemDTO) => i.id === item.id);
            if (index !== -1) {
                lastViewedItems.splice(index, 1);
            }
        }

        const newestItems = this.getNewestItems();
        if (newestItems) {
            const index = newestItems.findIndex((i: CompanyItemDTO) => i.id === item.id);
            if (index !== -1) {
                newestItems.splice(index, 1);
            }
        }
    }

}
