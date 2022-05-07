import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { FileUpload } from "graphql-upload";

export const uploadToCloudinary: (
  f: FileUpload,
  o?: UploadApiOptions
) => Promise<UploadApiResponse | undefined> = (file, options) => {
  return new Promise((resolve, reject) => {
    const { createReadStream } = file;

    const fileStream = createReadStream();
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      options,
      (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      }
    );

    fileStream.pipe(cloudinaryStream);
  });
};

export const deleteFromCloudinary = (imgPublicId: string) => {
  return cloudinary.uploader.destroy(imgPublicId);
};
