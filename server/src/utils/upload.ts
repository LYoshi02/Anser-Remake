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

    let uploadFolder = process.env.CLOUDINARY_ROOT_FOLDER!;
    if (options?.folder) {
      uploadFolder = uploadFolder.concat("/", options.folder);
    }

    const uploadOptions: UploadApiOptions = {
      ...options,
      folder: uploadFolder,
    };

    const fileStream = createReadStream();
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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
