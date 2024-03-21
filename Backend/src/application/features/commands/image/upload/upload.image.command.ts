import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import fs from 'fs';
import path from 'path';

export function makeUploadCommand({
  imageService,
  imageRepository,
}: Pick<Dependencies, 'imageService' | 'imageRepository'>) {
  return async function uploadCommand(image: Express.Multer.File, res: Response) {
    const uniqueFilename = await imageService.uploadImage(image);
    await imageRepository.create({ filename: uniqueFilename.fileName, mimetype: image.mimetype, path: 'local' });

    return new CustomResponse(
      { image: { filename: uniqueFilename, mimetype: image.mimetype } },
      'Image uploaded.',
    ).success(res);
  };
}

// export function makeUploadCommand({ imageService }: Pick<Dependencies, 'imageService' | 'imageRepository'>) {
//   return async function uploadCommand(abs: string, res: Response) {
//     // const files = fs.readdirSync('C:/Users/sahin/CSE/Senior Design Project/Dataset/polyvore_outfits/images');

//     // const imageFiles = files.filter((file) => {
//     //   const extension = path.extname(file).toLowerCase();
//     //   return ['.jpg', '.jpeg', '.png'].includes(extension);
//     // });

//     // const ttttt = imageFiles.map((file) =>
//     //   path.join('C:/Users/sahin/CSE/Senior Design Project/Dataset/polyvore_outfits/images', file),
//     // );

//     // const jsonData = fs.readFileSync('./updated_metadata.json', 'utf-8');
//     // const data = JSON.parse(jsonData);
//     // console.log(data.length);
//     // let i = 0;
//     // for (const filePath of ttttt) {
//     //   const file = {
//     //     originalname: path.basename(filePath),
//     //     mimetype: `image/${path.extname(filePath).slice(1)}`,
//     //     path: filePath,
//     //   };

//     //   const { fileId, fileName } = await imageService.uploadImage(file as Express.Multer.File);
//     //   // metadata[fileName].fileId = fileId;
//     //   console.log(`Uploaded image: ${fileName}, fileId: ${fileId}`);
//     //   if (data[fileName]) {
//     //     data[fileName].fileId = fileId;
//     //   }
//     //   console.log(i);
//     //   i++;
//     // }

//     // const newDataJson = JSON.stringify(data, null, 2);
//     // fs.writeFileSync('veri.json', newDataJson);

//     const temp = await imageService.findFileIdByName('shopping.png');
//     console.log(temp);

//     return new CustomResponse(null, 'Image uploaded.').success(res);
//   };
// }
