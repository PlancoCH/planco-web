import { useNavigate } from 'react-router-dom';
import { Cpu, Plus } from 'lucide-react';
import PageTitle from '../components/ui/PageTitle';
import PageContainer from '../components/ui/PageContainer';
import SmartList from '../components/ui/SmartList';
import type { SearchConfig, PaginationConfig, ListAction, EmptyStateConfig } from '../components/ui/SmartList';
import DeviceCard from '../components/ui/DeviceCard';
import type { Device } from '../types/device';
import { useDevices } from '../context/DeviceContext';

const POLLING_RATE_LABELS: Record<number, string> = {
  15: '15s',
  30: '30s',
  60: '1 min',
  120: '2 min',
  300: '5 min',
  600: '10 min',
  1800: '30 min',
  3600: '1 h',
};

function formatPollingRate(seconds: number): string {
  return POLLING_RATE_LABELS[seconds] ?? `${seconds}s`;
}

function getWifiStatus(rssi: number | null): { label: string; variant: 'success' | 'warning' | 'error' } {
  if (rssi === null) {
    return { label: 'No signal', variant: 'error' };
  }
  if (rssi >= -55) {
    return { label: 'Strong', variant: 'success' };
  }
  if (rssi >= -70) {
    return { label: 'Fair', variant: 'warning' };
  }
  return { label: 'Weak', variant: 'error' };
}

const searchConfig: SearchConfig<Device> = {
  placeholder: 'Search devices...',
  fields: ['name', 'notes'],
  fuzzy: true,
  serverSide: false,
  debounceMs: 250,
};

const paginationConfig: PaginationConfig = {
  serverSide: false,
  perPage: 6,
};

export default function Devices() {
  const navigate = useNavigate();
  const { devices, loading } = useDevices();

  const actions: ListAction[] = [
    {
      label: 'Map Device',
      onClick: () => {
        window.alert('Map device dialog would open here.');
      },
      icon: <Plus className="w-4 h-4" />,
      variant: 'primary',
    },
  ];

  const emptyState: EmptyStateConfig = {
    message: 'No devices found',
    description: 'Connect your first device to start monitoring your greenhouse.',
    cta: {
      label: 'Map a Device',
      onClick: () => {
        window.alert('Map device dialog would open here.');
      },
    },
  };

  return (
    <PageContainer>
      <PageTitle
        title="Devices"
        subtitle="Manage your connected devices and monitor your greenhouse."
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading devices...</p>
          </div>
        </div>
      ) : (
        <SmartList
          items={devices}
          getKey={(device) => device.id}
          displayMode="big"
          search={searchConfig}
          pagination={paginationConfig}
          actions={actions}
          emptyState={emptyState}
          renderItem={(device, _index, displayMode) => {
            const wifiStatus = getWifiStatus(device.wifi_rssi);

            return (
              <DeviceCard
                title={device.name}
                subtitle={`Polling every ${formatPollingRate(device.polling_rate)}`}
                details={[
                  { label: 'WiFi RSSI', value: device.wifi_rssi !== null ? `${device.wifi_rssi} dBm` : '\u2014' },
                  { label: 'LED', value: device.led_enabled ? 'On' : 'Off' },
                  { label: 'Updated', value: new Date(device.updated_at).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ]}
                tags={[`Poll: ${formatPollingRate(device.polling_rate)}`]}
                status={wifiStatus}
                icon={Cpu}
                onClick={() => navigate(`/devices/${device.id}`)}
                displayMode={displayMode}
              />
            );
          }}
        />
      )}
    </PageContainer>
  );
}
