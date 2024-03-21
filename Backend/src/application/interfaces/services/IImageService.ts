export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<{ fileId: string; fileName: string }>;
  deleteImage(fileId: string): Promise<void>;
  findFileIdByName(fileName: string): Promise<string>;
}
