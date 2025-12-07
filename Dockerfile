FROM denoland/deno:2.5.5

# It's good practice to specify the user. Deno's image provides a non-root 'deno' user.
USER deno

# Set the working directory inside the container
WORKDIR /app

# Expose the port the application will listen on.
# Render will set the PORT environment variable automatically.
# The application will use PORT env var if set, otherwise defaults to 10000.
EXPOSE 10000

# Copy all application files into the working directory.
# CRITICAL FIX: Use --chown to ensure the 'deno' user owns the files.
# This grants the necessary write permissions for the build step.
COPY --chown=deno:deno . .

# Run the custom build step defined in deno.json.
# This step writes to src/concepts/concepts.ts and now has permission to do so.
RUN deno task build

# Cache the main module and all its dependencies.
# This ensures faster startup times for the container as modules are pre-compiled.
# Also cache bcrypt module and its worker explicitly to ensure worker.ts is available
# when running with --cached-only in production (Render may add this flag automatically)
RUN deno cache src/main.ts && \
    deno cache src/concepts/Authentication/AuthenticationConcept.ts && \
    deno cache https://deno.land/x/bcrypt@v0.4.1/mod.ts && \
    deno cache https://deno.land/x/bcrypt@v0.4.1/src/worker.ts

# Specify the command to run when the container starts.
# Using 'deno task start' is the best practice here, as it encapsulates
# the full run command and necessary permissions from deno.json.
CMD ["deno", "task", "start"]