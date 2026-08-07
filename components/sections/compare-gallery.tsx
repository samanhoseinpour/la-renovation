import { CompareSlider } from "@/components/sections/compare-slider";
import { blurProps } from "@/content/blur";
import type { ComparePair } from "@/content/projects";

/**
 * Before/after strip for project case studies. Mirrors ProjectGallery's grid:
 * with an odd pair count the first frame takes the full row, so the set reads
 * as one wide comparison plus pairs.
 */
export function CompareGallery({ pairs }: { pairs: ComparePair[] }) {
  const oddCount = pairs.length % 2 === 1;

  return (
    <div>
      <h2 className="text-eyebrow text-muted-foreground">Before / after</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {pairs.map((pair, i) => {
          const fullWidth = oddCount && i === 0;

          return (
            <div
              key={pair.before.src}
              className={fullWidth ? "lg:col-span-2" : undefined}
            >
              <CompareSlider
                before={pair.before}
                after={pair.after}
                beforeBlur={blurProps(pair.before.src)}
                afterBlur={blurProps(pair.after.src)}
                label={pair.caption}
                sizes={fullWidth ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
              />
              {pair.caption ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {pair.caption}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
