import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Trash2, Cpu } from 'lucide-react';
import { getDevice, updateDevice, unmapDevice } from '../../api/devices';
import { ApiError } from '../../api/client';
import PageContainer from '../../components/ui/PageContainer';
import PageTitle from '../../components/ui/PageTitle';
import type { Device, DeviceUpdatePayload } from '../../types/device';

const POLLING_RATE_OPTIONS = [15, 30, 60, 120, 300, 600, 1800, 3600] as const;

const POLLING_RATE_LABELS: Record<number, string> = {
  15: '15 seconds',
  30: '30 seconds',
  60: '1 minute',
  120: '2 minutes',
  300: '5 minutes',
  600: '10 minutes',
  1800: '30 minutes',
  3600: '1 hour',
};

function formatPollingRate(seconds: number): string {
  return POLLING_RATE_LABELS[seconds] ?? `${seconds}s`;
}

export default function EditDevice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deviceId = Number(id);

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [pollingRate, setPollingRate] = useState(60);
  const [ledEnabled, setLedEnabled] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!deviceId || isNaN(deviceId)) {
      setError('Invalid device ID.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    getDevice(deviceId)
      .then((data) => {
        if (cancelled) return;
        setDevice(data);
        setName(data.name);
        setNotes(data.notes ?? '');
        setPollingRate(data.polling_rate);
        setLedEnabled(data.led_enabled);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load device.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload: DeviceUpdatePayload = {
      name,
      notes: notes || null,
      polling_rate: pollingRate,
      led_enabled: ledEnabled,
    };

    try {
      const updated = await updateDevice(deviceId, payload);
      setDevice(updated);
      setSuccess('Device updated successfully.');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to update device. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUnmap = async () => {
    setDeleting(true);
    setError(null);

    try {
      await unmapDevice(deviceId);
      localStorage.removeItem('cached_devices');
      navigate('/devices', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to unmap device. Please try again.',
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading device...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !device) {
    return (
      <PageContainer>
        <PageTitle title="Device Not Found" subtitle="The device you're looking for doesn't exist or you don't have access." />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/devices')}
            className="inline-flex items-center gap-2 text-forest-600 font-medium px-5 py-2.5 rounded-full border border-forest-300 hover:border-forest-DEFAULT hover:text-forest-DEFAULT transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Devices
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => navigate('/devices')}
        className="inline-flex items-center gap-2 text-forest-500 hover:text-forest-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Devices
      </button>

      <PageTitle title={device.name} subtitle="View and edit device settings." />

      {success && (
        <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-forest-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm mb-6">
        <h2 className="font-serif text-xl text-forest-800 mb-6">Device Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Device ID</p>
            <p className="text-sm font-medium text-forest-700">{device.id}</p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">WiFi RSSI</p>
            <p className="text-sm font-medium text-forest-700">
              {device.wifi_rssi !== null ? `${device.wifi_rssi} dBm` : '\u2014'}
            </p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">LED Status</p>
            <p className="text-sm font-medium text-forest-700">
              {device.led_enabled ? 'On' : 'Off'}
            </p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Created</p>
            <p className="text-sm font-medium text-forest-700">
              {new Date(device.created_at).toLocaleDateString('en-CH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Last Updated</p>
            <p className="text-sm font-medium text-forest-700">
              {new Date(device.updated_at).toLocaleDateString('en-CH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm mb-6">
        <h2 className="font-serif text-xl text-forest-800 mb-6">Edit Device</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label
              htmlFor="device-name"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Name
            </label>
            <input
              id="device-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={255}
              placeholder="Device name"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.name?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <label
              htmlFor="device-notes"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Notes
            </label>
            <textarea
              id="device-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes about this device"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm resize-none"
            />
            {fieldErrors.notes?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <label
              htmlFor="device-polling-rate"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Polling Rate
            </label>
            <select
              id="device-polling-rate"
              value={pollingRate}
              onChange={(e) => setPollingRate(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            >
              {POLLING_RATE_OPTIONS.map((rate) => (
                <option key={rate} value={rate}>
                  {formatPollingRate(rate)}
                </option>
              ))}
            </select>
            {fieldErrors.polling_rate?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-700">LED Indicator</p>
              <p className="text-xs text-forest-400 mt-0.5">
                Enable or disable the LED on the device.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={ledEnabled}
              onClick={() => setLedEnabled(!ledEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-forest-DEFAULT/20 ${
                ledEnabled ? 'bg-forest-DEFAULT' : 'bg-beige-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  ledEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {fieldErrors.led_enabled?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>

      <div className="bg-beige-50 rounded-2xl border border-red-200 p-8 shadow-sm">
        <h2 className="font-serif text-xl text-red-700 mb-2">Danger Zone</h2>
        <p className="text-forest-500 text-sm mb-6 leading-relaxed">
          Unmapping this device will remove it from your account. The device itself is not
          deleted and can be mapped again later. Any plants associated with this device will
          be disconnected.
        </p>
        <button
          type="button"
          onClick={handleUnmap}
          disabled={deleting}
          className="inline-flex items-center gap-2 border border-red-300 text-red-600 font-medium px-5 py-2.5 rounded-full hover:bg-red-50 hover:border-red-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {deleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Unmapping...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Unmap Device
            </>
          )}
        </button>
      </div>
    </PageContainer>
  );
}
