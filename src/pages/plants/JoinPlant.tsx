import PageContainer from "../../components/ui/PageContainer";
import PageTitle from "../../components/ui/PageTitle";
import BackButton from "../../components/ui/BackButton";
import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";
import { Loader2, QrCode, ScanLine } from "lucide-react";


export default function JoinPlant() {
  const [joinKey, setJoinKey] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-scanner-container";

  function startScanner() {
    setScanning(true);
  }

  function stopScanner() {
    setScanning(false);
  }

  function handleSubmit() {}

  return (
    <PageContainer>
      <BackButton to="/plants" text="Back to plants" />
      <PageTitle
        title="Join a Plant"
        subtitle="View and join an existing plant from another user to start tracking its health and growth."
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
          Use your camera to scan the QR code on the other device.
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
                  Point at the QR code on the other device
                </p>
              </div>
            </button>
          </div>
        )}

        {scanning && joinKey && (
          <div className="mt-6 p-4 bg-forest-50 rounded-xl border border-forest-200">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-4 h-4 text-forest-DEFAULT" />
              <p className="text-xs text-forest-400 uppercase tracking-wide">
                Scanned Key
              </p>
            </div>
            <p className="text-sm font-mono text-forest-700 truncate">
              {joinKey}
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
                  Joining ...
                </>
              ) : (
                "Join Plant"
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
        <h2 className="font-serif text-xl text-forest-800 mb-6">Join Key</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="join-key"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Enter the join key from your device packaging
            </label>
            <div className="flex gap-3">
              <input
                id="join-key"
                type="text"
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                placeholder="e.g. DEV-XXXX-XXXX"
                className="flex-1 px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm font-mono"
              />
              {joinKey && (
                <button
                  type="button"
                  onClick={() => setJoinKey("")}
                  className="shrink-0 p-3 rounded-xl border border-beige-300 text-forest-400 hover:text-forest-700 hover:border-forest-400 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !joinKey.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining ...
              </>
            ) : (
              "Join Device"
            )}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
