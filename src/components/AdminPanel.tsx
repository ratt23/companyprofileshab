import React, { useState } from "react";
import { Doctor, YearStats, ClinicSlide } from "../types";
import {
  Trash2,
  PlusCircle,
  Save,
  Database,
  Search,
  Check,
  X,
  FileText,
  Clock,
  BriefcaseMedical
} from "lucide-react";

interface AdminPanelProps {
  doctors: Doctor[];
  stats: YearStats[];
  clinic: ClinicSlide;
  onUpdateData: (newDoctors: Doctor[], newStats: YearStats[]) => Promise<void>;
  onUpdateClinic: (clinic: ClinicSlide) => Promise<void>;
  onClose: () => void;
}

export function AdminPanel({ doctors, stats, clinic, onUpdateData, onUpdateClinic, onClose }: AdminPanelProps) {
  const [localDoctors, setLocalDoctors] = useState<Doctor[]>([...doctors]);
  const [localStats, setLocalStats] = useState<YearStats[]>([...stats]);
  const [activeTab, setActiveTab] = useState<'doctors' | 'clinic'>('doctors');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState("");

  // Clinic Slide edit states
  const [clinicTitle, setClinicTitle] = useState(clinic.title || "EXECUTIVE CLINIC");
  const [clinicDescription, setClinicDescription] = useState(clinic.description || "");
  const [clinicSchedule, setClinicSchedule] = useState(clinic.schedule || "");
  const [clinicAmenities, setClinicAmenities] = useState<string[]>([...(clinic.amenities || [])]);
  const [clinicImage1, setClinicImage1] = useState(clinic.image1 || "/clinic_bg.png");
  const [clinicImage2, setClinicImage2] = useState(clinic.image2 || "/clinic_inset1.png");
  const [clinicImage3, setClinicImage3] = useState(clinic.image3 || "/clinic_inset2.png");
  const [newAmenity, setNewAmenity] = useState("");
  const [isSavingClinic, setIsSavingClinic] = useState(false);

  // Editing state for individual doctor
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editDocName, setEditDocName] = useState("");
  const [editDocSpecialty, setEditDocSpecialty] = useState("");
  const [editDocDept, setEditDocDept] = useState("");
  const [editDocSchedule, setEditDocSchedule] = useState<{ [day: string]: string }>({});

  // Adding doctor state
  const [isAdding, setIsAdding] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("OTOLARYNGOLOGIST");
  const [newDocDept, setNewDocDept] = useState("Sp.THT-KL");
  const [newDocSchedule, setNewDocSchedule] = useState<{ [day: string]: string }>({});

  const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const selectSpecialties = [
    "OTOLARYNGOLOGIST",
    "PULMONOLOGIST",
    "OBSTETRICS & GYNECOLOGY",
    "OBSTETRICS & GYNECOLOGY ONCOLOGY",
    "OBSTETRICS & GYNECOLOGY MATERNAL–FETAL MEDICINE",
    "PAEDIATRICIAN",
    "GENERAL SURGEON",
    "UROLOGY",
    "CARDIOTHORACIC & VASCULAR SURGERY",
    "NEUROLOGIST",
    "INTERNIST",
    "DENTIST",
    "PROSTHODONTIST",
    "ORAL MEDICINE",
    "PEDODONTIST",
    "ORAL SURGEON",
    "ENDODONTIST",
    "OPHTHALMOLOGIST",
    "CARDIOLOGIST",
    "DERMATOLOGIST",
    "PHYSICAL MEDICINE & REHABILITATION SPECIALIST",
    "CLINICAL NUTRITION",
    "PSYCHIATRIST",
    "SURGICAL ONCOLOGY",
    "ORTHOPEDIC HIP&KNEE",
    "ORTHOPEDIC SPORT INJURY",
    "INTERNIST – KIDNEY & HYPERTENSION SPECIALIST",
    "ANAESTHETIC"
  ];

  const handleStatChange = (yearIndex: number, field: keyof YearStats, value: number) => {
    const updated = [...localStats];
    updated[yearIndex] = {
      ...updated[yearIndex],
      [field]: value
    };
    setLocalStats(updated);
  };

  const startEditDoctor = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setEditDocName(doc.name);
    setEditDocSpecialty(doc.specialty);
    setEditDocDept(doc.department);
    setEditDocSchedule({ ...doc.schedule });
  };

  const saveEditedDoctor = () => {
    if (!editDocName.trim()) return;
    const updated = localDoctors.map(d => {
      if (d.id === editingDoctorId) {
        return {
          ...d,
          name: editDocName,
          specialty: editDocSpecialty,
          department: editDocDept,
          schedule: editDocSchedule
        };
      }
      return d;
    });
    setLocalDoctors(updated);
    setEditingDoctorId(null);
    showNotice("Jadwal Dokter terupdate di memori lokal, klik 'Simpan Perubahan' di bawah untuk mengekalkan.");
  };

  const handleAddDoctor = () => {
    if (!newDocName.trim() || !newDocSpecialty || !newDocDept) {
      alert("Mohon isi nama, spesialisasi, dan gelar departemen.");
      return;
    }
    const newDoc: Doctor = {
      id: "doc-" + Date.now(),
      name: newDocName,
      specialty: newDocSpecialty,
      department: newDocDept,
      schedule: newDocSchedule,
      active: true
    };
    setLocalDoctors([newDoc, ...localDoctors]);
    // reset
    setNewDocName("");
    setNewDocSchedule({});
    setIsAdding(false);
    showNotice("Dokter Baru berhasil ditambahkan ke list, klik 'Simpan Perubahan' di bawah untuk membekukannya.");
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal untuk ${name}?`)) {
      setLocalDoctors(localDoctors.filter(d => d.id !== id));
      showNotice("Dokter dihapus dari list, simpan perubahan untuk melestarikan di server.");
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onUpdateData(localDoctors, localStats);
      showNotice("Sukses! Database berkat diperbarui permanen.");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan ke server database.");
    } finally {
      setIsSaving(false);
    }
  };



  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const filteredDoctors = localDoctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Banner Title */}
        <div className="bg-[#003399] text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-xl font-black">RSU Siloam Database Update Center</h2>
              <p className="text-xs text-white/70">Manajemen Jadwal Dokter & Konten Executive Clinic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center space-x-2 px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'doctors'
                ? 'border-[#003399] text-[#003399] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <BriefcaseMedical className="w-4 h-4" />
            <span>JADWAL DOKTER & METRIK</span>
          </button>

          <button
            onClick={() => setActiveTab('clinic')}
            className={`flex items-center space-x-2 px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'clinic'
                ? 'border-[#003399] text-[#003399] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>KONTEN EXECUTIVE CLINIC</span>
          </button>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="bg-amber-500 text-white font-bold text-xs px-6 py-2 text-center shrink-0 shadow animate-pulse">
            {notification}
          </div>
        )}

        {/* === TAB: JADWAL DOKTER & METRIK === */}
        {activeTab === 'doctors' && (
          <>
          <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Doctor Roster Management */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden border-r border-slate-100">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase flex items-center">
                <BriefcaseMedical className="w-4 h-4 mr-2 text-[#003399]" />
                DATABASE JADWAL DOKTER ({localDoctors.length})
              </h3>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="px-4 py-2 bg-[#003399] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-[#b0841a] transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Dokter Baru</span>
              </button>
            </div>

            {/* Addition Form inline */}
            {isAdding && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 shrink-0 space-y-3 relative">
                <h4 className="text-xs font-bold text-slate-700 uppercase">Isi Detail Dokter Baru:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nama Lengkap e.g., dr. Adhi Pratama, Sp.A"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="col-span-1 md:col-span-2 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Abbr Gelar e.g., Sp.A"
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800"
                  >
                    {selectSpecialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Day Scheduler */}
                <div className="pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] font-bold text-slate-400 block mb-2">TENTUKAN JADWAL PRAKTEK (HARI):</span>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex flex-col items-center">
                        <label className="text-[9px] text-slate-405 font-bold mb-1 font-mono uppercase">{day}</label>
                        <input
                          type="text"
                          placeholder="e.g. 09:00-12:00"
                          value={newDocSchedule[day] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              setNewDocSchedule({ ...newDocSchedule, [day]: val });
                            } else {
                              const copy = { ...newDocSchedule };
                              delete copy[day];
                              setNewDocSchedule(copy);
                            }
                          }}
                          className="w-full text-[10px] p-1 border border-slate-250 bg-white rounded text-center text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddDoctor}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Tambahkan
                  </button>
                </div>
              </div>
            )}

            {/* Doctor Search input */}
            <div className="relative mb-3 shrink-0">
              <input
                type="text"
                placeholder="Cari Dokter berdasarkan nama atau spesialis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl border-none text-xs text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Doctor List scrolling content */}
            <div className="flex-grow overflow-y-auto space-y-2.5 pr-1.5">
              {filteredDoctors.map(doc => {
                const isEditing = editingDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    className="border border-slate-100 rounded-xl p-3.5 hover:border-slate-200 hover:bg-slate-50/50 transition-colors bg-white flex flex-col justify-between"
                  >
                    {isEditing ? (
                      /* Editing Form View */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editDocName}
                            onChange={(e) => setEditDocName(e.target.value)}
                            className="col-span-1 md:col-span-2 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={editDocDept}
                            onChange={(e) => setEditDocDept(e.target.value)}
                            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <label className="text-[10px] font-bold text-slate-450 uppercase font-mono">Spesialisasi:</label>
                          <select
                            value={editDocSpecialty}
                            onChange={(e) => setEditDocSpecialty(e.target.value)}
                            className="col-span-3 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                          >
                            {selectSpecialties.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Day Schedule values in editing */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1">
                          {daysOfWeek.map(day => (
                            <div key={day} className="flex flex-col">
                              <label className="text-[9px] text-slate-400 font-bold mb-0.5">{day}</label>
                              <input
                                type="text"
                                placeholder="Hari Libur"
                                value={editDocSchedule[day] || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) {
                                    setEditDocSchedule({ ...editDocSchedule, [day]: val });
                                  } else {
                                    const copy = { ...editDocSchedule };
                                    delete copy[day];
                                    setEditDocSchedule(copy);
                                  }
                                }}
                                className="w-full text-[10px] p-1 border border-slate-200 bg-white rounded"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end space-x-1.5 pt-1.5">
                          <button
                            onClick={() => setEditingDoctorId(null)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-bold text-slate-700"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveEditedDoctor}
                            className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold text-white"
                          >
                            Selesai
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Row View */
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-black text-slate-800">{doc.name}</span>
                            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100/30">
                              {doc.department}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase font-black font-mono tracking-wider mt-0.5">
                            {doc.specialty}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {Object.keys(doc.schedule).map(day => (
                              <span key={day} className="text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-150 rounded px-1.5 py-0.5">
                                {day}: {doc.schedule[day]}
                              </span>
                            ))}
                            {Object.keys(doc.schedule).length === 0 && (
                              <span className="text-[10px] italic text-slate-400">Belum diatur jadwal di database</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 ml-4">
                          <button
                            onClick={() => startEditDoctor(doc)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-all border border-blue-100/30"
                          >
                            <span className="text-[10px] font-bold">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-all border border-red-100/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Hospital Statistics Management */}
          <div className="w-80 p-6 bg-slate-50 flex flex-col justify-between select-none">
            <div>
              <h3 className="font-extrabold text-[#003399] tracking-wider text-xs uppercase mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-amber-500" />
                DASHBOARD METRIK KINERJA
              </h3>

              <div className="space-y-5">
                {localStats.map((stat, idx) => (
                  <div key={stat.year} className="bg-white border border-slate-150 p-4 rounded-2xl shadow-sm">
                    <span className="text-xs bg-amber-50 rounded-full px-2.5 py-0.5 border border-amber-100 text-[#b0841a] font-bold font-mono">
                      TAHUN {stat.year}
                    </span>

                    <div className="mt-3.5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-500 font-semibold font-sans">Rawat Jalan:</label>
                        <input
                          type="number"
                          value={stat.outpatient}
                          onChange={(e) => handleStatChange(idx, "outpatient", parseInt(e.target.value) || 0)}
                          className="w-24 text-right p-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-500 font-semibold font-sans">Rawat Inap:</label>
                        <input
                          type="number"
                          value={stat.inpatient}
                          onChange={(e) => handleStatChange(idx, "inpatient", parseInt(e.target.value) || 0)}
                          className="w-24 text-right p-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-500 font-semibold font-sans">Bedah/Surgical:</label>
                        <input
                          type="number"
                          value={stat.surgical}
                          onChange={(e) => handleStatChange(idx, "surgical", parseInt(e.target.value) || 0)}
                          className="w-24 text-right p-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-500 font-semibold font-sans">Emergency:</label>
                        <input
                          type="number"
                          value={stat.emergency}
                          onChange={(e) => handleStatChange(idx, "emergency", parseInt(e.target.value) || 0)}
                          className="w-24 text-right p-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-500 font-semibold font-sans">Med. Checkup:</label>
                        <input
                          type="number"
                          value={stat.mcu}
                          onChange={(e) => handleStatChange(idx, "mcu", parseInt(e.target.value) || 0)}
                          className="w-24 text-right p-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External API explanation card */}
            <div className="bg-[#002f8d]/5 border border-[#002f8d]/10 p-4 rounded-xl text-[10px] text-[#002f8d] mt-4 leading-relaxed font-sans">
              <span className="font-bold flex items-center">
                🔌 TIPS INTEGRASI API OTOMATIS:
              </span>
              <span>
                Developer Rumah Sakit Anda dapat menyinkronkan database internal RS secara otomatis dengan mengirimkan request HTTP POST JSON data ke endpoint API berikut di program ini:<br />
                <code className="font-mono bg-white inline-block px-1 rounded border border-blue-100 my-1">
                  POST /api/data
                </code>
              </span>
            </div>

          </div>
        </div>

        {/* Action Bar - Doctors Tab */}
        <div className="bg-slate-100 border-t border-slate-150 px-6 py-4 flex justify-between items-center shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            * Perubahan akan langsung disimpan ke data/database.json lokal.
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan Permanen"}</span>
            </button>
          </div>
        </div>
        </>
        )}



        {/* === TAB: KONTEN EXECUTIVE CLINIC === */}
        {activeTab === 'clinic' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-[#003399]" />
                  EDIT KONTEN EXECUTIVE CLINIC
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">
                  Ubah judul, detail deskripsi, jam operasional, fasilitas penunjang, dan 3 gambar utama untuk slide Executive Clinic.
                </p>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Judul Slide:</label>
                  <input
                    type="text"
                    value={clinicTitle}
                    onChange={(e) => setClinicTitle(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                    placeholder="e.g. EXECUTIVE CLINIC"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Jadwal / Jam Kerja:</label>
                  <input
                    type="text"
                    value={clinicSchedule}
                    onChange={(e) => setClinicSchedule(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                    placeholder="e.g. Senin - Sabtu, 08:00 - 20:00"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Deskripsi Clinic:</label>
                <textarea
                  value={clinicDescription}
                  onChange={(e) => setClinicDescription(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 min-h-[60px]"
                  placeholder="Deskripsi singkat clinic..."
                />
              </div>

              {/* Images Fields */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">KONFIGURASI 3 GAMBAR UTAMA</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Image 1 (Main Background):</label>
                    <input
                      type="text"
                      value={clinicImage1}
                      onChange={(e) => setClinicImage1(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-800 font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Direkomendasikan foto lobby landscape 16:9</span>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Image 2 (Top Inset):</label>
                    <input
                      type="text"
                      value={clinicImage2}
                      onChange={(e) => setClinicImage2(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-800 font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Foto sofa / lounge dekat, border putih tebal</span>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase font-mono">Image 3 (Bottom Inset):</label>
                    <input
                      type="text"
                      value={clinicImage3}
                      onChange={(e) => setClinicImage3(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-800 font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Foto koridor / kursi tunggu, border putih tebal</span>
                  </div>
                </div>
              </div>

              {/* Amenities / Features List */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">LAYANAN & FASILITAS (AMENITIES)</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {clinicAmenities.map((amenity, idx) => (
                    <span key={idx} className="flex items-center text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                      <span>{amenity}</span>
                      <button
                        onClick={() => setClinicAmenities(clinicAmenities.filter((_, i) => i !== idx))}
                        className="ml-2 text-red-500 font-bold hover:text-red-700 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {clinicAmenities.length === 0 && (
                    <span className="text-xs italic text-slate-400">Belum ada layanan yang ditambahkan</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Tambah layanan/fasilitas baru..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newAmenity.trim()) {
                        e.preventDefault();
                        setClinicAmenities([...clinicAmenities, newAmenity.trim()]);
                        setNewAmenity("");
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                  <button
                    onClick={() => {
                      if (newAmenity.trim()) {
                        setClinicAmenities([...clinicAmenities, newAmenity.trim()]);
                        setNewAmenity("");
                      }
                    }}
                    className="px-4 py-1.5 bg-[#003399] text-white rounded-xl text-xs font-bold"
                  >
                    Tambah
                  </button>
                </div>
              </div>

            </div>

            {/* Save Clinic Footer */}
            <div className="bg-slate-100 border-t border-slate-150 px-6 py-4 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">
                * Perubahan akan langsung disimpan ke database slideshow.
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    setIsSavingClinic(true);
                    try {
                      await onUpdateClinic({
                        title: clinicTitle,
                        description: clinicDescription,
                        schedule: clinicSchedule,
                        amenities: clinicAmenities,
                        image1: clinicImage1,
                        image2: clinicImage2,
                        image3: clinicImage3
                      });
                      showNotice("Konten Executive Clinic berhasil disimpan!");
                      setTimeout(() => onClose(), 1500);
                    } catch (err) {
                      console.error(err);
                      alert("Gagal menyimpan data Executive Clinic.");
                    } finally {
                      setIsSavingClinic(false);
                    }
                  }}
                  disabled={isSavingClinic}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingClinic ? "Menyimpan..." : "Simpan Konten Clinic"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
