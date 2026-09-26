import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  MapPin, 
  Camera, 
  CheckCircle, 
  Upload, 
  FileText, 
  Compass, 
  Layers,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FieldOfficerApp: React.FC = () => {
  const { parcels, updateParcelVerification, currentUser } = useApp();
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[0]?.id || '');
  const [remarks, setRemarks] = useState('');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const selectedParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsCapturingGps(false);
        },
        (error) => {
          console.warn('Geolocation error or permission denied:', error);
          // Fallback to sample coordinates around Haveli / Pune
          setGpsLocation({
            lat: 18.5204 + (Math.random() - 0.5) * 0.01,
            lng: 73.8567 + (Math.random() - 0.5) * 0.01
          });
          setIsCapturingGps(false);
        }
      );
    } else {
      setGpsLocation({ lat: 18.5204, lng: 73.8567 });
      setIsCapturingGps(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;

    await updateParcelVerification(
      selectedParcel.id,
      remarks || 'Ground boundary verified with concrete boundary markers and GPS lock.',
      true
    );

    setSuccessNotice(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setSuccessNotice(false), 4000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Mobile Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/src/assets/images/gov_india_emblem_1790406961533.jpg" 
              alt="National Emblem Seal" 
              className="w-7 h-7 rounded-md object-contain bg-white p-0.5"
            />
            <h2 className="font-bold text-sm tracking-tight">BhumiSetu Field Cadastral Officer</h2>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Offline Mode Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Assigned Inspector: <strong className="text-slate-200">{currentUser.displayName}</strong> ({currentUser.district || 'Pune'} Taluka Survey Unit)
        </p>
      </div>

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          Field verification synced with National Central Database!
        </div>
      )}

      {/* Task & Parcel Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Today's Field Verification Assignment:
        </label>
        <select
          value={selectedParcelId}
          onChange={(e) => {
            setSelectedParcelId(e.target.value);
            const p = parcels.find(item => item.id === e.target.value);
            if (p) setRemarks(p.fieldOfficerRemarks || '');
          }}
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
        >
          {parcels.map(p => (
            <option key={p.id} value={p.id}>
              Survey No. {p.surveyNumber} • {p.village} ({p.ownerName})
            </option>
          ))}
        </select>

        {/* Selected Parcel Dossier Card */}
        {selectedParcel && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900">
              <span>{selectedParcel.projectName}</span>
              <span className="text-blue-700 font-mono">{selectedParcel.areaHa} Ha</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Village: <strong>{selectedParcel.village}</strong>, Tehsil: <strong>{selectedParcel.tehsil}</strong>
            </div>
            <div className="text-[11px] text-slate-600">
              Landholder: <strong>{selectedParcel.ownerName}</strong> ({selectedParcel.landType})
            </div>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-slate-500">Current Status:</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {selectedParcel.acquisitionStatus}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Verification Actions Form */}
      <form onSubmit={handleSubmitVerification} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        {/* GPS Capture */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            1. Geo-Tag Cadastral Peg (GPS)
          </label>
          <button
            type="button"
            onClick={handleCaptureGps}
            disabled={isCapturingGps}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-colors"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            {isCapturingGps ? 'Locking Satellite Constellation...' : gpsLocation ? `Locked: ${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lng.toFixed(5)}` : 'Capture Accurate GPS Lock'}
          </button>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            2. Site Photo & Concrete Marker
          </label>
          <div 
            onClick={() => setPhotoUploaded(!photoUploaded)}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
              photoUploaded ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Camera className={`w-5 h-5 mx-auto mb-1 ${photoUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div className="text-xs font-semibold text-slate-800">
              {photoUploaded ? 'Spot Image Captured (boundary_peg.jpg)' : 'Take Photo with Mobile Camera'}
            </div>
            <div className="text-[10px] text-slate-400">Click to toggle sample on-site inspection photo</div>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            3. Field Officer Observations
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Boundary markers planted. Verified crops standing, no unauthorized civil constructions detected."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Upload & Verify Cadastral Parcel</span>
        </button>
      </form>
    </div>
  );
};
