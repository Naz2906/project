import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS: AYDINLIK GÖK & KRİSTAL MAVİ TEMA
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;600;800&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  
  /* --- GENEL AYARLAR --- */
  body, html { margin: 0; padding: 0; background-color: #000; overflow: hidden; height: 100%; width: 100%; font-family: 'Inter', sans-serif; }

  /* --- AYDINLIK KOZMİK ARKA PLAN --- */
  .cosmos-container {
    position: fixed; inset: 0; width: 100%; height: 100%;
    /* Mavi-Mor-Siyah geçişli derin ama aydınlık zemin */
    background: radial-gradient(ellipse at bottom, #1e40af 0%, #0f172a 60%, #020617 100%);
    overflow: hidden; z-index: 0;
  }

  .nebula-bright {
    position: absolute; width: 100%; height: 100%;
    background: radial-gradient(circle at 30% 20%, rgba(125, 211, 252, 0.15) 0%, transparent 50%), 
                radial-gradient(circle at 70% 80%, rgba(192, 132, 252, 0.15) 0%, transparent 50%);
    filter: blur(100px); z-index: 1;
  }
  
  /* Durgun Yıldızlar */
  .stars-layer {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: transparent; z-index: 2;
    animation: zoom-slow 120s linear infinite;
  }
  @keyframes zoom-slow { 0% { transform: scale(1); } 100% { transform: scale(1.3); } }

  .star-static {
    position: absolute; background: #e0f2fe; border-radius: 50%;
    box-shadow: 0 0 4px rgba(224, 242, 254, 0.8), 0 0 8px rgba(125, 211, 252, 0.4);
    animation: twinkle var(--dur) ease-in-out infinite alternate;
  }
  @keyframes twinkle { 0% { opacity: 0.3; scale: 0.8; } 100% { opacity: 1; scale: 1.1; box-shadow: 0 0 6px #fff; } }

  /* Kayan Yıldızlar (Beyaz/Mavi) */
  .shooting-star {
    position: absolute; top: 50%; left: 50%; height: 2px; z-index: 3;
    background: linear-gradient(-45deg, #ffffff, rgba(125, 211, 252, 0));
    filter: drop-shadow(0 0 6px rgba(125, 211, 252, 0.8));
    border-radius: 999px; opacity: 0;
    transform: rotate(-45deg) translateX(0);
    animation: shoot 8s ease-in-out infinite;
    animation-delay: var(--delay);
    width: var(--len);
  }
  .shooting-star::before {
    content: ''; position: absolute; top: 50%; transform: translateY(-50%);
    right: 0; height: 4px; width: 4px; background: #fff; border-radius: 50%;
    box-shadow: 0 0 15px #fff, 0 0 30px #38bdf8;
  }
  @keyframes shoot {
    0% { opacity: 0; transform: rotate(-45deg) translateX(0) translateY(0); }
    10% { opacity: 1; }
    20% { opacity: 0; transform: rotate(-45deg) translateX(-1200px) translateY(1200px); }
    100% { opacity: 0; }
  }

  /* --- GİRİŞ EKRANI (INTRO) --- */
  .intro-overlay {
    position: absolute; inset: 0; z-index: 50;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: radial-gradient(circle, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%);
    transition: all 1.2s cubic-bezier(0.7, 0, 0.3, 1);
  }
  
  .intro-overlay.zoom-out {
    opacity: 0; transform: scale(2.5); filter: blur(30px); pointer-events: none;
  }

  .intro-title-wrapper { position: relative; margin-bottom: 3rem; text-align: center; }
  
  .intro-title {
    font-family: 'Cinzel', serif; font-size: 5rem; font-weight: 800; letter-spacing: 0.15em;
    background: linear-gradient(to right, #e0f2fe, #7dd3fc, #ffffff, #38bdf8, #e0f2fe);
    -webkit-background-clip: text; color: transparent;
    text-shadow: 0 0 60px rgba(56, 189, 248, 0.5);
    animation: shine 6s linear infinite; background-size: 200%;
  }
  @media (max-width: 768px) { .intro-title { font-size: 3rem; } }

  .intro-subtitle {
    font-family: 'Scheherazade New', serif; font-size: 2.5rem; color: #bae6fd;
    margin-top: -10px; opacity: 0.9; letter-spacing: 0.05em;
    text-shadow: 0 0 15px rgba(125, 211, 252, 0.4);
    animation: float 4s ease-in-out infinite;
  }
  @keyframes shine { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  .glow-btn {
    position: relative; padding: 1.2rem 4rem; font-size: 1.2rem;
    font-family: 'Cinzel', serif; letter-spacing: 0.2em; text-transform: uppercase; color: #e0f2fe;
    background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(125, 211, 252, 0.4);
    cursor: pointer; overflow: hidden; transition: 0.5s;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }
  .glow-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 200%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    transition: 0.7s; transform: skewX(-20deg);
  }
  .glow-btn:hover {
    background: rgba(56, 189, 248, 0.2); color: white;
    box-shadow: 0 0 40px rgba(56, 189, 248, 0.5), 0 0 80px rgba(56, 189, 248, 0.3);
    border-color: #7dd3fc; transform: scale(1.05); letter-spacing: 0.25em;
  }
  .glow-btn:hover::before { left: 100%; }

  /* --- KART ALANI --- */
  .main-content {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    z-index: 40; perspective: 1500px;
    opacity: 0; transform: translateY(50px) scale(0.9); pointer-events: none;
    transition: opacity 1.5s ease 0.5s, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s;
  }
  .main-content.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

  .glass-card {
    width: 90%; max-width: 500px; max-height: 85vh;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(125, 211, 252, 0.2);
    border-top: 1px solid rgba(125, 211, 252, 0.4);
    border-bottom: 1px solid rgba(125, 211, 252, 0.1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(56, 189, 248, 0.2);
    backdrop-filter: blur(35px); -webkit-backdrop-filter: blur(35px);
    border-radius: 30px; padding: 0;
    display: flex; flex-direction: column; overflow: hidden;
    animation: card-float 8s ease-in-out infinite;
  }
  @keyframes card-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

  .card-inner {
    padding: 2.5rem 2rem; overflow-y: auto; text-align: center;
    scrollbar-width: thin; scrollbar-color: rgba(56, 189, 248, 0.3) transparent;
  }
  
  .arabic-title {
    font-family: 'Scheherazade New', serif; font-size: 5.5rem; line-height: 1.1;
    background: linear-gradient(180deg, #ffffff 0%, #38bdf8 100%);
    -webkit-background-clip: text; color: transparent;
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.6));
    margin-bottom: 0.5rem; animation: pulse-blue 3s infinite alternate;
  }
  @keyframes pulse-blue { 0% { filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4)); } 100% { filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.8)); } }

  .reading-text {
    font-family: 'Cinzel', serif; font-size: 1.4rem; color: #bae6fd;
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  }

  .blue-divider {
    height: 1px; width: 80px; background: linear-gradient(90deg, transparent, #7dd3fc, transparent);
    margin: 0 auto 1.5rem auto; opacity: 0.7;
  }

  .meaning-text {
    font-family: 'Inter', sans-serif; font-weight: 300; font-size: 1.1rem; color: #e0f2fe; line-height: 1.7; margin-bottom: 2rem;
  }

  .box-tefekkur {
    background: rgba(14, 165, 233, 0.1); border-left: 3px solid #38bdf8;
    padding: 1.2rem; margin-bottom: 1.5rem; text-align: left; border-radius: 0 12px 12px 0;
    box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.05);
  }
  .box-tefekkur h4 { margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #7dd3fc; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
  .box-tefekkur p { margin: 0; font-style: italic; color: #bae6fd; font-size: 1rem; }

  .box-dua {
    position: relative; padding: 1.8rem 1.5rem 1.5rem 1.5rem; border-radius: 16px;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), transparent);
    border: 1px solid rgba(125, 211, 252, 0.2); margin-top: 1rem;
    box-shadow: 0 10px 30px -10px rgba(14, 165, 233, 0.3);
  }
  .dua-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: #0f172a; border: 1px solid #38bdf8; color: #38bdf8;
    padding: 4px 16px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }
  .box-dua p {
    font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.2rem; color: #e0f2fe; margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .next-btn {
    width: 100%; padding: 1.5rem; cursor: pointer;
    background: rgba(56, 189, 248, 0.05); border: none; border-top: 1px solid rgba(125, 211, 252, 0.2);
    color: #bae6fd; font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
    transition: all 0.4s ease;
  }
  .next-btn:hover { 
    background: rgba(56, 189, 248, 0.2); color: #fff; letter-spacing: 0.4em;
    box-shadow: 0 -10px 30px rgba(56, 189, 248, 0.2);
  }

  .fade-content { transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-out { opacity: 0; transform: translateY(15px) scale(0.97); filter: blur(8px); }
  .fade-in { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
`;
// ==========================================
// 2. TAM VERİ SETİ (SIRALI BİRLEŞTİRİLMİŞ)
// ==========================================
const esmaData = [
  { 
    id: 1, 
    arabic: 'اللَّهُ', 
    transliteration: 'Allah', 
    meaning: 'Kâinatın tek yaratıcısı, bütün kemâl sıfatları kendisinde toplayan en yüce isim.', 
    question: 'Kalbimde O’ndan daha büyük bir yer kaplayan bir şey var mı?', 
    dua: 'Rabbim, kalbimi sadece Sana kul olmanın huzuruyla doldur.' 
  },
  { 
    id: 2, 
    arabic: 'الرَّحْمنُ', 
    transliteration: 'er-Rahmân', 
    meaning: 'Dünyada inanan inanmayan ayırt etmeden herkese şefkat gösteren.', 
    question: 'Ben de yaratılanlara ayrım yapmadan merhamet ediyor muyum?', 
    dua: 'Ey Rahmân, çorak gönlüme rahmet yağmurları indir.' 
  },
  { 
    id: 3, 
    arabic: 'الرَّحِيمُ', 
    transliteration: 'er-Rahîm', 
    meaning: 'Ahirette sadece müminlere merhamet edecek olan.', 
    question: 'Ahirette O’nun özel sevgisine layık olabilmek için ne yapıyorum?', 
    dua: 'Ey Rahîm, beni cennetine layık eyle ve özel şefkatinle kuşat.' 
  },
  { 
    id: 4, 
    arabic: 'الْمَلِكُ', 
    transliteration: 'el-Melik', 
    meaning: 'Mülkün gerçek sahibi, her şeye hükmeden sultan.', 
    question: 'Sahip olduğumu sandığım şeyler aslında kime ait?', 
    dua: 'Ey Melik, beni fani dünyanın mülküne köle olmaktan kurtar.' 
  },
  { 
    id: 5, 
    arabic: 'الْقُدُّوسُ', 
    transliteration: 'el-Kuddûs', 
    meaning: 'Her türlü eksiklikten ve kusurdan münezzeh, tertemiz.', 
    question: 'Ruhumu ve düşüncelerimi kirleten şeylerden arınıyor muyum?', 
    dua: 'Ey Kuddûs, ruhumu günah kirlerinden arındır, beni tertemiz huzuruna al.' 
  },
  { 
    id: 6, 
    arabic: 'السَّلاَمُ', 
    transliteration: 'es-Selâm', 
    meaning: 'Esenlik kaynağı, kullarını selamete çıkaran.', 
    question: 'Girdiğim ortama huzur ve güven veriyor muyum?', 
    dua: 'Ey Selâm, kalbime esenlik ver, beni dünya ve ahiretin korkularından selamete çıkar.' 
  },
  { 
    id: 7, 
    arabic: 'الْمُؤْمِنُ', 
    transliteration: 'el-Mü’min', 
    meaning: 'Güven veren, vaadine sadık olan, inananları koruyan.', 
    question: 'Çevremdeki insanlar bana ne kadar güveniyor?', 
    dua: 'Ey Mü’min, kalbime sarsılmaz bir iman ver, beni vesveselerden emin kıl.' 
  },
  { 
    id: 8, 
    arabic: 'الْمُهَيْمِنُ', 
    transliteration: 'el-Müheymin', 
    meaning: 'Her şeyi görüp gözeten, koruyan ve kollayan.', 
    question: 'Her an izlendiğimin bilinciyle hareket ediyor muyum?', 
    dua: 'Ey Müheymin, beni her an gözetiminde tut, nefsimin şerrinden koru.' 
  },
  { 
    id: 9, 
    arabic: 'الْعَزِيزُ', 
    transliteration: 'el-Azîz', 
    meaning: 'İzzet sahibi, mağlup edilmesi imkânsız olan galip.', 
    question: 'İzzeti malda mülkte mi, yoksa Allah’a itaatte mi arıyorum?', 
    dua: 'Ey Azîz, beni İslâm’ın izzetiyle şereflendir, kimseye muhtaç ve zelil etme.' 
  },
  { 
    id: 10, 
    arabic: 'الْجَبَّارُ', 
    transliteration: 'el-Cebbâr', 
    meaning: 'Kırılanları onaran, dilediğini zorla da olsa yaptıran.', 
    question: 'Kırık kalpleri onarıyor muyum, yoksa kırıyor muyum?', 
    dua: 'Ey Cebbâr, kırık kalbimi onar, eksiklerimi tamamla.' 
  },
  { 
    id: 11, 
    arabic: 'الْمُتَكَبِّرُ', 
    transliteration: 'el-Mütekebbir', 
    meaning: 'Büyüklükte eşi olmayan, azamet sahibi.', 
    question: 'Kibirlenmek bana yakışır mı?', 
    dua: 'Ey Mütekebbir, büyüklüğün karşısında nefsimi küçült, beni kibirden uzak eyle.' 
  },
  { 
    id: 12, 
    arabic: 'الْخَالِقُ', 
    transliteration: 'el-Hâlık', 
    meaning: 'Her şeyi yoktan var eden yaratıcı.', 
    question: 'Yaratılış gayeme uygun yaşıyor muyum?', 
    dua: 'Ey Hâlık, beni yaratılış gayeme uygun, hayırlı bir kul eyle.' 
  },
  { 
    id: 13, 
    arabic: 'الْبَارِئُ', 
    transliteration: 'el-Bâri', 
    meaning: 'Her şeyi kusursuz ve uyumlu bir şekilde yaratan.', 
    question: 'Vücudumdaki ve evrendeki bu muazzam düzeni tefekkür ediyor muyum?', 
    dua: 'Ey Bâri, üzerimdeki sanatını idrak etmeyi nasip eyle.' 
  },
  { 
    id: 14, 
    arabic: 'الْمُصَوِّرُ', 
    transliteration: 'el-Musavvir', 
    meaning: 'Varlıklara en güzel şekli ve sureti veren.', 
    question: 'Allah’ın bana verdiği sureti ve yetenekleri nerede kullanıyorum?', 
    dua: 'Ey Musavvir, ahlakımı da suretim gibi güzel eyle.' 
  },
  { 
    id: 15, 
    arabic: 'الْغَفَّارُ', 
    transliteration: 'el-Gaffâr', 
    meaning: 'Günahları tekrar tekrar örten ve çokça bağışlayan.', 
    question: 'Başkalarının hatalarını yüzlerine mi vuruyorum, yoksa örtüyor muyum?', 
    dua: 'Ey Gaffâr, yüzüm karası günahlarımı setret, beni utandırma.' 
  },
  { 
    id: 16, 
    arabic: 'الْقَهَّارُ', 
    transliteration: 'el-Kahhâr', 
    meaning: 'Her şeye galip gelen, isyankarları kahreden.', 
    question: 'Nefsimin kötü arzularına karşı galip gelebiliyor muyum?', 
    dua: 'Ey Kahhâr, nefsimin kötü arzularını kahret, beni bana bırakma.' 
  },
  { 
    id: 17, 
    arabic: 'الْوَهَّابُ', 
    transliteration: 'el-Vehhâb', 
    meaning: 'Karşılıksız ve bolca nimet veren.', 
    question: 'Ben de karşılık beklemeden iyilik yapabiliyor muyum?', 
    dua: 'Ey Vehhâb, bana katından karşılıksız hayırlar ve rahmet lütfet.' 
  },
  { 
    id: 18, 
    arabic: 'الرَّزَّاقُ', 
    transliteration: 'er-Rezzâk', 
    meaning: 'Bütün canlıların rızkını veren.', 
    question: 'Rızkı verene mi, yoksa aracı olana mı minnet ediyorum?', 
    dua: 'Ey Rezzâk, bana helal ve bol rızık ver, kanaatkar eyle.' 
  },
  { 
    id: 19, 
    arabic: 'الْفَتَّاحُ', 
    transliteration: 'el-Fettâh', 
    meaning: 'Her türlü zorluğu açan, hayır kapılarını aralayan.', 
    question: 'İnsanların sorunlarını çözmelerine yardımcı oluyor muyum?', 
    dua: 'Ey Fettâh, kalbimi hayırlara aç, önümdeki engelleri kaldır.' 
  },
  { 
    id: 20, 
    arabic: 'الْعَلِيمُ', 
    transliteration: 'el-Alîm', 
    meaning: 'Gizli ve açık her şeyi en ince detayına kadar bilen.', 
    question: 'Kimse görmese de O’nun bildiğini bilerek yaşıyor muyum?', 
    dua: 'Ey Alîm, bana ilim ve hikmet ver, cahillikten koru.' 
  },
  { 
    id: 21, 
    arabic: 'الْقَابِضُ', 
    transliteration: 'el-Kâbıd', 
    meaning: 'Dilediğinin rızkını daraltan, ruhları kabzeden.', 
    question: 'Darlık zamanında sabredebiliyor muyum?', 
    dua: 'Ey Kâbıd, kalbimi dünyeviliklere karşı daralt, Sana karşı genişlet.' 
  },
  { 
    id: 22, 
    arabic: 'الْبَاسِطُ', 
    transliteration: 'el-Bâsıt', 
    meaning: 'Dilediğinin rızkını genişleten, ruhları ferahlatan.', 
    question: 'Bana verilen genişliği hayır yolunda kullanıyor muyum?', 
    dua: 'Ey Bâsıt, gönlüme inşirah ver, rızkımı ve ilmimi bereketlendir.' 
  },
  { 
    id: 23, 
    arabic: 'الْخَافِضُ', 
    transliteration: 'el-Hâfıd', 
    meaning: 'Kafirleri ve zalimleri alçaltan.', 
    question: 'Kibirlenip alçalanlardan olmaktan korkuyor muyum?', 
    dua: 'Ey Hâfıd, nefsimi alçalt, beni dünyada ve ahirette rezil rüsva eyleme.' 
  },
  { 
    id: 24, 
    arabic: 'الرَّافِعُ', 
    transliteration: 'er-Râfi', 
    meaning: 'İnananları ve tevazu sahiplerini yükselten.', 
    question: 'Yükselmek için tevazu gösteriyor muyum?', 
    dua: 'Ey Râfi, imanımla ve ahlakımla derecemi katında yükselt.' 
  },
  { 
    id: 25, 
    arabic: 'الْمُعِزُّ', 
    transliteration: 'el-Muizz', 
    meaning: 'Dilediğine izzet ve şeref veren.', 
    question: 'İzzeti yanlış yerlerde mi arıyorum?', 
    dua: 'Ey Muizz, beni Sana itaatle aziz kıl.' 
  },
  { 
    id: 26, 
    arabic: 'الْمُذِلُّ', 
    transliteration: 'el-Müzill', 
    meaning: 'Dilediğini zelil ve hakir kılan.', 
    question: 'Başkalarını hor görüp zelil duruma düşmekten sakınıyor muyum?', 
    dua: 'Ey Müzill, beni nefsimin ve şeytanın elinde zelil eyleme.' 
  },
  { 
    id: 27, 
    arabic: 'السَّمِيعُ', 
    transliteration: 'es-Semî', 
    meaning: 'Her şeyi, en gizli fısıltıları bile işiten.', 
    question: 'Ağzımdan çıkan her sözü O’nun duyduğunun farkında mıyım?', 
    dua: 'Ey Semî, dualarımı işit ve kabul buyur.' 
  },
  { 
    id: 28, 
    arabic: 'الْبَصِيرُ', 
    transliteration: 'el-Basîr', 
    meaning: 'Her şeyi en ince ayrıntısına kadar gören.', 
    question: 'O’nun bakışları altındayken günah işlemekten utanıyor muyum?', 
    dua: 'Ey Basîr, beni her daim gözetiminde ve himayende tut.' 
  },
  { 
    id: 29, 
    arabic: 'الْحَكَمُ', 
    transliteration: 'el-Hakem', 
    meaning: 'Mutlak hakim, hakkı batıldan ayıran.', 
    question: 'Hayatımda O’nun hükümlerine razı oluyor muyum?', 
    dua: 'Ey Hakem, Senin hükmüne razı olanlardan eyle.' 
  },
  { 
    id: 30, 
    arabic: 'الْعَدْلُ', 
    transliteration: 'el-Adl', 
    meaning: 'Mutlak adalet sahibi, asla zulmetmeyen.', 
    question: 'Ben insanlara karşı adaletli miyim?', 
    dua: 'Ey Adl, beni zulmetmekten ve zulme uğramaktan koru.' 
  },
  { 
    id: 31, 
    arabic: 'الْلَّطِيفُ', 
    transliteration: 'el-Latîf', 
    meaning: 'En ince işlerin bütün inceliklerini bilen, lütufkâr.', 
    question: 'Başıma gelen olaylardaki gizli lütufları görebiliyor muyum?', 
    dua: 'Ey Latîf, bana gizli ve açık lütuflarını ihsan eyle.' 
  },
  { 
    id: 32, 
    arabic: 'الْخَبِيرُ', 
    transliteration: 'el-Habîr', 
    meaning: 'Her şeyin iç yüzünden, gizli taraflarından haberdar olan.', 
    question: 'Niyetlerimi O’nun bildiğini unutuyor muyum?', 
    dua: 'Ey Habîr, kötü niyetlerden ve gizli günahlardan Sana sığınırım.' 
  },
  { 
    id: 33, 
    arabic: 'الْحَلِيمُ', 
    transliteration: 'el-Halîm', 
    meaning: 'Acele etmeyen, cezalandırmada yumuşak davranan.', 
    question: 'İnsanların hatalarına karşı ben de sabırlı ve yumuşak mıyım?', 
    dua: 'Ey Halîm, isyanıma rağmen bana mühlet verdiğin için şükürler olsun, beni affet.' 
  },
  { 
    id: 34, 
    arabic: 'الْعَظِيمُ', 
    transliteration: 'el-Azîm', 
    meaning: 'Büyüklüğü akılla kavranamayacak kadar yüce.', 
    question: 'O’nun büyüklüğünü düşünüp acziyetimi hissediyor muyum?', 
    dua: 'Ey Azîm, azametini kalbimde hissettir, beni Sana layık bir kul eyle.' 
  },
  { 
    id: 35, 
    arabic: 'الْغَفُورُ', 
    transliteration: 'el-Gafûr', 
    meaning: 'Mağfireti bol olan, günahları affeden.', 
    question: 'Affedilmeyi beklerken ben affedici olabiliyor muyum?', 
    dua: 'Ey Gafûr, günahlarımı bağışla, beni affedilmiş kullarından eyle.' 
  },
  { 
    id: 36, 
    arabic: 'الشَّكُورُ', 
    transliteration: 'eş-Şekûr', 
    meaning: 'Az amele çok sevap veren, şükrü kabul eden.', 
    question: 'Verdiği sayısız nimetler için ne kadar şükrediyorum?', 
    dua: 'Ey Şekûr, azıcık ibadetimi kabul buyur, beni şükredici bir kul eyle.' 
  },
  { 
    id: 37, 
    arabic: 'الْعَلِيُّ', 
    transliteration: 'el-Aliyy', 
    meaning: 'Yücelikte eşi benzeri olmayan, pek yüce.', 
    question: 'Yüceliği makamda mevkide mi arıyorum?', 
    dua: 'Ey Aliyy, himmetimi ve gayemi yüce kıl, süfli heveslerden kurtar.' 
  },
  { 
    id: 38, 
    arabic: 'الْكَبِيرُ', 
    transliteration: 'el-Kebîr', 
    meaning: 'Büyüklüğüne sınır olmayan, mutlak büyük.', 
    question: 'Gözümde büyüttüğüm dertlerin O’nun yanında ne kadar küçük olduğunu biliyor muyum?', 
    dua: 'Ey Kebîr, dertlerimi değil, Senin büyüklüğünü anmayı nasip et.' 
  },
  { 
    id: 39, 
    arabic: 'الْحَفِيظُ', 
    transliteration: 'el-Hafîz', 
    meaning: 'Her şeyi koruyan ve muhafaza eden.', 
    question: 'Beni her türlü tehlikeden koruyanın O olduğunu hatırlıyor muyum?', 
    dua: 'Ey Hafîz, beni, ailemi ve imanımı her türlü şerden muhafaza eyle.' 
  },
  { 
    id: 40, 
    arabic: 'الْمُقِيتُ', 
    transliteration: 'el-Mukît', 
    meaning: 'Her yaratılmışın gıdasını ve azığını veren.', 
    question: 'Ruhumu da manevi gıdalarla besliyor muyum?', 
    dua: 'Ey Mukît, bedenime sağlık, ruhuma manevi gıdalar ihsan eyle.' 
  },
  { 
    id: 41, 
    arabic: 'الْحَسِيبُ', 
    transliteration: 'el-Hasîb', 
    meaning: 'Herkesin hesabını en ince detayına kadar gören.', 
    question: 'Hesap günü gelmeden nefsimi hesaba çekiyor muyum?', 
    dua: 'Ey Hasîb, hesabımı kolaylaştır, beni zorlu sorgudan muaf tut.' 
  },
  { 
    id: 42, 
    arabic: 'الْجَلِيلُ', 
    transliteration: 'el-Celîl', 
    meaning: 'Celal ve azamet sahibi.', 
    question: 'O’nun celalinden hakkıyla korkup saygı duyuyor muyum?', 
    dua: 'Ey Celîl, kalbime Senin korkunu ve saygını yerleştir.' 
  },
  { 
    id: 43, 
    arabic: 'الْكَرِيمُ', 
    transliteration: 'el-Kerîm', 
    meaning: 'Çok cömert, ikramı bol olan.', 
    question: 'Rabbimin cömertliği karşısında ben cimrilik yapıyor muyum?', 
    dua: 'Ey Kerîm, bana cömertliğinden ikram et, beni de cömert eyle.' 
  },
  { 
    id: 44, 
    arabic: 'الرَّقِيبُ', 
    transliteration: 'er-Rakîb', 
    meaning: 'Her varlığı her an gözeten ve kontrol eden.', 
    question: 'Yalnız kaldığımda bile O’nun gözetimi altında olduğumu biliyor muyum?', 
    dua: 'Ey Rakîb, her halimi ıslah et, beni bir an bile nefsimle baş başa bırakma.' 
  },
  { 
    id: 45, 
    arabic: 'الْمُجِيبُ', 
    transliteration: 'el-Mucîb', 
    meaning: 'Duaları ve istekleri kabul eden.', 
    question: 'Dualarımın kabul olacağına inancım tam mı?', 
    dua: 'Ey Mucîb, ellerimi boş çevirme, dualarımı kabul buyur.' 
  },
  { 
    id: 46, 
    arabic: 'الْوَاسِعُ', 
    transliteration: 'el-Vâsi', 
    meaning: 'İlmi ve rahmeti her şeyi kuşatan, geniş olan.', 
    question: 'Rabbimin rahmetinin günahlarımdan daha geniş olduğunu biliyor muyum?', 
    dua: 'Ey Vâsi, ilmimi artır, gönlümü ve rızkımı genişlet.' 
  },
  { 
    id: 47, 
    arabic: 'الْحَكِيمُ', 
    transliteration: 'el-Hakîm', 
    meaning: 'Her işi hikmetli olan, her şeyi yerli yerinde yapan.', 
    question: 'Başıma gelen olaylardaki hikmeti arıyor muyum?', 
    dua: 'Ey Hakîm, bana olayların ardındaki hikmeti kavrayacak feraset ver.' 
  },
  { 
    id: 48, 
    arabic: 'الْوَدُودُ', 
    transliteration: 'el-Vedûd', 
    meaning: 'Kullarını çok seven ve sevilmeye en layık olan.', 
    question: 'O’nu her şeyden daha çok seviyor muyum?', 
    dua: 'Ey Vedûd, Sen beni sev, sevdiklerini sevdir, Senin sevgine ulaştıracak amelleri sevdir.' 
  },
  { 
    id: 49, 
    arabic: 'الْمَجِيدُ', 
    transliteration: 'el-Mecîd', 
    meaning: 'Şanı yüce ve övülmeye layık olan.', 
    question: 'Övgülerin en güzeline O’nun layık olduğunu biliyor muyum?', 
    dua: 'Ey Mecîd, şanını yücelt, beni rızana uygun amellerle şereflendir.' 
  },
  { 
    id: 50, 
    arabic: 'الْبَاعِثُ', 
    transliteration: 'el-Bâis', 
    meaning: 'Ölüleri dirilten, peygamberler gönderen.', 
    question: 'Öldükten sonra dirilişe ne kadar hazırlıklıyım?', 
    dua: 'Ey Bâis, kalbimi iman nuruyla dirilt, beni haşr gününde mahcup etme.' 
  },
  { 
    id: 51, 
    arabic: 'الشَّهِيدُ', 
    transliteration: 'eş-Şehîd', 
    meaning: 'Her şeye şahit olan, her yerde hazır bulunan.', 
    question: 'Yaptığım her şeye O’nun şahit olduğunu unutuyor muyum?', 
    dua: 'Ey Şehîd, şahitliğinden yüzümü kızartacak amellerden Sana sığınırım.' 
  },
  { 
    id: 52, 
    arabic: 'الْحَقُّ', 
    transliteration: 'el-Hakk', 
    meaning: 'Varlığı hiç değişmeden duran, gerçek olan.', 
    question: 'Hayatımı hakikat üzerine mi, yoksa yalanlar üzerine mi kuruyorum?', 
    dua: 'Ey Hakk, bana hakkı hak olarak gösterip ona uymayı nasip et.' 
  },
  { 
    id: 53, 
    arabic: 'الْوَكِيلُ', 
    transliteration: 'el-Vekîl', 
    meaning: 'Kendisine güvenilip dayanılan, işleri en güzel şekilde yoluna koyan.', 
    question: 'İşlerimi O’na havale edip gerçekten tevekkül ediyor muyum?', 
    dua: 'Ey Vekîl, işlerimi Sana bıraktım, benim için en hayırlısını nasip eyle.' 
  },
  { 
    id: 54, 
    arabic: 'الْقَوِيُّ', 
    transliteration: 'el-Kaviyy', 
    meaning: 'Pek güçlü, kuvvetli, her şeye gücü yeten.', 
    question: 'Gücü kendimden mi, yoksa O’ndan mı biliyorum?', 
    dua: 'Ey Kaviyy, İslam yolunda bana güç ve kuvvet ver, beni aciz bırakma.' 
  },
  { 
    id: 55, 
    arabic: 'الْمَتِينُ', 
    transliteration: 'el-Metîn', 
    meaning: 'Çok sağlam, sarsılmaz kudret sahibi.', 
    question: 'İmanım zorluklar karşısında ne kadar sağlam?', 
    dua: 'Ey Metîn, dinim ve imanım konusunda ayaklarımı sabit kıl.' 
  },
  { 
    id: 56, 
    arabic: 'الْوَلِيُّ', 
    transliteration: 'el-Veliyy', 
    meaning: 'İnananların dostu ve yardımcısı.', 
    question: 'Allah’ı dost edinenleri dost ediniyor muyum?', 
    dua: 'Ey Veliyy, beni dostluğuna kabul et, beni sahipsiz bırakma.' 
  },
  { 
    id: 57, 
    arabic: 'الْحَمِيدُ', 
    transliteration: 'el-Hamîd', 
    meaning: 'Her türlü övgüye layık olan.', 
    question: 'Her halimde O’na hamd ediyor muyum?', 
    dua: 'Ey Hamîd, dilimi hamdinden, kalbimi şükründen ayırma.' 
  },
  { 
    id: 58, 
    arabic: 'الْمُحْصِي', 
    transliteration: 'el-Muhsî', 
    meaning: 'Her şeyin sayısını tek tek bilen.', 
    question: 'Nefeslerimin sayılı olduğunu ve bir gün biteceğini biliyor muyum?', 
    dua: 'Ey Muhsî, kalan ömrümü geçen ömrümden hayırlı eyle.' 
  },
  { 
    id: 59, 
    arabic: 'الْمُبْدِئُ', 
    transliteration: 'el-Mubdi', 
    meaning: 'Varlıkları örneksiz olarak ilk defa yaratan.', 
    question: 'Her başlangıcın O’nun izniyle olduğunu biliyor muyum?', 
    dua: 'Ey Mubdi, her hayırlı işimde bana güzel başlangıçlar nasip et.' 
  },
  { 
    id: 60, 
    arabic: 'الْمُعِيدُ', 
    transliteration: 'el-Muîd', 
    meaning: 'Yaratılmışları öldükten sonra tekrar dirilten.', 
    question: 'Tekrar diriltileceğim güne ne hazırladım?', 
    dua: 'Ey Muîd, beni huzuruna tertemiz bir şekilde geri döndür.' 
  },
  { 
    id: 61, 
    arabic: 'الْمُحْيِي', 
    transliteration: 'el-Muhyî', 
    meaning: 'Can veren, hayat bahşeden.', 
    question: 'Kalbimi Kuran ve iman ile diriltiyor muyum?', 
    dua: 'Ey Muhyî, kalbimi iman nuruyla, bedenimi sağlıkla yaşat.' 
  },
  { 
    id: 62, 
    arabic: 'الْمُمِيتُ', 
    transliteration: 'el-Mumît', 
    meaning: 'Canlıların hayatına son veren, öldüren.', 
    question: 'Ölümün bir yok oluş değil, O’na kavuşma olduğunu biliyor muyum?', 
    dua: 'Ey Mumît, bana imanla dolu hayırlı bir ölüm nasip eyle.' 
  },
  { 
    id: 63, 
    arabic: 'الْحَيُّ', 
    transliteration: 'el-Hayy', 
    meaning: 'Ezeli ve ebedi hayat sahibi, diri.', 
    question: 'Gerçek hayatın ahiret hayatı olduğunun farkında mıyım?', 
    dua: 'Ey Hayy, kalbimi gaflet uykusundan uyandır, beni diri tut.' 
  },
  { 
    id: 64, 
    arabic: 'الْقَيُّومُ', 
    transliteration: 'el-Kayyûm', 
    meaning: 'Kendi kendine var olan, her şeyi ayakta tutan.', 
    question: 'Her an O’nun kudretiyle ayakta durduğumu biliyor muyum?', 
    dua: 'Ey Kayyûm, rahmetinle yardım istiyorum, işlerimi yoluna koy.' 
  },
  { 
    id: 65, 
    arabic: 'الْوَاجِدُ', 
    transliteration: 'el-Wâcid', 
    meaning: 'İstediğini istediği zaman bulan, hiçbir şeye muhtaç olmayan.', 
    question: 'Aradığım huzuru O’nda bulabiliyor muyum?', 
    dua: 'Ey Wâcid, kaybettiklerim için üzülmemeyi, Seni bulunca her şeyi bulmuş olmayı nasip et.' 
  },
  { 
    id: 66, 
    arabic: 'الْمَاجِدُ', 
    transliteration: 'el-Mâcid', 
    meaning: 'Şanı ve keremi sonsuz olan.', 
    question: 'O’nun keremine layık işler yapıyor muyum?', 
    dua: 'Ey Mâcid, ikramınla beni zenginleştir, ahlakımı güzelleştir.' 
  },
  { 
    id: 67, 
    arabic: 'الْوَاحِدُ', 
    transliteration: 'el-Vâhid', 
    meaning: 'Tek ve bir olan, ortağı olmayan.', 
    question: 'Kalbimi sadece O’na mı bağladım, yoksa başka sevgiler mi var?', 
    dua: 'Ey Vâhid, kalbimde Senden başkasına yer bırakma, tevhirden ayırma.' 
  },
  { 
    id: 68, 
    arabic: 'الصَّمَدُ', 
    transliteration: 'es-Samed', 
    meaning: 'Her şeyin kendisine muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan.', 
    question: 'İhtiyaçlarımı insanlardan mı, yoksa Samed olan Allah’tan mı istiyorum?', 
    dua: 'Ey Samed, beni kimseye muhtaç etme, sadece Sana el açtır.' 
  },
  { 
    id: 69, 
    arabic: 'الْقَادِرُ', 
    transliteration: 'el-Kâdir', 
    meaning: 'İstediğini yapmaya gücü yeten.', 
    question: 'O’nun her şeye gücünün yettiğine tam anlamıyla güveniyor muyum?', 
    dua: 'Ey Kâdir, acizliğime merhamet et, gücünle beni destekle.' 
  },
  { 
    id: 70, 
    arabic: 'الْمُقْتَدِرُ', 
    transliteration: 'el-Muktedir', 
    meaning: 'Kuvvet ve kudret sahipleri üzerinde dilediği gibi tasarruf eden.', 
    question: 'Gücümü hayırda mı, şerde mi kullanıyorum?', 
    dua: 'Ey Muktedir, beni gücünü zulümde değil, adalette kullananlardan eyle.' 
  },
  { 
    id: 71, 
    arabic: 'الْمُقَدِّمُ', 
    transliteration: 'el-Mukaddim', 
    meaning: 'Dilediğini öne alan, yükselten.', 
    question: 'Hayırlı işlerde öne geçmek için gayret ediyor muyum?', 
    dua: 'Ey Mukaddim, beni hayır yarışlarında en önde gidenlerden eyle.' 
  },
  { 
    id: 72, 
    arabic: 'الْمُؤَخِّرُ', 
    transliteration: 'el-Muahhir', 
    meaning: 'Dilediğini geriye bırakan, erteleyen.', 
    question: 'Tövbeyi ve ibadetleri erteliyor muyum?', 
    dua: 'Ey Muahhir, kötü arzularımı ertele, tövbemi ve ibadetimi geciktirme.' 
  },
  { 
    id: 73, 
    arabic: 'الأَوَّلُ', 
    transliteration: 'el-Evvel', 
    meaning: 'Varlığının başlangıcı olmayan, ezeli.', 
    question: 'Her işime O’nun adıyla başlıyor muyum?', 
    dua: 'Ey Evvel, her işimin başını hayırlı, sonunu selametli eyle.' 
  },
  { 
    id: 74, 
    arabic: 'الآخِرُ', 
    transliteration: 'el-Âhir', 
    meaning: 'Varlığının sonu olmayan, ebedi.', 
    question: 'Son nefesimde O’na imanla kavuşabilecek miyim?', 
    dua: 'Ey Âhir, son nefesimde kelime-i şehadet ile çene kapamayı nasip eyle.' 
  },
  { 
    id: 75, 
    arabic: 'الظَّاهِرُ', 
    transliteration: 'ez-Zâhir', 
    meaning: 'Varlığı açık, aşikâr olan, eserleriyle bilinen.', 
    question: 'Kainattaki eserlerine bakıp O’nu görüyor muyum?', 
    dua: 'Ey Zâhir, varlığının delillerini görmeyi ve idrak etmeyi nasip et.' 
  },
  { 
    id: 76, 
    arabic: 'الْبَاطِنُ', 
    transliteration: 'el-Bâtın', 
    meaning: 'Akılların idrak edemeyeceği kadar gizli olan.', 
    question: 'Kalbimin derinliklerindeki niyetlerimi O’nun bildiğini hissediyor muyum?', 
    dua: 'Ey Bâtın, içimi dışımdan, gizlimi açığımdan daha hayırlı eyle.' 
  },
  { 
    id: 77, 
    arabic: 'الْوَالِي', 
    transliteration: 'el-Vâlî', 
    meaning: 'Bütün kainatı idare eden, yöneten.', 
    question: 'Hayatımın yönetimini O’nun rızasına göre yapıyor muyum?', 
    dua: 'Ey Vâlî, bizi salih kullarınla beraber yönet, şerlilerin eline bırakma.' 
  },
  { 
    id: 78, 
    arabic: 'الْمُتَعَالِي', 
    transliteration: 'el-Muteâlî', 
    meaning: 'Aklın tasavvur ettiği her şeyden yüce olan.', 
    question: 'Düşüncelerimi O’nun yüceliğine yakışır seviyede tutuyor muyum?', 
    dua: 'Ey Muteâlî, himmetimi yükselt, beni dünya heveslerinden kurtar.' 
  },
  { 
    id: 79, 
    arabic: 'الْبَرُّ', 
    transliteration: 'el-Berr', 
    meaning: 'İyiliği ve lütfu bol olan, kullarına karşı şefkatli.', 
    question: 'Ben de insanlara karşı iyiliksever miyim?', 
    dua: 'Ey Berr, bana iyilik yapmayı ve iyilerden olmayı sevdir.' 
  },
  { 
    id: 80, 
    arabic: 'التَّوَّابُ', 
    transliteration: 'et-Tevvâb', 
    meaning: 'Tövbeleri kabul eden, günahları bağışlayan.', 
    question: 'Günah işlediğimde hemen tövbeye sarılıyor muyum?', 
    dua: 'Ey Tevvâb, tövbemi kabul et, beni günahlarında ısrar etmeyenlerden eyle.' 
  },
  { 
    id: 81, 
    arabic: 'الْمُنْتَقِمُ', 
    transliteration: 'el-Muntekim', 
    meaning: 'Suçluları adaletiyle cezalandıran.', 
    question: 'Başkasına zulmedip O’nun gazabını çekmekten korkuyor muyum?', 
    dua: 'Ey Muntekim, zalimlerin şerrinden Sana sığınırım, hakkımı Sen al.' 
  },
  { 
    id: 82, 
    arabic: 'الْعَفُوُّ', 
    transliteration: 'el-Afuv', 
    meaning: 'Çok affedici, günahları tamamen silen.', 
    question: 'Bana kötülük yapanları ben de affedebiliyor muyum?', 
    dua: 'Ey Afuv, Sen affedicisin, affetmeyi seversin, beni de affet.' 
  },
  { 
    id: 83, 
    arabic: 'الرَّؤُوفُ', 
    transliteration: 'er-Raûf', 
    meaning: 'Çok şefkatli ve merhametli.', 
    question: 'İnsanlara ve diğer canlılara şefkatle yaklaşıyor muyum?', 
    dua: 'Ey Raûf, kalbimi şefkat ve merhametle doldur.' 
  },
  { 
    id: 84, 
    arabic: 'مَالِكُ الْمُلْكِ', 
    transliteration: 'Mâlik-ul Mülk', 
    meaning: 'Mülkün ebedi ve mutlak sahibi.', 
    question: 'Elimdeki nimetlerin emanet olduğunu biliyor muyum?', 
    dua: 'Ey Mâlik-ul Mülk, mülkünde rızana uygun tasarruf etmeyi nasip eyle.' 
  },
  { 
    id: 85, 
    arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', 
    transliteration: 'Zü’l-Celâli ve’l-İkrâm', 
    meaning: 'Hem büyüklük hem de kerem ve ikram sahibi.', 
    question: 'O’na hem saygı duyup hem de lütfunu ümit ediyor muyum?', 
    dua: 'Ey Zü’l-Celâli ve’l-İkrâm, bana celalinle vakar, ikramınla lütuf bahşet.' 
  },
  { 
    id: 86, 
    arabic: 'الْمُقْسِطُ', 
    transliteration: 'el-Muksit', 
    meaning: 'Bütün işlerini denk ve birbirine uygun yapan, adaletli.', 
    question: 'Hayatımda dengeyi ve adaleti koruyor muyum?', 
    dua: 'Ey Muksit, beni her işinde adaletli olan ve aşırılıktan kaçınan kullarından eyle.' 
  },
  { 
    id: 87, 
    arabic: 'الْجَامِعُ', 
    transliteration: 'el-Câmi', 
    meaning: 'İstediğini istediği zaman istediği yerde toplayan.', 
    question: 'İyi huyları ve güzel insanları çevremde topluyor muyum?', 
    dua: 'Ey Câmi, beni salih kullarınla ve cennetinde sevdiklerimle bir araya getir.' 
  },
  { 
    id: 88, 
    arabic: 'الْغَنِيُّ', 
    transliteration: 'el-Ganiyy', 
    meaning: 'Çok zengin, hiçbir şeye muhtaç olmayan.', 
    question: 'Zenginliği malda mı, gönülde mi arıyorum?', 
    dua: 'Ey Ganiyy, beni Senden başkasına muhtaç etme, gönül zenginliği ver.' 
  },
  { 
    id: 89, 
    arabic: 'الْمُغْنِي', 
    transliteration: 'el-Mugnî', 
    meaning: 'Dilediğini zengin kılan.', 
    question: 'Başkalarının ihtiyacını gidererek manevi zenginliğe eriyor muyum?', 
    dua: 'Ey Mugnî, beni helalinden zengin kıl, harama tenezzül ettirme.' 
  },
  { 
    id: 90, 
    arabic: 'الْمَانِعُ', 
    transliteration: 'el-Mâni', 
    meaning: 'Dilemediği şeyin gerçekleşmesine izin vermeyen, engelleyen.', 
    question: 'Bir işim olmadığında bunda bir hayır olduğunu düşünüyor muyum?', 
    dua: 'Ey Mâni, beni günahlardan ve bana zarar verecek şeylerden alıkoy.' 
  },
  { 
    id: 91, 
    arabic: 'الضَّارُ', 
    transliteration: 'ed-Dârr', 
    meaning: 'Elem ve zarar verecek şeyleri yaratan.', 
    question: 'Zararın da faydanın da O’ndan geldiğine inanıyor muyum?', 
    dua: 'Ey Dârr, her türlü zarardan ve musibetten Sana sığınırım.' 
  },
  { 
    id: 92, 
    arabic: 'النَّافِعُ', 
    transliteration: 'en-Nâfi', 
    meaning: 'Fayda veren, yararlı şeyleri yaratan.', 
    question: 'İnsanlara faydalı bir birey miyim?', 
    dua: 'Ey Nâfi, ilmimi ve ömrümü insanlara faydalı kıl.' 
  },
  { 
    id: 93, 
    arabic: 'النُّورُ', 
    transliteration: 'en-Nûr', 
    meaning: 'Alemleri nurlandıran, aydınlatan.', 
    question: 'Kalbimi ve yüzümü ibadet nuruyla aydınlatıyor muyum?', 
    dua: 'Ey Nûr, kabrimi ve kalbimi iman nuruyla aydınlat, önümü görmemi sağla.' 
  },
  { 
    id: 94, 
    arabic: 'الْهَادِي', 
    transliteration: 'el-Hâdî', 
    meaning: 'Hidayet veren, doğru yolu gösteren.', 
    question: 'Doğru yolda kalmak için çaba sarf ediyor muyum?', 
    dua: 'Ey Hâdî, beni dosdoğru yoluna (Sırat-ı Müstakim) ilet ve orada sabit kıl.' 
  },
  { 
    id: 95, 
    arabic: 'الْبَدِيعُ', 
    transliteration: 'el-Bedî', 
    meaning: 'Eşi ve benzeri olmayan harikalar yaratan.', 
    question: 'Yaratılan eşsiz güzelliklere bakıp hayranlık duyuyor muyum?', 
    dua: 'Ey Bedî, ömrümü ve amellerimi güzelleştir, beni şaşırtıcı lütuflarına mazhar et.' 
  },
  { 
    id: 96, 
    arabic: 'الْبَاقِي', 
    transliteration: 'el-Bâkî', 
    meaning: 'Varlığının sonu olmayan, ebedi kalan.', 
    question: 'Fani dünyaya mı, yoksa Baki olan Allah’a mı bağlanıyorum?', 
    dua: 'Ey Bâkî, fani dertlerle beni yorma, ebedi huzuruna kabul et.' 
  },
  { 
    id: 97, 
    arabic: 'الْوَارِثُ', 
    transliteration: 'el-Vâris', 
    meaning: 'Her şeyin asıl sahibi, mülk kendisine kalan.', 
    question: 'Bırakıp gideceğim mirasın hesabını nasıl vereceğimi düşünüyorum?', 
    dua: 'Ey Vâris, bana arkamdan hayırla anılacak sadaka-i cariyeler bırakmayı nasip et.' 
  },
  { 
    id: 98, 
    arabic: 'الرَّشِيدُ', 
    transliteration: 'er-Reşîd', 
    meaning: 'Doğru yolu gösteren, işleri en güzel sonuca ulaştıran.', 
    question: 'Kararlarımda O’nun rızasını gözetiyor muyum?', 
    dua: 'Ey Reşîd, bana rüştü ve doğruyu ilham et, yanlış kararlardan koru.' 
  },
  { 
    id: 99, 
    arabic: 'الصَّبُورُ', 
    transliteration: 'es-Sabûr', 
    meaning: 'Çok sabırlı olan, cezalandırmada acele etmeyen.', 
    question: 'Başıma gelenlere sabredebiliyor muyum?', 
    dua: 'Ey Sabûr, bana musibetler karşısında peygamber sabrı ver, acelecilikten koru.' 
  }
];
const esmaData = [
  { 
    id: 1, 
    arabic: 'اللَّهُ', 
    transliteration: 'Allah', 
    meaning: 'Kâinatın tek yaratıcısı, bütün kemâl sıfatları kendisinde toplayan en yüce isim.', 
    question: 'Kalbimde O’ndan daha büyük bir yer kaplayan bir şey var mı?', 
    dua: 'Rabbim, kalbimi sadece Sana kul olmanın huzuruyla doldur.' 
  },
  { 
    id: 2, 
    arabic: 'الرَّحْمنُ', 
    transliteration: 'er-Rahmân', 
    meaning: 'Dünyada inanan inanmayan ayırt etmeden herkese şefkat gösteren.', 
    question: 'Ben de yaratılanlara ayrım yapmadan merhamet ediyor muyum?', 
    dua: 'Ey Rahmân, çorak gönlüme rahmet yağmurları indir.' 
  },
  { 
    id: 3, 
    arabic: 'الرَّحِيمُ', 
    transliteration: 'er-Rahîm', 
    meaning: 'Ahirette sadece müminlere merhamet edecek olan.', 
    question: 'Ahirette O’nun özel sevgisine layık olabilmek için ne yapıyorum?', 
    dua: 'Ey Rahîm, beni cennetine layık eyle ve özel şefkatinle kuşat.' 
  },
  { 
    id: 4, 
    arabic: 'الْمَلِكُ', 
    transliteration: 'el-Melik', 
    meaning: 'Mülkün gerçek sahibi, her şeye hükmeden sultan.', 
    question: 'Sahip olduğumu sandığım şeyler aslında kime ait?', 
    dua: 'Ey Melik, beni fani dünyanın mülküne köle olmaktan kurtar.' 
  },
  { 
    id: 5, 
    arabic: 'الْقُدُّوسُ', 
    transliteration: 'el-Kuddûs', 
    meaning: 'Her türlü eksiklikten ve kusurdan münezzeh, tertemiz.', 
    question: 'Ruhumu ve düşüncelerimi kirleten şeylerden arınıyor muyum?', 
    dua: 'Ey Kuddûs, ruhumu günah kirlerinden arındır, beni tertemiz huzuruna al.' 
  },
  { 
    id: 6, 
    arabic: 'السَّلاَمُ', 
    transliteration: 'es-Selâm', 
    meaning: 'Esenlik kaynağı, kullarını selamete çıkaran.', 
    question: 'Girdiğim ortama huzur ve güven veriyor muyum?', 
    dua: 'Ey Selâm, kalbime esenlik ver, beni dünya ve ahiretin korkularından selamete çıkar.' 
  },
  { 
    id: 7, 
    arabic: 'الْمُؤْمِنُ', 
    transliteration: 'el-Mü’min', 
    meaning: 'Güven veren, vaadine sadık olan, inananları koruyan.', 
    question: 'Çevremdeki insanlar bana ne kadar güveniyor?', 
    dua: 'Ey Mü’min, kalbime sarsılmaz bir iman ver, beni vesveselerden emin kıl.' 
  },
  { 
    id: 8, 
    arabic: 'الْمُهَيْمِنُ', 
    transliteration: 'el-Müheymin', 
    meaning: 'Her şeyi görüp gözeten, koruyan ve kollayan.', 
    question: 'Her an izlendiğimin bilinciyle hareket ediyor muyum?', 
    dua: 'Ey Müheymin, beni her an gözetiminde tut, nefsimin şerrinden koru.' 
  },
  { 
    id: 9, 
    arabic: 'الْعَزِيزُ', 
    transliteration: 'el-Azîz', 
    meaning: 'İzzet sahibi, mağlup edilmesi imkânsız olan galip.', 
    question: 'İzzeti malda mülkte mi, yoksa Allah’a itaatte mi arıyorum?', 
    dua: 'Ey Azîz, beni İslâm’ın izzetiyle şereflendir, kimseye muhtaç ve zelil etme.' 
  },
  { 
    id: 10, 
    arabic: 'الْجَبَّارُ', 
    transliteration: 'el-Cebbâr', 
    meaning: 'Kırılanları onaran, dilediğini zorla da olsa yaptıran.', 
    question: 'Kırık kalpleri onarıyor muyum, yoksa kırıyor muyum?', 
    dua: 'Ey Cebbâr, kırık kalbimi onar, eksiklerimi tamamla.' 
  },
  { 
    id: 11, 
    arabic: 'الْمُتَكَبِّرُ', 
    transliteration: 'el-Mütekebbir', 
    meaning: 'Büyüklükte eşi olmayan, azamet sahibi.', 
    question: 'Kibirlenmek bana yakışır mı?', 
    dua: 'Ey Mütekebbir, büyüklüğün karşısında nefsimi küçült, beni kibirden uzak eyle.' 
  },
  { 
    id: 12, 
    arabic: 'الْخَالِقُ', 
    transliteration: 'el-Hâlık', 
    meaning: 'Her şeyi yoktan var eden yaratıcı.', 
    question: 'Yaratılış gayeme uygun yaşıyor muyum?', 
    dua: 'Ey Hâlık, beni yaratılış gayeme uygun, hayırlı bir kul eyle.' 
  },
  { 
    id: 13, 
    arabic: 'الْبَارِئُ', 
    transliteration: 'el-Bâri', 
    meaning: 'Her şeyi kusursuz ve uyumlu bir şekilde yaratan.', 
    question: 'Vücudumdaki ve evrendeki bu muazzam düzeni tefekkür ediyor muyum?', 
    dua: 'Ey Bâri, üzerimdeki sanatını idrak etmeyi nasip eyle.' 
  },
  { 
    id: 14, 
    arabic: 'الْمُصَوِّرُ', 
    transliteration: 'el-Musavvir', 
    meaning: 'Varlıklara en güzel şekli ve sureti veren.', 
    question: 'Allah’ın bana verdiği sureti ve yetenekleri nerede kullanıyorum?', 
    dua: 'Ey Musavvir, ahlakımı da suretim gibi güzel eyle.' 
  },
  { 
    id: 15, 
    arabic: 'الْغَفَّارُ', 
    transliteration: 'el-Gaffâr', 
    meaning: 'Günahları tekrar tekrar örten ve çokça bağışlayan.', 
    question: 'Başkalarının hatalarını yüzlerine mi vuruyorum, yoksa örtüyor muyum?', 
    dua: 'Ey Gaffâr, yüzüm karası günahlarımı setret, beni utandırma.' 
  },
  { 
    id: 16, 
    arabic: 'الْقَهَّارُ', 
    transliteration: 'el-Kahhâr', 
    meaning: 'Her şeye galip gelen, isyankarları kahreden.', 
    question: 'Nefsimin kötü arzularına karşı galip gelebiliyor muyum?', 
    dua: 'Ey Kahhâr, nefsimin kötü arzularını kahret, beni bana bırakma.' 
  },
  { 
    id: 17, 
    arabic: 'الْوَهَّابُ', 
    transliteration: 'el-Vehhâb', 
    meaning: 'Karşılıksız ve bolca nimet veren.', 
    question: 'Ben de karşılık beklemeden iyilik yapabiliyor muyum?', 
    dua: 'Ey Vehhâb, bana katından karşılıksız hayırlar ve rahmet lütfet.' 
  },
  { 
    id: 18, 
    arabic: 'الرَّزَّاقُ', 
    transliteration: 'er-Rezzâk', 
    meaning: 'Bütün canlıların rızkını veren.', 
    question: 'Rızkı verene mi, yoksa aracı olana mı minnet ediyorum?', 
    dua: 'Ey Rezzâk, bana helal ve bol rızık ver, kanaatkar eyle.' 
  },
  { 
    id: 19, 
    arabic: 'الْفَتَّاحُ', 
    transliteration: 'el-Fettâh', 
    meaning: 'Her türlü zorluğu açan, hayır kapılarını aralayan.', 
    question: 'İnsanların sorunlarını çözmelerine yardımcı oluyor muyum?', 
    dua: 'Ey Fettâh, kalbimi hayırlara aç, önümdeki engelleri kaldır.' 
  },
  { 
    id: 20, 
    arabic: 'الْعَلِيمُ', 
    transliteration: 'el-Alîm', 
    meaning: 'Gizli ve açık her şeyi en ince detayına kadar bilen.', 
    question: 'Kimse görmese de O’nun bildiğini bilerek yaşıyor muyum?', 
    dua: 'Ey Alîm, bana ilim ve hikmet ver, cahillikten koru.' 
  },
  { 
    id: 21, 
    arabic: 'الْقَابِضُ', 
    transliteration: 'el-Kâbıd', 
    meaning: 'Dilediğinin rızkını daraltan, ruhları kabzeden.', 
    question: 'Darlık zamanında sabredebiliyor muyum?', 
    dua: 'Ey Kâbıd, kalbimi dünyeviliklere karşı daralt, Sana karşı genişlet.' 
  },
  { 
    id: 22, 
    arabic: 'الْبَاسِطُ', 
    transliteration: 'el-Bâsıt', 
    meaning: 'Dilediğinin rızkını genişleten, ruhları ferahlatan.', 
    question: 'Bana verilen genişliği hayır yolunda kullanıyor muyum?', 
    dua: 'Ey Bâsıt, gönlüme inşirah ver, rızkımı ve ilmimi bereketlendir.' 
  },
  { 
    id: 23, 
    arabic: 'الْخَافِضُ', 
    transliteration: 'el-Hâfıd', 
    meaning: 'Kafirleri ve zalimleri alçaltan.', 
    question: 'Kibirlenip alçalanlardan olmaktan korkuyor muyum?', 
    dua: 'Ey Hâfıd, nefsimi alçalt, beni dünyada ve ahirette rezil rüsva eyleme.' 
  },
  { 
    id: 24, 
    arabic: 'الرَّافِعُ', 
    transliteration: 'er-Râfi', 
    meaning: 'İnananları ve tevazu sahiplerini yükselten.', 
    question: 'Yükselmek için tevazu gösteriyor muyum?', 
    dua: 'Ey Râfi, imanımla ve ahlakımla derecemi katında yükselt.' 
  },
  { 
    id: 25, 
    arabic: 'الْمُعِزُّ', 
    transliteration: 'el-Muizz', 
    meaning: 'Dilediğine izzet ve şeref veren.', 
    question: 'İzzeti yanlış yerlerde mi arıyorum?', 
    dua: 'Ey Muizz, beni Sana itaatle aziz kıl.' 
  },
  { 
    id: 26, 
    arabic: 'الْمُذِلُّ', 
    transliteration: 'el-Müzill', 
    meaning: 'Dilediğini zelil ve hakir kılan.', 
    question: 'Başkalarını hor görüp zelil duruma düşmekten sakınıyor muyum?', 
    dua: 'Ey Müzill, beni nefsimin ve şeytanın elinde zelil eyleme.' 
  },
  { 
    id: 27, 
    arabic: 'السَّمِيعُ', 
    transliteration: 'es-Semî', 
    meaning: 'Her şeyi, en gizli fısıltıları bile işiten.', 
    question: 'Ağzımdan çıkan her sözü O’nun duyduğunun farkında mıyım?', 
    dua: 'Ey Semî, dualarımı işit ve kabul buyur.' 
  },
  { 
    id: 28, 
    arabic: 'الْبَصِيرُ', 
    transliteration: 'el-Basîr', 
    meaning: 'Her şeyi en ince ayrıntısına kadar gören.', 
    question: 'O’nun bakışları altındayken günah işlemekten utanıyor muyum?', 
    dua: 'Ey Basîr, beni her daim gözetiminde ve himayende tut.' 
  },
  { 
    id: 29, 
    arabic: 'الْحَكَمُ', 
    transliteration: 'el-Hakem', 
    meaning: 'Mutlak hakim, hakkı batıldan ayıran.', 
    question: 'Hayatımda O’nun hükümlerine razı oluyor muyum?', 
    dua: 'Ey Hakem, Senin hükmüne razı olanlardan eyle.' 
  },
  { 
    id: 30, 
    arabic: 'الْعَدْلُ', 
    transliteration: 'el-Adl', 
    meaning: 'Mutlak adalet sahibi, asla zulmetmeyen.', 
    question: 'Ben insanlara karşı adaletli miyim?', 
    dua: 'Ey Adl, beni zulmetmekten ve zulme uğramaktan koru.' 
  },
  { 
    id: 31, 
    arabic: 'الْلَّطِيفُ', 
    transliteration: 'el-Latîf', 
    meaning: 'En ince işlerin bütün inceliklerini bilen, lütufkâr.', 
    question: 'Başıma gelen olaylardaki gizli lütufları görebiliyor muyum?', 
    dua: 'Ey Latîf, bana gizli ve açık lütuflarını ihsan eyle.' 
  },
  { 
    id: 32, 
    arabic: 'الْخَبِيرُ', 
    transliteration: 'el-Habîr', 
    meaning: 'Her şeyin iç yüzünden, gizli taraflarından haberdar olan.', 
    question: 'Niyetlerimi O’nun bildiğini unutuyor muyum?', 
    dua: 'Ey Habîr, kötü niyetlerden ve gizli günahlardan Sana sığınırım.' 
  },
  { 
    id: 33, 
    arabic: 'الْحَلِيمُ', 
    transliteration: 'el-Halîm', 
    meaning: 'Acele etmeyen, cezalandırmada yumuşak davranan.', 
    question: 'İnsanların hatalarına karşı ben de sabırlı ve yumuşak mıyım?', 
    dua: 'Ey Halîm, isyanıma rağmen bana mühlet verdiğin için şükürler olsun, beni affet.' 
  },
  { 
    id: 34, 
    arabic: 'الْعَظِيمُ', 
    transliteration: 'el-Azîm', 
    meaning: 'Büyüklüğü akılla kavranamayacak kadar yüce.', 
    question: 'O’nun büyüklüğünü düşünüp acziyetimi hissediyor muyum?', 
    dua: 'Ey Azîm, azametini kalbimde hissettir, beni Sana layık bir kul eyle.' 
  },
  { 
    id: 35, 
    arabic: 'الْغَفُورُ', 
    transliteration: 'el-Gafûr', 
    meaning: 'Mağfireti bol olan, günahları affeden.', 
    question: 'Affedilmeyi beklerken ben affedici olabiliyor muyum?', 
    dua: 'Ey Gafûr, günahlarımı bağışla, beni affedilmiş kullarından eyle.' 
  },
  { 
    id: 36, 
    arabic: 'الشَّكُورُ', 
    transliteration: 'eş-Şekûr', 
    meaning: 'Az amele çok sevap veren, şükrü kabul eden.', 
    question: 'Verdiği sayısız nimetler için ne kadar şükrediyorum?', 
    dua: 'Ey Şekûr, azıcık ibadetimi kabul buyur, beni şükredici bir kul eyle.' 
  },
  { 
    id: 37, 
    arabic: 'الْعَلِيُّ', 
    transliteration: 'el-Aliyy', 
    meaning: 'Yücelikte eşi benzeri olmayan, pek yüce.', 
    question: 'Yüceliği makamda mevkide mi arıyorum?', 
    dua: 'Ey Aliyy, himmetimi ve gayemi yüce kıl, süfli heveslerden kurtar.' 
  },
  { 
    id: 38, 
    arabic: 'الْكَبِيرُ', 
    transliteration: 'el-Kebîr', 
    meaning: 'Büyüklüğüne sınır olmayan, mutlak büyük.', 
    question: 'Gözümde büyüttüğüm dertlerin O’nun yanında ne kadar küçük olduğunu biliyor muyum?', 
    dua: 'Ey Kebîr, dertlerimi değil, Senin büyüklüğünü anmayı nasip et.' 
  },
  { 
    id: 39, 
    arabic: 'الْحَفِيظُ', 
    transliteration: 'el-Hafîz', 
    meaning: 'Her şeyi koruyan ve muhafaza eden.', 
    question: 'Beni her türlü tehlikeden koruyanın O olduğunu hatırlıyor muyum?', 
    dua: 'Ey Hafîz, beni, ailemi ve imanımı her türlü şerden muhafaza eyle.' 
  },
  { 
    id: 40, 
    arabic: 'الْمُقِيتُ', 
    transliteration: 'el-Mukît', 
    meaning: 'Her yaratılmışın gıdasını ve azığını veren.', 
    question: 'Ruhumu da manevi gıdalarla besliyor muyum?', 
    dua: 'Ey Mukît, bedenime sağlık, ruhuma manevi gıdalar ihsan eyle.' 
  },
  { 
    id: 41, 
    arabic: 'الْحَسِيبُ', 
    transliteration: 'el-Hasîb', 
    meaning: 'Herkesin hesabını en ince detayına kadar gören.', 
    question: 'Hesap günü gelmeden nefsimi hesaba çekiyor muyum?', 
    dua: 'Ey Hasîb, hesabımı kolaylaştır, beni zorlu sorgudan muaf tut.' 
  },
  { 
    id: 42, 
    arabic: 'الْجَلِيلُ', 
    transliteration: 'el-Celîl', 
    meaning: 'Celal ve azamet sahibi.', 
    question: 'O’nun celalinden hakkıyla korkup saygı duyuyor muyum?', 
    dua: 'Ey Celîl, kalbime Senin korkunu ve saygını yerleştir.' 
  },
  { 
    id: 43, 
    arabic: 'الْكَرِيمُ', 
    transliteration: 'el-Kerîm', 
    meaning: 'Çok cömert, ikramı bol olan.', 
    question: 'Rabbimin cömertliği karşısında ben cimrilik yapıyor muyum?', 
    dua: 'Ey Kerîm, bana cömertliğinden ikram et, beni de cömert eyle.' 
  },
  { 
    id: 44, 
    arabic: 'الرَّقِيبُ', 
    transliteration: 'er-Rakîb', 
    meaning: 'Her varlığı her an gözeten ve kontrol eden.', 
    question: 'Yalnız kaldığımda bile O’nun gözetimi altında olduğumu biliyor muyum?', 
    dua: 'Ey Rakîb, her halimi ıslah et, beni bir an bile nefsimle baş başa bırakma.' 
  },
  { 
    id: 45, 
    arabic: 'الْمُجِيبُ', 
    transliteration: 'el-Mucîb', 
    meaning: 'Duaları ve istekleri kabul eden.', 
    question: 'Dualarımın kabul olacağına inancım tam mı?', 
    dua: 'Ey Mucîb, ellerimi boş çevirme, dualarımı kabul buyur.' 
  },
  { 
    id: 46, 
    arabic: 'الْوَاسِعُ', 
    transliteration: 'el-Vâsi', 
    meaning: 'İlmi ve rahmeti her şeyi kuşatan, geniş olan.', 
    question: 'Rabbimin rahmetinin günahlarımdan daha geniş olduğunu biliyor muyum?', 
    dua: 'Ey Vâsi, ilmimi artır, gönlümü ve rızkımı genişlet.' 
  },
  { 
    id: 47, 
    arabic: 'الْحَكِيمُ', 
    transliteration: 'el-Hakîm', 
    meaning: 'Her işi hikmetli olan, her şeyi yerli yerinde yapan.', 
    question: 'Başıma gelen olaylardaki hikmeti arıyor muyum?', 
    dua: 'Ey Hakîm, bana olayların ardındaki hikmeti kavrayacak feraset ver.' 
  },
  { 
    id: 48, 
    arabic: 'الْوَدُودُ', 
    transliteration: 'el-Vedûd', 
    meaning: 'Kullarını çok seven ve sevilmeye en layık olan.', 
    question: 'O’nu her şeyden daha çok seviyor muyum?', 
    dua: 'Ey Vedûd, Sen beni sev, sevdiklerini sevdir, Senin sevgine ulaştıracak amelleri sevdir.' 
  },
  { 
    id: 49, 
    arabic: 'الْمَجِيدُ', 
    transliteration: 'el-Mecîd', 
    meaning: 'Şanı yüce ve övülmeye layık olan.', 
    question: 'Övgülerin en güzeline O’nun layık olduğunu biliyor muyum?', 
    dua: 'Ey Mecîd, şanını yücelt, beni rızana uygun amellerle şereflendir.' 
  },
  { 
    id: 50, 
    arabic: 'الْبَاعِثُ', 
    transliteration: 'el-Bâis', 
    meaning: 'Ölüleri dirilten, peygamberler gönderen.', 
    question: 'Öldükten sonra dirilişe ne kadar hazırlıklıyım?', 
    dua: 'Ey Bâis, kalbimi iman nuruyla dirilt, beni haşr gününde mahcup etme.' 
  },
  { 
    id: 51, 
    arabic: 'الشَّهِيدُ', 
    transliteration: 'eş-Şehîd', 
    meaning: 'Her şeye şahit olan, her yerde hazır bulunan.', 
    question: 'Yaptığım her şeye O’nun şahit olduğunu unutuyor muyum?', 
    dua: 'Ey Şehîd, şahitliğinden yüzümü kızartacak amellerden Sana sığınırım.' 
  },
  { 
    id: 52, 
    arabic: 'الْحَقُّ', 
    transliteration: 'el-Hakk', 
    meaning: 'Varlığı hiç değişmeden duran, gerçek olan.', 
    question: 'Hayatımı hakikat üzerine mi, yoksa yalanlar üzerine mi kuruyorum?', 
    dua: 'Ey Hakk, bana hakkı hak olarak gösterip ona uymayı nasip et.' 
  },
  { 
    id: 53, 
    arabic: 'الْوَكِيلُ', 
    transliteration: 'el-Vekîl', 
    meaning: 'Kendisine güvenilip dayanılan, işleri en güzel şekilde yoluna koyan.', 
    question: 'İşlerimi O’na havale edip gerçekten tevekkül ediyor muyum?', 
    dua: 'Ey Vekîl, işlerimi Sana bıraktım, benim için en hayırlısını nasip eyle.' 
  },
  { 
    id: 54, 
    arabic: 'الْقَوِيُّ', 
    transliteration: 'el-Kaviyy', 
    meaning: 'Pek güçlü, kuvvetli, her şeye gücü yeten.', 
    question: 'Gücü kendimden mi, yoksa O’ndan mı biliyorum?', 
    dua: 'Ey Kaviyy, İslam yolunda bana güç ve kuvvet ver, beni aciz bırakma.' 
  },
  { 
    id: 55, 
    arabic: 'الْمَتِينُ', 
    transliteration: 'el-Metîn', 
    meaning: 'Çok sağlam, sarsılmaz kudret sahibi.', 
    question: 'İmanım zorluklar karşısında ne kadar sağlam?', 
    dua: 'Ey Metîn, dinim ve imanım konusunda ayaklarımı sabit kıl.' 
  },
  { 
    id: 56, 
    arabic: 'الْوَلِيُّ', 
    transliteration: 'el-Veliyy', 
    meaning: 'İnananların dostu ve yardımcısı.', 
    question: 'Allah’ı dost edinenleri dost ediniyor muyum?', 
    dua: 'Ey Veliyy, beni dostluğuna kabul et, beni sahipsiz bırakma.' 
  },
  { 
    id: 57, 
    arabic: 'الْحَمِيدُ', 
    transliteration: 'el-Hamîd', 
    meaning: 'Her türlü övgüye layık olan.', 
    question: 'Her halimde O’na hamd ediyor muyum?', 
    dua: 'Ey Hamîd, dilimi hamdinden, kalbimi şükründen ayırma.' 
  },
  { 
    id: 58, 
    arabic: 'الْمُحْصِي', 
    transliteration: 'el-Muhsî', 
    meaning: 'Her şeyin sayısını tek tek bilen.', 
    question: 'Nefeslerimin sayılı olduğunu ve bir gün biteceğini biliyor muyum?', 
    dua: 'Ey Muhsî, kalan ömrümü geçen ömrümden hayırlı eyle.' 
  },
  { 
    id: 59, 
    arabic: 'الْمُبْدِئُ', 
    transliteration: 'el-Mubdi', 
    meaning: 'Varlıkları örneksiz olarak ilk defa yaratan.', 
    question: 'Her başlangıcın O’nun izniyle olduğunu biliyor muyum?', 
    dua: 'Ey Mubdi, her hayırlı işimde bana güzel başlangıçlar nasip et.' 
  },
  { 
    id: 60, 
    arabic: 'الْمُعِيدُ', 
    transliteration: 'el-Muîd', 
    meaning: 'Yaratılmışları öldükten sonra tekrar dirilten.', 
    question: 'Tekrar diriltileceğim güne ne hazırladım?', 
    dua: 'Ey Muîd, beni huzuruna tertemiz bir şekilde geri döndür.' 
  },
  { 
    id: 61, 
    arabic: 'الْمُحْيِي', 
    transliteration: 'el-Muhyî', 
    meaning: 'Can veren, hayat bahşeden.', 
    question: 'Kalbimi Kuran ve iman ile diriltiyor muyum?', 
    dua: 'Ey Muhyî, kalbimi iman nuruyla, bedenimi sağlıkla yaşat.' 
  },
  { 
    id: 62, 
    arabic: 'الْمُمِيتُ', 
    transliteration: 'el-Mumît', 
    meaning: 'Canlıların hayatına son veren, öldüren.', 
    question: 'Ölümün bir yok oluş değil, O’na kavuşma olduğunu biliyor muyum?', 
    dua: 'Ey Mumît, bana imanla dolu hayırlı bir ölüm nasip eyle.' 
  },
  { 
    id: 63, 
    arabic: 'الْحَيُّ', 
    transliteration: 'el-Hayy', 
    meaning: 'Ezeli ve ebedi hayat sahibi, diri.', 
    question: 'Gerçek hayatın ahiret hayatı olduğunun farkında mıyım?', 
    dua: 'Ey Hayy, kalbimi gaflet uykusundan uyandır, beni diri tut.' 
  },
  { 
    id: 64, 
    arabic: 'الْقَيُّومُ', 
    transliteration: 'el-Kayyûm', 
    meaning: 'Kendi kendine var olan, her şeyi ayakta tutan.', 
    question: 'Her an O’nun kudretiyle ayakta durduğumu biliyor muyum?', 
    dua: 'Ey Kayyûm, rahmetinle yardım istiyorum, işlerimi yoluna koy.' 
  },
  { 
    id: 65, 
    arabic: 'الْوَاجِدُ', 
    transliteration: 'el-Wâcid', 
    meaning: 'İstediğini istediği zaman bulan, hiçbir şeye muhtaç olmayan.', 
    question: 'Aradığım huzuru O’nda bulabiliyor muyum?', 
    dua: 'Ey Wâcid, kaybettiklerim için üzülmemeyi, Seni bulunca her şeyi bulmuş olmayı nasip et.' 
  },
  { 
    id: 66, 
    arabic: 'الْمَاجِدُ', 
    transliteration: 'el-Mâcid', 
    meaning: 'Şanı ve keremi sonsuz olan.', 
    question: 'O’nun keremine layık işler yapıyor muyum?', 
    dua: 'Ey Mâcid, ikramınla beni zenginleştir, ahlakımı güzelleştir.' 
  },
  { 
    id: 67, 
    arabic: 'الْوَاحِدُ', 
    transliteration: 'el-Vâhid', 
    meaning: 'Tek ve bir olan, ortağı olmayan.', 
    question: 'Kalbimi sadece O’na mı bağladım, yoksa başka sevgiler mi var?', 
    dua: 'Ey Vâhid, kalbimde Senden başkasına yer bırakma, tevhirden ayırma.' 
  },
  { 
    id: 68, 
    arabic: 'الصَّمَدُ', 
    transliteration: 'es-Samed', 
    meaning: 'Her şeyin kendisine muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan.', 
    question: 'İhtiyaçlarımı insanlardan mı, yoksa Samed olan Allah’tan mı istiyorum?', 
    dua: 'Ey Samed, beni kimseye muhtaç etme, sadece Sana el açtır.' 
  },
  { 
    id: 69, 
    arabic: 'الْقَادِرُ', 
    transliteration: 'el-Kâdir', 
    meaning: 'İstediğini yapmaya gücü yeten.', 
    question: 'O’nun her şeye gücünün yettiğine tam anlamıyla güveniyor muyum?', 
    dua: 'Ey Kâdir, acizliğime merhamet et, gücünle beni destekle.' 
  },
  { 
    id: 70, 
    arabic: 'الْمُقْتَدِرُ', 
    transliteration: 'el-Muktedir', 
    meaning: 'Kuvvet ve kudret sahipleri üzerinde dilediği gibi tasarruf eden.', 
    question: 'Gücümü hayırda mı, şerde mi kullanıyorum?', 
    dua: 'Ey Muktedir, beni gücünü zulümde değil, adalette kullananlardan eyle.' 
  },
  { 
    id: 71, 
    arabic: 'الْمُقَدِّمُ', 
    transliteration: 'el-Mukaddim', 
    meaning: 'Dilediğini öne alan, yükselten.', 
    question: 'Hayırlı işlerde öne geçmek için gayret ediyor muyum?', 
    dua: 'Ey Mukaddim, beni hayır yarışlarında en önde gidenlerden eyle.' 
  },
  { 
    id: 72, 
    arabic: 'الْمُؤَخِّرُ', 
    transliteration: 'el-Muahhir', 
    meaning: 'Dilediğini geriye bırakan, erteleyen.', 
    question: 'Tövbeyi ve ibadetleri erteliyor muyum?', 
    dua: 'Ey Muahhir, kötü arzularımı ertele, tövbemi ve ibadetimi geciktirme.' 
  },
  { 
    id: 73, 
    arabic: 'الأَوَّلُ', 
    transliteration: 'el-Evvel', 
    meaning: 'Varlığının başlangıcı olmayan, ezeli.', 
    question: 'Her işime O’nun adıyla başlıyor muyum?', 
    dua: 'Ey Evvel, her işimin başını hayırlı, sonunu selametli eyle.' 
  },
  { 
    id: 74, 
    arabic: 'الآخِرُ', 
    transliteration: 'el-Âhir', 
    meaning: 'Varlığının sonu olmayan, ebedi.', 
    question: 'Son nefesimde O’na imanla kavuşabilecek miyim?', 
    dua: 'Ey Âhir, son nefesimde kelime-i şehadet ile çene kapamayı nasip eyle.' 
  },
  { 
    id: 75, 
    arabic: 'الظَّاهِرُ', 
    transliteration: 'ez-Zâhir', 
    meaning: 'Varlığı açık, aşikâr olan, eserleriyle bilinen.', 
    question: 'Kainattaki eserlerine bakıp O’nu görüyor muyum?', 
    dua: 'Ey Zâhir, varlığının delillerini görmeyi ve idrak etmeyi nasip et.' 
  },
  { 
    id: 76, 
    arabic: 'الْبَاطِنُ', 
    transliteration: 'el-Bâtın', 
    meaning: 'Akılların idrak edemeyeceği kadar gizli olan.', 
    question: 'Kalbimin derinliklerindeki niyetlerimi O’nun bildiğini hissediyor muyum?', 
    dua: 'Ey Bâtın, içimi dışımdan, gizlimi açığımdan daha hayırlı eyle.' 
  },
  { 
    id: 77, 
    arabic: 'الْوَالِي', 
    transliteration: 'el-Vâlî', 
    meaning: 'Bütün kainatı idare eden, yöneten.', 
    question: 'Hayatımın yönetimini O’nun rızasına göre yapıyor muyum?', 
    dua: 'Ey Vâlî, bizi salih kullarınla beraber yönet, şerlilerin eline bırakma.' 
  },
  { 
    id: 78, 
    arabic: 'الْمُتَعَالِي', 
    transliteration: 'el-Muteâlî', 
    meaning: 'Aklın tasavvur ettiği her şeyden yüce olan.', 
    question: 'Düşüncelerimi O’nun yüceliğine yakışır seviyede tutuyor muyum?', 
    dua: 'Ey Muteâlî, himmetimi yükselt, beni dünya heveslerinden kurtar.' 
  },
  { 
    id: 79, 
    arabic: 'الْبَرُّ', 
    transliteration: 'el-Berr', 
    meaning: 'İyiliği ve lütfu bol olan, kullarına karşı şefkatli.', 
    question: 'Ben de insanlara karşı iyiliksever miyim?', 
    dua: 'Ey Berr, bana iyilik yapmayı ve iyilerden olmayı sevdir.' 
  },
  { 
    id: 80, 
    arabic: 'التَّوَّابُ', 
    transliteration: 'et-Tevvâb', 
    meaning: 'Tövbeleri kabul eden, günahları bağışlayan.', 
    question: 'Günah işlediğimde hemen tövbeye sarılıyor muyum?', 
    dua: 'Ey Tevvâb, tövbemi kabul et, beni günahlarında ısrar etmeyenlerden eyle.' 
  },
  { 
    id: 81, 
    arabic: 'الْمُنْتَقِمُ', 
    transliteration: 'el-Muntekim', 
    meaning: 'Suçluları adaletiyle cezalandıran.', 
    question: 'Başkasına zulmedip O’nun gazabını çekmekten korkuyor muyum?', 
    dua: 'Ey Muntekim, zalimlerin şerrinden Sana sığınırım, hakkımı Sen al.' 
  },
  { 
    id: 82, 
    arabic: 'الْعَفُوُّ', 
    transliteration: 'el-Afuv', 
    meaning: 'Çok affedici, günahları tamamen silen.', 
    question: 'Bana kötülük yapanları ben de affedebiliyor muyum?', 
    dua: 'Ey Afuv, Sen affedicisin, affetmeyi seversin, beni de affet.' 
  },
  { 
    id: 83, 
    arabic: 'الرَّؤُوفُ', 
    transliteration: 'er-Raûf', 
    meaning: 'Çok şefkatli ve merhametli.', 
    question: 'İnsanlara ve diğer canlılara şefkatle yaklaşıyor muyum?', 
    dua: 'Ey Raûf, kalbimi şefkat ve merhametle doldur.' 
  },
  { 
    id: 84, 
    arabic: 'مَالِكُ الْمُلْكِ', 
    transliteration: 'Mâlik-ul Mülk', 
    meaning: 'Mülkün ebedi ve mutlak sahibi.', 
    question: 'Elimdeki nimetlerin emanet olduğunu biliyor muyum?', 
    dua: 'Ey Mâlik-ul Mülk, mülkünde rızana uygun tasarruf etmeyi nasip eyle.' 
  },
  { 
    id: 85, 
    arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', 
    transliteration: 'Zü’l-Celâli ve’l-İkrâm', 
    meaning: 'Hem büyüklük hem de kerem ve ikram sahibi.', 
    question: 'O’na hem saygı duyup hem de lütfunu ümit ediyor muyum?', 
    dua: 'Ey Zü’l-Celâli ve’l-İkrâm, bana celalinle vakar, ikramınla lütuf bahşet.' 
  },
  { 
    id: 86, 
    arabic: 'الْمُقْسِطُ', 
    transliteration: 'el-Muksit', 
    meaning: 'Bütün işlerini denk ve birbirine uygun yapan, adaletli.', 
    question: 'Hayatımda dengeyi ve adaleti koruyor muyum?', 
    dua: 'Ey Muksit, beni her işinde adaletli olan ve aşırılıktan kaçınan kullarından eyle.' 
  },
  { 
    id: 87, 
    arabic: 'الْجَامِعُ', 
    transliteration: 'el-Câmi', 
    meaning: 'İstediğini istediği zaman istediği yerde toplayan.', 
    question: 'İyi huyları ve güzel insanları çevremde topluyor muyum?', 
    dua: 'Ey Câmi, beni salih kullarınla ve cennetinde sevdiklerimle bir araya getir.' 
  },
  { 
    id: 88, 
    arabic: 'الْغَنِيُّ', 
    transliteration: 'el-Ganiyy', 
    meaning: 'Çok zengin, hiçbir şeye muhtaç olmayan.', 
    question: 'Zenginliği malda mı, gönülde mi arıyorum?', 
    dua: 'Ey Ganiyy, beni Senden başkasına muhtaç etme, gönül zenginliği ver.' 
  },
  { 
    id: 89, 
    arabic: 'الْمُغْنِي', 
    transliteration: 'el-Mugnî', 
    meaning: 'Dilediğini zengin kılan.', 
    question: 'Başkalarının ihtiyacını gidererek manevi zenginliğe eriyor muyum?', 
    dua: 'Ey Mugnî, beni helalinden zengin kıl, harama tenezzül ettirme.' 
  },
  { 
    id: 90, 
    arabic: 'الْمَانِعُ', 
    transliteration: 'el-Mâni', 
    meaning: 'Dilemediği şeyin gerçekleşmesine izin vermeyen, engelleyen.', 
    question: 'Bir işim olmadığında bunda bir hayır olduğunu düşünüyor muyum?', 
    dua: 'Ey Mâni, beni günahlardan ve bana zarar verecek şeylerden alıkoy.' 
  },
  { 
    id: 91, 
    arabic: 'الضَّارُ', 
    transliteration: 'ed-Dârr', 
    meaning: 'Elem ve zarar verecek şeyleri yaratan.', 
    question: 'Zararın da faydanın da O’ndan geldiğine inanıyor muyum?', 
    dua: 'Ey Dârr, her türlü zarardan ve musibetten Sana sığınırım.' 
  },
  { 
    id: 92, 
    arabic: 'النَّافِعُ', 
    transliteration: 'en-Nâfi', 
    meaning: 'Fayda veren, yararlı şeyleri yaratan.', 
    question: 'İnsanlara faydalı bir birey miyim?', 
    dua: 'Ey Nâfi, ilmimi ve ömrümü insanlara faydalı kıl.' 
  },
  { 
    id: 93, 
    arabic: 'النُّورُ', 
    transliteration: 'en-Nûr', 
    meaning: 'Alemleri nurlandıran, aydınlatan.', 
    question: 'Kalbimi ve yüzümü ibadet nuruyla aydınlatıyor muyum?', 
    dua: 'Ey Nûr, kabrimi ve kalbimi iman nuruyla aydınlat, önümü görmemi sağla.' 
  },
  { 
    id: 94, 
    arabic: 'الْهَادِي', 
    transliteration: 'el-Hâdî', 
    meaning: 'Hidayet veren, doğru yolu gösteren.', 
    question: 'Doğru yolda kalmak için çaba sarf ediyor muyum?', 
    dua: 'Ey Hâdî, beni dosdoğru yoluna (Sırat-ı Müstakim) ilet ve orada sabit kıl.' 
  },
  { 
    id: 95, 
    arabic: 'الْبَدِيعُ', 
    transliteration: 'el-Bedî', 
    meaning: 'Eşi ve benzeri olmayan harikalar yaratan.', 
    question: 'Yaratılan eşsiz güzelliklere bakıp hayranlık duyuyor muyum?', 
    dua: 'Ey Bedî, ömrümü ve amellerimi güzelleştir, beni şaşırtıcı lütuflarına mazhar et.' 
  },
  { 
    id: 96, 
    arabic: 'الْبَاقِي', 
    transliteration: 'el-Bâkî', 
    meaning: 'Varlığının sonu olmayan, ebedi kalan.', 
    question: 'Fani dünyaya mı, yoksa Baki olan Allah’a mı bağlanıyorum?', 
    dua: 'Ey Bâkî, fani dertlerle beni yorma, ebedi huzuruna kabul et.' 
  },
  { 
    id: 97, 
    arabic: 'الْوَارِثُ', 
    transliteration: 'el-Vâris', 
    meaning: 'Her şeyin asıl sahibi, mülk kendisine kalan.', 
    question: 'Bırakıp gideceğim mirasın hesabını nasıl vereceğimi düşünüyorum?', 
    dua: 'Ey Vâris, bana arkamdan hayırla anılacak sadaka-i cariyeler bırakmayı nasip et.' 
  },
  { 
    id: 98, 
    arabic: 'الرَّشِيدُ', 
    transliteration: 'er-Reşîd', 
    meaning: 'Doğru yolu gösteren, işleri en güzel sonuca ulaştıran.', 
    question: 'Kararlarımda O’nun rızasını gözetiyor muyum?', 
    dua: 'Ey Reşîd, bana rüştü ve doğruyu ilham et, yanlış kararlardan koru.' 
  },
  { 
    id: 99, 
    arabic: 'الصَّبُورُ', 
    transliteration: 'es-Sabûr', 
    meaning: 'Çok sabırlı olan, cezalandırmada acele etmeyen.', 
    question: 'Başıma gelenlere sabredebiliyor muyum?', 
    dua: 'Ey Sabûr, bana musibetler karşısında peygamber sabrı ver, acelecilikten koru.' 
  }
];

// ==========================================
// 3. UYGULAMA MANTIĞI
// ==========================================
function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starArray = Array.from({ length: 150 }).map((_, i) => ({
      id: `star-${i}`,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 2.5 + 0.5 + 'px',
      dur: Math.random() * 4 + 2 + 's'
    }));
    setStars(starArray);
  }, []);

  const getRandomIndex = () => {
    if (esmaData.length <= 1) return 0;
    let newIndex;
    do { newIndex = Math.floor(Math.random() * esmaData.length); } while (newIndex === currentIndex);
    return newIndex;
  };

  const handleStart = () => {
    setCurrentIndex(getRandomIndex());
    setStarted(true);
  };

  const handleNext = () => {
    setFading(true);
    setTimeout(() => {
      setCurrentIndex(getRandomIndex());
      setFading(false);
    }, 600);
  };

  const currentEsma = esmaData[currentIndex];

  return (
    <>
      <style>{styles}</style>

      {/* ARKA PLAN */}
      <div className="cosmos-container">
        <div className="nebula-bright"></div>
        <div className="stars-layer">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star-static"
              style={{ left: star.left, top: star.top, width: star.size, height: star.size, '--dur': star.dur }}
            />
          ))}
        </div>
        {/* Kayan Yıldızlar */}
        <div className="shooting-star" style={{ top: '20%', left: '80%', '--len': '180px', '--delay': '1s' }}></div>
        <div className="shooting-star" style={{ top: '15%', left: '40%', '--len': '220px', '--delay': '6s' }}></div>
        <div className="shooting-star" style={{ top: '70%', left: '90%', '--len': '150px', '--delay': '11s' }}></div>
      </div>

      {/* GİRİŞ */}
      <div className={`intro-overlay ${started ? 'zoom-out' : ''}`}>
        <div className="intro-title-wrapper">
          <h1 className="intro-title">ESMA-ÜL HÜSNA</h1>
          <div className="intro-subtitle">99 Güzel İsim</div>
        </div>
        <button onClick={handleStart} className="glow-btn">
          BAŞLA
        </button>
      </div>

      {/* KART */}
      <div className={`main-content ${started ? 'visible' : ''}`}>
        <div className="glass-card">
          <div className="card-inner">
            <div className={`fade-content ${fading ? 'fade-out' : 'fade-in'}`}>
              
              <div className="arabic-title">{currentEsma.arabic}</div>
              <div className="reading-text">{currentEsma.transliteration}</div>
              
              <div className="blue-divider"></div>

              <div className="meaning-text">
                {currentEsma.meaning}
              </div>

              <div className="box-tefekkur">
                <h4>Tefekkür</h4>
                <p>"{currentEsma.question}"</p>
              </div>

              <div className="box-dua">
                <div className="dua-badge">Dua</div>
                {/* DUA METNİ BURADA GÖSTERİLİYOR */}
                <p>"{currentEsma.dua}"</p>
              </div>

            </div>
          </div>
          <button onClick={handleNext} className="next-btn">
            SIRADAKİ İSİM
          </button>
        </div>
      </div>
    </>
  );
}

export default App;