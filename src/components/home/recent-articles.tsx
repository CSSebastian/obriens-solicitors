"use client";

import { useState } from "react";

import { ArticleCard } from "@/components/site/article-card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/content/site";

const MOBILE_INITIAL_COUNT = 3;

/**
 * Desktop shows the full 2x3 grid. Mobile shows the first three cards with a
 * "Load more" button that reveals the rest — per Home • Mobile.png.
 */
export function RecentArticles({ articles }: { articles: Article[] }) {
  const [expanded, setExpanded] = useState(false);
  const hiddenOnMobile = articles.length - MOBILE_INITIAL_COUNT;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {articles.map((article, index) => {
          const hideOnMobile = !expanded && index >= MOBILE_INITIAL_COUNT;
          return (
            <li
              key={article.slug}
              className={hideOnMobile ? "hidden sm:block" : undefined}
            >
              <ArticleCard article={article} />
            </li>
          );
        })}
      </ul>

      {hiddenOnMobile > 0 && !expanded ? (
        <div className="mt-10 sm:hidden">
          <Button
            variant="outline-inverse"
            className="w-full"
            onClick={() => setExpanded(true)}
            aria-label={`Load ${hiddenOnMobile} more articles`}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}
