/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CloudRain, Link2, Copy, Check, FileSpreadsheet, Play, 
  HelpCircle, ShieldCheck, RefreshCw, Radio 
} from 'lucide-react';
import { SheetsConfig } from '../types.ts';

interface SheetsLinkerProps {
  config: SheetsConfig;
  onSaveConfig: (cfg: { scriptUrl: string; spreadsheetId: string; autoSync: boolean }) => Promise<boolean>;
  onTriggerSync: () => Promise<{ success: boolean; message: string }>;
}

export default function SheetsLinker({
  config,
  onSaveConfig,
  onTriggerSync
}: SheetsLinkerProps) {
  const [scriptUrl, setScriptUrl] = useState(config.scriptUrl || '');
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId || '');
  const [autoSync, setAutoSync] = useState(!!config.autoSync);
  
  React.useEffect(() => {
    setScriptUrl(config.scriptUrl || '');
    setSpreadsheetId(config.spreadsheetId || '');
    setAutoSync(!!config.autoSync);
  }, [config.scriptUrl, config.spreadsheetId, config.autoSync]);
  
  const [loading, setLoading] = useState(false);
  const [syncResponse, setSyncResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const googleAppsScriptCode = `/**
 * ALINA ENTERPRISE SYSTEM - Google Apps Script Connector
 * Google Sheets Database Bridge v1.2
 */

function doGet(e) {
  var action = e.parameter.action;
  var sheetName = e.parameter.sheet;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "readAll") {
    var result = {};
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      var s = sheets[i];
      result[s.getName()] = getSheetDataJson(s);
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  var action = postData.action; // 'syncAll'
  var db = postData.db; // The full JSON structure from WMS & OMS
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "syncAll") {
    // Write tables
    writeTableDirect(ss, "Products", db.products);
    writeTableDirect(ss, "Customers", db.customers);
    writeTableDirect(ss, "Stock_In", db.stockIn);
    writeTableDirect(ss, "Stock_Out", db.stockOut);
    writeTableDirect(ss, "Stock_Opname", db.stockOpname);
    writeTableDirect(ss, "Orders", db.orders);
    writeTableDirect(ss, "Shipping", db.shipping);
    writeTableDirect(ss, "Users", db.users);
    writeTableDirect(ss, "Activity_Log", db.activityLog);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Sheets sync complete!" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetDataJson(sheet) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var result = [];
  var headers = rows[0];
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    result.push(obj);
  }
  return result;
}

function writeTableDirect(ss, sheetName, list) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  sheet.clear();
  if (!list || list.length === 0) return;
  
  var headers = Object.keys(list[0]);
  sheet.appendRow(headers);
  
  var values = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var val = item[headers[j]];
      row.push(typeof val === 'object' ? JSON.stringify(val) : val);
    }
    values.push(row);
  }
  
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const executeSaveConfig = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    const success = await onSaveConfig({ scriptUrl, spreadsheetId, autoSync });
    setLoading(false);
    if (success) {
      setShowSuccessModal(true);
      setSyncResponse("Koneksi Google Sheets berhasil dihubungkan! Setiap transaksi/update sistem akan disinkronisasikan otomatis.");
    }
  };

  const handleTriggerNow = async () => {
    setLoading(true);
    const res = await onTriggerSync();
    setLoading(false);
    setSyncResponse(res.message);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Container */}
      <div className="bg-white border border-pink-100 p-5 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-3 max-w-xl text-left">
          <span className="text-[10px] bg-pink-150 text-[#EC4899] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-pink-50 inline-flex items-center gap-1">
            <Radio className="w-3 h-3 animate-ping" /> REALTIME SYNC ENGINE
          </span>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">KONEKSI GOOGLE SHEET SEBAGAI DATABASE UTAMA</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sinkronisasikan seluruh database inventaris, pesanan pelanggan retail/shopee/tiktok, log aktivitas audit, dan forecasting Alina secara instan tanpa perlu refresh halaman.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-5 bg-[#FFF8FB] rounded-2xl border border-pink-100 min-w-[200px] text-center space-y-2">
          <FileSpreadsheet className="w-10 h-10 text-emerald-500" />
          <p className="text-xs font-bold text-gray-700">Status Database</p>
          <span className={`inline-block text-[10px] font-black px-3 py-0.5 rounded-full ${
            config.isLinked ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-pink-100 text-[#EC4899]'
          }`}>
            {config.isLinked ? 'SHEET TERHUBUNG (AKTIF)' : 'TIDAK TERHUBUNG'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Configuration */}
        <div className="lg:col-span-5 bg-white rounded-[32px] border border-pink-100 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 pb-2 border-b border-pink-50">
            Sheet Connection Panel
          </h3>

          <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block uppercase">Google Apps Script Web App URL</label>
              <input
                type="url"
                required
                id="script-url-input"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                className="w-full bg-[#FFF8FB] border border-pink-100 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-600 block uppercase">Spreadsheet ID</label>
              <input
                type="text"
                required
                id="spreadsheet-id-input"
                placeholder="Spreadsheet ID URL string..."
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="w-full bg-[#FFF8FB] border border-pink-100 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500 text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2 py-1 select-none">
              <input
                type="checkbox"
                id="auto-sync-checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-[#EC4899] border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="auto-sync-checkbox" className="font-bold text-gray-600 cursor-pointer">
                Auto Sync (Otomatis push di background setelah transaksi)
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition text-xs shadow-md"
              >
                {loading ? 'Menyimpan...' : 'Simpan Kredensial'}
              </button>
              
              <button
                type="button"
                id="sync-now-btn"
                disabled={loading}
                onClick={handleTriggerNow}
                className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer transition text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Force Sync
              </button>
            </div>
          </form>

          {syncResponse && (
            <div className="p-4 bg-pink-50 border border-pink-100 text-[#EC4899] font-medium rounded-2xl text-[11px] leading-relaxed">
              🎉 {syncResponse}
            </div>
          )}
        </div>

        {/* Apps Script Code Reference */}
        <div className="lg:col-span-7 bg-[#111827] rounded-[32px] p-6 text-white shadow-lg space-y-4 font-mono text-left">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <h4 className="font-semibold text-xs tracking-wider uppercase text-pink-400">GOOGLE APPS SCRIPT CODE</h4>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-1 px-3 rounded-full hover:bg-white/10 text-xs flex items-center gap-1 text-pink-400 font-bold cursor-pointer hover:text-white transition duration-200"
            >
              {copied ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Script
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 text-[10px] text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10 font-sans">
            <p className="font-bold text-pink-300 text-xs uppercase mb-1">🛠️ Langkah Penyebaran (Deployment Steps):</p>
            <ol className="list-decimal pl-4 space-y-1 text-gray-400">
              <li>Buat Google Spreadsheet baru di Drive Anda.</li>
              <li>Buat 9 Sheet dengan nama persis sesuai program: <strong className="text-pink-300">Products, Customers, Stock_In, Stock_Out, Stock_Opname, Orders, Shipping, Users, Activity_Log</strong>.</li>
              <li>Klik <strong className="text-white">Extensions &gt; Apps Script</strong> dari menu Spreadsheet.</li>
              <li>Copas kode Apps Script di samping ini ke editor <strong className="text-white">Code.gs</strong>.</li>
              <li>Klik <strong className="text-white">Deploy &gt; New Deployment</strong>, pilih tipe <strong className="text-white">Web App</strong>, pasang akses "Who has access" ke <strong className="text-pink-300">Anyone</strong> (ini wajib agar REST API handal), lalu deploy.</li>
              <li>Salin URL Web App yang dihasilkan & masukkan di Sheet Connection Panel Alina d sebelah kiri beserta Spreadsheet ID URL Anda!</li>
            </ol>
          </div>

          <div className="max-h-56 overflow-y-auto bg-black/60 p-4 rounded-2xl text-[10px] text-gray-400 border border-white/5 whitespace-pre">
            {googleAppsScriptCode}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 1. CONFIRMATION MODAL OVERLAY */}
      {/* ========================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" id="confirm-sheet-modal">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full border border-pink-100 shadow-2xl space-y-5 text-center animate-scale-up">
            <div className="mx-auto w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-[#EC4899]">
              <Link2 className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 text-lg leading-tight">Konfirmasi Koneksi Database</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Apakah Anda yakin ingin menghubungkan database Alina Enterprise System dengan Google Sheets menggunakan kredensial ini?
              </p>
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100/50 text-[10px] text-left space-y-1">
                <span className="font-bold text-[#EC4899] block">💡 Catatan Sinkronisasi:</span>
                <p className="text-gray-500">
                  Pastikan spreadsheet Anda telah memiliki sheet dengan nama yang sesuai dan script Apps Script dideploy sebagai Web App yang diakses oleh 'Anyone'.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition text-xs border border-gray-200 cursor-pointer font-sans"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeSaveConfig}
                className="flex-1 bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs shadow-md cursor-pointer font-sans"
              >
                Ya, Hubungkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. SUCCESS MODAL OVERLAY */}
      {/* ========================================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" id="success-sheet-modal">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full border border-emerald-100 shadow-2xl space-y-5 text-center animate-scale-up">
            <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 text-lg leading-tight">Sistem Berhasil Terhubung!</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Koneksi Google Sheets berhasil disimpan dan diaktifkan. Alina Enterprise System sekarang berjalan dalam sinkronisasi waktu nyata (real-time).
              </p>
              <div className="p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 text-[10px] text-emerald-800 text-left">
                <strong>✓ Sinkronisasi Aktif:</strong> Setiap perubahan inventaris, pesanan retail, dan log audit akan dipush otomatis ke Spreadsheet Anda.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs shadow-md cursor-pointer font-sans"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
