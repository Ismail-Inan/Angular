import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyItemCategoryFilter } from 'src/app/models/category/company-item-category-filter';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoriesUrl = 'assets/category/categories.json';

    constructor(private http: HttpClient) { }

    getCategoryFilters(category: string): Observable<CompanyItemCategoryFilter> {
        return this.http.get<any>(this.categoriesUrl).pipe(
            map((data: any) => {
                // Flatten the nested categories into a single array
                const flattenCategories = this.flattenCategories(data.categories);

                // Find the category object based on the given category string
                const categoryObj = flattenCategories.find((cat: any) => cat.category === category);

                // Initialize the parent category variable
                let parentCat = '';

                // Check if the category object exists and if it's not the 'ALL' category
                if (categoryObj && category !== 'ALL') {
                    // Find the parent category for the given category object
                    parentCat = this.getParentCategory(flattenCategories, categoryObj);
                }

                // Extract the children categories from the category object
                const childrenCategories = this.extractChildrenCategories(categoryObj);

                // Create the category filter object with the category, parent, and children properties
                const categoryFilter: CompanyItemCategoryFilter = {
                    category: categoryObj.category,
                    parent: parentCat,
                    children: childrenCategories
                };

                // Return the category filter object as an observable value
                return categoryFilter;
            })
        );
    }

    // Extract the children categories from the category object
    private extractChildrenCategories(categoryObj: any): string[] {
        const childrenCategories: string[] = [];

        if (categoryObj.children && Array.isArray(categoryObj.children)) {
            categoryObj.children.forEach((child: any) => {
                if (typeof child === 'string') {
                    childrenCategories.push(child.trim());
                } else if (child.category) {
                    childrenCategories.push(child.category.trim());
                }
            });
        }

        return childrenCategories;
    }

    // Recursive function to flatten the nested categories into a single array
    private flattenCategories(categories: any[]): any[] {
        let flattenedCategories: any[] = [];

        categories.forEach((category: any) => {
            // Push the current category object to the flattened categories array
            flattenedCategories.push(category);

            // If the current category has children, recursively call the function to flatten them as well
            if (category.children) {
                flattenedCategories = flattenedCategories.concat(this.flattenCategories(category.children));
            }
        });

        // Return the flattened categories array
        return flattenedCategories;
    }

    // Find the parent category for a given category object
    private getParentCategory(categories: any[], categoryObj: any): string {
        const parentCategory = categories.find(cat => cat.children?.some(child => child.category === categoryObj.category));

        return parentCategory?.category || "ALL";
    }

}