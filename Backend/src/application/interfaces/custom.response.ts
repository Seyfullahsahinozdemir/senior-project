import { Response } from 'express';

class CustomResponse {
  data: any;
  message: string;

  constructor(data: any, message: string) {
    this.data = data;
    this.message = message;
  }

  success(res: Response) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? 'Success',
    });
  }

  created(res: Response) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? 'Success',
    });
  }

  error500(res: Response) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message ?? 'Error Occurred',
    });
  }

  error400(res: Response) {
    return res.status(400).json({
      success: false,
      data: this.data,
      message: this.message ?? 'Error Occurred',
    });
  }

  error401(res: Response) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? 'Unauthorized',
    });
  }

  error404(res: Response) {
    return res.status(404).json({
      success: false,
      data: this.data,
      message: this.message ?? 'Not Found',
    });
  }
}

export default CustomResponse;
