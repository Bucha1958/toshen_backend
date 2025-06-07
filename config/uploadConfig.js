// import {v2 as cloudinary} from 'cloudinary';
// import {CloudinaryStorage} from 'multer-storage-cloudinary';
// import {config} from 'dotenv';
// config();

// export const cloudinaryConfig = cloudinary.config({
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// })

// export const storage = new CloudinaryStorage({
//     cloudinary: cloudinaryConfig,
//     params: {
//         folder: 'uploads',
//         allowed_formats: ['jpg', 'png', 'jpeg'],
//         transformation: [{width: 500, height: 500, crop: 'limit'}]
//     }
// })

// multerConfig.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'ecommerce-images';
    const ext = file.mimetype.split('/')[0];

    if (ext === 'video') {
      folder = 'ecommerce-videos';
    }

    return {
      folder,
      resource_type: ext === 'video' ? 'video' : 'image',
      public_id: file.originalname.split('.')[0],
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };
