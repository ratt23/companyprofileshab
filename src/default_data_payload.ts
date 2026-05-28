import { DatabaseState } from "./types";

export const defaultDatabaseState: DatabaseState = {
  doctors: [
    // OTOLARYNGOLOGIST
    {
      id: "dr-rodrigo",
      name: "Dr. dr. Rodrigo Limmon, Sp.THT-KL, MARS",
      specialty: "OTOLARYNGOLOGIST",
      department: "Sp.THT-KL",
      schedule: { "Senin": "09:00 - 12:00", "Rabu": "13:00 - 16:00" },
      active: true
    },
    {
      id: "dr-stanley",
      name: "dr. Stanley Permana Setiawan, Sp.THT-KL",
      specialty: "OTOLARYNGOLOGIST",
      department: "Sp.THT-KL",
      schedule: { "Selasa": "10:00 - 14:00", "Kamis": "10:00 - 14:00" },
      active: true
    },
    {
      id: "dr-chriscelia",
      name: "dr. Chriscelia Valery So, Sp.THT-KL",
      specialty: "OTOLARYNGOLOGIST",
      department: "Sp.THT-KL",
      schedule: { "Jumat": "09:00 - 12:00", "Sabtu": "09:00 - 12:00" },
      active: true
    },
    // PULMONOLOGIST
    {
      id: "dr-rina",
      name: "dr. Rina Angriany, Sp.P",
      specialty: "PULMONOLOGIST",
      department: "Sp.P",
      schedule: { "Senin": "08:00 - 11:00", "Rabu": "08:00 - 11:00", "Jumat": "08:00 - 11:00" },
      active: true
    },
    {
      id: "dr-marisa",
      name: "dr. Marisa Afifudin, Sp.P",
      specialty: "PULMONOLOGIST",
      department: "Sp.P",
      schedule: { "Selasa": "13:00 - 16:00", "Kamis": "13:00 - 16:00", "Sabtu": "08:00 - 12:00" },
      active: true
    },
    // OBSTETRICS & GYNECOLOGY
    {
      id: "dr-markus",
      name: "dr. Markus Daniel Taliak, Sp.OG",
      specialty: "OBSTETRICS & GYNECOLOGY",
      department: "Sp.OG",
      schedule: { "Senin": "09:00 - 13:00", "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-rey",
      name: "dr. Rey Jauwerissa, Sp.OG",
      specialty: "OBSTETRICS & GYNECOLOGY",
      department: "Sp.OG",
      schedule: { "Selasa": "11:00 - 15:00", "Jumat": "11:00 - 15:00" },
      active: true
    },
    {
      id: "dr-irene",
      name: "dr. Irene Leha, Sp.OG",
      specialty: "OBSTETRICS & GYNECOLOGY",
      department: "Sp.OG",
      schedule: { "Rabu": "09:00 - 13:00", "Sabtu": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-ika",
      name: "dr. Ika Wiraswesty Ciptaningdiah, Sp.OG, M.Biomed",
      specialty: "OBSTETRICS & GYNECOLOGY",
      department: "Sp.OG",
      schedule: { "Senin": "14:00 - 17:00", "Rabu": "14:00 - 17:00" },
      active: true
    },
    {
      id: "dr-norma",
      name: "dr. Norma Pattinama, Sp.OG",
      specialty: "OBSTETRICS & GYNECOLOGY",
      department: "Sp.OG",
      schedule: { "Selasa": "14:00 - 17:00", "Jumat": "14:00 - 17:00" },
      active: true
    },
    {
      id: "dr-rachmat",
      name: "dr. Rachmat Ramadhani Tuasikal, Sp.OG., SubSp.Onk",
      specialty: "OBSTETRICS & GYNECOLOGY ONCOLOGY",
      department: "Sp.OG., SubSp.Onk",
      schedule: { "Senin": "10:00 - 12:00", "Kamis": "14:00 - 16:00" },
      active: true
    },
    {
      id: "dr-erwin",
      name: "dr. Erwin Rahakbauw, Sp.OG., SubSp.Onk",
      specialty: "OBSTETRICS & GYNECOLOGY ONCOLOGY",
      department: "Sp.OG., SubSp.Onk",
      schedule: { "Selasa": "10:00 - 12:00", "Jumat": "14:00 - 16:00" },
      active: true
    },
    {
      id: "dr-merlin",
      name: "dr. Merlin Margareth Maelissa, SpOG, SubSp. KFM, M.Kes",
      specialty: "OBSTETRICS & GYNECOLOGY MATERNAL–FETAL MEDICINE",
      department: "Sp.OG, SubSp.KFM",
      schedule: { "Rabu": "10:00 - 13:00", "Sabtu": "11:00 - 14:00" },
      active: true
    },
    // PAEDIATRICIAN
    {
      id: "dr-robby-k",
      name: "dr. Robby Kalew, SH, C.Me, SpA",
      specialty: "PAEDIATRICIAN",
      department: "Sp.A",
      schedule: { "Senin": "09:00 - 12:00", "Selasa": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-elizabeth",
      name: "dr. Elizabeth Joan Salim, Sp.A",
      specialty: "PAEDIATRICIAN",
      department: "Sp.A",
      schedule: { "Rabu": "09:00 - 13:00", "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-ria-r",
      name: "dr. Ria Resti Sukur, Sp.A",
      specialty: "PAEDIATRICIAN",
      department: "Sp.A",
      schedule: { "Jumat": "10:00 - 14:00", "Sabtu": "10:00 - 13:00" },
      active: true
    },
    {
      id: "dr-anitha",
      name: "dr. Anitha Marllyin Mairuhu, M.Ked.Klin., Sp.A., CPS",
      specialty: "PAEDIATRICIAN",
      department: "Sp.A",
      schedule: { "Senin": "13:00 - 16:00", "Rabu": "13:00 - 16:00" },
      active: true
    },
    {
      id: "dr-kartika",
      name: "dr. Kartika Setiawaty, Sp.A",
      specialty: "PAEDIATRICIAN",
      department: "Sp.A",
      schedule: { "Selasa": "14:00 - 17:00", "Jumat": "14:00 - 17:00" },
      active: true
    },
    // GENERAL SURGEON
    {
      id: "dr-mo",
      name: "dr. Mo Tualeka, Sp.B",
      specialty: "GENERAL SURGEON",
      department: "Sp.B",
      schedule: { "Senin": "09:00 - 13:00", "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-dewa",
      name: "dr. I Dewa Gede Sidan Agung Mahendra, Sp.B",
      specialty: "GENERAL SURGEON",
      department: "Sp.B",
      schedule: { "Selasa": "10:00 - 13:00", "Jumat": "10:00 - 13:00" },
      active: true
    },
    {
      id: "dr-ricky-m",
      name: "dr. Ricky Masyudha, Sp.B",
      specialty: "GENERAL SURGEON",
      department: "Sp.B",
      schedule: { "Rabu": "09:00 - 12:00", "Sabtu": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-hery",
      name: "dr. Hery Siswanto, Sp.B, FICS FINACS",
      specialty: "GENERAL SURGEON",
      department: "Sp.B, FICS",
      schedule: { "Senin": "14:00 - 17:00", "Rabu": "14:00 - 17:00" },
      active: true
    },
    // UROLOGY
    {
      id: "dr-stefanus",
      name: "dr. Stefanus Cahyo Ariwicaksono, Sp.U",
      specialty: "UROLOGY",
      department: "Sp.U",
      schedule: { "Senin": "11:00 - 14:00", "Kamis": "11:00 - 14:00" },
      active: true
    },
    {
      id: "dr-wyckmell",
      name: "dr. Wyckmell Octof Ingratoeboen, Sp.U",
      specialty: "UROLOGY",
      department: "Sp.U",
      schedule: { "Selasa": "11:00 - 14:00", "Jumat": "11:00 - 14:00" },
      active: true
    },
    // CARDIOTHORACIC & VASCULAR SURGERY
    {
      id: "dr-chaisari",
      name: "dr. Chaisari Maria M. Turnip, Sp.BTKV, FIATCVS",
      specialty: "CARDIOTHORACIC & VASCULAR SURGERY",
      department: "Sp.BTKV",
      schedule: { "Senin": "09:00 - 12:00", "Rabu": "10:00 - 13:00" },
      active: true
    },
    // NEUROLOGIST
    {
      id: "dr-enseline",
      name: "dr. Enseline Nikijuluw, Sp.S",
      specialty: "NEUROLOGIST",
      department: "Sp.S",
      schedule: { "Senin": "09:00 - 13:00", "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-niluh",
      name: "dr. Ni Luh Putu Dirasandhi Semedi Putri, Sp.N",
      specialty: "NEUROLOGIST",
      department: "Sp.N",
      schedule: { "Selasa": "09:00 - 13:00", "Jumat": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-louis",
      name: "dr. Louis Mailuhu, Sp.N., FINA., AIFO-K",
      specialty: "NEUROLOGIST",
      department: "Sp.N",
      schedule: { "Rabu": "09:00 - 13:00", "Sabtu": "09:00 - 12:00" },
      active: true
    },
    // INTERNIST
    {
      id: "dr-denny",
      name: "dr. Denny Jolanda, Sp.PD, Finasim",
      specialty: "INTERNIST",
      department: "Sp.PD",
      schedule: { "Senin": "09:00 - 13:00", "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-jansye",
      name: "dr. Jansye Cyntia Pentury, Sp.PD",
      specialty: "INTERNIST",
      department: "Sp.PD",
      schedule: { "Selasa": "09:00 - 13:00", "Jumat": "09:00 - 13:00" },
      active: true
    },
    {
      id: "dr-dian",
      name: "dr. Dian Qisthi, Sp.PD",
      specialty: "INTERNIST",
      department: "Sp.PD",
      schedule: { "Rabu": "09:00 - 13:00", "Sabtu": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-made-k",
      name: "dr. I Made Kristya Permana, Sp.PD",
      specialty: "INTERNIST",
      department: "Sp.PD",
      schedule: { "Senin": "13:00 - 16:00", "Rabu": "13:00 - 16:00" },
      active: true
    },
    {
      id: "dr-alex",
      name: "dr. Alex Ranuseto, Sp.PD",
      specialty: "INTERNIST",
      department: "Sp.PD",
      schedule: { "Selasa": "13:00 - 16:00", "Kamis": "13:00 - 16:00" },
      active: true
    },
    {
      id: "dr-ria-j-kidney",
      name: "dr. Ria Jauwerissa, M.Biomed, Sp.PD-KGH",
      specialty: "INTERNIST – KIDNEY & HYPERTENSION SPECIALIST",
      department: "Sp.PD-KGH",
      schedule: { "Rabu": "10:00 - 12:00", "Jumat": "10:00 - 12:00" },
      active: true
    },
    // DENTISTS
    {
      id: "drg-lieyanti",
      name: "drg. Lieyanti Melinda",
      specialty: "DENTIST",
      department: "drg.",
      schedule: { "Senin": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-stephanie",
      name: "drg. Stephanie Astrid Rehatta",
      specialty: "DENTIST",
      department: "drg.",
      schedule: { "Selasa": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-lisye",
      name: "drg. Lisye Fabiola Loei",
      specialty: "DENTIST",
      department: "drg.",
      schedule: { "Rabu": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-wendy",
      name: "drg. Wendy Agus Wirawan, Sp.Pros",
      specialty: "PROSTHODONTIST",
      department: "drg. Sp.Pros",
      schedule: { "Kamis": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-hasrul",
      name: "drg. Hasrul Husain, Sp.PM",
      specialty: "ORAL MEDICINE",
      department: "drg. Sp.PM",
      schedule: { "Jumat": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-sofia",
      name: "drg. Sofia Tandya Putri, Sp.KGA",
      specialty: "PEDODONTIST",
      department: "drg. Sp.KGA",
      schedule: { "Sabtu": "09:00 - 13:00" },
      active: true
    },
    {
      id: "drg-roberto",
      name: "drg. Roberto Hutapea, Sp.BMM",
      specialty: "ORAL SURGEON",
      department: "drg. Sp.BMM",
      schedule: { "Senin": "14:00 - 17:00", "Rabu": "14:00 - 17:00" },
      active: true
    },
    {
      id: "drg-slamet",
      name: "drg. Slamet Riyadi, Sp.BMM",
      specialty: "ORAL SURGEON",
      department: "drg. Sp.BMM",
      schedule: { "Selasa": "14:00 - 17:00", "Kamis": "14:00 - 17:00" },
      active: true
    },
    {
      id: "drg-wigiarti",
      name: "drg. Wigiarti, Sp.KG",
      specialty: "ENDODONTIST",
      department: "drg. Sp.KG",
      schedule: { "Jumat": "14:00 - 17:00" },
      active: true
    },
    // OPHTHALMOLOGIST (Eye specialists, shown in Page 31 under ENDODONTIST title)
    {
      id: "dr-daniel",
      name: "dr. Daniel Siegers, Sp.M",
      specialty: "OPHTHALMOLOGIST",
      department: "Sp.M",
      schedule: { "Senin": "09:00 - 12:00", "Rabu": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-wayan",
      name: "dr. I Wayan Ardy Paribrajaka, Sp.M",
      specialty: "OPHTHALMOLOGIST",
      department: "Sp.M",
      schedule: { "Selasa": "09:00 - 12:00", "Kamis": "09:00 - 12:00" },
      active: true
    },
    // CARDIOLOGIST
    {
      id: "dr-gery",
      name: "dr. Gery Soemara, Sp.JP",
      specialty: "CARDIOLOGIST",
      department: "Sp.JP",
      schedule: { "Senin": "09:00 - 12:00", "Kamis": "13:00 - 16:00" },
      active: true
    },
    {
      id: "dr-ririn",
      name: "dr. Ririn Ramli, Sp.JP",
      specialty: "CARDIOLOGIST",
      department: "Sp.JP",
      schedule: { "Selasa": "09:00 - 12:00", "Jumat": "13:00 - 16:00" },
      active: true
    },
    // DERMATOLOGIST
    {
      id: "dr-hanny",
      name: "dr. Hanny Tanasal, Sp.KK",
      specialty: "DERMATOLOGIST",
      department: "Sp.KK",
      schedule: { "Rabu": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-amanda",
      name: "dr. Amanda Gracia Manuputty, M.Ked, Sp.DV",
      specialty: "DERMATOLOGIST",
      department: "Sp.DV",
      schedule: { "Kamis": "09:00 - 12:00" },
      active: true
    },
    // REHABILITATION
    {
      id: "dr-maureen",
      name: "dr. Maureen Jaqualin Paliyama, Sp.KFR",
      specialty: "PHYSICAL MEDICINE & REHABILITATION SPECIALIST",
      department: "Sp.KFR",
      schedule: { "Senin": "09:00 - 12:00", "Rabu": "09:00 - 12:00" },
      active: true
    },
    {
      id: "dr-wiwin",
      name: "dr. Wiwin Lestari Selawa, Sp.KFR",
      specialty: "PHYSICAL MEDICINE & REHABILITATION SPECIALIST",
      department: "Sp.KFR",
      schedule: { "Selasa": "09:00 - 12:00", "Kamis": "09:00 - 12:00" },
      active: true
    },
    // CLINICAL NUTRITION
    {
      id: "dr-mellyana",
      name: "dr. Mellyana Kusuma Atmanegara, M.Kes, Sp.GK",
      specialty: "CLINICAL NUTRITION",
      department: "Sp.GK",
      schedule: { "Senin": "09:00 - 12:00", "Jumat": "09:00 - 12:00" },
      active: true
    },
    // PSYCHIATRIST
    {
      id: "dr-david",
      name: "dr. David Santoso Tjoei, Sp.KJ, MARS",
      specialty: "PSYCHIATRIST",
      department: "Sp.KJ",
      schedule: { "Kamis": "09:00 - 12:00" },
      active: true
    },
    // SURGICAL ONCOLOGY
    {
      id: "dr-ubaidillah",
      name: "dr. Ubaidillah, Sp.B (K) Onk",
      specialty: "SURGICAL ONCOLOGY",
      department: "Sp.B (K) Onk",
      schedule: { "Rabu": "10:00 - 13:00" },
      active: true
    },
    // ORTHOPEDIC HIP&KNEE
    {
      id: "dr-wijaya",
      name: "dr. Wijaya Johanes Chendra, Sp.OT (K), AIFO-K, FICS",
      specialty: "ORTHOPEDIC HIP&KNEE",
      department: "Sp.OT (K)",
      schedule: { "Senin": "10:00 - 13:00", "Kamis": "10:00 - 13:00" },
      active: true
    },
    // ORTHOPEDIC SPORT INJURY
    {
      id: "dr-ganda",
      name: "dr. Ganda Mando Rantou Hamonangan Purba, M.Kes., Sp.OT., Subsp. C.O(K).",
      specialty: "ORTHOPEDIC SPORT INJURY",
      department: "Sp.OT, Subsp. C.O",
      schedule: { "Selasa": "10:00 - 13:00", "Jumat": "10:00 - 13:00" },
      active: true
    },
    // ANAESTHETIC
    {
      id: "dr-idabagus",
      name: "dr. Ida Bagus Gita Dharma Wibawa, SpAn",
      specialty: "ANAESTHETIC",
      department: "Sp.An",
      schedule: { "Senin": "08:00 - On Call" },
      active: true
    },
    {
      id: "dr-aguseko",
      name: "dr. Agus Eko Susilo, SpAn",
      specialty: "ANAESTHETIC",
      department: "Sp.An",
      schedule: { "Selasa": "08:00 - On Call" },
      active: true
    },
    {
      id: "dr-yanjidon",
      name: "dr. Yan Jidon Batlayeri, SpAn",
      specialty: "ANAESTHETIC",
      department: "Sp.An",
      schedule: { "Rabu": "08:00 - On Call" },
      active: true
    },
    {
      id: "dr-cokorda",
      name: "dr. Cokorda Istri Arintha Devi, SpAn",
      specialty: "ANAESTHETIC",
      department: "Sp.An",
      schedule: { "Kamis": "08:00 - On Call" },
      active: true
    },
    {
      id: "dr-teresa",
      name: "dr. Teresa Wilfrida Mangkung, SpAn",
      specialty: "ANAESTHETIC",
      department: "Sp.An",
      schedule: { "Jumat": "08:00 - On Call" },
      active: true
    }
  ],
  stats: [
    {
      year: "2023",
      outpatient: 61231,
      inpatient: 6920,
      surgical: 3469,
      emergency: 6576,
      mcu: 1486
    },
    {
      year: "2024",
      outpatient: 84234,
      inpatient: 8629,
      surgical: 4382,
      emergency: 10873,
      mcu: 1671
    },
    {
      year: "2025",
      outpatient: 90068,
      inpatient: 10562,
      surgical: 4974,
      emergency: 15145,
      mcu: 3375
    }
  ],
  facilities: [
    {
      id: "facility-emergency",
      title: "24 Hours Emergency",
      category: "Layanan Kontinu",
      description: "Unit Gawat Darurat yang siap melayani 24 jam penuh dalam seminggu dengan dokter dan paramedis terlatih gawat darurat serta ambulans tanggap cepat.",
      specs: ["Resusitasi Lengkap", "Dokter Jaga Gawat Darurat 24 Jam", "Perawat Bersertifikat BTCLS/ATLS"]
    },
    {
      id: "facility-siloam-home",
      title: "Siloam at Home",
      category: "Layanan Kontinu",
      description: "Layanan perawatan kesehatan berkualitas dari RSU Siloam langsung di kenyamanan rumah Anda, termasuk kunjungan dokter, perawat, fisioterapi, dan pengambilan laboratorium.",
      specs: ["Home Care Nursing", "Pemberian Infus/Obat di Rumah", "Pengambilan Sampel Darah", "Pascabedah Monitoring"]
    },
    {
      id: "facility-radiology",
      title: "Radiology",
      category: "Fasilitas Medis",
      description: "Instalasi radiologi lengkap dengan pemindaian canggih, interpretasi diagnosis akurat untuk membantu penyembuhan menyeluruh.",
      specs: ["CT Scan Multi-Slice", "Digital X-Ray", "Ultrasonografi (USG)", "C-Arm Fluoroskopi"]
    },
    {
      id: "facility-outpatient",
      title: "Outpatient",
      category: "Layanan Kontinu",
      description: "Klinik Rawat Jalan komprehensif yang melayani konsultasi dokter spesialis, sub-spesialis, pemeriksaan umum, dan tindakan medis rawat jalan tanpa menginap.",
      specs: ["Lebih dari 20 Poliklinik Spesialis", "Sistem Registrasi Online", "Apotek Rawat Jalan Terintegrasi"]
    },
    {
      id: "facility-inpatient",
      title: "Inpatient",
      category: "Rawat Inap",
      description: "Layanan perawatan inap yang nyaman dengan dukungan tim keperawatan yang ramah dan kompeten untuk memulihkan kesehatan pasien secara prima.",
      specs: ["VVIP Room", "VIP Room", "Kelas 1, 2, dan 3", "Layanan Makanan Bergizi sesuai Diet Medis"]
    },
    {
      id: "facility-ambulance",
      title: "Ambulance",
      category: "Layanan Kontinu",
      description: "Armada ambulans tanggap darurat yang dilengkapi dengan peralatan penyelamat hidup instan untuk transportasi rujukan cepat.",
      specs: ["Ventilator Transportable", "Defibrillator & Monitoring", "Bantuan Medis Pra-Rumah Sakit"]
    },
    {
      id: "facility-vvip",
      title: "Kamar Perawatan VVIP",
      category: "Rawat Inap",
      description: "Kamar perawatan premium dengan fasilitas super lengkap seperti sofa santai keluarga, TV kabel, kulkas, dispenser, kamar mandi luxury, dan view estetis untuk pemulihan yang berkelas.",
      specs: ["1 Patient Bed Electric", "Sofa Bed Keluarga", "Pantry & Dining Set", "Welcome Pack Premium"]
    },
    {
      id: "facility-vip",
      title: "Kamar Perawatan VIP",
      category: "Rawat Inap",
      description: "Kamar rawat inap privat super nyaman dengan pendingin udara, sofa pendamping, kamar mandi dalam, TV, serta layanan keperawatan VIP berdedikasi.",
      specs: ["1 Patient Bed Electric", "Sofa Tunggu", "Kulkas Kecil & TV", "Kamar Mandi Pribadi"]
    },
    {
      id: "facility-kelas-1",
      title: "Kamar Perawatan Kelas I",
      category: "Rawat Inap",
      description: "Kamar rawat inap semi-privat yang ideal, dihuni oleh maksimal 2 pasien dengan tirai pembatas steril untuk menjamin privasi selama masa perawatan.",
      specs: ["2 Patient Beds", "Tirai Sekat Rel Gantung", "Kamar Mandi Dalam", "TV Bersama"]
    },
    {
      id: "facility-kelas-2",
      title: "Kamar Perawatan Kelas 2",
      category: "Rawat Inap",
      description: "Kamar rawat inap kolektif yang higienis, dihuni oleh maksimal 3-4 pasien dengan fasilitas pendingin ruangan dan kamar mandi yang memadai.",
      specs: ["3-4 Patient Beds", "Air Conditioner", "Kamar Mandi Dalam", "Tirai Anti-Bakteri"]
    },
    {
      id: "facility-kelas-3",
      title: "Kamar Perawatan Kelas 3",
      category: "Rawat Inap",
      description: "Kamar perawatan kolektif bernilai ekonomis tinggi dengan standar kebersihan, keamanan, dan sirkulasi udara optimal sesuai standar akreditasi rumah sakit.",
      specs: ["Beds Higienis Berjarak Standar", "Sistem Panggilan Suster Terintegrasi", "Kamar Mandi Bersih"]
    }
  ],
  cover: {
    tagline: "RSU SILOAM AMBON",
    title: "Dedicated to providing highest quality healthcare",
    description: "Our dedicated team of health care professionals is committed to give our patients the highest quality of healthcare.",
    image: ""
  },
  excellence: [
    { title: "EMERGENCY", description: "24-hour emergency room ready for all situations.", image: "" },
    { title: "WOMEN & CHILDREN", description: "Comprehensive care for women and pediatric needs.", image: "" }
  ],
  clinic: {
    title: "EXECUTIVE CLINIC",
    description: "Premium integrated clinic designed exclusively for executive comfort with luxury waiting rooms and one stop service.",
    schedule: "Senin - Sabtu, 08:00 - 20:00",
    amenities: ["One Stop Specialist Services", "Executive Lounge", "Personal Assistant"]
  },
  equipments: [
    { name: "CT SCAN MULTI-SLICE", description: "Advanced diagnostic imaging.", image: "" },
    { name: "C-ARM FLUOROSCOPY", description: "Real-time medical imaging during surgery.", image: "" }
  ],
  plan: {
    title: "HOSPITAL MASTER PLAN",
    description: "Our vision for the future expansion of RSU Siloam Ambon.",
    image: ""
  },
  socials: {
    phone: "1-500-181",
    instagram: "siloamhospitals",
    facebook: "Siloam Hospitals",
    website: "siloamhospitals.com"
  }
};
