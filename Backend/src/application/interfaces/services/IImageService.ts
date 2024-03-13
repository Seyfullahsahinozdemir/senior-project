export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<string>;
  deleteImage(filename: string): Promise<void>;
}
