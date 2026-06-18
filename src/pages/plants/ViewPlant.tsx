import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sprout, Thermometer, Droplets, Sun, Gauge, Leaf, Cpu } from 'lucide-react';
import { getPlant, getPlantData } from '../../api/plants';
import { ApiError } from '../../api/client';
import PageContainer from '../../components/ui/PageContainer';
import PageTitle from '../../components/ui/PageTitle';
import BackButton from '../../components/ui/BackButton';
import ImageCard from '../../components/ui/ImageCard';
import HealthGauge from '../../components/ui/HealthGauge';
import StatCard from '../../components/ui/StatCard';
import SensorTimeChart from '../../components/ui/SensorTimeChart';
import CollapsibleSection from '../../components/ui/CollapsibleSection';
import { useAuthImage } from '../../hooks/useAuthImage';
import { useImageCache } from '../../context/ImageCacheContext';
import type { Plant, PlantData } from '../../types/plant';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ViewPlant() {
  const { id } = useParams<{ id: string }>();
  const plantId = Number(id);
  const { getImageUrl } = useImageCache();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantData, setPlantData] = useState<PlantData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cachedImage = getImageUrl('plant', plantId);
  const imageUrl = cachedImage ?? `https://api.planco.ch/api/plants/${plantId}/image`;
  const { dataUrl: imageDataUrl } = useAuthImage(
    cachedImage ? '' : imageUrl,
    cachedImage ? undefined : getAuthHeaders(),
  );

  const displayImage = cachedImage ?? imageDataUrl;

  useEffect(() => {
    if (!plantId || isNaN(plantId)) {
      setError('Invalid plant ID.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.all([
      getPlant(plantId),
      getPlantData(plantId).catch(() => [] as PlantData[]),
    ])
      .then(([plantResult, dataResult]) => {
        if (cancelled) return;
        setPlant(plantResult);
        setPlantData(dataResult);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load plant.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [plantId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading plant...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !plant) {
    return (
      <PageContainer>
        <PageTitle title="Plant Not Found" subtitle="The plant you're looking for doesn't exist or you don't have access." />
        <div className="flex justify-center">
          <BackButton to="/plants" text="Back to Plants" />
        </div>
      </PageContainer>
    );
  }

  const latestData = plantData && plantData.length > 0
    ? [...plantData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  const latestScore = latestData?.plant_score ?? null;

  return (
    <PageContainer>
      <BackButton to="/plants" text="Back to Plants" />

      {/* Hero */}
      <div className="mb-8">
        <ImageCard
          variant="horizontal"
          icon={Sprout}
          image={displayImage ?? imageUrl}
          imageAlt={plant.nickname}
          title={plant.nickname}
          paragraph={plant.notes ?? `A ${plant.plant_type.common_name} (${plant.plant_type.scientific_name})`}
          tags={[
            plant.role === 'owner' ? 'Owner' : 'Member',
            plant.device ? `Connected to ${plant.device.name}` : 'No device connected',
          ]}
        />
      </div>

      {/* Health Section */}
      <div className="mb-8">
        <h2 className="font-serif text-xl text-forest-800 mb-5">Plant Health</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="rounded-2xl border border-beige-300 bg-beige-50 p-5 sm:p-6 w-full">
              <HealthGauge score={latestScore !== null ? latestScore : null} size={160} />
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={Thermometer}
              label="Temperature"
              value={latestData ? `${latestData.temperature}°C` : '—'}
              accent="amber"
            />
            <StatCard
              icon={Droplets}
              label="Humidity"
              value={latestData ? `${latestData.humidity}%` : '—'}
              accent="sage"
            />
            <StatCard
              icon={Gauge}
              label="Soil Moisture"
              value={latestData ? `${latestData.soil_moisture}%` : '—'}
              accent="forest"
            />
            <StatCard
              icon={Sun}
              label="Light"
              value={latestData ? `${latestData.light_intensity} lux` : '—'}
              accent="amber"
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      {plantData && plantData.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-forest-800 mb-5">Sensor History</h2>
          <SensorTimeChart data={plantData} />
        </div>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-4 mb-8">
        <CollapsibleSection title="Plant Type" icon={Leaf}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Common Name</p>
              <p className="text-sm font-medium text-forest-700">{plant.plant_type.common_name}</p>
            </div>
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Scientific Name</p>
              <p className="text-sm font-medium text-forest-700 italic">{plant.plant_type.scientific_name}</p>
            </div>
            {plant.plant_type.description && (
              <div className="sm:col-span-2">
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-forest-600 leading-relaxed">{plant.plant_type.description}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Ideal Temp</p>
              <p className="text-sm font-medium text-forest-700">
                {plant.plant_type.ideal_temp !== null ? `${plant.plant_type.ideal_temp}°C` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Ideal Humidity</p>
              <p className="text-sm font-medium text-forest-700">
                {plant.plant_type.ideal_humidity !== null ? `${plant.plant_type.ideal_humidity}%` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Ideal Moisture</p>
              <p className="text-sm font-medium text-forest-700">
                {plant.plant_type.ideal_moisture !== null ? `${plant.plant_type.ideal_moisture}%` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Ideal Light</p>
              <p className="text-sm font-medium text-forest-700">
                {plant.plant_type.ideal_light_lux !== null ? `${plant.plant_type.ideal_light_lux} lux` : '—'}
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {plant.device && (
          <CollapsibleSection title="Connected Device" icon={Cpu}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm font-medium text-forest-700">{plant.device.name}</p>
              </div>
              <div>
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Device ID</p>
                <p className="text-sm font-medium text-forest-700">{plant.device.id}</p>
              </div>
              <div>
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Polling Rate</p>
                <p className="text-sm font-medium text-forest-700">
                  {plant.device.polling_rate}s
                </p>
              </div>
              <div>
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">WiFi RSSI</p>
                <p className="text-sm font-medium text-forest-700">
                  {plant.device.wifi_rssi !== null ? `${plant.device.wifi_rssi} dBm` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">LED Status</p>
                <p className="text-sm font-medium text-forest-700">
                  {plant.device.led_enabled ? 'On' : 'Off'}
                </p>
              </div>
              {plant.device.notes && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-forest-600 leading-relaxed">{plant.device.notes}</p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </PageContainer>
  );
}
