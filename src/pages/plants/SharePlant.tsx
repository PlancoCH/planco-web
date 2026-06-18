import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import { Copy, Check, Loader2, QrCode, Share } from "lucide-react";
import { getShareToken } from "../../api/plants";
import { ApiError } from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import PageTitle from "../../components/ui/PageTitle";
import BackButton from "../../components/ui/BackButton";

export default function SharePlant() {
  const { id } = useParams<{ id: string }>();
  const plantId = Number(id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sharingToken, setSharingToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sharingToken && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, sharingToken, {
        width: 240,
        margin: 2,
        color: { dark: "#1A3B2C", light: "#FEF9EC" },
      });
    }
  }, [sharingToken]);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await getShareToken(plantId);
      setSharingToken(response.sharing_token);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to generate sharing token. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!sharingToken) return;
    try {
      await navigator.clipboard.writeText(sharingToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  return (
    <PageContainer>
      <BackButton to={`/plants/${plantId}`} text="Back to plant" />

      <PageTitle
        title="Share a Plant"
        subtitle="Invite another user to join and track an existing plant."
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm">
        {sharingToken ? (
          <div>
            <h2 className="font-serif text-xl text-forest-800 mb-6">
              Plant Sharing Code
            </h2>

            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-xl border border-beige-300 p-4 inline-block">
                <canvas ref={canvasRef} />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-2">
                Sharing Token
              </p>
              <div className="flex gap-2 max-w-md">
                <div className="flex-1 bg-white border border-beige-300 rounded-xl px-4 py-3 font-mono text-sm text-forest-700 truncate select-all">
                  {sharingToken}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-forest-DEFAULT text-beige-100 font-medium text-sm hover:shadow-lg hover:shadow-forest-DEFAULT/25 active:scale-95 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-forest-500">
              Share this code or have the other user scan the QR code from the{" "}
              <strong>Join Plant</strong> page.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-xl text-forest-800 mb-2">
              Generate Sharing Link
            </h2>
            <p className="text-forest-500 text-sm mb-6">
              Create a unique sharing token that another user can use to join
              this plant.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Generate Sharing Token
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
