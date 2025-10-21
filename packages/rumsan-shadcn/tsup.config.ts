import { defineConfig } from "tsup";
import { globSync } from "glob";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    // Individual components
    ...Object.fromEntries(
      globSync("src/components/*.tsx").map((file: string) => [
        `components/${file.split("/").pop()?.replace(".tsx", "")}`,
        file,
      ])
    ),
    // Individual hooks
    ...Object.fromEntries(
      globSync("src/hooks/*.ts").map((file: string) => [
        `hooks/${file.split("/").pop()?.replace(".ts", "")}`,
        file,
      ])
    ),
    // Individual lib files
    ...Object.fromEntries(
      globSync("src/lib/*.ts").map((file: string) => [
        `lib/${file.split("/").pop()?.replace(".ts", "")}`,
        file,
      ])
    ),
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  treeshake: true,
  bundle: false,
  external: [
    "react",
    "react-dom",
    "next",
    "next-themes",
    "@radix-ui/*",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "cmdk",
    "date-fns",
    "embla-carousel-react",
    "input-otp",
    "lucide-react",
    "react-day-picker",
    "react-hook-form",
    "react-resizable-panels",
    "recharts",
    "sonner",
    "vaul",
    "zod",
    "@hookform/resolvers",
    "tw-animate-css",
  ],
  esbuildOptions(options: any) {
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    // Copy CSS files
    const fs = await import("fs/promises");
    const path = await import("path");
    const { glob } = await import("glob");
    
    try {
      await fs.mkdir("dist/styles", { recursive: true });
      await fs.copyFile("src/styles/globals.css", "dist/styles/globals.css");
      
      // Add "use client" directive to all .js files
      const jsFiles = await glob("dist/**/*.js");
      for (const file of jsFiles) {
        const content = await fs.readFile(file, "utf-8");
        // Only add if not already present and not a pure re-export file
        if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
          await fs.writeFile(file, `"use client";\n${content}`);
        }
      }
    } catch (error) {
      console.warn("Error in onSuccess:", error);
    }
  },
});