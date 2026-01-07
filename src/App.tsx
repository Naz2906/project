import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (GÖK YÜZÜ & NUR KONSEPTİ)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.1; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }

  /* --- SAYFA YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN (DERİN GÖKYÜZÜ) --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    /* Derin maviden, turkuaza ve altın sarısı ufuk çizgisine geçiş */
    background: linear-gradient(160deg, #0c4a6e 0%, #0284c7 40%, #38bdf8 70%, #fef3c7 100%);
    z-index: 0;
    overflow: hidden;
    perspective: 1000px;
  }

  /* Işık Bulutları (Daha belirgin) */
  .nebula {
    position: absolute; width: 100%; height: 100%;
    background: 
      radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%), /* Üstten inen nur */
      radial-gradient(circle at 10% 80%, rgba(253, 224, 71, 0.3) 0%, transparent 40%); /* Alttan vuran altın ışık */
    filter: blur(60px);
    animation: light-move 20s infinite alternate ease-in-out;
  }
  @keyframes light-move { from { transform: scale(1); opacity: 0.7; } to { transform: scale(1.1); opacity: 0.9; } }

  /* --- PARÇACIK SİSTEMİ (Altın Tozları) --- */
  .star-field { position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; }

  /* Küçük Tozlar */
  .star-small {
    position: absolute; 
    background: #fff; /* Gökyüzünde beyaz daha iyi görünür */
    border-radius: 50%; width: 3px; height: 3px;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
    animation: dust-float infinite alternate ease-in-out;
  }

  /* Büyük Parıltılar */
  .star-sparkle {
    position: absolute; 
    background: #fbbf24; /* Altın */
    width: 5px; height: 5px; border-radius: 50%;
    animation: gold-pulse infinite alternate ease-in-out;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
  }

  /* Haç Şekli Işıltı */
  .star-sparkle::before, .star-sparkle::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.9), transparent);
    width: 30px; height: 1px; transform: translate(-50%, -50%);
  }
  .star-sparkle::after { transform: translate(-50%, -50%) rotate(90deg); }

  /* --- ANİMASYONLAR --- */
  @keyframes dust-float {
    0% { opacity: 0.3; transform: translateY(0) scale(0.8); }
    100% { opacity: 0.9; transform: translateY(-30px) scale(1.2); }
  }

  @keyframes gold-pulse {
    0% { opacity: 0.5; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1.3); }
  }

  /* --- IŞIK HUZMELERİ --- */
  .shooting-star-layer { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
  .shooting-star {
    position: absolute; width: 400px; height: 1px;
    /* Beyazdan şeffafa */
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), transparent);
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)); 
    opacity: 0;
    transform: rotate(-45deg); 
    animation: light-beam 6s infinite ease-out;
  }
  @keyframes light-beam {
    0% { opacity: 0; transform: rotate(-45deg) translateX(0) scale(0.8); }
    20% { opacity: 0.5; }
    40% { opacity: 0; transform: rotate(-45deg) translateX(-1000px) scale(1.1); }
    100% { opacity: 0; }
  }

  /* --- GEÇİŞ EFEKTLERİ --- */
  .warping .star-small, .warping .star-sparkle {
    transition: transform 1.5s ease-in, opacity 1.5s ease-in;
    transform: scale(0) translateZ(-2000px) !important;
    opacity: 0;
  }

  .light-flash {
    position: absolute; inset: 0; 
    background: #fff;
    opacity: 0; pointer-events: none; z-index: 100;
    transition: opacity 0.8s ease-out;
  }
  .flash-active { opacity: 1; }

  /* --- GİRİŞ EKRANI (INTRO) --- */
  .intro-container {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;
  }
  
  .extreme-zoom-in {
    animation: extreme-zoom 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; 
    opacity: 0; transform-origin: center center;
  }
  @keyframes extreme-zoom {
    0% { opacity: 0; transform: scale(0) translateZ(-5000px); letter-spacing: -50px; filter: blur(20px); }
    100% { opacity: 1; transform: scale(1) translateZ(0); letter-spacing: normal; filter: blur(0); }
  }
  
  /* Başlık */
  .title-glow {
    color: #ffffff;
    text-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(14, 165, 233, 0.4);
  }

  .subtitle-light {
    color: #bae6fd; /* Açık mavi */
    letter-spacing: 0.5em;
    text-shadow: 0 0 10px rgba(186, 230, 253, 0.5);
  }

  .start-btn {
    padding: 1.5rem 5rem; font-size: 1.5rem; 
    color: #0c4a6e; /* Koyu Mavi */
    background: rgba(255, 255, 255, 0.9); 
    border: none;
    border-radius: 50px; cursor: pointer; margin-top: 3rem;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    transition: all 0.3s;
    text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;
  }
  .start-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
    background: #fff;
  }

  /* --- KART GÖRÜNÜMÜ --- */
  .content-container {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1200px;
  }
  
  .card-explosion { animation: card-appear 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes card-appear {
    from { opacity: 0; transform: scale(0.3) rotateX(10deg) translateZ(-200px); }
    to { opacity: 1; transform: scale(1) rotateX(0) translateZ(0); }
  }

  .crystal-card {
    width: 90%; max-width: 600px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255,255,255, 0.2) inset,
      0 0 30px rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 40px; padding: 3rem 2rem;
    text-align: center; position: relative;
  }
  
  /* Arapça Yazı Stili */
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 0%, #fbbf24 50%, #d97706 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.3));
  }
  
  .transliteration-mist { 
    color: #e0f2fe; 
    font-weight: 300; 
    text-shadow: 0 0 10px rgba(224, 242, 254, 0.6); 
  }

  .meaning-mist { 
    color: #ffffff; 
    font-weight: 500; 
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .question-box {
    background: rgba(255, 255, 255, 0.1); 
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }
  
  .question-text { 
    color: #bae6fd; 
    font-style: italic; 
    text-shadow: 0 0 5px rgba(186, 230, 253, 0.4);
  }

  .action-btn {
    border: 1px solid #fbbf24;
    color: #fbbf24;
    background: rgba(0,0,0,0.2);
    padding: 1rem 2.5rem; border-radius: 999px;
    margin-top: 2rem;
    text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; font-weight: 600;
    transition: all 0.3s;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.1);
  }
  .action-btn:hover {
    background: #fbbf24;
    color: #0c4a6e;
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(251, 191, 36, 0.6);
  }
  
  .fade-wrapper { transition: all 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(1.1); filter: blur(10px); }
  .fade-in { opacity: 1; transform: scale(1); filter: blur(0); }
`;

// ==========================================
// 2. VERİ SETİ (99 İSİM - TAM LİSTE)
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
// 3. UYGULAMA MANTIĞI (APP COMPONENT)
// ==========================================
function App() {
  const [viewState, setViewState] = useState('intro'); // 'intro' | 'warping' | 'card'
  const [flash, setFlash] = useState(false); 
  const [currentEsma, setCurrentEsma] = useState(esmaData[0]);
  const [contentFading, setContentFading] = useState(false);
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // 1. ALTIN TOZLARI (Particles)
    const starCount = 200; 
    const newStars = [];
    
    for (let i = 0; i < starCount; i++) {
      const isSparkle = Math.random() > 0.90; // %10 parlak ışıltı
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

    // 2. SÜZÜLEN IŞIK HUZMELERİ
    const sStars = [];
    for(let i = 0; i < 5; i++) {
        sStars.push({
            id: i,
            style: {
                top: `${Math.random() * 60}%`, 
                left: `${Math.random() * 80}%`, 
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 2 + 5}s` 
            }
        });
    }
    setShootingStars(sStars);
    
    setCurrentEsma(esmaData[Math.floor(Math.random() * esmaData.length)]);
  }, []);

  const handleStart = () => {
    setViewState('warping');
    // 1.2 sn sonra flaş patlar
    setTimeout(() => setFlash(true), 1200);
    // 1.8 sn sonra kart gelir
    setTimeout(() => {
      setViewState('card');
      setTimeout(() => setFlash(false), 800); 
    }, 1800);
  };

  const handleNextEsma = () => {
    setContentFading(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * esmaData.length);
      setCurrentEsma(esmaData[randomIdx]);
      setContentFading(false);
    }, 500);
  };

  return (
    <>
      <style>{styles}</style>

      {/* --- AYDINLIK ARKA PLAN --- */}
      <div className={`heavenly-background ${viewState === 'warping' ? 'warping' : ''}`}>
        <div className="nebula"></div>
        
        {/* ALTIN TOZLARI */}
        <div className="star-field">
          {stars.map((star) => (
            <div
              key={star.id}
              className={star.type === 'sparkle' ? 'star-sparkle' : 'star-small'}
              style={star.style}
            ></div>
          ))}
        </div>

        {/* IŞIK HUZMELERİ KATMANI */}
        <div className="shooting-star-layer">
            {shootingStars.map(s => (
                <div key={s.id} className="shooting-star" style={s.style}></div>
            ))}
        </div>
      </div>

      {/* --- FLAŞ GEÇİŞİ --- */}
      <div className={`light-flash ${flash ? 'flash-active' : ''}`}></div>

      {/* --- GİRİŞ EKRANI --- */}
      {viewState !== 'card' && (
        <div className="intro-container" style={{ opacity: viewState === 'warping' ? 0 : 1, transition: 'opacity 1s' }}>
          <div className="text-center px-4 relative z-10 extreme-zoom-in">
            <h1 className="text-7xl md:text-9xl mb-6 font-bold title-glow title-font tracking-tighter">
              Hüsn-ü Hal
            </h1>
            <p className="text-xl md:text-3xl subtitle-light tracking-[0.5em] font-light uppercase mb-12 title-font">
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
              
              {/* Arapça İsim */}
              <div className="mb-6">
                <h2 className="text-8xl md:text-9xl arabic-font gold-mist-text mb-4 drop-shadow-xl">
                  {currentEsma.arabic}
                </h2>
                <h3 className="text-3xl transliteration-mist title-font font-light tracking-[0.2em] opacity-90">
                  {currentEsma.transliteration}
                </h3>
              </div>

              {/* Ayırıcı Çizgi */}
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8 opacity-60"></div>

              {/* Anlam ve Soru */}
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

              {/* Devam Butonu */}
              <button 
                onClick={handleNextEsma}
                className="action-btn"
              >
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