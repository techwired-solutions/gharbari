import { supabase } from "@/lib/supabase";

export const MAX_LISTING_IMAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — matches the bucket's file_size_limit
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const BUCKET = "listing-photos";

export class ImageUploadError extends Error {}

/**
 * Uploads a single image to the public `listing-photos` bucket and returns
 * its public URL. Runs entirely in the browser against the anon key — the
 * bucket's storage policies (supabase/migration_001_images.sql) are what
 * actually authorize the write, same trust model as the public POST to
 * /api/listings.
 */
export async function uploadListingImage(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new ImageUploadError("Please choose a JPEG, PNG, WEBP, or GIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError("Each photo must be under 5MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new ImageUploadError(error.message || "Could not upload image.");
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
