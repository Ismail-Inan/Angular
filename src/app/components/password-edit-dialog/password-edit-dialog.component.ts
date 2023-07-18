import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Dimensions, ImageCroppedEvent, ImageCropperModule, ImageTransform, base64ToFile } from 'ngx-image-cropper';
import { FilePickerModule } from  'ngx-awesome-uploader';

@Component({
  selector: 'app-password-edit-dialog',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatDialogModule, FilePickerModule],
  templateUrl: './password-edit-dialog.component.html',
  styleUrls: ['./password-edit-dialog.component.css']
})
export class PasswordEditDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PasswordEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  changePassword(): void {
    //TODO
  }

}