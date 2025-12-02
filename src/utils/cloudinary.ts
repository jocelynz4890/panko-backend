import {
  type UploadApiResponse,
  v2 as cloudinary,
} from "npm:cloudinary@1.41.0";
import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import "jsr:@std/dotenv/load";

type Uploadable = File | Blob | ArrayBuffer | Uint8Array;

const REQUIRED_VARS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const MAX_RECIPE_IMAGE_BYTES = Number(
  Deno.env.get("MAX_RECIPE_IMAGE_BYTES") ?? 5_000_000,
);
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

function toNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
  if (typeof Readable.fromWeb === "function") {
    return Readable.fromWeb(stream);
  }

  // Fallback for environments missing Readable.fromWeb
  const iterator = (async function* () {
    const reader = stream.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) yield value;
      }
    } finally {
      reader.releaseLock();
    }
  })();

  return Readable.from(iterator);
}

async function toReadable(
  input: Uploadable,
): Promise<{ readable: Readable; bytes: number; mimeType?: string }> {
  if (isFile(input)) {
    return {
      readable: toNodeReadable(input.stream()),
      bytes: input.size,
      mimeType: input.type || undefined,
    };
  }

  if (isBlob(input)) {
    return {
      readable: toNodeReadable(input.stream()),
      bytes: input.size,
      mimeType: input.type || undefined,
    };
  }

  if (input instanceof Uint8Array) {
    const buffer = Buffer.from(input);
    return {
      readable: Readable.from([buffer]),
      bytes: buffer.byteLength,
    };
  }

  if (input instanceof ArrayBuffer) {
    const buffer = Buffer.from(input);
    return {
      readable: Readable.from([buffer]),
      bytes: buffer.byteLength,
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

  const { readable, bytes, mimeType } = await toReadable(input);
  validateSize(bytes);

  const uploadOptions = {
    folder: options.folder ?? DEFAULT_FOLDER,
    public_id: options.publicId,
    tags: options.tags,
    resource_type: "image",
    content_type: options.mimeType ?? mimeType ?? "image/jpeg",
  };

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            reject(
              error ?? new Error("Cloudinary upload failed without a result."),
            );
            return;
          }
          resolve(result);
        },
      );

      readable.on("error", reject);
      uploadStream.on("error", reject);
      readable.pipe(uploadStream);
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
