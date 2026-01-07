import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (AURORA & CAM EFEKTİ)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.1; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }

  /* --- TEMEL YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN (AURORA EFEKTİ) --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #0f172a; /* Çok koyu lacivert taban */
    z-index: 0; overflow: hidden; perspective: 1000px;
  }

  /* Hareketli Işık Blokları (Aurora) */
  .aurora-blob {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4;
    animation: aurora-float 20s infinite alternate ease-in-out;
  }
  .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0c4a6e; animation-delay: 0s; }
  .blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #0369a1; animation-delay: -5s; }
  .blob-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: #4338ca; animation-delay: -10s; opacity: 0.3; }
  
  @keyframes aurora-float {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }

  /* --- YILDIZLAR --- */
  .star-field { position: absolute; width: 100%; height: 100%; z-index: 1; }
  .star-small {
    position: absolute; background: #fff; border-radius: 50%; width: 2px; height: 2px;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    animation: twinkle 4s infinite ease-in-out;
  }
  @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }

  /* --- GİRİŞ EKRANI (CAM FANUS) --- */
  .intro-wrapper {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10;
    transition: opacity 1s ease-in-out;
  }
  
  /* BUZLU CAM KUTUSU (Yazıyı koruyan kalkan) */
  .glass-pane {
    background: rgba(255, 255, 255, 0.03); /* Çok şeffaf beyaz */
    backdrop-filter: blur(12px); /* Arkadaki karmaşayı flulaştırır */
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    padding: 4rem 6rem;
    border-radius: 2rem;
    text-align: center;
    
    /* Kutu Süzülme Animasyonu */
    animation: float-box 6s ease-in-out infinite;
  }

  @keyframes float-box {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  /* Başlık Işıltısı (Shimmer) */
  .shimmer-text {
    font-size: 5rem; font-weight: 700; 
    background: linear-gradient(to right, #94a3b8 20%, #ffffff 50%, #94a3b8 80%);
    background-size: 200% auto;
    color: transparent; -webkit-background-clip: text; background-clip: text;
    animation: shine 5s linear infinite;
    margin-bottom: 1rem;
  }
  @media (min-width: 768px) { .shimmer-text { font-size: 7rem; } }

  @keyframes shine { to { background-position: 200% center; } }

  .subtitle-clean {
    color: #cbd5e1; letter-spacing: 0.6em; text-transform: uppercase;
    font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.8;
  }

  /* Buton (Pulse Efekti) */
  .glow-btn {
    padding: 1rem 3.5rem; font-size: 1.2rem; letter-spacing: 0.2em;
    color: #fff; background: transparent;
    border: 1px solid rgba(255,255,255,0.4); border-radius: 50px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.4s;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
  .glow-btn:hover {
    background: rgba(255,255,255,0.1); border-color: #fff;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
  .glow-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }
  .glow-btn:hover::before { left: 100%; }

  /* --- GEÇİŞ (WARP) --- */
  .warping .glass-pane {
    transform: scale(0.8) translateZ(-500px); opacity: 0; transition: all 1s ease-in;
  }
  .warping .star-small {
    transition: transform 1.5s ease-in;
    transform: scale(0) translateZ(-1000px); opacity: 0;
  }
  .warping .aurora-blob {
    transition: opacity 1.5s; opacity: 0;
  }

  /* --- KART STİLLERİ (Öncekiyle Aynı) --- */
  .content-container {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1200px;
  }
  .card-explosion { animation: card-appear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes card-appear {
    from { opacity: 0; transform: scale(0.6) translateY(50px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .crystal-card {
    width: 90%; max-width: 600px;
    background: rgba(255, 255, 255, 0.1); /* Biraz daha koyu kart */
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255, 0.1) inset;
    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    border-radius: 40px; padding: 3rem 2rem;
    text-align: center; position: relative;
  }
  
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 0%, #fbbf24 50%, #d97706 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.4));
  }
  .transliteration-mist { color: #e0f2fe; text-shadow: 0 0 10px rgba(224, 242, 254, 0.4); }
  .meaning-mist { color: #f1f5f9; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  
  .question-box {
    background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem; padding: 1.5rem;
  }
  .question-text { color: #bae6fd; font-style: italic; }

  .action-btn {
    border: 1px solid #fbbf24; color: #fbbf24; background: rgba(0,0,0,0.2);
    padding: 1rem 2.5rem; border-radius: 999px; margin-top: 2rem;
    text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; font-weight: 600;
    transition: all 0.3s;
  }
  .action-btn:hover {
    background: #fbbf24; color: #0c4a6e; transform: scale(1.05); box-shadow: 0 0 25px rgba(251, 191, 36, 0.5);
  }
  
  .fade-wrapper { transition: all 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(1.1); filter: blur(10px); }
  .fade-in { opacity: 1; transform: scale(1); filter: blur(0); }
`;
// ==========================================
// 2. VERİ SETİ (99 İSİM)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Kâinatın tek yaratıcısı.', question: 'Kendinden büyük bir güce teslim olmak sana ne hissettiriyor?' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhametiyle lütuf ve ihsanda bulunan.', question: 'Bugün gökyüzüne bakıp O’nun rahmetini hissettin mi?' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Rahmetiyle her şeyi kuşatan.', question: 'Kendine gösterdiğin şefkat yeterli mi?' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Bütün varlıkların sahibi/hükümdârı.', question: 'Sahip olduğunu sandığın ne aslında sadece bir emanet?' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Eksiklik ve kusurlardan münezzeh.', question: 'Ruhunu bugün hangi olumsuz düşüncelerden arındırmak istersin?' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik ve selâmet veren.', question: 'İçindeki savaşı bitirmek için neye ihtiyacın var?' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Güven veren ve kendisine güvenilen.', question: 'Bugün kime güvenli bir liman olabilirsin?' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Kâinatın bütün işlerini gözetip yöneten.', question: 'Kontrol etmeyi bırakıp akışa güvenebilir misin?' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'İzzet sahibi, üstün.', question: 'Onurunu korumak için bugün ne yapmalısın?' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yaptıran, onaran.', question: 'Kırık kalbini onarması için O’na izin ver.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklüğünü izhar eden, son derece ulu.', question: 'Gerçek büyüklüğün sadece O’na ait olduğunu bilmek egonu nasıl etkiliyor?' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Her şeyin yaratıcısı.', question: 'Hayatında bugün neyi yeniden inşa etmek istersin?' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Yoktan yaratan, örneği olmadan icat eden.', question: 'İçindeki yaratıcı potansiyeli nasıl kullanıyorsun?' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Varlığa şekil ve sûret veren.', question: 'Kendi karakterine nasıl bir şekil vermek istersin?' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Kusur ve günahları örten, çokça bağışlayan.', question: 'Bugün kimi affederek kalbini özgürleştirebilirsin?' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Her şeye boyun eğdiren kudret sahibi.', question: 'Nefsinin hangi arzusunu yenmek istiyorsun?' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız olarak çokça nimet veren.', question: 'Karşılık beklemeden vermenin huzurunu en son ne zaman yaşadın?' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Maddî ve manevî bol rızık veren.', question: 'Ruhunun şu an hangi manevi rızka ihtiyacı var?' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Hayır kapılarını açan.', question: 'Kapanan bir kapının ardındaki hayrı görebiliyor musun?' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'İlmi her şeyi kuşatan.', question: 'Neyi bilmemek seni korkutuyor?' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', meaning: 'Her şeyi teslim alan, daraltan.', question: 'Şu anki daralma hissinin seni hangi genişliğe hazırladığını düşünüyorsun?' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Rızkı genişleten, ferahlık veren.', question: 'İçindeki ferahlığı başkalarına nasıl yansıtabilirsin?' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Dereceleri alçaltan.', question: 'Tevazu göstermenin seni aslında nasıl yükselteceğini biliyor musun?' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi`', meaning: 'Dereceleri yükselten.', question: 'Manevi olarak yükselmek için hangi yüklerden kurtulmalısın?' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'İzzet veren, aziz kılan.', question: 'Gerçek onurun kaynağını nerede arıyorsun?' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Değersiz kılan, boyun eğdiren.', question: 'Kibirlenmenin insanı nasıl küçülttüğünü hiç düşündün mü?' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî`', meaning: 'Her şeyi işiten.', question: 'Fısıldadığın duaların bile duyulduğunu bilmek sana güven veriyor mu?' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören.', question: 'Kimse görmese de O’nun seni izlediğini bilmek davranışlarını nasıl değiştirir?' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Mutlak hüküm sahibi.', question: 'Hayatındaki olaylarda O’nun hükmüne razı mısın?' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', meaning: 'Mutlak adalet sahibi.', question: 'Kendine ve çevrene karşı adil davranıyor musun?' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'En ince işlerin iç yüzünü bilen, lütuf sahibi.', question: 'Bugün başına gelen küçük bir güzelliğin arkasındaki lütfu fark ettin mi?' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Her şeyden haberdar olan.', question: 'İçindeki gizli niyetlerin O’nun tarafından bilindiğini hatırlıyor musun?' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Yumuşak huylu, acele etmeyen.', question: 'Sana yapılan hatalara karşı ne kadar sabırlısın?' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Pek yüce, azametli.', question: 'O’nun azameti karşısında dertlerinin ne kadar küçük olduğunu görüyor musun?' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Çok bağışlayıcı.', question: 'Kendini affetmek için neyi bekliyorsun?' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Az amele çok sevap veren.', question: 'Sahip olduğun nimetler için bugün şükrettin mi?' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yüceler yücesi.', question: 'Hedeflerini O’nun rızasına uygun yüksek tutuyor musun?' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Büyüklükte eşi olmayan.', question: 'Gözünde büyüttüğün sorunlar O’ndan büyük mü?' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Her şeyi koruyan ve dengede tutan.', question: 'Seni her an koruyup gözeten bir gücün varlığını hissediyor musun?' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Her yaratılmışın gıdasını veren.', question: 'Rızık endişesi taşımak yerine Rezzak’a güvenebilir misin?' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesaba çeken.', question: 'Her günün sonunda kendi vicdan muhasebeni yapıyor musun?' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Azamet ve celal sahibi.', question: 'O’nun yüceliği karşısında hayret duygunu koruyor musun?' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Çok cömert, ikramı bol.', question: 'Sen de elindekileri başkalarıyla paylaşacak kadar cömert misin?' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Her an gözetleyen.', question: 'Yalnız kaldığında bile seni izleyen bir dostun olduğunu bilmek nasıl hissettiriyor?' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Duaları kabul eden.', question: 'En samimi duan nedir?' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi`', meaning: 'İlmi ve rahmeti geniş olan.', question: 'Kalbini, herkesi kucaklayacak kadar genişletebilir misin?' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Her işi hikmetli.', question: 'Başına gelen zorluktaki gizli hikmeti görebiliyor musun?' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Çok seven, sevilen.', question: 'Allah’ın seni ne kadar sevdiğini hissediyor musun?' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Şanı yüce ve keremi bol.', question: 'Hayatını onurlu ve şerefli bir şekilde yaşıyor musun?' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Ölüleri dirilten.', question: 'İçinde ölmüş olan umutları O’nun dirilteceğine inanıyor musun?' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Her şeye şahit olan.', question: 'Her anına şahit olan O iken, kime neyi ispatlamaya çalışıyorsun?' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', meaning: 'Varlığı hiç değişmeden duran, gerçek.', question: 'Yalan dünyada tek gerçeğin O olduğunu hatırlıyor musun?' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'En güzel vekil, güvenilen.', question: 'Sırtındaki yükleri O’na devredip rahatladın mı?' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', meaning: 'Pek güçlü.', question: 'Kendi gücünün bittiği yerde O’nun gücüne sığınıyor musun?' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Sarsılmaz kudret sahibi.', question: 'Zorluklar karşısında duruşunu ne kadar sağlam tutabiliyorsun?' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', meaning: 'Dost ve yardımcı.', question: 'O’ndan daha iyi bir dost bulabilir misin?' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Her türlü övgüye layık.', question: 'Bugün dilinden ve kalbinden hamd kelimesi döküldü mü?' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Her şeyin sayısını bilen.', question: 'Sen unutsan da O’nun her iyiliğini kaydettiğini biliyor musun?' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Varlıkları ilk kez yaratan.', question: 'Hayatında hangi yeni başlangıca adım atmak istiyorsun?' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Yaratılmışları tekrar yaratan.', question: 'Her gecenin sabahında sana yeni bir şans verildiğinin farkında mısın?' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Can veren, dirilten.', question: 'Ruhunu ne ile besleyip canlandırıyorsun?' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Can alan, öldüren.', question: 'Ölümü bir son değil, bir kavuşma olarak görebiliyor musun?' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', meaning: 'Sonsuz hayat sahibi.', question: 'Fani şeylere bağlanmak yerine Baki olana yöneliyor musun?' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Her şeyi ayakta tutan.', question: 'Kendi ayakların üzerinde dururken O’nun desteğini hissediyor musun?' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Her istediğini bulan, zengin.', question: 'Aradığın mutluluğu dışarıda mı yoksa O’nda mı arıyorsun?' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şanı yüce ve keremi bol.', question: 'O’nun sana verdiği değeri hissedebiliyor musun?' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Tek ve bir olan.', question: 'Kalbindeki sevgileri O’nun sevgisinde birleştirebildin mi?' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', meaning: 'Her şeyin kendisine muhtaç olduğu.', question: 'İhtiyaçlarını insanlardan değil, sadece O’ndan istiyor musun?' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Her şeye gücü yeten.', question: 'Senin "imkansız" dediğin şeyin O’nun için "ol" demek kadar kolay olduğunu biliyor musun?' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'Kuvvet sahipleri üzerinde istediğini yapan.', question: 'O’nun kudretine teslim olmak seni ne kadar rahatlatıyor?' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'İstediğini öne alan.', question: 'İşlerin senin planladığın gibi gitmediğinde O’nun sıralamasına güveniyor musun?' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'İstediğini geriye bırakan.', question: 'Gecikiyorsa güzelleşiyordur, sabredebiliyor musun?' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', meaning: 'Başlangıcı olmayan.', question: 'Her işe O’nun adıyla (Besmele ile) başlıyor musun?' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', meaning: 'Sonu olmayan.', question: 'Yolun sonunun O’na çıkacağını bilmek yürüyüşünü nasıl etkiliyor?' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Varlığı açık ve aşikar olan.', question: 'Kainattaki sanat eserlerine bakıp Sanatkarı görüyor musun?' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Gizli olan, mahiyeti bilinemeyen.', question: 'Gözle görülmeyen alemlerin varlığı sana ne düşündürüyor?' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', meaning: 'Kâinatı yöneten.', question: 'Hayatının yönetimini O’na bırakmaya cesaretin var mı?' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Noksanlıklardan yüce.', question: 'Hata yapmaktan korkma, çünkü kusursuz olan sadece O.' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', meaning: 'İyiliği ve ihsanı bol.', question: 'Sen bugün kime karşılıksız bir iyilik yaptın?' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Tövbeleri kabul eden.', question: 'Hata yaptığında geri dönmek için geç olmadığını biliyor musun?' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaning: 'Suçluları cezalandıran.', question: 'Sana yapılan haksızlıkların hesabını O’na havale edebilir misin?' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Çokça affeden.', question: 'O seni affederken sen kendini neden affetmiyorsun?' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Çok şefkatli.', question: 'Kalbindeki katılığı O’nun şefkatiyle yumuşatmak ister misin?' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', meaning: 'Mülkün gerçek sahibi.', question: 'Hiçbir şeyin sana ait olmadığını anladığında ne hissediyorsun?' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', meaning: 'Büyüklük ve ikram sahibi.', question: 'O’nun büyüklüğü karşısında boyun eğmenin yüceliğini tadabildin mi?' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Adaleti sağlayan.', question: 'Haksızlığa uğradığında adaletin er ya da geç tecelli edeceğine inanıyor musun?' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', meaning: 'Zıtları birleştiren, toplayan.', question: 'Dağınık zihnini ve kalbini O’nun zikriyle toplamak ister misin?' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', meaning: 'Çok zengin, muhtaç olmayan.', question: 'Gerçek zenginliğin gönül tokluğu olduğunu fark ettin mi?' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'İstediğini zengin kılan.', question: 'Maddi zenginlikten öte manevi zenginliği talep ediyor musun?' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni`', meaning: 'Engel olan, koruyan.', question: 'Olmuyorsa, seni bir şerden koruduğu için olabilir mi?' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Elem ve zarar verici şeyleri yaratan.', question: 'Başına gelen sıkıntının seni olgunlaştıran bir ders olduğunu görebiliyor musun?' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi`', meaning: 'Fayda veren şeyler yaratan.', question: 'İnsanlara faydalı olmak için bugün ne yaptın?' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Alemleri aydınlatan.', question: 'Hayatının hangi karanlık noktasına ışık tutmalısın?' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Doğru yolu gösteren.', question: 'Hangi konuda bir işarete, bir rehbere ihtiyacın var?' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî`', meaning: 'Eşsiz yaratan.', question: 'Kendi parmak izindeki eşsizliği düşünüp O’nu andın mı?' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Varlığı sonsuz olan.', question: 'Geçici hevesler yerine Baki olana gönül verdin mi?' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Her şeyin asıl sahibi.', question: 'Dünyadan giderken götürebileceğin tek şeyin amellerin olduğunu hatırlıyor musun?' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Doğru yola ileten.', question: 'Kararsız kaldığında O’ndan bir çıkış yolu istiyor musun?' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Çok sabırlı.', question: 'Sabrın sonundaki selameti bekliyor musun?' }
];

// ==========================================
// 3. YARDIMCI FONKSİYON: KARIŞTIRMA (SHUFFLE)
// ==========================================
const shuffleArray = (array) => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ==========================================
// 4. UYGULAMA MANTIĞI (APP COMPONENT)
// ==========================================
function App() {
  const [viewState, setViewState] = useState('intro');
  const [contentFading, setContentFading] = useState(false);
  const [stars, setStars] = useState([]);
  
  // Karıştırılmış Deste State'leri
  const [shuffledDeck, setShuffledDeck] = useState([]); 
  const [deckIndex, setDeckIndex] = useState(0); 
  const [currentEsma, setCurrentEsma] = useState(null); 

  useEffect(() => {
    // 1. PARTİKÜLLER (Yıldız sayısını biraz azalttık ve boyutlarını küçülttük CSS'te)
    const starCount = 150; 
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      const isSparkle = Math.random() > 0.92; 
      newStars.push({
        id: i,
        type: isSparkle ? 'sparkle' : 'small',
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`, 
          animationDuration: isSparkle ? `${Math.random() * 3 + 2}s` : `${Math.random() * 3 + 3}s`,
        }
      });
    }
    setStars(newStars);
    
    // 2. DESTEYİ KARIŞTIR
    const mixed = shuffleArray([...esmaData]);
    setShuffledDeck(mixed);
    setDeckIndex(0);
    setCurrentEsma(mixed[0]);

  }, []);

  const handleStart = () => {
    setViewState('warping');
    setTimeout(() => {
      setViewState('card');
    }, 1200);
  };

  const handleNextEsma = () => {
    setContentFading(true);
    setTimeout(() => {
      let nextIndex = deckIndex + 1;
      if (nextIndex >= shuffledDeck.length) {
        const reshuffled = shuffleArray([...esmaData]);
        setShuffledDeck(reshuffled);
        nextIndex = 0;
      }
      setDeckIndex(nextIndex);
      setCurrentEsma(shuffledDeck[nextIndex]);
      setContentFading(false);
    }, 500);
  };

  if (!currentEsma) return null;

  return (
    <>
      <style>{styles}</style>

      {/* --- AYDINLIK ARKA PLAN --- */}
      <div className={`heavenly-background ${viewState === 'warping' ? 'warping' : ''}`}>
        <div className="nebula"></div>
        
        {/* YILDIZLAR (Artık yazının arkasındaki vinyetin altında kalacaklar) */}
        <div className="star-field">
          {stars.map((star) => (
            <div
              key={star.id}
              className={star.type === 'sparkle' ? 'star-sparkle' : 'star-small'}
              style={star.style}
            ></div>
          ))}
        </div>
      </div>

      {/* --- GİRİŞ EKRANI (Vinyet Efektli) --- */}
      {viewState !== 'card' && (
        <div className="intro-container" style={{ opacity: viewState === 'warping' ? 0 : 1 }}>
          <div className="text-center px-4 relative z-10 extreme-zoom-in">
            {/* Başlık Parlaması daha netleştirildi */}
            <h1 className="text-7xl md:text-9xl mb-6 font-bold title-glow title-font tracking-tighter">
              Hüsn-ü Hal
            </h1>
            <p className="text-xl md:text-3xl subtitle-light tracking-[0.5em] uppercase mb-12 title-font">
              Esma-ül Hüsna
            </p>
            <button onClick={handleStart} className="start-btn title-font tracking-widest uppercase">
              Bismillah
            </button>
          </div>
        </div>
      )}

      {/* --- KART EKRANI --- */}
      {viewState === 'card' && (
        <div className="content-container">
          <div className="crystal-card card-explosion">
            <div className={`fade-wrapper ${contentFading ? 'fade-out' : 'fade-in'}`}>
              
              <div className="mb-6">
                <h2 className="text-8xl md:text-9xl arabic-font gold-mist-text mb-4 drop-shadow-xl">
                  {currentEsma.arabic}
                </h2>
                <h3 className="text-3xl transliteration-mist title-font font-light tracking-[0.2em] opacity-90">
                  {currentEsma.transliteration}
                </h3>
              </div>

              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8 opacity-60"></div>

              <div className="mb-10">
                <p className="text-2xl meaning-mist font-light body-font leading-relaxed mb-8">
                  {currentEsma.meaning}
                </p>
                <div className="question-box">
                  <p className="text-xl question-text body-font">
                    "{currentEsma.question}"
                  </p>
                </div>
              </div>

              <button onClick={handleNextEsma} className="action-btn">
                Tefekküre Devam Et
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;