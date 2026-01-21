
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { CATALOGS_DATA, FORMAT_CURRENCY } from './constants';

// Helper for Inline Editing
export const EditableText = ({ value, onChange, className, isMultiline = false }: any) => {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isMultiline) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={`${className} outline-none focus:bg-white/10 focus:ring-1 focus:ring-[var(--accent)]/30 rounded px-0.5 cursor-text transition-all`}
    >
      {value}
    </span>
  );
};

// Helper for Admin UI Components
const AdminCheckbox = ({ label, value, onChange }: any) => (
  <div className="flex items-center gap-3 w-full">
    <input 
      type="checkbox" 
      checked={value} 
      onChange={e => onChange(e.target.checked)} 
      className="w-4 h-4 accent-[var(--accent)] rounded border-white/10 bg-black/60 cursor-pointer" 
    />
    <label className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer">{label}</label>
  </div>
);

const AdminInput = ({ label, value, onChange, type = "text" }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      className="bg-black/60 border border-white/10 rounded-lg p-3 text-white text-xs outline-none focus:border-[var(--accent)] w-full font-sans" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('catalogue');
  const [catalogIndex, setCatalogIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(() => localStorage.getItem('armani_confirmed') === 'true');
  const [currentThemeId, setCurrentThemeId] = useState(() => localStorage.getItem('global_theme_id') || 'IVORY_EXECUTIVE');

  useEffect(() => {
    const handleThemeChange = (e: any) => setCurrentThemeId(e.detail);
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const [catalogs, setCatalogs] = useState(() => {
    const saved = localStorage.getItem('armani_catalogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((cat: any) => ({
        ...cat,
        products: cat.products.map((p: any) => ({
          ...p,
          isVisible: p.isVisible !== undefined ? p.isVisible : true,
          statusText: p.statusText || 'Detail',
          totalIncome: p.totalIncome !== undefined ? p.totalIncome : (p.price + p.profit),
          isExclusive: p.isExclusive !== undefined ? p.isExclusive : false
        }))
      }));
    }
    return JSON.parse(JSON.stringify(CATALOGS_DATA)).map((cat: any) => ({
      ...cat,
      products: cat.products.map((p: any) => ({
        ...p,
        isVisible: true,
        statusText: 'Detail',
        totalIncome: (p.price + p.profit),
        isExclusive: false
      }))
    }));
  });

  const [detailContent, setDetailContent] = useState(() => {
    const saved = localStorage.getItem('armani_detail');
    const defaultDetail = {
      subtitle: "DOKUMENTASI STRATEGIS INTERNAL",
      title: "DETAIL TUGAS",
      taskDetailTitle: "RINCIAN TUGAS",
      accId: "ELITE PLATINUM GROUP",
      packageAmount: "IDR 3.300.000",
      profitRange: "20% - 50% NETT",
      warningText: "KONFIRMASI",
      contractItems: [
        "Detail tugas merupakan bagian dari perjanjian resmi Pengguna and Sistem.",
        "Dana yang dikirim akan otomatis menjadi saldo akun kerja.",
        "Seluruh proses mengikuti ketentuan sistem yang berlaku.",
        "Aktivasi tugas berarti Pengguna menyetujui seluruh ketentuan.",
        "Dokumen ini sah tanpa tanda tangan tertulis."
      ],
      workflowItems: [
        { n: "01", t: "SISTEM", d: "MASUK AKUN BISNIS" },
        { n: "02", t: "START", d: "SCROLL KE BAWAH LALU KLIK START AUTOMATIC PROMOTION LALU KLIK MULAI" },
        { n: "03", t: "PROFIT", d: "SELESAI & TERIMA KOMISI" }
      ],
      taskDetailsList: [
        { l: 'KETENTUAN', d: 'Pesanan diterbitkan otomatis oleh pusat.' },
        { l: 'PROSES', d: 'Sistem memproses tugas secara otomatis.' },
        { l: 'TUGAS', d: 'Satu pesanan satu produk total satu pesanan' },
        { l: 'STATUS penarikan', d: 'Jika tugas belum selesai, sistem tidak dapat mengizinkan' },
        { l: 'KONFIRMASI', d: 'Wajib mengikuti arahan mentor pembimbing.' }
      ],
      contractNoteText: "SETIAP MISI PEKERJAAN DISELESAIKAN, PENARIKAN DAPAT LANGSUNG DI LAKUKAN. HARAP SELESAIKAN PEKERJAAN INI DALAM WAKTU YANG DI TENTUKAN",
    };
    return saved ? JSON.parse(saved) : defaultDetail;
  });

  const [systemContent, setSystemContent] = useState(() => {
    const saved = localStorage.getItem('armani_system');
    const defaultSystem = {
      visualMode: 'verifikasi',
      common: {
        title: "DETEKSI SISTEM",
        accNo: "0821-2437-2410",
        reportDate: "18 JAN 2026",
        owner: "IWAN EGY",
        status: "VERIFIKASI AKUN",
        bank: "BNI",
        pembayaran: "IDR 9.900.000",
        rek: "0897714140",
        frequency: "1",
        saldo: "IDR 15.850.000",
        pendapatan: "IDR 29.700.000",
      },
      kesalahan: {
        target: "IDR 14.850.000",
        withdrawal: "IDR 15.850.000",
        left_title: "PEMULIHAN",
        left_subtitle: "KESALAHAN TERDETEKSI: SALURAN PENARIKAN ERROR",
        left_note: "SISTEM CRASH DAN INFORMASI TUGAS HILANG. PEMULIHAN SALURAN PENARIKAN DI PERLUKAN !!!",
        footer_label: "VARIANSI PROTOKOL",
        footer_value: "IDR 1.000.000",
        right_title: "INFORMASI",
        right_paragraph: "Anggota melanggar aturan penarikan and jumlah penarikan tidak sesuai dengan jumlah yang di tentukan oleh sistem, sehingga menyebabkan beberapa hal :",
        right_bullets: "SALURAN PENARIKAN TERKUNCI\nINFORMASI TUGAS HILANG\nKREDIBILITAS AKUN MENURUN",
        highlight_title: "PENTING !!!",
        highlight_text: "HARAP SEGERA PULIHKAN SALURAN PENARIKAN UNTUK MEMBUKA KEMBALI PENARIKAN DENGAN SETORAN SEJUMLAH Rp 1.560.000"
      },
      kredit: {
        currentKredit: "56",
        left_title: "PEMULIHAN KREDIT",
        left_subtitle: "KREDIBILITAS MENURUN | PEMULIHAN DIPERLUKAN",
        left_note: "1 Point kredit = 1.044.900 atau 1% dari total saldo akun.\n44 Point x 1.094.900 = 45.975.600",
        footer_label: "KUOTA PEMULIHAN",
        footer_value: "IDR 35.640.000",
        right_title: "INFORMASI",
        right_paragraph: "SETIAP AKUN ANGGOTA AKAN MENDAPATKAN 100 POIN KREDIT SETELAH PROSES PENDAFTARAN SELESAI. POIN KREDIT INI DI GUNAKAN SEBAGAI TOLOK UKUR UNTUK MENGEVALUASI TINGKAT KEPERCAYAAN DAN KUALITAS SEORANG PELANGGAN.",
        highlight_title: "PENTING !!!",
        highlight_text: "HARAP MELAKUKAN SETORAN SEJUMLAH Rp. 35.640.000 UNTUK MENAIKAN POIN KREDIT MENJADI 100 AND SEJUMLAH Rp 330.000.000 DAPAT DITARIK."
      },
      verifikasi: {
        verifList: [
          { label: "KESALAHAN PENARIKAN", val: "IDR 5.000.000" },
          { label: "BATAS WAKTU", val: "IDR 5.000.000" },
          { label: "KREDIT POIN", val: "IDR 1.134.375" }
        ],
        left_title: "VERIFIKASI AKUN",
        left_subtitle: "VERIFIKASI PENARIKAN UNTUK PENCAIRAN",
        left_note: "SESUAI KETENTUAN BIAYA VERIFIKASI ADALAH 50% DARI TOTAL KESALAHAN YANG TERDETEKSI.",
        footer_label: "BIAYA VERIFIKASI",
        footer_value: "IDR 11.134.375",
        right_title: "INFORMASI",
        right_paragraph: "Verifikasi akun di perlukan karena anggota telah melakukan kesalahan berulang kali, sebagai berikut :",
        right_bullets: "Melakukan penarikan yang tidak sesuai dengan ketentuan\nMelebihi batas waktu yang di tentukan\nKredit poin menurun 80 poin",
        highlight_title: "PENTING !!!",
        highlight_text: "Harap melakukan setoran verifikasi sejumlah Rp 11.134.375 and sejumlah Rp 330.000.000 akan langsung di proses ke Rekening anggota tanpa kendala."
      }
    };
    return saved ? JSON.parse(saved) : defaultSystem;
  });

  const [bankContent, setBankContent] = useState(() => {
    const saved = localStorage.getItem('armani_bank');
    const defaultBank = {
      bankName: "BNI",
      rek: "1988 0158 80",
      owner: "IMAN HADI KESUMA",
      logo: "https://upload.wikimedia.org/wikipedia/id/thumb/1/15/BNI_logo.svg/1200px-BNI_logo.svg.png",
      status: "TERVERIFIKASI",
      certTitle: "DETAIL TUGAS TELAH DIKONFIRMASI.",
      certSubtitle: "SURAT PERSETUJUAN KERJAGIORGIO ARMANI BUSINESS",
      certItems: "01. SAYA MENYATAKAN SETUJU UNTUK MENYELESAIKAN SELURUH TUGAS SESUAI KETENTUAN SISTEM.\n02. SAYA MEMAHAMI BAHWA TUGAS YANG TELAH DIMULAI TIDAK DAPAT DIBATALKAN SECARA SEPIHAK.\n03. SAYA BERSEDIA MENGIKUTI ARAHAN MENTOR UNTUK KELANCARAN PROSES PENCAIRAN KOMISI.",
      certStatus: "SIGNED & VERIFIED",
      certFooter: "SECURED BY ARMANI PRIVÉ"
    };
    return saved ? JSON.parse(saved) : defaultBank;
  });

  useEffect(() => {
    localStorage.setItem('armani_catalogs', JSON.stringify(catalogs));
    localStorage.setItem('armani_detail', JSON.stringify(detailContent));
    localStorage.setItem('armani_system', JSON.stringify(systemContent));
    localStorage.setItem('armani_bank', JSON.stringify(bankContent));
  }, [catalogs, detailContent, systemContent, bankContent]);

  const updateProduct = (catIdx: number, pIdx: number, field: string, val: any) => {
    const newC = [...catalogs];
    newC[catIdx].products[pIdx][field] = val;
    setCatalogs(newC);
  };

  const nextCatalog = () => setCatalogIndex((prev) => (prev + 1) % catalogs.length);
  const prevCatalog = () => setCatalogIndex((prev) => (prev - 1 + catalogs.length) % catalogs.length);

  const renderContent = () => {
    if (activeView === 'detail') {
      return (
        <div className="flex flex-col items-center w-full h-auto bg-transparent view-readability-optimized">
          <div className="w-full flex flex-col items-center justify-center pt-2 pb-1 bg-transparent shrink-0">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-14 h-[1px] bg-[var(--accent)] opacity-40"></div>
              <EditableText 
                value={detailContent.subtitle} 
                onChange={(v:string) => setDetailContent({...detailContent, subtitle: v})} 
                className="text-[11px] font-black text-[var(--accent)] tracking-[0.5em] uppercase italic" 
              />
              <div className="w-14 h-[1px] bg-[var(--accent)] opacity-40"></div>
            </div>
            <EditableText 
              value={detailContent.title} 
              onChange={(v:string) => setDetailContent({...detailContent, title: v})} 
              className="font-brand text-[72px] font-black text-[var(--text-primary)] tracking-tight leading-none text-center italic uppercase [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]" 
            />
          </div>
          <div className="w-full px-10 pb-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-[960px] mx-auto">
              <div className="bg-white border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-5">INFORMASI AKUN</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">ID AKUN</span>
                    <EditableText value={detailContent.accId} onChange={(v:string) => setDetailContent({...detailContent, accId: v})} className="text-[14px] text-black font-black uppercase italic" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">TUGAS</span>
                    <EditableText value={detailContent.packageAmount} onChange={(v:string) => setDetailContent({...detailContent, packageAmount: v})} className="text-[16px] text-[#B38B4D] font-black" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">KOMISI</span>
                    <EditableText value={detailContent.profitRange} onChange={(v:string) => setDetailContent({...detailContent, profitRange: v})} className="text-[14px] text-[#064e3b] font-black italic" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
                <h3 className="text-[12px] font-black text-[#B38B4D]/60 tracking-[0.4em] uppercase italic mb-4">CARA PENYELESAIAN TUGAS</h3>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {detailContent.workflowItems.map((item: any, i: number) => (
                    <div key={i} className="text-center flex flex-col items-center px-1">
                      <EditableText 
                        value={item.t} 
                        onChange={(v:string) => {
                          const items = [...detailContent.workflowItems];
                          items[i].t = v;
                          setDetailContent({...detailContent, workflowItems: items});
                        }} 
                        className="text-[16px] text-black font-black uppercase italic leading-none mb-1.5" 
                      />
                      <EditableText 
                        value={item.d} 
                        isMultiline
                        onChange={(v:string) => {
                          const items = [...detailContent.workflowItems];
                          items[i].d = v;
                          setDetailContent({...detailContent, workflowItems: items});
                        }} 
                        className="text-[10px] text-[#525252] font-bold uppercase tracking-widest leading-tight text-center" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[280px]">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-6">KETENTUAN KONTRAK</h3>
                <div className="space-y-4">
                  {detailContent.contractItems.map((text: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <span className="text-[#B38B4D] font-black text-[15px] mt-0.5 opacity-70 w-4 shrink-0 text-center">§</span>
                      <EditableText 
                        value={text} 
                        isMultiline
                        onChange={(v:string) => {
                          const items = [...detailContent.contractItems];
                          items[i] = v;
                          setDetailContent({...detailContent, contractItems: items});
                        }} 
                        className="text-[12px] leading-[1.3] text-[#525252] font-bold uppercase tracking-tight" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[280px]">
                <EditableText 
                  value={detailContent.taskDetailTitle} 
                  onChange={(v:string) => setDetailContent({...detailContent, taskDetailTitle: v})} 
                  className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-6" 
                />
                <div className="space-y-4 mb-auto">
                  {detailContent.taskDetailsList.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#B38B4D]/40 mt-1.5 shrink-0"></div>
                      <div className="flex flex-col sm:flex-row sm:gap-4 flex-grow items-baseline">
                        <EditableText 
                          value={item.l} 
                          onChange={(v:string) => {
                            const items = [...detailContent.taskDetailsList];
                            items[i].l = v;
                            setDetailContent({...detailContent, taskDetailsList: items});
                          }} 
                          className="text-[11px] font-black text-[#B38B4D] uppercase italic tracking-[0.15em] w-[110px] shrink-0 leading-tight" 
                        />
                        <EditableText 
                          value={item.d} 
                          isMultiline
                          onChange={(v:string) => {
                            const items = [...detailContent.taskDetailsList];
                            items[i].d = v;
                            setDetailContent({...detailContent, taskDetailsList: items});
                          }} 
                          className="text-[11px] text-black font-bold leading-tight uppercase tracking-wide" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#999999]/20 p-3 rounded-lg text-center mt-6 border border-black/5">
                   <h4 className="text-[11px] font-black text-[#333333] uppercase italic mb-1 opacity-70">SISTEM KERJA</h4>
                   <p className="text-[11px] font-black text-[#444444] uppercase tracking-wider">1 KALI PENYELESAIAN TUGAS 1 KALI PENARIKAN</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border-2 border-[#B38B4D]/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-center h-[100px]">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-2">PENTING!!!</h3>
                <EditableText 
                  value={detailContent.contractNoteText} 
                  isMultiline
                  onChange={(v:string) => setDetailContent({...detailContent, contractNoteText: v})} 
                  className="text-[11px] leading-tight text-[#888888] font-black uppercase italic" 
                />
              </div>
              <div 
                onClick={() => {
                  localStorage.setItem('armani_confirmed', 'true');
                  setIsConfirmed(true);
                  setActiveView('bank');
                }}
                className="bg-[#8a6a35] border border-[#8a6a35] rounded-2xl shadow-[0_15px_40px_-10px_rgba(138,106,53,0.5)] cursor-pointer group hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center h-[100px]"
              >
                <EditableText 
                  value={detailContent.warningText} 
                  onChange={(v:string) => setDetailContent({...detailContent, warningText: v})} 
                  className="text-[32px] font-black text-white uppercase tracking-[0.5em] leading-none italic drop-shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'system') {
      const s = systemContent;
      const common = s.common;
      const mode = s.visualMode;
      const data = s[mode as keyof typeof s] as any;

      return (
        <div className="flex flex-col items-center w-full h-auto bg-transparent view-readability-optimized">
          <div className="w-full h-auto pt-4 px-12 pb-1 flex flex-col gap-4 justify-start">
            <div className="w-full flex flex-col items-center border-b border-white/10 pb-2 shrink-0 relative">
               <span className="text-[12px] font-black text-[var(--accent)] tracking-[0.8em] uppercase mb-1">Protokol Audit Internal</span>
               <EditableText value={common.title} onChange={(v:string) => setSystemContent({...s, common: {...common, title: v}})} className="text-[46px] font-brand font-black text-[var(--color-text-primary)] tracking-tight uppercase italic" />
            </div>
            <div className="w-full bg-[var(--bg-panel)] rounded-2xl p-6 border border-white/5 luxury-gradient-border shadow-2xl shrink-0">
                <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                   {[
                     { l: "ID AKUN", v: common.accNo, k: 'accNo' }, { l: "TANGGAL", v: common.reportDate, k: 'reportDate' },
                     { l: "NAMA", v: common.owner, k: 'owner' }, { l: "STATUS AKUN", v: common.status, k: 'status', highlight: true },
                     { l: "NAMA BANK", v: common.bank, k: 'bank' }, { l: "PEMBAYARAN", v: common.pembayaran, k: 'pembayaran' },
                     { l: "NOMOR REKENING", v: common.rek, k: 'rek' }, { l: "FREKUENSI", v: common.frequency, k: 'frequency' },
                     { l: "INFORMASI SALDO", v: common.saldo, k: 'saldo' }, { l: "Total Pendapatan", v: common.pendapatan, k: 'pendapatan' }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-white/5 pb-1">
                       <span className="text-[12px] font-black tracking-[0.3em] uppercase text-[var(--color-text-secondary)] italic">{item.l}</span>
                       <EditableText 
                        value={item.v} 
                        onChange={(v:string) => setSystemContent({...s, common: {...common, [item.k]: v}})} 
                        className={`text-[16px] font-sans font-extrabold tracking-tight uppercase ${item.highlight ? 'text-[var(--status-error)]' : 'text-[var(--color-text-primary)]'}`} 
                       />
                     </div>
                   ))}
                </div>
            </div>
            <div className="w-full grid grid-cols-12 gap-4 overflow-visible">
              <div className="col-span-7 flex flex-col h-auto bg-[var(--bg-panel)] border border-white/5 shadow-2xl rounded-2xl overflow-visible">
                 <div className="w-full py-2 bg-white/5 text-center border-b border-white/5 shrink-0">
                   <span className="text-[12px] font-black uppercase tracking-[0.5em] text-[var(--accent)] italic">DETEKSI SISTEM</span>
                 </div>
                 <div className="flex-grow p-6 flex flex-col justify-between h-auto">
                    <div className="flex flex-col gap-4 flex-grow">
                        <div>
                            <EditableText value={data.left_title} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, left_title: v}})} className="text-[24px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide border-l-4 border-[var(--accent)] pl-6 italic block" />
                            <EditableText value={data.left_subtitle} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, left_subtitle: v}})} className="text-[11px] text-[var(--accent)] font-black uppercase tracking-[0.25em] mt-1 opacity-80 italic block" />
                        </div>
                        <div className="flex flex-col justify-center h-auto">
                            {mode === 'kesalahan' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
                                        <h4 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] mb-1 font-black italic">PENARIKAN DITENTUKAN</h4>
                                        <EditableText value={s.kesalahan.target} onChange={(v:string) => setSystemContent({...s, kesalahan: {...s.kesalahan, target: v}})} className="text-[22px] font-sans font-extrabold text-[var(--color-success)]" />
                                    </div>
                                    <div className="bg-black/40 p-4 border border-[var(--status-error)]/20 rounded-xl">
                                        <h4 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] mb-1 font-black italic">PENARIKAN DILAKUKAN</h4>
                                        <EditableText value={s.kesalahan.withdrawal} onChange={(v:string) => setSystemContent({...s, kesalahan: {...s.kesalahan, withdrawal: v}})} className="text-[22px] font-sans font-extrabold text-[var(--status-error)]" />
                                    </div>
                                </div>
                            )}
                            {mode === 'kredit' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-6 border border-white/5 rounded-xl min-h-[110px]">
                                        <h4 className="text-[11px] mb-2 text-[var(--color-text-secondary)] uppercase tracking-[0.35em] font-black italic border-b border-white/5 pb-1">POIN AWAL</h4>
                                        <span className="text-[32px] font-sans font-black text-[var(--color-text-primary)] leading-none text-glow-gold">100</span>
                                    </div>
                                    <div className="bg-black/40 p-6 border border-[var(--status-error)]/20 rounded-xl min-h-[110px]">
                                        <h4 className="text-[11px] mb-2 text-[var(--status-error)] uppercase tracking-[0.35em] font-black italic border-b border-[var(--status-error)]/10 pb-1">SKOR SAAT INI</h4>
                                        <EditableText value={s.kredit.currentKredit} onChange={(v:string) => setSystemContent({...s, kredit: {...s.kredit, currentKredit: v}})} className="text-[32px] font-sans font-black text-[var(--status-error)] leading-none" />
                                    </div>
                                </div>
                            )}
                            {mode === 'verifikasi' && (
                                <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-xl">
                                    <table className="w-full text-[13px] border-collapse">
                                        <tbody>
                                            {s.verifikasi.verifList.map((item: any, idx: number) => (
                                                <tr key={idx} className="border-b border-white/5 last:border-0">
                                                    <td className="py-2 px-4 text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">
                                                      <EditableText value={item.label} onChange={(v:string) => {
                                                        const list = [...s.verifikasi.verifList];
                                                        list[idx].label = v;
                                                        setSystemContent({...s, verifikasi: {...s.verifikasi, verifList: list}});
                                                      }} />
                                                    </td>
                                                    <td className="py-2 px-4 text-right font-sans font-extrabold text-[var(--status-error)]">
                                                      <EditableText value={item.val} onChange={(v:string) => {
                                                        const list = [...s.verifikasi.verifList];
                                                        list[idx].val = v;
                                                        setSystemContent({...s, verifikasi: {...s.verifikasi, verifList: list}});
                                                      }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <EditableText 
                          value={data.left_note} 
                          isMultiline
                          onChange={(v:string) => setSystemContent({...s, [mode]: {...data, left_note: v}})} 
                          className="text-[14px] whitespace-pre-line leading-relaxed text-[var(--color-text-secondary)] font-bold italic block border-l border-white/10 pl-4" 
                        />
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center bg-black/40 p-6 rounded-xl border-t-[4px] border-t-[var(--accent)] shadow-2xl">
                        <EditableText value={data.footer_label} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, footer_label: v}})} className="text-[12px] font-black text-[var(--accent)] uppercase tracking-[0.5em] italic" />
                        <EditableText value={data.footer_value} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, footer_value: v}})} className="text-[32px] font-sans font-black text-[var(--color-text-primary)] text-glow-gold" />
                    </div>
                 </div>
              </div>
              <div className="col-span-5 bg-[var(--bg-panel)] border border-white/5 flex flex-col p-6 shadow-2xl rounded-2xl h-auto overflow-visible relative">
                 <div className="w-full border-b pb-2 mb-4 border-white/10 flex justify-between items-center shrink-0">
                   <EditableText value={data.right_title} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, right_title: v}})} className="text-[16px] font-brand font-black uppercase tracking-[0.4em] text-[var(--accent)] italic" />
                   <div className="w-3 h-3 bg-[var(--status-error)] rounded-full animate-pulse shadow-[0_0_15px_var(--status-error)]"></div>
                 </div>
                 <div className="flex-grow flex flex-col justify-between h-auto">
                    <div className="flex flex-col gap-4">
                        <EditableText 
                          value={data.right_paragraph} 
                          isMultiline
                          onChange={(v:string) => setSystemContent({...s, [mode]: {...data, right_paragraph: v}})} 
                          className="text-[15px] font-bold leading-relaxed text-[var(--color-text-secondary)] block" 
                        />
                        {data.right_bullets && (
                          <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
                              {data.right_bullets.split('\n').map((text: string, i: number) => (
                                  <div key={i} className="flex items-center gap-4">
                                      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-60"></div>
                                      <EditableText 
                                        value={text} 
                                        onChange={(v:string) => {
                                          const lines = data.right_bullets.split('\n');
                                          lines[i] = v;
                                          setSystemContent({...s, [mode]: {...data, right_bullets: lines.join('\n')}});
                                        }} 
                                        className="text-[12px] text-[var(--color-text-primary)] font-extrabold uppercase tracking-[0.15em] opacity-80" 
                                      />
                                  </div>
                              ))}
                          </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="p-4 bg-gradient-to-br from-[var(--status-error)]/15 to-transparent border border-[var(--status-error)]/30 rounded-2xl space-y-2 border-l-[4px] border-l-[var(--status-error)]">
                            <EditableText value={data.highlight_title} onChange={(v:string) => setSystemContent({...s, [mode]: {...data, highlight_title: v}})} className="text-[13px] font-black text-[var(--status-error)] uppercase tracking-wide border-l-2 border-[var(--status-error)] pl-3 italic block" />
                            <EditableText value={data.highlight_text} isMultiline onChange={(v:string) => setSystemContent({...s, [mode]: {...data, highlight_text: v}})} className="text-[13px] font-extrabold text-[var(--color-text-primary)] uppercase tracking-[0.12em] leading-relaxed italic block" />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'bank') {
      const b = bankContent;
      return (
        <div className="flex flex-col items-center justify-center w-full h-auto bg-transparent px-12 pt-12 pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none"></div>
          {isConfirmed && (
            <div className="w-[760px] p-6 bg-[var(--bg-panel)] border border-white/5 rounded-[24px] luxury-gradient-border shadow-2xl mb-6 relative overflow-hidden shrink-0">
               <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)]"></div>
               <EditableText value={b.certSubtitle} onChange={(v:string) => setBankContent({...b, certSubtitle: v})} className="text-[11px] font-black text-[var(--accent)] tracking-[0.5em] mb-2 text-center uppercase italic opacity-70 block" />
               <EditableText value={b.certTitle} onChange={(v:string) => setBankContent({...b, certTitle: v})} className="text-[14px] font-black text-[var(--color-text-primary)] text-center mb-4 border-b border-white/10 pb-2 tracking-widest uppercase italic block" />
               <div className="space-y-2 text-[11px] text-[var(--color-text-secondary)] font-bold leading-relaxed uppercase">
                  {b.certItems.split('\n').map((line: string, i: number) => (
                    <EditableText 
                      key={i} 
                      value={line} 
                      onChange={(v:string) => {
                        const lines = b.certItems.split('\n');
                        lines[i] = v;
                        setBankContent({...b, certItems: lines.join('\n')});
                      }} 
                      className="block" 
                    />
                  ))}
               </div>
               <div className="mt-5 flex justify-between items-end border-t border-white/5 pt-3">
                  <div className="flex flex-col">
                     <span className="text-[8px] opacity-40 uppercase tracking-[0.2em] font-black mb-1">Status Verifikasi</span>
                     <EditableText value={b.certStatus} onChange={(v:string) => setBankContent({...b, certStatus: v})} className="text-[10px] font-black italic text-[var(--color-success)] px-3 py-1 bg-[var(--color-success)]/10 rounded-full border border-[var(--color-success)]/20 uppercase" />
                  </div>
                  <EditableText value={b.certFooter} onChange={(v:string) => setBankContent({...b, certFooter: v})} className="text-[10px] font-sans font-black text-[var(--color-text-primary)] tracking-wider uppercase" />
               </div>
            </div>
          )}
          <div className="w-[760px] h-[380px] bg-[var(--bg-panel)] shadow-[0_60px_100px_-30px_rgba(0,0,0,1)] relative overflow-hidden border border-white/5 flex flex-col rounded-[32px] luxury-gradient-border shrink-0">
            <div className="flex-grow flex flex-col px-12 pt-8 pb-8 relative z-10">
              <div className="absolute top-8 right-12">
                <EditableText value={b.status} onChange={(v:string) => setBankContent({...b, status: v})} className="text-[11px] font-black text-white uppercase tracking-[0.4em] px-6 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 italic" />
              </div>
              <div className="mb-6 border-b border-white/5 pb-5">
                <h2 className="text-[36px] font-brand font-black tracking-tight leading-none uppercase text-[var(--color-text-primary)] italic">
                  BANK ACCOUNT <span className="text-[var(--accent)] font-medium">CARD</span>
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.6em] mt-2.5 italic">DIGITAL BUSINESS PROGRAM BY GIORGIO ARMANI</p>
              </div>
              <div className="flex-grow grid grid-cols-12 gap-10 items-center">
                <div className="col-span-4 flex items-center justify-center border-r border-white/5 pr-10">
                  <div className="w-full aspect-square bg-black rounded-2xl shadow-2xl border border-white/5 flex items-center justify-center p-6 relative overflow-hidden">
                    <img src={b.logo} alt="Bank Logo" className="w-full h-full object-contain grayscale brightness-125" />
                  </div>
                </div>
                <div className="col-span-8 pl-10 flex flex-col justify-center gap-5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NAMA BANK</span>
                    <EditableText value={b.bankName} onChange={(v:string) => setBankContent({...b, bankName: v})} className="text-[18px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide leading-none" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NOMOR REKENING</span>
                    <EditableText value={b.rek} onChange={(v:string) => setBankContent({...b, rek: v})} className="text-[34px] font-sans font-medium text-[var(--accent)] tracking-normal leading-none" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NAMA</span>
                    <EditableText value={b.owner} onChange={(v:string) => setBankContent({...b, owner: v})} className="text-[20px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide leading-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-between w-full h-[calc(1000px-72px-30px)] bg-transparent">
        <div className="w-full h-32 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <EditableText 
              value={catalogs[catalogIndex].name} 
              onChange={(v:string) => {
                const newC = [...catalogs];
                newC[catalogIndex].name = v;
                setCatalogs(newC);
              }} 
              className="font-brand text-[clamp(24px,3.5vw,42px)] font-black text-[var(--color-text-primary)] tracking-[0.4em] uppercase text-center leading-none italic block" 
            />
            <div className="flex items-center gap-6 mt-4">
               <div className="w-20 h-[1px] bg-[var(--accent)] opacity-40"></div>
               <p className="text-[clamp(10px,1.1vw,13px)] font-black text-[var(--accent)] tracking-[0.8em] uppercase italic">COLLECTION 2026</p>
               <div className="w-20 h-[1px] bg-[var(--accent)] opacity-40"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 items-stretch gap-x-8 gap-y-6 w-full max-w-[960px] px-10 py-2 mb-auto flex-grow min-h-0 overflow-hidden">
          {catalogs[catalogIndex].products.map((product: any, pIdx: number) => (
            product.isVisible !== false && (
              <div key={product.id} className="flex flex-col h-full min-h-0">
                <ProductCard product={product} onUpdate={(f:string, v:any) => updateProduct(catalogIndex, pIdx, f, v)} />
              </div>
            )
          ))}
        </div>

        <div className="w-full h-20 flex items-center justify-center gap-16 shrink-0 border-t border-black/5 bg-transparent">
          <button onClick={prevCatalog} className="text-[var(--color-text-secondary)] hover:text-[var(--accent)] transition-all uppercase font-black text-[11px] tracking-[0.5em] italic">SEBELUMNYA</button>
          <div className="flex gap-4">
            {catalogs.map((_: any, i: number) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all duration-700 ${i === catalogIndex ? 'bg-[var(--accent)] scale-150 border-none shadow-[0_0_10px_var(--accent)]' : 'bg-transparent border-[var(--accent)]/40 hover:border-[var(--accent)]'}`} />
            ))}
          </div>
          <button onClick={nextCatalog} className="text-[var(--color-text-secondary)] hover:text-[var(--accent)] transition-all uppercase font-black text-[11px] tracking-[0.5em] italic">SELANJUTNYA</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-canvas flex flex-col bg-transparent relative" style={{ height: '1000px', minHeight: '1000px', overflow: 'hidden' }}>
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="relative z-10 flex-grow flex flex-col overflow-hidden">{renderContent()}</main>
      <footer className="relative z-10 w-full text-center py-2 bg-transparent border-t border-white/5 text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[1em] shrink-0 opacity-20 italic">
        GIORGIO ARMANI SYSTEM 2026
      </footer>

      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-4 right-4 z-[100] w-10 h-10 bg-black/40 backdrop-blur-md hover:bg-[var(--accent)] border border-white/10 rounded-full flex items-center justify-center transition-all opacity-20 hover:opacity-100 hover:text-black group">
        <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
      </button>

      {isAdminOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-[850px] max-h-[90vh] bg-[#080808] border border-white/5 rounded-[40px] shadow-2xl overflow-y-auto p-10 space-y-8 custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/10 pb-6 sticky top-0 bg-[#080808] z-10">
              <h2 className="text-white font-brand font-black text-2xl uppercase tracking-widest italic">Pusat Kontrol Strategis</h2>
              <button onClick={() => setIsAdminOpen(false)} className="text-[var(--accent)] font-black text-xs uppercase tracking-widest px-6 py-2 border border-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-black transition-all">Tutup</button>
            </div>
            
            <div className="space-y-8">
              {/* DETEKSI SISTEM CONTROLS */}
              <div className="bg-white/5 p-6 rounded-2xl space-y-6 border border-white/5">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] italic mb-2">PENGATURAN DETEKSI SISTEM</p>
                <div className="flex gap-4">
                  {['kesalahan', 'kredit', 'verifikasi'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setSystemContent({...systemContent, visualMode: m})} 
                      className={`flex-grow px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${systemContent.visualMode === m ? 'bg-[var(--accent)] text-black' : 'bg-black/40 text-white/30 border border-white/5'}`}
                    >
                      Mode {m}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  {systemContent.visualMode === 'kesalahan' && (
                    <>
                      <AdminInput label="PENARIKAN DITENTUKAN" value={systemContent.kesalahan.target} onChange={(v:string) => setSystemContent({...systemContent, kesalahan: {...systemContent.kesalahan, target: v}})} />
                      <AdminInput label="PENARIKAN DILAKUKAN" value={systemContent.kesalahan.withdrawal} onChange={(v:string) => setSystemContent({...systemContent, kesalahan: {...systemContent.kesalahan, withdrawal: v}})} />
                      <div className="col-span-2">
                        <AdminInput label="VALUE PEMULIHAN (FOOTER)" value={systemContent.kesalahan.footer_value} onChange={(v:string) => setSystemContent({...systemContent, kesalahan: {...systemContent.kesalahan, footer_value: v}})} />
                      </div>
                    </>
                  )}
                  {systemContent.visualMode === 'kredit' && (
                    <>
                      <AdminInput label="SKOR KREDIT SAAT INI" value={systemContent.kredit.currentKredit} onChange={(v:string) => setSystemContent({...systemContent, kredit: {...systemContent.kredit, currentKredit: v}})} />
                      <AdminInput label="VALUE KUOTA PEMULIHAN (FOOTER)" value={systemContent.kredit.footer_value} onChange={(v:string) => setSystemContent({...systemContent, kredit: {...systemContent.kredit, footer_value: v}})} />
                    </>
                  )}
                  {systemContent.visualMode === 'verifikasi' && (
                    <div className="col-span-2 space-y-4">
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">DAFTAR KESALAHAN VERIFIKASI:</p>
                      {systemContent.verifikasi.verifList.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-end bg-black/20 p-4 rounded-xl">
                          <AdminInput label="LABEL KESALAHAN" value={item.label} onChange={(v:string) => {
                            const list = [...systemContent.verifikasi.verifList];
                            list[idx].label = v;
                            setSystemContent({...systemContent, verifikasi: {...systemContent.verifikasi, verifList: list}});
                          }} />
                          <AdminInput label="VALUE (50%)" value={item.val} onChange={(v:string) => {
                            const list = [...systemContent.verifikasi.verifList];
                            list[idx].val = v;
                            setSystemContent({...systemContent, verifikasi: {...systemContent.verifikasi, verifList: list}});
                          }} />
                        </div>
                      ))}
                      <AdminInput label="BIAYA VERIFIKASI TOTAL (FOOTER)" value={systemContent.verifikasi.footer_value} onChange={(v:string) => setSystemContent({...systemContent, verifikasi: {...systemContent.verifikasi, footer_value: v}})} />
                    </div>
                  )}
                </div>
              </div>

              {/* MEDIA CONTROLS */}
              <div className="bg-white/5 p-6 rounded-2xl space-y-6 border border-white/5">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] italic mb-2">URL GAMBAR & MODE PRODUK ({catalogs[catalogIndex].name})</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {catalogs.map((cat, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCatalogIndex(idx)}
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border ${catalogIndex === idx ? 'bg-[var(--accent)] text-black border-[var(--accent)]' : 'bg-black/40 text-white/30 border-white/10 hover:border-white/20'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {catalogs[catalogIndex].products.map((p: any, idx: number) => (
                    <div key={p.id} className="flex flex-col gap-3 p-4 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] text-[var(--accent)] font-black uppercase tracking-widest">{p.label} - {p.name}</label>
                        <AdminCheckbox 
                          label="Exclusive Mode (50%)" 
                          value={p.isExclusive === true} 
                          onChange={(v: boolean) => updateProduct(catalogIndex, idx, 'isExclusive', v)} 
                        />
                      </div>
                      <input 
                        className="bg-black/60 border border-white/10 rounded-lg p-3 text-white text-xs outline-none focus:border-[var(--accent)] w-full font-sans" 
                        placeholder="Image URL"
                        value={p.imageUrl} 
                        onChange={(e) => updateProduct(catalogIndex, idx, 'imageUrl', e.target.value)} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/5">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] italic mb-4">LOGO URL KONTROL BANK</p>
                <AdminInput label="BANK LOGO URL" value={bankContent.logo} onChange={(v:string) => setBankContent({...bankContent, logo: v})} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
