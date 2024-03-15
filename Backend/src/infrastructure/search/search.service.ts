import { ISearchService } from '@application/interfaces/services/search/ISearchService';
import { IPostRepository } from '@application/persistence';
import { Post } from '@domain/entities';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export class SearchService implements ISearchService {
  private readonly searchEndPoint: string;
  private readonly postRepository: IPostRepository;

  constructor({ postRepository }: { postRepository: IPostRepository }) {
    this.searchEndPoint = process.env.SEARCH_SERVICE_URL;
    this.postRepository = postRepository;
  }

  async get(file: Express.Multer.File): Promise<Post[]> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));

    const response = await axios.post(`${this.searchEndPoint}/find_similar_images`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const images: string[] = response.data.similar_images;
    const matchingPosts: Post[] = [];

    for (const image of images) {
      const postsContainingImage: Post[] = await this.postRepository.find({ items: { $in: [image] } });

      for (const post of postsContainingImage) {
        if (!matchingPosts.some((matchingPost) => matchingPost._id === post._id)) {
          matchingPosts.push(post);
        }
      }
    }

    return matchingPosts;
  }
}
