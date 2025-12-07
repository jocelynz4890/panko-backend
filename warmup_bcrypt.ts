// Warm up bcrypt to ensure worker is cached
// This file ensures the bcrypt worker and all dependencies are loaded and cached
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// Explicitly cache the worker file and its dependencies
await Deno.permissions.request({ name: "read" });
await import("https://deno.land/x/bcrypt@v0.4.1/src/worker.ts").catch(() => {
  // Worker file might not be importable directly, that's okay
});

// Force bcrypt to initialize and load its worker
try {
  await bcrypt.hash("warmup");
  console.log("✅ Bcrypt worker warmed up successfully");
} catch (error) {
  console.error("❌ Error warming up bcrypt:", error);
  Deno.exit(1);
}
