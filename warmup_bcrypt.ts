import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

await bcrypt.hash("warmup"); // forces worker to load + cache
