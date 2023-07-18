
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CompanyItemDTO } from '../../models/company-item-dto';
import { CompanyItemService } from '../../services/company_item/company-item.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { CompanyItemCategoryNode } from '../../models/user.item.category.node';
import { FileListWrapper } from './FileListWrapper';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { InputNumberModule } from 'primeng/inputnumber';
import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet, RouterLinkWithHref, Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/services/error/error.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    templateUrl: './add.user.item.component.html',
    styleUrls: ['./add.user.item.component.css'],
    imports: [CommonModule, ReactiveFormsModule, RouterOutlet,
        RouterLinkWithHref, HttpClientModule, FormsModule, NavigationComponent,
        TranslateModule, DragDropModule, ReactiveFormsModule, InputNumberModule],
    providers: [CompanyItemService],
})
export class AddUserItemComponent implements OnInit {

    public userItems: CompanyItemDTO[];
    public userItemCategories: CompanyItemCategoryNode[];
    public editUserItem: CompanyItemDTO;
    public deleteUserItem: CompanyItemDTO;
    userItem: CompanyItemDTO;
    // Variable to store shortLink from api response
    shortLink: string = "";
    loading: boolean = false; // Flag variable
    selectedFiles: FileList;
    images = [];
    connectedList = [];
    previews = [];
    isUpdate: boolean;
    value4: number;
    @Input()
    userItemsContent: CompanyItemDTO[];

    constructor(private router: Router, private route: ActivatedRoute,
        private userItemService: CompanyItemService,
        private errorService: ErrorService) {
        this.userItem = new CompanyItemDTO();
        this.userItem.giveAway = false;
    }

    ngOnInit() {
        this.initWithUserIdIfPresent();
        this.getCategories();

        var forms = document.querySelectorAll('.needs-validation')
        //prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }

                    form.classList.add('was-validated')
                }, false)
            })
    }

    public initWithUserIdIfPresent(): void {
        this.route.params.subscribe(params => {
            var id: number = +params.id;

            if (!id) {
                return;
            }

            if (isNaN(+id)) {
                this.errorService.setShowErrorMessage(true);
                return;
            }

            this.userItemService.getCompanyItemById(id).subscribe(
                (item: CompanyItemDTO) => {
                    if (!item) {
                        console.log("CompanyItem not found")
                        this.errorService.setShowErrorMessage(true);
                        return;
                    }

                    this.userItem = item;
                    if (this.userItem.giveAway === undefined) {
                        this.userItem.giveAway = false;
                    }
                    this.isUpdate = true;
                    item.images.map(image => this.replaceImageUrl(image.imageUrl)).forEach((image2) => {
                        this.previews.push({ url: this.replaceImageUrl(image2), name: "test" });
                    });


                    console.log(this.previews);
                    this.images = item.images;
                });
        });
    }

    public replaceImageUrl(url: string): string {
        return url.replace(/\\/g, '/').replace('uploads', '/assets');
    }

    public getCategories(): void {
        this.userItemService.getCategories().subscribe(
            (response: CompanyItemCategoryNode[]) => {
                this.userItemCategories = response;
                console.log(this.userItemCategories);
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.previews.splice(index, 1);
    }

    dropImage(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    }

    gotoItemsOverview() {
        this.router.navigate(['/itemsOverview']);
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            if (this.isUpdate) {
                this.userItemService.updateUserItem(this.userItem, this.images)
                    .subscribe(result => this.gotoItemsOverview());
            } else {
                this.userItem = form.value as CompanyItemDTO;
                this.userItemService.createCompanyItem(this.userItem, this.images)
                    .subscribe(result => this.gotoItemsOverview());
            }
        }
    }

    public onDeleteUserItem(userItemId: number): void {
        this.userItemService.deleteUserItem(userItemId).subscribe(
            (response: void) => {
                console.log(response);
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }

    public onOpenModal(userItem: CompanyItemDTO, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-target', '#addUserItemModal');
        }
        if (mode === 'edit') {
            this.editUserItem = userItem;
            button.setAttribute('data-target', '#updateUserItemModal');
        }
        if (mode === 'delete') {
            this.deleteUserItem = userItem;
            button.setAttribute('data-target', '#deleteUserItemModal');
        }
        container.appendChild(button);
        button.click();
    }

    onFileSelected(event: any) {
        this.selectedFiles = event.target.files;
        for (let i = 0; i < this.selectedFiles.length && i < 5; i++) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.images.push(this.selectedFiles.item(i));
                this.previews.push({ url: e.target.result, name: this.selectedFiles[i].name });
            };
            reader.readAsDataURL(this.selectedFiles[i]);
        }
        console.log(this.images);
    }

    removeFile(index: number): void {
        if (this.selectedFiles && this.selectedFiles.length > index) {
            const files = Array.from(this.selectedFiles);
            files.splice(index, 1);
            this.selectedFiles = new FileListWrapper(files);
            this.previews.splice(index, 1);
        }
    }

    getPreviewUrl(file: File): string {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return reader.result as string;
    }

}