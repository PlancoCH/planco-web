import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { getPlantTypes, createPlant } from '../../api/plants';
import PageContainer from '../../components/ui/PageContainer';
import PageTitle from '../../components/ui/PageTitle';
import BackButton from '../../components/ui/BackButton';
import SmartList from '../../components/ui/SmartList';
import type { SearchConfig, PaginationConfig, EmptyStateConfig } from '../../components/ui/SmartList';
import type { PlantType, PaginatedPlantTypes } from '../../types/plant';

const PER_PAGE = 15;

const searchConfig: SearchConfig<PlantType> = {
  placeholder: 'Search plant types...',
  fields: ['common_name', 'scientific_name'],
  fuzzy: true,
  serverSide: true,
  debounceMs: 300,
};

function formatIdealValue(value: number | null, suffix: string): string {
  if (value === null) return '\u2014';
  return `${value}${suffix}`;
}

export default function AddPlant() {
  const navigate = useNavigate();

  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchRef = useRef('');

  const fetchPlantTypes = useCallback(async (search: string, page: number) => {
    setFetching(true);
    setError(null);
    try {
      const result: PaginatedPlantTypes = await getPlantTypes(search || undefined, page);
      setPlantTypes(result.data);
      setCurrentPage(result.meta.current_page);
      setTotalPages(result.meta.last_page);
    } catch {
      setError('Failed to load plant types. Please try again.');
    } finally {
      setFetching(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlantTypes('', 1);
  }, [fetchPlantTypes]);

  const handleSearch = useCallback(
    (query: string) => {
      searchRef.current = query;
      fetchPlantTypes(query, 1);
    },
    [fetchPlantTypes],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchPlantTypes(searchRef.current, page);
    },
    [fetchPlantTypes],
  );

  const handleSelect = useCallback(async (plantType: PlantType) => {
    setCreating(true);
    setError(null);
    try {
      const plant = await createPlant({
        nickname: `New ${plantType.common_name}`,
        plant_type_id: plantType.id,
      });
      localStorage.removeItem('cached_plants');
      navigate(`/plants/${plant.id}/edit`, { replace: true });
    } catch {
      setError('Failed to create plant. Please try again.');
      setCreating(false);
    }
  }, [navigate]);

  const emptyState: EmptyStateConfig = {
    message: 'No plant types found',
    description: 'Try a different search term or adjust your filters.',
  };

  const paginationConfig: PaginationConfig = {
    serverSide: true,
    perPage: PER_PAGE,
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  };

  const resolvedSearchConfig: SearchConfig<PlantType> = {
    ...searchConfig,
    onSearch: handleSearch,
  };

  if (creating) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Creating plant...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton to="/plants" text="Back to Plants" />

      <PageTitle title="Add Plant" subtitle="Choose a plant type to get started." />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading plant types...</p>
          </div>
        </div>
      ) : (
        <>
          {fetching && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-forest-DEFAULT/10 rounded-full px-4 py-2">
                <div className="w-4 h-4 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-forest-600">Loading...</span>
              </div>
            </div>
          )}
          <SmartList
            items={plantTypes}
            getKey={(pt) => pt.id}
            displayMode="small"
            search={resolvedSearchConfig}
            pagination={paginationConfig}
            emptyState={emptyState}
            renderItem={(plantType) => (
              <button
                type="button"
                onClick={() => handleSelect(plantType)}
                className="w-full text-left bg-beige-50 rounded-2xl border border-beige-300 p-6 hover:border-forest-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-DEFAULT/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sprout className="w-5 h-5 text-forest-DEFAULT" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg text-forest-800 group-hover:text-forest-DEFAULT transition-colors truncate">
                      {plantType.common_name}
                    </h3>
                    <p className="text-xs text-forest-400 italic mt-0.5">
                      {plantType.scientific_name}
                    </p>
                    {plantType.description && (
                      <p className="text-sm text-forest-600 mt-2 line-clamp-2 leading-relaxed">
                        {plantType.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-beige-200">
                      <div>
                        <p className="text-[10px] text-forest-400 uppercase tracking-wide">Temp</p>
                        <p className="text-xs font-medium text-forest-600">
                          {formatIdealValue(plantType.ideal_temp, '\u00b0C')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-forest-400 uppercase tracking-wide">Humidity</p>
                        <p className="text-xs font-medium text-forest-600">
                          {formatIdealValue(plantType.ideal_humidity, '%')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-forest-400 uppercase tracking-wide">Moisture</p>
                        <p className="text-xs font-medium text-forest-600">
                          {formatIdealValue(plantType.ideal_moisture, '%')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-forest-400 uppercase tracking-wide">Light</p>
                        <p className="text-xs font-medium text-forest-600">
                          {formatIdealValue(plantType.ideal_light_lux, ' lux')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )}
          />
        </>
      )}
    </PageContainer>
  );
}
