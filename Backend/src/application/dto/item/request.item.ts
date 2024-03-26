export class RequestItemDTO {
  _id?: string;
  urlName: string;
  description: string | null;
  title: string;
  topCategory: string;
  subCategories: string[] | null;
  image: { fileId: string; filename: string; mimetype: string };
}
