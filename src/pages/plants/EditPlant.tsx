import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Trash2, Cpu, Plus, Unplug } from 'lucide-react';
import { getPlant, updatePlant, deletePlant, mapPlantDevice, unmapPlantDevice } from '../../api/plants';
import { ApiError } from '../../api/client';
import { usePlants } from '../../context/PlantContext';
import { useDevices } from '../../context/DeviceContext';
import PageContainer from '../../components/ui/PageContainer';
import PageTitle from '../../components/ui/PageTitle';
import BackButton from '../../components/ui/BackButton';
import type { Plant, PlantUpdatePayload } from '../../types/plant';

export default function EditPlant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plantId = Number(id);

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nickname, setNickname] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mapping, setMapping] = useState(false);
  const [unmapping, setUnmapping] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { plants } = usePlants();
  const { devices, loading: devicesLoading } = useDevices();

  const mappedDeviceIds = useMemo(() => {
    const ids = new Set<number>();
    for (const p of plants) {
      if (p.id !== plantId && p.device_id !== null) {
        ids.add(p.device_id);
      }
    }
    return ids;
  }, [plants, plantId]);

  const availableDevices = useMemo(
    () => devices.filter((d) => !mappedDeviceIds.has(d.id)),
    [devices, mappedDeviceIds],
  );

  useEffect(() => {
    if (!plantId || isNaN(plantId)) {
      setError('Invalid plant ID.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    getPlant(plantId)
      .then((data) => {
        if (cancelled) return;
        setPlant(data);
        setNickname(data.nickname);
        setNotes(data.notes ?? '');
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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload: PlantUpdatePayload = {
      nickname,
      notes: notes || null,
    };

    try {
      const updated = await updatePlant(plantId, payload);
      setPlant((prev) => (prev ? { ...updated, plant_type: prev.plant_type, device: prev.device } : updated));
      setSuccess('Plant updated successfully.');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to update plant. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deletePlant(plantId);
      localStorage.removeItem('cached_plants');
      navigate('/plants', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to delete plant. Please try again.',
      );
      setDeleting(false);
    }
  };

  const handleMap = async () => {
    if (selectedDeviceId === null) return;
    setMapping(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await mapPlantDevice(plantId, selectedDeviceId);
      setPlant((prev) => (prev ? { ...updated, plant_type: prev.plant_type } : updated));
      setSuccess('Device mapped successfully.');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to map device. Please try again.',
      );
    } finally {
      setMapping(false);
    }
  };

  const handleUnmap = async () => {
    setUnmapping(true);
    setError(null);
    setSuccess(null);
    try {
      await unmapPlantDevice(plantId);
      setPlant((prev) => (prev ? { ...prev, device_id: null, device: null } : prev));
      setSuccess('Device unmapped successfully.');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to unmap device. Please try again.',
      );
    } finally {
      setUnmapping(false);
    }
  };

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
          <BackButton text="Back to Plant" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton text="Back to Plant" />

      <PageTitle title={plant.nickname} subtitle="View and edit plant settings." />

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
        <h2 className="font-serif text-xl text-forest-800 mb-6">Plant Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Plant ID</p>
            <p className="text-sm font-medium text-forest-700">{plant.id}</p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Plant Type</p>
            <p className="text-sm font-medium text-forest-700">
              {plant.plant_type.common_name}{' '}
              <span className="text-forest-400 italic">({plant.plant_type.scientific_name})</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm font-medium text-forest-700 capitalize">{plant.role}</p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Device</p>
            <p className="text-sm font-medium text-forest-700">
              {plant.device ? (
                <>
                  {plant.device.name}{' '}
                  <span className="text-forest-400 font-normal">(ID: {plant.device.id})</span>
                </>
              ) : (
                '\u2014'
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-forest-400 uppercase tracking-wide mb-1">Created</p>
            <p className="text-sm font-medium text-forest-700">
              {new Date(plant.created_at).toLocaleDateString('en-CH', {
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
              {new Date(plant.updated_at).toLocaleDateString('en-CH', {
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
        <h2 className="font-serif text-xl text-forest-800 mb-6">Edit Plant</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label
              htmlFor="plant-nickname"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Nickname
            </label>
            <input
              id="plant-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={255}
              placeholder="Plant nickname"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.nickname?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <label
              htmlFor="plant-notes"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Notes
            </label>
            <textarea
              id="plant-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes about this plant"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm resize-none"
            />
            {fieldErrors.notes?.map((msg) => (
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

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm mb-6">
        <h2 className="font-serif text-xl text-forest-800 mb-6">Device Connection</h2>
        {plant.device ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-forest-DEFAULT/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-forest-DEFAULT" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest-700">{plant.device.name}</p>
                <p className="text-xs text-forest-400">Device ID: {plant.device.id}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUnmap}
              disabled={unmapping}
              className="inline-flex items-center gap-2 border border-red-300 text-red-600 font-medium px-5 py-2.5 rounded-full hover:bg-red-50 hover:border-red-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {unmapping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unmapping...
                </>
              ) : (
                <>
                  <Unplug className="w-4 h-4" />
                  Unmap Device
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="plant-device"
                  className="block text-sm font-medium text-forest-700 mb-1.5"
                >
                  Select Device
                </label>
                <select
                  id="plant-device"
                  value={selectedDeviceId ?? ''}
                  onChange={(e) => setSelectedDeviceId(e.target.value ? Number(e.target.value) : null)}
                  disabled={devicesLoading || mapping}
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm disabled:opacity-50"
                >
                  <option value="">{devicesLoading ? 'Loading devices...' : '-- Choose a device --'}</option>
                  {availableDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (ID: {d.id})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleMap}
                disabled={selectedDeviceId === null || mapping}
                className="inline-flex items-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {mapping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mapping...
                  </>
                ) : (
                  'Map Device'
                )}
              </button>
            </div>
            <div className="mt-5 pt-5 border-t border-beige-200">
              <p className="text-xs text-forest-400 leading-relaxed mb-3">
                Only devices that are not already mapped to a plant are shown. If the device
                you're looking for doesn't appear here, it may already be connected to another
                plant, or you haven't set one up yet.
              </p>
              <button
                type="button"
                onClick={() => navigate('/devices/add')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-DEFAULT hover:text-forest-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Set up a new device
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-beige-50 rounded-2xl border border-red-200 p-8 shadow-sm">
        <h2 className="font-serif text-xl text-red-700 mb-2">Danger Zone</h2>
        <p className="text-forest-500 text-sm mb-6 leading-relaxed">
          Deleting this plant will permanently remove it from your account, along with all
          associated data, insights, and images. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 border border-red-300 text-red-600 font-medium px-5 py-2.5 rounded-full hover:bg-red-50 hover:border-red-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {deleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete Plant
            </>
          )}
        </button>
      </div>
    </PageContainer>
  );
}
