import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (ARTIRILMIŞ IŞIK VE EFEKTLER)
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
    /* Daha derin ve mistik bir geçiş */
    background: radial-gradient(circle at center bottom, #1e293b 0%, #0f172a 40%, #020617 100%);
    z-index: 0;
    overflow: hidden;
    perspective: 1000px;
  }

  /* --- YENİ: İLAHİ IŞIK HUZMELERİ (Dönen Işıklar) --- */
  .light-beams {
    position: absolute; top: 50%; left: 50%;
    width: 200vw; height: 200vw;
    transform: translate(-50%, -50%);
    background: repeating-conic-gradient(
      from 0deg,
      rgba(255, 255, 255, 0.03) 0deg,
      rgba(255, 255, 255, 0) 15deg,
      rgba(255, 255, 255, 0.03) 30deg
    );
    animation: rotate-beams 60s linear infinite;
    z-index: 1;
    pointer-events: none;
    mask-image: radial-gradient(circle, black 0%, transparent 70%);
  }
  @keyframes rotate-beams { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

  /* --- YENİ: ORTAM PARLAMASI (Ambient Glow) --- */
  .ambient-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
    filter: blur(80px);
    animation: pulse-glow 8s infinite ease-in-out;
    z-index: 1;
  }
  @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); } }

  /* Işık Bulutları (Nebula) */
  .nebula {
    position: absolute; width: 100%; height: 100%;
    background: 
      radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
      radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%);
    filter: blur(60px);
    z-index: 2;
  }

  /* --- PARÇACIK SİSTEMİ --- */
  .star-field { position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; z-index: 3; }

  .star-small {
    position: absolute; background: #fff;
    border-radius: 50%; width: 2px; height: 2px;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    animation: twinkle 4s infinite ease-in-out;
  }
  
  /* Daha parlak büyük yıldızlar */
  .star-sparkle {
    position: absolute; background: #fffbeb;
    width: 3px; height: 3px; border-radius: 50%;
    animation: float-sparkle 6s infinite ease-in-out;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
  }
  .star-sparkle::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 20px; height: 1px; background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .star-sparkle::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 20px; height: 1px; background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
  @keyframes float-sparkle { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; } 50% { transform: translateY(-20px) scale(1.3); opacity: 1; } }

  /* --- GEÇİŞ EFEKTLERİ --- */
  .warping .star-small, .warping .star-sparkle {
    transition: transform 1.5s ease-in;
    transform: scale(0) translateZ(-1000px) !important; opacity: 0; 
  }

  /* --- GİRİŞ EKRANI --- */
  .intro-container {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;
    transition: opacity 1.2s ease-in-out;
  }
  
  /* Giriş yazısı arkasına vinyet */
  .intro-container::before {
    content: ''; position: absolute; inset: -50%;
    background: radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, transparent 60%);
    z-index: -1;
  }

  /* Yazı Animasyonu */
  .extreme-zoom-in {
    animation: extreme-zoom 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; 
    opacity: 0; transform-origin: center center;
    text-align: center;
  }
  @keyframes extreme-zoom {
    0% { opacity: 0; transform: scale(0.8) translateZ(-500px); letter-spacing: -10px; filter: blur(15px); }
    100% { opacity: 1; transform: scale(1) translateZ(0); letter-spacing: normal; filter: blur(0); }
  }
  
  /* Başlık Parlaması - Daha güçlü */
  .title-glow {
    color: #ffffff; 
    text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(14, 165, 233, 0.5), 0 0 80px rgba(14, 165, 233, 0.3);
  }
  .subtitle-light {
    color: #bae6fd; letter-spacing: 0.6em; 
    text-shadow: 0 0 15px rgba(186, 230, 253, 0.5); font-weight: 600;
  }

  .start-btn {
    padding: 1.2rem 4rem; font-size: 1.3rem; 
    color: #020617; background: #fff; 
    border: none; border-radius: 999px; cursor: pointer; margin-top: 3.5rem;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
    transition: all 0.4s ease; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;
    position: relative; overflow: hidden;
  }
  .start-btn:hover {
    transform: scale(1.05); box-shadow: 0 0 60px rgba(255, 255, 255, 0.8);
  }
  .start-btn::after {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.8), transparent);
    transform: rotate(45deg) translate(-100%, -100%);
    animation: shimmer 3s infinite;
  }
  @keyframes shimmer { 100% { transform: rotate(45deg) translate(100%, 100%); } }

  /* --- KART GÖRÜNÜMÜ --- */
  .content-container {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1200px;
  }
  .card-explosion { animation: card-appear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes card-appear {
    from { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }

  .crystal-card {
    width: 90%; max-width: 600px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255, 0.1) inset, 0 0 40px rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    border-radius: 40px; padding: 3rem 2rem;
    text-align: center; position: relative;
    overflow: hidden;
  }
  /* Kart içi parlama */
  .crystal-card::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 10%, #fbbf24 50%, #d97706 90%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.5));
  }
  .transliteration-mist { 
    color: #e0f2fe; font-weight: 300; text-shadow: 0 0 15px rgba(224, 242, 254, 0.5); 
  }
  .meaning-mist { 
    color: #ffffff; font-weight: 500; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .question-box {
    background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem; padding: 1.5rem; 
  }
  .question-text { 
    color: #bae6fd; font-style: italic; text-shadow: 0 0 8px rgba(186, 230, 253, 0.3);
  }

  .action-btn {
    border: 1px solid #fbbf24; color: #fbbf24; background: rgba(0,0,0,0.3);
    padding: 1rem 3rem; border-radius: 999px; margin-top: 2rem;
    text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.9rem; font-weight: 700;
    transition: all 0.3s; box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
    cursor: pointer; position: relative; z-index: 10;
  }
  .action-btn:hover {
    background: #fbbf24; color: #0f172a; transform: scale(1.05); box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
  }
  
  .fade-wrapper { transition: all 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(0.95); filter: blur(10px); }
  .fade-in { opacity: 1; transform: scale(1); filter: blur(0); }
`;

// ==========================================
// 2. VERİ SETİ (GÜNCELLENMİŞ TEFEKKÜR SORULARI)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Kâinatın tek yaratıcısı.', question: 'Hayatımın merkezinde, kararlarımda ve niyetlerimde gerçekten O mu var, yoksa başka öncelikler mi?' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhamet sahibi.', question: 'O’nun sonsuz merhametinden payıma düşeni alıp, ben de yaratılanlara karşılıksız merhamet edebiliyor muyum?' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Ahirette müminlere merhamet eden.', question: 'Ahirette O\'nun özel sevgisine layık olabilmek için dünyada O\'nu memnun edecek neler yapıyorum?' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Mülkün sahibi.', question: 'Sahip olduğumu sandığım şeylerin (ev, araba, beden) gerçek sahibinin O olduğunu hatırlayıp emanetçi gibi yaşıyor muyum?' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Eksiklikten uzak.', question: 'O her türlü eksikten uzakken, ben ruhumu ve düşüncelerimi kirleten şeylerden arındırmak için çaba gösteriyor muyum?' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik veren.', question: 'Girdiğim ortamlara huzur ve güven veren bir insan mıyım, yoksa varlığım başkalarını tedirgin mi ediyor?' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Güven veren.', question: 'İnsanlar bana baktığında "bundan zarar gelmez" diyerek bana güvenebiliyor mu?' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Gözetip koruyan.', question: 'Kimsenin görmediği yerlerde bile O’nun beni gözetlediğini bilerek aynı edeple davranabiliyor muyum?' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'Üstün ve şerefli.', question: 'İzzet ve şerefi makamda, parada mı arıyorum, yoksa O’na itaat ederek aziz olmaya mı çalışıyorum?' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yapan.', question: 'Kırılan gönülleri onarmaya, eksikleri tamamlamaya gayret ediyor muyum, yoksa insanları kırıp döküyor muyum?' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklük sahibi.', question: 'Gerçek büyüklük O\'na aitken, ben kime karşı kibirleniyor ve kimi hor görüyorum?' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Yaratan.', question: 'O beni en güzel şekilde yaratmışken, ben bedenime ve ruhuma zarar verecek alışkanlıkları terk edebiliyor muyum?' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Kusursuz yaratan.', question: 'Hayatımda, odamda, işimde O’nun kâinattaki düzenine uygun bir ahenk ve intizam var mı?' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Şekil veren.', question: 'O bana en güzel şekli vermiş; ben ahlakımı ve karakterimi güzelleştirmek için ne kadar emek veriyorum?' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Günahları örten.', question: 'O benim sayısız günahımı örterken, ben başkalarının hatalarını yüzlerine mi vuruyorum, yoksa örtüyor muyum?' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Her şeye galip gelen.', question: 'İçimdeki kötü arzuları, tembelliği ve nefsani istekleri yenebilecek iradeyi gösteriyor muyum?' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız veren.', question: 'O bana karşılıksız onca nimet vermişken, ben insanlara bir şey verirken karşılık veya teşekkür bekliyor muyum?' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Rızık veren.', question: 'Rızık endişesiyle O\'nun yasakladığı yollara sapıyor muyum, yoksa "Rızkı veren O\'dur" deyip güveniyor muyum?' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Kapıları açan.', question: 'Çevremdeki insanların sıkıntılarını gidermek, onlara hayır kapısı olmak için bir çilingir gibi çalışıyor muyum?' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'Her şeyi bilen.', question: 'O her şeyi biliyorken, ben "kimse görmüyor" zannıyla gizli günahlar işlemekten haya ediyor muyum?' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', meaning: 'Sıkan, daraltan.', question: 'Ruhum daraldığında veya maddi sıkıntı çektiğimde bunun bir imtihan olduğunu bilip sabırla O\'na yöneliyor muyum?' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Genişleten.', question: 'Mutlu ve huzurlu anlarımda şımarıyor muyum, yoksa bu genişliği şükrederek ve paylaşarak mı değerlendiriyorum?' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Alçaltan.', question: 'Başkalarını küçümseyerek kendimi yükseltmeye çalışıyor muyum? (Böyle yaparak O\'nun katında alçalacağımı biliyor muyum?)' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi`', meaning: 'Yükselten.', question: 'Başkalarının iyiliği için tevazu gösterip O\'nun katında yükselmeyi hedefliyor muyum?' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'İzzet veren.', question: 'Beni neyin "değerli" kıldığına inanıyorum; dünya malı mı, yoksa iman ve güzel ahlak mı?' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Zelil eden.', question: 'Nefsimin kölesi olarak kendi kendimi zelil duruma düşürüyor muyum?' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî`', meaning: 'Her şeyi işiten.', question: 'Ağzımdan çıkan her sözü, hatta içimden geçirdiğim fısıltıları O\'nun işittiğinin farkında mıyım?' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören.', question: 'O\'nun bana verdiği göz nimetini, O\'nun bakmamı yasakladığı haramlardan sakınıyor muyum?' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Hüküm veren.', question: 'İnsanlar arasında veya kendi içimde karar verirken O\'nun koyduğu ölçülere mi, yoksa menfaatime mi uyuyorum?' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', meaning: 'Adaletli.', question: 'Kendime, aileme ve astlarıma karşı ne kadar adaletliyim; sevmediğim birine bile adil davranabiliyor muyum?' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'Lütuf sahibi.', question: 'O bana karşı bu kadar lütufkârken, ben insanlara karşı nazik, ince düşünceli ve zarif olabiliyor muyum?' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Haberdar olan.', question: 'Dışım insanları, içim ise Allah\'ı hoşnut edecek durumda mı; yoksa ikiyüzlü bir hayat mı yaşıyorum?' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Yumuşak huylu.', question: 'Bana yapılan hatalar karşısında hemen parlıyor muyum, yoksa O\'nun gibi yumuşaklıkla ve sabırla mı karşılık veriyorum?' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Pek yüce.', question: 'Gözümde büyüttüğüm dünya dertleri, O\'nun azameti yanında ne kadar küçük kalır, bunu idrak edebiliyor muyum?' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Bağışlayıcı.', question: 'Sürekli günah işleyip "nasılsa affeder" diyerek O\'nun affını suistimal mi ediyorum?' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Şükre karşılık veren.', question: 'Bana yapılan küçücük bir iyiliğe bile teşekkür ederken, O\'nun sonsuz nimetlerine hakkıyla şükrediyor muyum?' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yüce.', question: 'Hedeflerim ve hayallerim sadece dünya çöplüğü mü, yoksa ulvi ve yüksek gayeler peşinde miyim?' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Büyük.', question: 'Kibrim, gururum veya egom, O\'nun büyüklüğü karşısında eriyip yok oluyor mu?' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Koruyan.', question: 'İmanımı, gözümü, dilimi ve iffetimi haramlardan korumak için O\'na sığınıp tedbir alıyor muyum?' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Gıdalandıran.', question: 'Bedenimi helal gıdayla beslediğim gibi, ruhumu da ibadet ve ilimle besliyor muyum?' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesap gören.', question: 'Her günün sonunda "Bugün Allah için ne yaptım?" diye kendi nefsimi hesaba çekiyor muyum?' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Celal sahibi.', question: 'O\'nun ismini andığımda veya ayetlerini duyduğumda kalbimde bir ürperti ve saygı oluşuyor mu?' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Cömert.', question: 'O bana cömertçe verirken, ben elimdekileri paylaşmaktan korkuyor muyum?' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Gözetleyen.', question: 'Her an kayıt altında olduğumu bilseydim, şu an yaptıklarımı yapmaya devam eder miydim?' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Cevap veren.', question: 'Dualarımın kabul olmadığı zamanlarda küsüyor muyum, yoksa "Hakkımda hayırlısı budur" diyebiliyor muyum?' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi`', meaning: 'Geniş.', question: 'Kalbim, insanların hatalarını tolere edebilecek kadar geniş mi, yoksa dar ve tahammülsüz müyüm?' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Hikmet sahibi.', question: 'Başıma gelen olumsuzluklarda "Keşke" demek yerine, "Bunda da bir hikmet vardır" diyebiliyor muyum?' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Seven.', question: 'Allah’ı her şeyden çok seviyor muyum ve O\'nun sevdiklerini (müminleri) sadece O\'nun rızası için seviyor muyum?' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Şanı yüce.', question: 'Övgüye layık işler yapmaya çalışıyor muyum, yoksa sadece insanların alkışını mı bekliyorum?' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Dirilten.', question: 'Her sabah uyanırken bana yeni bir gün (hayat) bahşeden Rabbime, bugün yeniden doğmuş gibi şükrediyor muyum?' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Şahit.', question: 'Yalnız kaldığımda, O\'nun şahitliğinden utanıp yapmaktan vazgeçtiğim bir günahım var mı?' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', meaning: 'Gerçek.', question: 'Doğruyu söylemek aleyhime olsa bile Hakk\'ı savunabiliyor muyum?' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'Vekil.', question: 'Elimden gelen tüm gayreti gösterdikten sonra endişeyi bırakıp O\'na tam anlamıyla güvenebiliyor muyum?' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', meaning: 'Güçlü.', question: 'Bana verilen gücü ve enerjiyi nerede harcıyorum; hayır yolunda mı, boş işlerde mi?' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Sarsılmaz.', question: 'Zorluklar ve inancıma yapılan saldırılar karşısında ne kadar sağlam durabiliyorum?' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', meaning: 'Dost.', question: 'Dost seçerken kriterim ne; dünya menfaati mi, yoksa Allah\'a yakınlık mı?' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Övgüye layık.', question: 'Hayatımda işler ters gittiğinde de "Elhamdülillah" diyebilecek teslimiyete sahip miyim?' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Sayan.', question: 'Ömrümden giden sayılı nefeslerin farkında mıyım, yoksa hiç ölmeyecekmiş gibi mi yaşıyorum?' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Başlatan.', question: 'Hayatımda iyiye, güzele ve hayra dair yeni başlangıçlar yapma cesaretim var mı?' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Geri döndüren.', question: 'Ahirette diriltileceğimi bildiğim halde, neden sanki hesap yokmuş gibi rahatım?' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Hayat veren.', question: 'Ölü kalpleri imanla dirilten O ise, ben sözlerimle başkalarının ümidini mi kırıyorum, yoksa onları hayata mı bağlıyorum?' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Öldüren.', question: 'Ölümü bir yok oluş değil, Sevgili\'ye kavuşma anı olarak görebilecek bir hazırlığım var mı?' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', meaning: 'Diri.', question: 'Kalbim Allah sevgisiyle diri mi, yoksa gaflet içinde ölü gibi mi dolaşıyorum?' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Ayakta tutan.', question: 'Kendi başıma ayakta durduğumu sanıp gaflete mi düşüyorum, yoksa her an O\'nun kudretiyle var olduğumu biliyor muyum?' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Bulan.', question: 'Aradığım huzuru ve mutluluğu maddede mi, yoksa O\'nu bulmakta mı arıyorum?' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şanlı.', question: 'Şeref ve haysiyetimi koruyacak, O\'nun şanına yaraşır bir kul olmaya gayret ediyor muyum?' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Bir.', question: 'Kalbimde O\'ndan başka "olmazsa olmaz" dediğim putlaştırdığım sevgiler var mı?' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', meaning: 'Muhtaç olunan.', question: 'Dertlendiğimde ilk kime koşuyorum; insanlara mı, yoksa kimseye muhtaç olmayan Samed\'e mi?' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Kudretli.', question: 'O her şeye kadirken, neden geleceğimden bu kadar korkuyorum?' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'İktidar sahibi.', question: 'Gücümün yettiği her şeyi yapmaya hakkım olmadığını, O\'nun sınırlarına uymam gerektiğini biliyor muyum?' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'Öne alan.', question: 'Hayatımda neyi öne alıyorum; namazı ve ahireti mi, yoksa dünyalık işleri mi?' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'Erteleyen.', question: 'Nefsimin acele istediği ama günah olan arzuları erteleyebiliyor muyum?' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', meaning: 'İlk.', question: 'Her işe "Bismillah" diyerek O\'nun adıyla başlıyor muyum?' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', meaning: 'Son.', question: 'Son nefesimde dilimde O\'nun adının olması için bugün dilimi ne ile meşgul ediyorum?' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Aşikar.', question: 'Kâinata baktığımda her eserde O\'nun imzasını ve gücünü görebiliyor muyum?' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Gizli.', question: 'İç dünyamda, kimsenin bilmediği o yerde O\'nunla aram nasıl?' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', meaning: 'Yöneten.', question: 'Kendi küçük dünyamı (bedenimi, evimi) O\'nun istediği gibi yönetebiliyor muyum?' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Yüce.', question: 'Düşüncelerimi basit dedikodulardan ve dünya hırslarından arındırıp yüceltebiliyor muyum?' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', meaning: 'İyilik sahibi.', question: 'İyilik yaparken insanların takdirini mi bekliyorum, yoksa sadece O\'nun bilmesi yeterli mi?' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Tövbeleri kabul eden.', question: 'Hata yaptığında hemen tövbe kapısına koşuyor muyum, yoksa günahı erteliyor muyum?' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaning: 'İntikam alan.', question: 'Bana yapılan haksızlıklarda intikam peşine mi düşüyorum, yoksa adaleti O\'na mı havale ediyorum?' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Affeden.', question: 'O\'nun beni affetmesini istediğim şiddette, ben de beni kıranları affedebiliyor muyum?' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Şefkatli.', question: 'Kalbimde insanlara, hayvanlara ve tabiata karşı bir şefkat ve merhamet taşıyor muyum?' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', meaning: 'Mülkün sahibi.', question: 'Elimdekilerin benim değil, O\'nun olduğunu bilerek cömertçe paylaşabiliyor muyum?' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', meaning: 'Celal ve ikram sahibi.', question: 'O\'na kulluk ederken hem saygı (celal) hem de sevgi/ümit (ikram) dengesini koruyabiliyor muyum?' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Adil.', question: 'Kendi menfaatim zedelense bile adaleti ayakta tutabiliyor muyum?' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', meaning: 'Toplayan.', question: 'İnsanları ayrıştıran, ötekileştiren miyim; yoksa birleştiren, gönülleri toplayan mıyım?' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', meaning: 'Zengin.', question: 'Gözüm doymuyor mu, yoksa O\'nun verdikleriyle gönül zenginliğini yakalayabildim mi?' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'Zengin eden.', question: 'İnsanların ihtiyaçlarını gidermelerine vesile olarak onları manen veya madden zenginleştiriyor muyum?' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni`', meaning: 'Engel olan.', question: 'Günah işleme fırsatı elime geçtiğinde, O\'nun korkusu buna engel oluyor mu?' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Elem veren.', question: 'Başına gelen zarar ve musibetlerin, beni O\'na yaklaştıran birer uyarı olduğunu görebiliyor musun?' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi`', meaning: 'Fayda veren.', question: 'Varlığım çevreme, insanlığa ve aileme bir fayda sağlıyor mu?' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Nur.', question: 'Bilgimle, ahlakımla ve duruşumla çevreme ışık saçan, yol gösteren biri miyim?' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Hidayet veren.', question: 'İnsanların hidayetine vesile olacak kadar güzel bir Müslümanlık yaşıyor muyum?' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî`', meaning: 'Eşsiz yaratan.', question: 'Yaptığım işi baştan savma mı yapıyorum, yoksa O\'nun sanatkarlığına yakışır bir estetikle mi?' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Baki olan.', question: 'Geçici dünya hevesleri için ebedi ahiret hayatımı riske atıyor muyum?' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Mirasçı.', question: 'Ben öldükten sonra arkamdan hayırla anılacak, insanlara faydalı ne bırakıyorum?' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Doğru yolu gösteren.', question: 'Kararsız kaldığımda O\'nun kitabına ve Resulü\'nün sünnetine danışarak mı yolumu buluyorum?' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Çok sabırlı.', question: 'O benim günahlarıma bunca zaman sabrederken, ben başkalarının küçük hatalarına neden tahammül edemiyorum?' }
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
    // 1. PARTİKÜLLER
    const starCount = 180; // Yıldız sayısını biraz artırdık
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      const isSparkle = Math.random() > 0.94; 
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
    
    // 2. DESTEYİ KARIŞTIR (Her yüklemede tamamen rastgele sıra)
    const mixed = shuffleArray([...esmaData]);
    setShuffledDeck(mixed);
    setDeckIndex(0);
    // İlk kartı rastgele listenin en başından al
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
      
      // Liste biterse yeniden karıştır
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

      {/* --- ARKA PLAN VE IŞIK EFEKTLERİ --- */}
      <div className={`heavenly-background ${viewState === 'warping' ? 'warping' : ''}`}>
        <div className="light-beams"></div> {/* Dönen ışık huzmeleri */}
        <div className="ambient-glow"></div> {/* Ortam parlaması */}
        <div className="nebula"></div>
        
        {/* YILDIZLAR */}
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

      {/* --- GİRİŞ EKRANI --- */}
      {viewState !== 'card' && (
        <div className="intro-container" style={{ opacity: viewState === 'warping' ? 0 : 1 }}>
          <div className="text-center px-4 relative z-10 extreme-zoom-in">
            <h1 className="text-7xl md:text-9xl mb-6 font-bold title-glow title-font tracking-tighter">
              Hüsn-ü Hal
            </h1>
            <p className="text-xl md:text-3xl subtitle-light tracking-[0.5em] uppercase mb-12 title-font">
              Esma-ül Hüsna
            </p>
            <button onClick={handleStart} className="start-btn title-font">
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

              <button onClick={handleNextEsma} className="action-btn body-font">
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