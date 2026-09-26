import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  CheckCircle, 
  Search, 
  Info, 
  Filter, 
  X, 
  ShieldCheck, 
  FileText,
  User,
  AlertCircle
} from 'lucide-react';
import { LandParcel } from '../../types';

export const GisMapModule: React.FC = () => {
  const { parcels, updateParcelVerification, currentUser, setSelectedProjectId, setActiveTab } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fieldRemarks, setFieldRemarks] = useState<string>('');

  const filteredParcels = parcels.filter(p => {
    const matchesFilter = filterStatus === 'All' || p.acquisitionStatus === filterStatus;
    const matchesSearch = p.surveyNumber.includes(searchQuery) || 
                          p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Color mapping based on acquisition status
  const getParcelColor = (status: LandParcel['acquisitionStatus']) => {
    switch (status) {
      case 'Possession Completed': return '#059669'; // Emerald
      case 'Acquired': return '#2563eb'; // Blue
      case 'Award Declared': return '#d97706'; // Amber
      case 'Surveyed': return '#9333ea'; // Purple
      case 'Notified': return '#ea580c'; // Orange
      case 'Proposed': return '#64748b'; // Slate
      default: return '#2563eb';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If an instance already exists, remove it before re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Pune / Maharashtra default center
    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([18.5204, 73.8567], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | BhumiSetu GIS',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update polygons and markers on data/filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    filteredParcels.forEach((parcel) => {
      const color = getParcelColor(parcel.acquisitionStatus);

      // Create polygon for parcel boundary
      const polygon = L.polygon(parcel.coordinates, {
        color: color,
        weight: 2.5,
        fillColor: color,
        fillOpacity: 0.35,
      });

      polygon.on('click', () => {
        setSelectedParcel(parcel);
        setFieldRemarks(parcel.fieldOfficerRemarks || '');
        map.panTo(parcel.center, { animate: true });
      });

      // Add a clean tool-tip
      polygon.bindTooltip(`<b>Survey No. ${parcel.surveyNumber}</b><br/>${parcel.village} (${parcel.areaHa} Ha)<br/>${parcel.acquisitionStatus}`, {
        sticky: true,
        className: 'text-xs font-sans'
      });

      polygon.addTo(layerGroup);

      // Center marker with icon
      const markerIcon = L.divIcon({
        className: 'custom-parcel-marker',
        html: `<div style="background-color:${color}; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker(parcel.center, { icon: markerIcon });
      marker.on('click', () => {
        setSelectedParcel(parcel);
        setFieldRemarks(parcel.fieldOfficerRemarks || '');
      });
      marker.addTo(layerGroup);
    });

    if (filteredParcels.length > 0 && selectedParcel) {
      map.setView(selectedParcel.center, 14);
    }
  }, [filteredParcels, selectedParcel]);

  const handleSaveFieldVerification = async () => {
    if (!selectedParcel) return;
    await updateParcelVerification(selectedParcel.id, fieldRemarks, true);
    setSelectedParcel(prev => prev ? { ...prev, fieldVerified: true, fieldOfficerRemarks: fieldRemarks } : null);
  };

  return (
    <div className="space-y-4">
      {/* Top Map Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              National Land Parcel GIS & Cadastral Spatial Viewer
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              OpenStreetMap + Cadastral Overlay
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click on any land parcel polygon or marker to view titleholder identity, RFCTLARR award determination, and DBT payment status.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search survey no / owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Statuses ({parcels.length})</option>
            <option value="Possession Completed">Possession Completed</option>
            <option value="Acquired">Acquired</option>
            <option value="Award Declared">Award Declared</option>
            <option value="Surveyed">Surveyed</option>
            <option value="Notified">Notified</option>
            <option value="Proposed">Proposed</option>
          </select>
        </div>
      </div>

      {/* Main Map + Info Panel Layout */}
      <div className="relative h-[650px] w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Legend (Top Left) */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-md text-xs w-60">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Acquisition Status Legend</span>
            <span className="text-slate-400 text-[10px] font-mono">{filteredParcels.length} plotted</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
              <span className="text-slate-700">Possession Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
              <span className="text-slate-700">Acquired</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-600"></span>
              <span className="text-slate-700">Award Declared (Sec 3G)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-purple-600"></span>
              <span className="text-slate-700">Surveyed (Drone/Cadastral)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-orange-600"></span>
              <span className="text-slate-700">Notified (Sec 3A / 4(1))</span>
            </div>
          </div>
        </div>

        {/* Selected Parcel Slide-over Drawer / Panel */}
        {selectedParcel && (
          <div className="absolute top-4 right-4 bottom-4 z-20 w-88 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    {selectedParcel.id}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    Survey No. {selectedParcel.surveyNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Village {selectedParcel.village}, {selectedParcel.tehsil}, {selectedParcel.district}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedParcel.acquisitionStatus}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedParcel.compensationStatus === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  DBT: {selectedParcel.compensationStatus}
                </span>
              </div>

              {/* Cadastral Specs */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50 items-center">
                  <span className="text-slate-500">Project Alignment:</span>
                  <button 
                    onClick={() => {
                      setSelectedProjectId(selectedParcel.projectId);
                      setActiveTab('project_details');
                    }}
                    className="font-bold text-blue-700 hover:underline text-right text-xs truncate max-w-[200px]"
                  >
                    {selectedParcel.projectName}
                  </button>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Total Parcel Area:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedParcel.areaHa} Hectares</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Land Classification:</span>
                  <span className="font-semibold text-slate-900">{selectedParcel.landType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Recorded Titleholder:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.ownerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Family ID:</span>
                  <span className="font-mono text-slate-700">{selectedParcel.ownerFamilyId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Statutory Compensation:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{(selectedParcel.compensationAmount / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Lakh
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">R&R Entitlement:</span>
                  <span className="font-semibold text-purple-700">{selectedParcel.rrStatus}</span>
                </div>
              </div>

              {/* Field Officer Spot Verification Box */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Field Cadastral Verification
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    selectedParcel.fieldVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedParcel.fieldVerified ? 'Verified by Amin' : 'Pending Spot Check'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {selectedParcel.fieldOfficerRemarks ? (
                    <p className="italic">"{selectedParcel.fieldOfficerRemarks}"</p>
                  ) : (
                    <p className="text-slate-400 italic">No spot remarks recorded yet.</p>
                  )}
                  {selectedParcel.verificationDate && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Verified Date: {selectedParcel.verificationDate}
                    </div>
                  )}
                </div>

                {/* Edit remarks for field officer or admin */}
                {currentUser.role !== 'viewer' && (
                  <div className="mt-2 space-y-1.5">
                    <textarea
                      rows={2}
                      value={fieldRemarks}
                      onChange={(e) => setFieldRemarks(e.target.value)}
                      placeholder="Add field inspection or boundary peg update..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      onClick={handleSaveFieldVerification}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                    >
                      Update Cadastral Verification
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 text-[10px] text-slate-400 text-center font-mono">
              Center: {selectedParcel.center[0].toFixed(4)}, {selectedParcel.center[1].toFixed(4)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
