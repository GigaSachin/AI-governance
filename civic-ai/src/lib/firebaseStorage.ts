import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "./firebase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadComplaintImage(
  file: File
): Promise<string> {

  // -----------------------------------------
  // Validate file type
  // -----------------------------------------

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG or WEBP images are allowed."
    );
  }

  // -----------------------------------------
  // Validate file size
  // -----------------------------------------

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Image must be smaller than 10 MB."
    );
  }

  // -----------------------------------------
  // Unique filename
  // -----------------------------------------

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  // -----------------------------------------
  // Storage path
  // -----------------------------------------

  const storageRef = ref(
    storage,
    `complaints/${fileName}`
  );

  // -----------------------------------------
  // Upload
  // -----------------------------------------

  await uploadBytes(
    storageRef,
    file,
    {
      contentType: file.type,
    }
  );

  // -----------------------------------------
  // Get download URL
  // -----------------------------------------

  const downloadURL =
    await getDownloadURL(storageRef);

  return downloadURL;
}