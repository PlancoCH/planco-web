import { useEffect } from 'react';
import { Sprout } from 'lucide-react';
import PageTitle from '../components/ui/PageTitle';
import PageContainer from '../components/ui/PageContainer';
import SmartList from '../components/ui/SmartList';
import type { SearchConfig, PaginationConfig, EmptyStateConfig } from '../components/ui/SmartList';
import ImageCard from '../components/ui/ImageCard';
import type { Plant } from '../types/plant';
import { usePlants } from '../context/PlantContext';

const PLANT_IMAGE_FALLBACK = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
  '<rect fill="#F2EAD8" width="400" height="300"/>' +
  '<text fill="#7FA87A" font-family="sans-serif" font-size="48" x="200" y="160" text-anchor="middle">🪴</text>' +
  '</svg>'
);

const searchConfig: SearchConfig<Plant> = {
  placeholder: 'Search plants...',
  fields: ['nickname', 'notes'],
  fuzzy: true,
  serverSide: false,
  debounceMs: 250,
};

const paginationConfig: PaginationConfig = {
  serverSide: false,
  perPage: 9,
};

export default function Plants() {
  const { plants, loading, refresh } = usePlants();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const emptyState: EmptyStateConfig = {
    message: 'No plants yet',
    description: 'Get started by adding your first plant to begin tracking its health.',
  };

  return (
    <PageContainer>
      <PageTitle
        title="Plants"
        subtitle="Manage your plants and track their current health statistics."
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading plants...</p>
          </div>
        </div>
      ) : (
        <SmartList
          items={plants}
          getKey={(plant) => plant.id}
          displayMode="small"
          search={searchConfig}
          pagination={paginationConfig}
          emptyState={emptyState}
          renderItem={(plant) => (
            <ImageCard
              variant="vertical"
              icon={Sprout}
              image={PLANT_IMAGE_FALLBACK}
              imageAlt={plant.nickname}
              title={plant.nickname}
              paragraph={
                plant.notes
                  ? plant.notes
                  : `A ${plant.plant_type.common_name} (${plant.plant_type.scientific_name})`
              }
              tags={[
                plant.role === 'owner' ? 'Owner' : 'Member',
                plant.device ? `Connected to ${plant.device.name}` : 'No device',
              ]}
            />
          )}
        />
      )}
    </PageContainer>
  );
}
