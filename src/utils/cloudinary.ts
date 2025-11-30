import { v2 as cloudinary, type UploadApiResponse } from "npm:cloudinary@1.41.0";
import { Buffer } from "node:buffer";
import "jsr:@std/dotenv/load";

type Uploadable = File | Blob | ArrayBuffer | Uint8Array;

const REQUIRED_VARS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const MAX_RECIPE_IMAGE_BYTES =
  Number(Deno.env.get("MAX_RECIPE_IMAGE_BYTES") ?? 5_000_000);
const DEFAULT_FOLDER = Deno.env.get("CLOUDINARY_RECIPE_FOLDER") ??
  "panko/recipes";

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  for (const variable of REQUIRED_VARS) {
    if (!Deno.env.get(variable)) {
      throw new Error(
        `Missing required Cloudinary environment variable: ${variable}`,
      );
    }
  }

  cloudinary.config({
    cloud_name: Deno.env.get("CLOUDINARY_CLOUD_NAME"),
    api_key: Deno.env.get("CLOUDINARY_API_KEY"),
    api_secret: Deno.env.get("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  configured = true;
}

interface UploadRecipeImageOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  mimeType?: string;
}

export interface RecipeImageUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  createdAt: string;
}

function isFile(value: Uploadable): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function isBlob(value: Uploadable): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

async function toBuffer(
  input: Uploadable,
): Promise<{ buffer: Buffer; bytes: number; mimeType?: string }> {
  if (isFile(input)) {
    const arrayBuffer = await input.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      bytes: input.size,
      mimeType: input.type || undefined,
    };
  }

  if (isBlob(input)) {
    const arrayBuffer = await input.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      bytes: input.size,
      mimeType: input.type || undefined,
    };
  }

  if (input instanceof Uint8Array) {
    return {
      buffer: Buffer.from(input),
      bytes: input.byteLength,
    };
  }

  if (input instanceof ArrayBuffer) {
    return {
      buffer: Buffer.from(input),
      bytes: input.byteLength,
    };
  }

  throw new Error("Unsupported upload input type for Cloudinary helper.");
}

function validateSize(bytes: number): void {
  if (bytes > MAX_RECIPE_IMAGE_BYTES) {
    throw new Error(
      `Recipe image exceeds ${MAX_RECIPE_IMAGE_BYTES} byte limit.`,
    );
  }
}

function toDataUri(buffer: Buffer, mimeType = "application/octet-stream") {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

function mapResponse(response: UploadApiResponse): RecipeImageUploadResult {
  return {
    url: response.url,
    secureUrl: response.secure_url,
    publicId: response.public_id,
    width: response.width ?? undefined,
    height: response.height ?? undefined,
    format: response.format,
    bytes: response.bytes,
    createdAt: response.created_at,
  };
}

export async function uploadRecipeImage(
  input: Uploadable,
  options: UploadRecipeImageOptions = {},
): Promise<RecipeImageUploadResult> {
  ensureConfigured();

  const { buffer, bytes, mimeType } = await toBuffer(input);
  validateSize(bytes);

  const uploadResult = await cloudinary.uploader.upload(
    toDataUri(buffer, options.mimeType ?? mimeType ?? "image/jpeg"),
    {
      folder: options.folder ?? DEFAULT_FOLDER,
      public_id: options.publicId,
      tags: options.tags,
      resource_type: "image",
    },
  );

  return mapResponse(uploadResult);
}

export function getRecipeImageLimits() {
  return {
    maxBytes: MAX_RECIPE_IMAGE_BYTES,
    defaultFolder: DEFAULT_FOLDER,
    allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  };
}

