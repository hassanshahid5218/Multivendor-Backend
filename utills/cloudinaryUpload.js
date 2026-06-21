const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file, folder = "default") => {
  if (!file) throw new Error("No file provided for upload");

  const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64File, {
    folder,
  });

  return result;
};

const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  return await cloudinary.uploader.destroy(public_id);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};