import React from "react";

interface Props {
  query: string;
  results: any[];
  loading: boolean;
}

export function SearchResultsOverlay({ query, results, loading }: Props) {
  return (
    <div className="absolute top-14 left-0 w-full bg-neutral-900 text-white rounded-xl shadow-lg z-50 max-h-[70vh] overflow-y-auto border border-neutral-700">
      {loading && <div className="p-4">Searching...</div>}

      {!loading && results.length === 0 && (
        <div className="p-4 text-gray-400">No results found for "{query}"</div>
      )}

      <ul>
        {results.map((item: any, idx: number) => (
          <li
            key={idx}
            className="p-4 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer"
          >
            <div className="font-semibold">{item.title || item.name}</div>
            <div className="text-sm text-gray-400">
              {item.artist || item.type}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
