import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompanyItemService } from '../../services/company_item/company-item.service';
import { CompanyItemDTO } from '../../models/company-item-dto';
import { NavigationComponent } from '../navigation/navigation.component';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { CompanyItemImage } from 'src/app/models/company/company-item-image';
import { CompanyItemImageService } from 'src/app/services/company-item-image/company-item-image.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { StatisticsService } from 'src/app/services/statistic-service/statistic.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-show-user-item',
  standalone: true,
  imports: [CommonModule, NavigationComponent, TranslateModule],
  templateUrl: './show-user-item.component.html',
  styleUrls: ['./show-user-item.component.css']
})
export class ShowUserItemComponent {
  item: CompanyItemDTO;
  private routeSub: any;
  currentImageIndex = 0;
  imageUrl: string;

  constructor(private userItemService: CompanyItemService,
    private route: ActivatedRoute,
    private statisticService: StatisticsService,
    private errorService: ErrorService,
    private companyItemImageService: CompanyItemImageService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      var id: number = +params.id;

      if (!id || isNaN(+id)) {
        console.log("No Id")
        this.errorService.setShowErrorMessage(true);
        return;
      }

      this.userItemService.getCompanyItemById(id).subscribe(
        (item: CompanyItemDTO) => {

          if (!item) {
            console.log("Item not found")
            this.errorService.setShowErrorMessage(true);
            return;
          }

          this.item = item;
          console.log(item);

          this.companyItemImageService.getCompanyImagesByItemId(item.id).subscribe((images: CompanyItemImage[]) => {
            this.item.images = images;
            console.log(item.images + " " + item.images.length)

          });

          if (this.item.owner.profileImageId) {
            this.imageUrl = this.replaceImageUrl(this.item.owner.profileImageId);
          }

          this.localStorageService.addToLastViewedItems(item);
          console.log("addtolastviewed=" + this.localStorageService.getLastViewedItems());
          this.trackItemVisit(item.id); // Track the visit when the component initializes
          this.getItemViewsCount(item.id); // Get the views count when the component initializes
        },
        (error) => {
          console.log("An error occurred while fetching the item:", error);
          this.errorService.setShowErrorMessage(true);
        });
    });

  }

  trackItemVisit(itemId: number): void {
    this.statisticService.trackItemVisit(itemId).subscribe(
      () => {
        console.log('Item visit tracked successfully.');
      },
      (error) => {
        console.error('Error tracking item visit:', error);
      }
    );
  }

  getItemViewsCount(itemId: number): void {
    this.statisticService.getItemViewsCount(itemId).subscribe(
      (count) => {
        console.log('Item views count:', count);
      },
      (error) => {
        console.error('Error getting item views count:', error);
      }
    );
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  setCurrentImage(index: number) {
    this.currentImageIndex = index;
  }

}