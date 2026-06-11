/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, ClipboardList, Keyboard, X, ShieldAlert, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types.ts';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsList: Product[];
  onScanSuccess: (scannedSku: string) => void;
  title?: string;
}

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  productsList,
  onScanSuccess,
  title = "SCAN BARCODE & QR CODE"
}: BarcodeScannerModalProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'simulation' | 'hardware'>('camera');
  const [simSelectedSku, setSimSelectedSku] = useState('');
  const [hardwareInput, setHardwareInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // File upload scan states
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileScanning, setFileScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Auto-select first SKU in product list
  useEffect(() => {
    if (productsList.length > 0 && !simSelectedSku) {
      setSimSelectedSku(productsList[0].SKU);
    }
  }, [productsList, simSelectedSku]);

  // Handle Camera initialization with html5-qrcode
  useEffect(() => {
    let qrScanner: Html5Qrcode | null = null;
    let isMounted = true;
    let isStreaming = false;

    if (isOpen && activeMode === 'camera') {
      setCameraError(null);

      // Brief delay to ensure container element is present in the DOM
      const timer = setTimeout(() => {
        if (!isMounted) return;
        const elementId = "html5-qrcode-reader";
        const container = document.getElementById(elementId);
        if (!container) return;

        try {
          qrScanner = new Html5Qrcode(elementId, {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.QR_CODE
            ],
            verbose: false
          });
          
          const config = {
            fps: 24, // Higher scan frequency for instant tracking
            qrbox: (width: number, height: number) => {
              // Custom wide rectangular window optimized for standard linear barcodes (like Code-128)
              const w = Math.min(Math.floor(width * 0.9), 320);
              const h = Math.min(Math.floor(height * 0.45), 140);
              return { width: w, height: h };
            },
            aspectRatio: 1.7777778
          };

          const onDecode = (decodedText: string) => {
            if (decodedText && isMounted) {
              // Try a quick phone vibration if supported
              if ('vibrate' in navigator) {
                try { navigator.vibrate(100); } catch (_) {}
              }
              onScanSuccess(decodedText.trim().toUpperCase());
              onClose();
            }
          };

          const onFail = () => {}; // Ignore single-frame scan failures naturally

          qrScanner.start(
            { facingMode: 'environment' },
            config,
            onDecode,
            onFail
          ).then(() => {
            isStreaming = true;
          }).catch((err) => {
            console.warn("Environment camera start failed, attempting user-facing camera fallback...", err);
            // Fallback: try default or user camera if environment camera is unavailable (desktop)
            if (qrScanner && isMounted) {
              qrScanner.start(
                { facingMode: 'user' },
                config,
                onDecode,
                onFail
              ).then(() => {
                isStreaming = true;
              }).catch((fallbackErr) => {
                console.warn("User camera also failed:", fallbackErr);
                if (isMounted) {
                  setCameraError("Tidak dapat mengakses kamera. Pastikan browser memiliki izin akses kamera atau coba unggah foto.");
                }
              });
            }
          });
        } catch (e) {
          if (e instanceof Error && (e.message.includes("aborted") || e.message.includes("abort"))) {
            console.warn("Scanner initialization aborted safely:", e);
          } else {
            console.error("Failed to initialize scanner:", e);
          }
          if (isMounted) {
            setCameraError("Gagal mempersiapkan pemindaian kamera.");
          }
        }
      }, 400);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        
        // Prevent uncaught "The operation was aborted" by stopping safely after state updates settle
        setTimeout(() => {
          if (qrScanner) {
            try {
              if (qrScanner.isScanning || isStreaming) {
                qrScanner.stop()
                  .then(() => {
                    try { qrScanner?.clear(); } catch (_) {}
                  })
                  .catch(err => {
                    console.warn("Scanner stopped during cleanup:", err);
                  });
              } else {
                try { qrScanner.clear(); } catch (_) {}
              }
            } catch (err) {
              console.warn("Scanner cleanup warning:", err);
            }
          }
        }, 300);
      };
    }
  }, [isOpen, activeMode]);

  // Gallery Photo Scan Fallback
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setFileScanning(true);

    // Create a temporary hidden container to run scanFile
    const tempElementId = "temp-html5-qrcode-file-scanner";
    let tempContainer = document.getElementById(tempElementId);
    if (!tempContainer) {
      tempContainer = document.createElement('div');
      tempContainer.id = tempElementId;
      tempContainer.style.display = 'none';
      document.body.appendChild(tempContainer);
    }

    try {
      const fileScanner = new Html5Qrcode(tempElementId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        verbose: false
      });

      const decodedText = await fileScanner.scanFile(file, false);
      if (decodedText) {
        if ('vibrate' in navigator) {
          try { navigator.vibrate(100); } catch (_) {}
        }
        onScanSuccess(decodedText.trim().toUpperCase());
        onClose();
      }
    } catch (err) {
      console.warn("File scanning failed:", err);
      setFileError("Kode tidak terdeteksi. Silakan ambil foto barcode yang lebih dekat, beresolusi baik, dan tegak lurus.");
    } finally {
      setFileScanning(false);
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    }
  };

  const handleSimulateScan = () => {
    if (simSelectedSku) {
      onScanSuccess(simSelectedSku);
      onClose();
    }
  };

  const handleHardwareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hardwareInput.trim()) {
      onScanSuccess(hardwareInput.trim().toUpperCase());
      setHardwareInput('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div id="scanner-modal-backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#FFF8FB] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-500/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EC4899] to-[#F9A8D4] p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="font-bold tracking-tight text-sm uppercase">{title}</h3>
          </div>
          <button 
            id="close-scanner-btn"
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 border-b border-pink-100 bg-[#FFF3F8]">
          <button
            onClick={() => setActiveMode('simulation')}
            className={`py-3 text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition ${
              activeMode === 'simulation' ? 'bg-[#FFF8FB] text-[#EC4899] border-b-2 border-[#EC4899]' : 'text-gray-500 hover:text-[#EC4899]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Simulasi Instant
          </button>
          <button
            onClick={() => setActiveMode('camera')}
            className={`py-3 text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition ${
              activeMode === 'camera' ? 'bg-[#FFF8FB] text-[#EC4899] border-b-2 border-[#EC4899]' : 'text-gray-500 hover:text-[#EC4899]'
            }`}
          >
            <Camera className="w-4 h-4" />
            Kamera HP
          </button>
          <button
            onClick={() => setActiveMode('hardware')}
            className={`py-3 text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition ${
              activeMode === 'hardware' ? 'bg-[#FFF8FB] text-[#EC4899] border-b-2 border-[#EC4899]' : 'text-gray-500 hover:text-[#EC4899]'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Guns Scanner
          </button>
        </div>

        {/* Content area */}
        <div className="p-6">
          
          {/* CAMERA MODE */}
          {activeMode === 'camera' && (
            <div className="space-y-4 text-center">
              {cameraError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] p-3 rounded-2xl flex items-center gap-2 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{cameraError}</span>
                </div>
              )}
              
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-pink-500 shadow-md">
                <div 
                  id="html5-qrcode-reader" 
                  className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
                />
                
                {/* Visual guideline overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                  <div className="w-[85%] h-[45%] border-2 border-[#EC4899] border-dashed rounded-lg relative flex items-center justify-center">
                    <div className="w-full h-[2px] bg-red-500 absolute animate-pulse" />
                  </div>
                  <p className="text-[10px] text-white/80 bg-black/60 px-3 py-1.5 rounded-full mt-3 z-10">
                    Arahkan Kode Batang / QR ke dalam kotak
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Pindai barcode Code128 pada tag pakaian Alina atau QR Code pelanggan.
              </p>

              {/* Robust Photo Scan Fallback Divider */}
              <div className="relative my-4 flex py-2 items-center">
                <div className="flex-grow border-t border-dashed border-pink-100"></div>
                <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest font-bold text-pink-400 font-mono">Atau alternatif transfer</span>
                <div className="flex-grow border-t border-dashed border-pink-100"></div>
              </div>

              {/* Gallery upload fallback UI */}
              <div className="bg-[#FFF5FA] border border-pink-100/50 p-4 rounded-3xl space-y-3">
                <div className="text-[11px] text-gray-600 font-medium leading-relaxed">
                  Kamera HP kesulitan fokus / resolusi? Ambil foto tag barcode secara dekat dan tegak lurus, lalu unggah di sini:
                </div>

                <input 
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileScan}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileScanning}
                  className="w-full bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-300 text-pink-600 font-bold py-2.5 px-4 rounded-2xl cursor-pointer transition shadow-sm flex items-center justify-center gap-2 text-xs"
                >
                  <Upload className="w-4 h-4 text-pink-500" />
                  {fileScanning ? "Membaca Barcode..." : "PILIH / FOTO DARI GALERI"}
                </button>

                {fileScanning && (
                  <div className="text-xs text-pink-500 font-bold animate-pulse">
                    Mohon tunggu, AI sedang memindai barcode dari berkas gambar...
                  </div>
                )}

                {fileError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] p-2.5 rounded-xl text-left leading-normal font-medium">
                    {fileError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATION MODE */}
          {activeMode === 'simulation' && (
            <div className="space-y-4">
              <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl">
                <p className="text-xs text-[#EC4899] font-medium leading-relaxed">
                  💡 <strong>Demo Sandbox Helper:</strong> Karena keterbatasan sandbox web, gunakan pemindai instant ini untuk memilih SKU dan menirukan penembakan sukses. Sempurna untuk demonstrasi dan QA operasional.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Pilih SKU untuk Discann</label>
                <select
                  id="scanner-sku-sim-select"
                  value={simSelectedSku}
                  onChange={(e) => setSimSelectedSku(e.target.value)}
                  className="w-full bg-white border border-pink-200 text-gray-700 text-sm py-2 px-3 rounded-xl focus:border-pink-500 focus:outline-none"
                >
                  {productsList.map((p) => (
                    <option key={p.SKU} value={p.SKU}>
                      [{p.SKU}] {p.Product_Name} (Stok: {p.Current_Stock})
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="sumulate-scan-confirm-btn"
                onClick={handleSimulateScan}
                className="w-full bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                SIMULATE SUCCESS SCAN
              </button>
            </div>
          )}

          {/* HARDWARE GUNS SCANNER */}
          {activeMode === 'hardware' && (
            <form onSubmit={handleHardwareSubmit} className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <p className="text-xs text-gray-600 font-medium">
                  Hubungkan USB Barcode Gun fisik. Fokuskan kursor pada kotak input di bawah dan lakukan pemindaian langsung pada produk pakaian.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Keyboard Wedge Input</label>
                <input
                  type="text"
                  id="scanner-hardware-input"
                  autoFocus
                  placeholder="Scan product tag / type SKU..."
                  value={hardwareInput}
                  onChange={(e) => setHardwareInput(e.target.value)}
                  className="w-full bg-white border border-pink-200 text-gray-800 text-sm py-2.5 px-4 rounded-xl focus:border-[#EC4899] focus:ring-1 focus:ring-[#EC4899] focus:outline-none placeholder-gray-400 font-mono tracking-wider text-center"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl cursor-pointer transition text-xs uppercase"
              >
                Kirim Kode Manual
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
