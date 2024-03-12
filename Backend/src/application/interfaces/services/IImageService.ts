export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<boolean>;
  deleteImage(filename: string): Promise<void>;
}
