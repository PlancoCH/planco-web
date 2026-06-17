import { useState, useRef, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, QrCode, ScanLine, X, Loader2 } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { mapDevice } from "../../api/devices";
import { ApiError } from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import PageTitle from "../../components/ui/PageTitle";
import BackButton from "../../components/ui/BackButton";

export default function AddDevice() {
  const navigate = useNavigate();

  const [mappingKey, setMappingKey] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-scanner-container";

  const startScanner = useCallback(async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setMappingKey(decodedText);
          scanner.stop().then(() => {
            scanner.clear();
            scannerRef.current = null;
            setScanning(false);
          });
        },
        () => {
          // scan failure — silently ignore
        },
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start camera.";
      setError(message);
      setScanning(false);
    }
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // scanner already stopped
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!mappingKey.trim()) {
      setError("Please enter a mapping key.");
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const device = await mapDevice(mappingKey.trim());
      localStorage.removeItem("cached_devices");
      setSuccess(`Device "${device.name}" mapped successfully.`);
      setSubmitting(false);
      setTimeout(() => {
        navigate(`/devices/${device.id}`, { replace: true });
      }, 800);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to map device. Please try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <BackButton to="/devices" text="Back to Devices" />

      <PageTitle
        title="Add a Device"
        subtitle="Scan the QR code from your device packaging or enter the mapping key manually."
      />

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
        <h2 className="font-serif text-xl text-forest-800 mb-2">
          Scan QR Code
        </h2>
        <p className="text-forest-500 text-sm mb-6">
          Use your camera to scan the QR code on the device packaging.
        </p>

        {scanning ? (
          <div className="space-y-4">
            <div
              id={scannerContainerId}
              className="w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-beige-300"
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={stopScanner}
                className="inline-flex items-center gap-2 text-forest-600 font-medium px-5 py-2.5 rounded-full border border-forest-300 hover:border-forest-DEFAULT hover:text-forest-DEFAULT transition-all duration-300 text-sm"
              >
                <X className="w-4 h-4" />
                Stop Scanner
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={startScanner}
              className="inline-flex items-center gap-3 bg-forest-DEFAULT/10 text-forest-DEFAULT font-semibold px-8 py-5 rounded-2xl border-2 border-dashed border-forest-300 hover:border-forest-DEFAULT hover:bg-forest-DEFAULT/20 transition-all duration-300"
            >
              <ScanLine className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm">Open Camera</p>
                <p className="text-xs text-forest-500 font-normal mt-0.5">
                  Point at the QR code on your device
                </p>
              </div>
            </button>
          </div>
        )}

        {scanning && mappingKey && (
          <div className="mt-6 p-4 bg-forest-50 rounded-xl border border-forest-200">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-4 h-4 text-forest-DEFAULT" />
              <p className="text-xs text-forest-400 uppercase tracking-wide">
                Scanned Key
              </p>
            </div>
            <p className="text-sm font-mono text-forest-700 truncate">
              {mappingKey}
            </p>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="mt-3 inline-flex items-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mapping...
                </>
              ) : (
                "Map Device"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-beige-300" />
        <span className="text-sm text-forest-400 font-medium">or</span>
        <div className="flex-1 h-px bg-beige-300" />
      </div>

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm">
        <h2 className="font-serif text-xl text-forest-800 mb-6">Mapping Key</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mapping-key"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Enter the mapping key from your device packaging
            </label>
            <div className="flex gap-3">
              <input
                id="mapping-key"
                type="text"
                value={mappingKey}
                onChange={(e) => setMappingKey(e.target.value)}
                placeholder="e.g. DEV-XXXX-XXXX"
                className="flex-1 px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm font-mono"
              />
              {mappingKey && (
                <button
                  type="button"
                  onClick={() => setMappingKey("")}
                  className="shrink-0 p-3 rounded-xl border border-beige-300 text-forest-400 hover:text-forest-700 hover:border-forest-400 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !mappingKey.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mapping...
              </>
            ) : (
              "Map Device"
            )}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
