import { IImageService } from '@application/interfaces/services/IImageService';
import * as fs from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

export class ImageService implements IImageService {
  // private uploadDir = './uploads';
  private oauth2Client;
  private drive;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI,
    );
    this.oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ fileName: string; fileId: string }> {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
          parents: [process.env.STORAGE_URL],
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path),
        },
      });

      const fileId = response.data.id as string;

      await this.generatePublicUrl(fileId as string);

      const fileNameWithoutExtension = this.removeFileExtension(file.originalname);

      return { fileId, fileName: fileNameWithoutExtension };
    } catch (error) {
      console.error('Error uploading image to Google Drive:', error);
      throw error;
    }
  }

  async getImage(fileId: string): Promise<Express.Multer.File> {
    try {
      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const response = await this.drive.files.get(
        {
          fileId: fileId,
          alt: 'media',
        },
        { responseType: 'stream' },
      );

      const imageStream = response.data as Readable;

      // Assuming you have a directory for temporary image storage
      const filePath = `./temp/${fileId}.jpg`; // You may adjust file extension based on your file type

      // Create a writable stream to save the image
      const fileWriteStream = fs.createWriteStream(filePath);

      // Pipe the image stream to the file stream
      await new Promise((resolve, reject) => {
        imageStream.pipe(fileWriteStream).on('finish', resolve).on('error', reject);
      });

      // Create Express.Multer.File object
      const file: Express.Multer.File = {
        fieldname: 'image',
        originalname: fileId, // You may want to set a proper name here
        encoding: 'binary', // or whatever encoding suits your image
        mimetype: 'image/jpeg', // or whatever mimetype your image has
        destination: './temp', // adjust the destination based on your setup
        filename: `${fileId}.jpg`, // adjust filename and extension based on your file type
        path: filePath,
        size: fs.statSync(filePath).size,
        stream: fs.createReadStream(filePath), // Add stream property
        buffer: fs.readFileSync(filePath), // Add buffer property
      };

      return file;
    } catch (error) {
      console.error('Error getting image from Google Drive:', error);
      throw error;
    }
  }

  async getImageName(fileId: string): Promise<string> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'name',
      });

      const fileName = response.data.name;
      if (typeof fileName !== 'string') {
        throw new Error('An error occurred while getting file name.');
      }
      return fileName;
    } catch (error) {
      console.error('Error getting image name from Google Drive:', error);
      throw error;
    }
  }

  // private async initializeStorageFolder() {
  //   try {
  //     const response = await this.drive.files.list({
  //       q: "mimeType='application/vnd.google-apps.folder' and name='storage'",
  //       fields: 'files(id)',
  //     });
  //     const files = response.data.files as drive_v3.Schema$File[];
  //     if (files.length > 0) {
  //       this.storageFolderId = files[0].id;
  //     } else {
  //       const folderMetadata = {
  //         name: 'storage',
  //         mimeType: 'application/vnd.google-apps.folder',
  //       };
  //       const res = await this.drive.files.create({
  //         requestBody: folderMetadata,
  //         fields: 'id',
  //       });
  //       this.storageFolderId = res.data.id;
  //     }
  //   } catch (error) {
  //     console.error('Storage folder initialization error:', error);
  //     throw error;
  //   }
  // }

  async findFileIdByName(fileName: string): Promise<string> {
    try {
      const response = await this.drive.files.list({
        q: `name='${fileName}'`,
        fields: 'files(id)',
      });

      const files = response.data.files;

      if (files && files.length > 0) {
        return files[0].id as string;
      } else {
        console.log('Dosya bulunamadı.');
      }
      return '';
    } catch (error) {
      console.error('Dosya ID bulunurken bir hata oluştu:', error);
      throw error;
    }
  }

  removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName;
    } else {
      return fileName.substring(0, lastDotIndex);
    }
  }

  async deleteImage(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Error deleting image from Google Drive:', error);
      throw error;
    }
  }

  async generatePublicUrl(fileId: string): Promise<boolean> {
    try {
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'id',
      });

      if (!file.data.id) {
        return false;
      }

      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      return true;
    } catch (error) {
      console.error('Error generating public URL:', error);
      return false;
    }
  }

  // async uploadImage(file: Express.Multer.File): Promise<string> {
  //   const uniqueFileName = await this.generateUniqueFileName(file.originalname);
  //   const uploadedImagePath = `${this.uploadDir}/${uniqueFileName}`;

  //   // Read the file stream and then write it to the destination
  //   const fileStream = fs.createReadStream(file.path);
  //   const writeStream = fs.createWriteStream(uploadedImagePath);
  //   fileStream.pipe(writeStream);

  //   // Wait for the write stream to finish
  //   await new Promise((resolve, reject) => {
  //     writeStream.on('finish', resolve);
  //     writeStream.on('error', reject);
  //   });

  //   await this.processImageAndSave(uploadedImagePath);
  //   const fileNameWithoutExtension = path.parse(uniqueFileName).name;

  //   return fileNameWithoutExtension;
  // }

  // async deleteImage(filename: string): Promise<void> {
  //   try {
  //     const imagePath = `${this.uploadDir}/${filename}`;
  //     await promises.access(imagePath);
  //     await promises.unlink(imagePath);
  //   } catch (error) {
  //     throw new NotFoundException('Image not found.');
  //   }
  // }

  // private async generateUniqueFileName(originalName: string): Promise<string> {
  //   const extension = originalName.split('.').pop();
  //   if (!extension) {
  //     throw new Error();
  //   }
  //   const nameWithoutExtension = originalName.slice(0, -(extension.length + 1)); // +1 to include the dot

  //   let fileName = originalName;
  //   let count = 1;

  //   while (fs.existsSync(`${this.uploadDir}/${fileName}`)) {
  //     fileName = `${nameWithoutExtension}_${count}.${extension}`;
  //     count++;
  //   }

  //   return fileName;
  // }

  // private async processImageAndSave(imagePath: string): Promise<void> {
  //   await this.processImage(imagePath);
  // }

  // private async processImage(imagePath: string): Promise<void> {
  //   await sharp(imagePath).resize({ width: 300, height: 200 }).toBuffer();
  // }
}
