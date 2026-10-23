// The raw Flow downloads live in public/ for reference but are not part of the site.
import { rmSync } from "node:fs";

for (const dir of ["out/source-frames", "out/source-video"]) {
  rmSync(dir, { recursive: true, force: true });
}
