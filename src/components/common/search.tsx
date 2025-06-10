import React, { useRef, useEffect, useState } from "react";
import cn from "classnames";
import SearchResultLoader from "@components/ui/loaders/search-result-loader";
import { useUI } from "@contexts/ui.context";
import SearchBox from "@components/common/search-box";
import { useSearchQuery } from "@framework/product/use-search";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import SearchProduct from "@components/common/search-product";

export default function Search() {
  const { displaySearch, closeSearch } = useUI();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useSearchQuery(searchText);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    const scrollEl = scrollableRef.current;
    if (displaySearch && scrollEl) {
      disableBodyScroll(scrollEl, { reserveScrollBarGap: true });
    } else if (scrollEl) {
      enableBodyScroll(scrollEl);
    }
    return () => clearAllBodyScrollLocks();
  }, [displaySearch]);

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
  }

  function handleAutoSearch(e: React.FormEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  function clear() {
    setSearchText("");
  }

  return (
    <div ref={wrapperRef}>
      {/* Background overlay */}
      <div
        className={cn("overlay", { open: displaySearch })}
        role="button"
        onClick={closeSearch}
      />

      {/* Search Drawer */}
      <div
        className={cn(
          "drawer-search fixed z-50 top-0 left-1/2 w-full px-4 md:w-[730px] lg:w-[930px] transform -translate-x-1/2 transition-all duration-300 ease-in-out",
          {
            "opacity-100 visible": displaySearch,
            "opacity-0 invisible": !displaySearch,
          }
        )}
      >
        <div className="w-full flex flex-col justify-center pt-4">
          {/* Search Input */}
          <div className="w-full">
            <SearchBox
              onSubmit={handleSearch}
              onChange={handleAutoSearch}
              name="search"
              value={searchText}
              onClear={clear}
              ref={inputRef}
            />
          </div>

          {/* Search Results */}
          {searchText && (
            <div
              ref={scrollableRef}
              className="bg-white rounded-md h-[70vh] overflow-y-auto mt-3"
            >
              {isLoading ? (
                <div className="p-5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <SearchResultLoader
                      key={`loader-${idx}`}
                      uniqueKey={`top-search-${idx}`}
                    />
                  ))}
                </div>
              ) : (
                data?.map((item: any, index: number) => (
                  <div
                    key={item.key || index}
                    className="p-5 border-b border-gray-200 last:border-b-0"
                    onClick={closeSearch}
                  >
                    <SearchProduct item={item} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
