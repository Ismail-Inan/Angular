import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FilePickerComponent, FilePreviewModel } from 'ngx-awesome-uploader';

import { Dimensions, ImageCroppedEvent, ImageCropperModule, ImageTransform, base64ToFile } from 'ngx-image-cropper';
import { CustomFilePickerAdapter } from '../custom-file-picker.adapter';
import { FilePickerModule } from  'ngx-awesome-uploader';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatDialogModule, FilePickerModule],
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
})
export class ImageCropperComponent implements OnInit {
  @ViewChild('uploader', { static: true }) uploader: FilePickerComponent;
  adapter = new  CustomFilePickerAdapter(this.http);
  selectedImage: File;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  sanitizedUrl!: SafeUrl;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public image: string,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.image);

    const files = [
      {
        fileName: 'My File 1 for edit.png',
      },
      {
        fileName: 'My File 2 for edit.xlsx',
      },
    ] as FilePreviewModel[];
    this.uploader.setFiles(files);
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  saveImage(): void {
    this.dialogRef.close(this.selectedImage);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  getRoundedCanvas(sourceCanvas: any) {
    var canvas = document.createElement('canvas');
    var context: any = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

}