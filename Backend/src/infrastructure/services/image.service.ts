import { IImageService } from '@application/interfaces/services/IImageService';
import sharp from 'sharp';
import { NotFoundException } from '@application/exceptions';
import * as fs from 'fs';
import * as promises from 'fs/promises';
import * as path from 'path';

export class ImageService implements IImageService {
  private uploadDir = './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uniqueFileName = await this.generateUniqueFileName(file.originalname);
    const uploadedImagePath = `${this.uploadDir}/${uniqueFileName}`;

    // Read the file stream and then write it to the destination
    const fileStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(uploadedImagePath);
    fileStream.pipe(writeStream);

    // Wait for the write stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    await this.processImageAndSave(uploadedImagePath);
    const fileNameWithoutExtension = path.parse(uniqueFileName).name;

    return fileNameWithoutExtension;
  }

  async deleteImage(filename: string): Promise<void> {
    try {
      const imagePath = `${this.uploadDir}/${filename}`;
      await promises.access(imagePath);
      await promises.unlink(imagePath);
    } catch (error) {
      throw new NotFoundException('Image not found.');
    }
  }

  private async generateUniqueFileName(originalName: string): Promise<string> {
    const extension = originalName.split('.').pop();
    if (!extension) {
      throw new Error();
    }
    const nameWithoutExtension = originalName.slice(0, -(extension.length + 1)); // +1 to include the dot

    let fileName = originalName;
    let count = 1;

    while (fs.existsSync(`${this.uploadDir}/${fileName}`)) {
      fileName = `${nameWithoutExtension}_${count}.${extension}`;
      count++;
    }

    return fileName;
  }

  private async processImageAndSave(imagePath: string): Promise<void> {
    await this.processImage(imagePath);
  }

  private async processImage(imagePath: string): Promise<void> {
    await sharp(imagePath).resize({ width: 300, height: 200 }).toBuffer();
  }
}
