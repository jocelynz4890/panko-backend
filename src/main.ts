/**
 * Entry point for an application built with concepts + synchronizations.
 * Requires the Requesting concept as a bootstrap concept.
 * Please run "deno run import" or "generate_imports.ts" to prepare "@concepts".
 */
import * as concepts from "@concepts";

// Use the following line instead to run against the test database, which resets each time.
// import * as concepts from "@test-concepts";

// Warm up bcrypt to ensure worker is loaded and cached before server starts
// This prevents "cached-only" errors when bcrypt dynamically loads its worker
// We explicitly cache the worker file so it's available when bcrypt creates the Worker
try {
  // Explicitly cache the worker file and its dependencies
  await import("https://deno.land/x/bcrypt@v0.4.1/src/worker.ts").catch(() => {
    // Worker might not be directly importable, that's okay
  });
  
  // Warm up bcrypt by calling hash, which will initialize the worker
  const { hash } = await import("https://deno.land/x/bcrypt/mod.ts");
  await hash("warmup");
  console.log("✅ Bcrypt worker initialized");
} catch (error) {
  console.warn("⚠️  Warning: Could not warm up bcrypt worker:", error);
  // Continue anyway - bcrypt will try to load worker when needed
}

const { Engine } = concepts;
import { Logging } from "@engine";
import { startRequestingServer } from "@concepts/Requesting/RequestingConcept.ts";
import syncs from "@syncs";

/**
 * Available logging levels:
 *   Logging.OFF
 *   Logging.TRACE - display a trace of the actions.
 *   Logging.VERBOSE - display full record of synchronization.
 */
Engine.logging = Logging.TRACE;

// Register synchronizations
Engine.register(syncs);

// Start a server to provide the Requesting concept with external/system actions.
startRequestingServer(concepts);
