export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<{ fileId: string; fileName: string }>;
  deleteImage(fileId: string): Promise<void>;
  findFileIdByName(fileName: string): Promise<string>;
  getImage(fileId: string): Promise<Express.Multer.File>;
  getImageName(fileId: string): Promise<string>;
  generatePublicUrl(fileId: string): Promise<boolean>;
}
