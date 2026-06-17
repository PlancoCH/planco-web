import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

function exactMatch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      qi++;
    }
  }
  return qi === q.length;
}

function filterItems<T>(
  items: T[],
  query: string,
  fields: (keyof T)[],
  fuzzy: boolean,
): T[] {
  if (!query) return items;
  const matcher = fuzzy ? fuzzyMatch : exactMatch;
  return items.filter((item) =>
    fields.some((field) => matcher(String(item[field] ?? ''), query)),
  );
}

function paginateItems<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

function getPageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('ellipsis');
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push('ellipsis');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('ellipsis');
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push('ellipsis');
    pages.push(total);
  }

  return pages;
}

export interface SearchConfig<T> {
  placeholder?: string;
  fields: (keyof T)[];
  fuzzy?: boolean;
  serverSide?: boolean;
  onSearch?: (query: string) => void;
  debounceMs?: number;
}

export interface PaginationConfig {
  serverSide?: boolean;
  perPage: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface ListAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface EmptyStateConfig {
  message: string;
  description?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export interface SmartListProps<T> {
  items: T[];
  renderItem: (item: T, index: number, displayMode: 'big' | 'small') => ReactNode;
  getKey?: (item: T, index: number) => string | number;
  displayMode?: 'big' | 'small';
  search?: SearchConfig<T>;
  pagination?: PaginationConfig;
  actions?: ListAction[];
  emptyState?: EmptyStateConfig;
  className?: string;
  headerClassName?: string;
  listClassName?: string;
}

export default function SmartList<T>({
  items,
  renderItem,
  getKey,
  displayMode = 'big',
  search,
  pagination,
  actions,
  emptyState,
  className = '',
  headerClassName = '',
  listClassName = '',
}: SmartListProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [clientPage, setClientPage] = useState(1);

  const debounceMs = search?.debounceMs ?? 300;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputValue), debounceMs);
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  useEffect(() => {
    if (search?.serverSide) {
      search.onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (!search?.serverSide) {
        setClientPage(1);
      }
    },
    [search],
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    setClientPage(1);
  }, []);

  const filteredItems = useMemo(() => {
    if (search?.serverSide || !search) return items;
    return filterItems(items, debouncedQuery, search.fields, search.fuzzy ?? false);
  }, [items, search, debouncedQuery]);

  const effectivePage = useMemo(() => {
    if (pagination?.serverSide) return pagination.currentPage ?? 1;
    return clientPage;
  }, [pagination, clientPage]);

  const effectiveTotalPages = useMemo(() => {
    if (pagination?.serverSide) return pagination.totalPages ?? 1;
    return Math.max(1, Math.ceil(filteredItems.length / pagination!.perPage));
  }, [pagination, filteredItems]);

  const displayItems = useMemo(() => {
    if (pagination?.serverSide) return items;
    if (pagination) return paginateItems(filteredItems, clientPage, pagination.perPage);
    return filteredItems;
  }, [items, filteredItems, pagination, clientPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (pagination?.serverSide) {
        pagination.onPageChange?.(page);
      } else {
        setClientPage(page);
      }
    },
    [pagination],
  );

  const pageNumbers = useMemo(
    () => getPageRange(effectivePage, effectiveTotalPages),
    [effectivePage, effectiveTotalPages],
  );

  const isEmpty = displayItems.length === 0;
  const showSearch = search !== undefined;
  const showActions = actions && actions.length > 0;
  const showPagination = pagination && effectiveTotalPages > 1;
  const showHeader = showSearch || showActions;

  const isBig = displayMode === 'big';
  const gridClass = isBig
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={className}>
      {showHeader && (
        <div className={`mb-8 space-y-4 ${headerClassName}`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={search.placeholder ?? 'Search...'}
                  className="w-full pl-12 pr-10 py-3 bg-beige-50 border border-beige-300 rounded-full text-forest-700 placeholder:text-forest-400 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-DEFAULT/15 transition-all duration-300"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {showActions && (
              <div className="flex items-center gap-3 flex-wrap">
                {actions.map((action) => {
                  const variant = action.variant ?? 'primary';
                  const styles: Record<string, string> = {
                    primary:
                      'inline-flex items-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest-DEFAULT/25 active:scale-95 text-sm',
                    secondary:
                      'inline-flex items-center gap-2 text-forest-600 font-medium px-5 py-2.5 rounded-full border border-forest-300 hover:border-forest-DEFAULT hover:text-forest-DEFAULT transition-all duration-300 text-sm',
                    ghost:
                      'inline-flex items-center gap-2 text-forest-DEFAULT font-semibold hover:opacity-80 transition-opacity text-sm',
                  };
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className={styles[variant]}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {showSearch && !search.serverSide && debouncedQuery && (
            <p className="text-sm text-forest-500">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for
              &ldquo;{debouncedQuery}&rdquo;
            </p>
          )}
        </div>
      )}

      {isEmpty && emptyState ? (
        <div className="text-center py-16 px-6">
          <div className="max-w-sm mx-auto">
            <Search className="w-12 h-12 text-forest-300 mx-auto mb-6 opacity-50" />
            <h3 className="font-serif text-xl text-forest-800 mb-2">
              {emptyState.message}
            </h3>
            {emptyState.description && (
              <p className="text-forest-500 mb-8 leading-relaxed">
                {emptyState.description}
              </p>
            )}
            {emptyState.cta && (
              <button
                type="button"
                onClick={emptyState.cta.onClick}
                className="inline-flex items-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                {emptyState.cta.label}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className={`${gridClass} ${listClassName}`}>
            {displayItems.map((item, index) => (
              <div key={getKey ? getKey(item, index) : index}>
                {renderItem(item, index, displayMode)}
              </div>
            ))}
          </div>

          {showPagination && (
            <nav className="flex items-center justify-center gap-1 mt-10">
              <button
                type="button"
                disabled={effectivePage <= 1}
                onClick={() => handlePageChange(effectivePage - 1)}
                className="p-2 rounded-full text-forest-600 hover:bg-beige-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {pageNumbers.map((page, idx) =>
                page === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-10 h-10 flex items-center justify-center text-forest-400 text-sm"
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                      page === effectivePage
                        ? 'bg-forest-DEFAULT text-beige-100 shadow-md'
                        : 'text-forest-600 hover:bg-beige-200'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={effectivePage >= effectiveTotalPages}
                onClick={() => handlePageChange(effectivePage + 1)}
                className="p-2 rounded-full text-forest-600 hover:bg-beige-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
