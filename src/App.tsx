import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (GÖK YÜZÜ & NUR KONSEPTİ - GÜNCELLENMİŞ)
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
  
  /* Başlık: Artık Beyaz ve Parlak */
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
    /* Daha şeffaf ve parlak cam */
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255,255,255, 0.2) inset,
      0 0 30px rgba(255, 255, 255, 0.1); /* Dış parlama */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 40px; padding: 3rem 2rem;
    text-align: center; position: relative;
  }
  
  /* --- YENİ BUĞULU YAZI EFEKTLERİ --- */
  /* Arapça: Altın gibi parlayan, etrafı huzme saçan */
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 0%, #fbbf24 50%, #d97706 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    /* Buğulu Efekt (Glow) */
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.3));
  }
  
  .transliteration-mist { 
    color: #e0f2fe; /* Çok açık mavi */
    font-weight: 300; 
    text-shadow: 0 0 10px rgba(224, 242, 254, 0.6); /* Hafif puslu */
  }

  .meaning-mist { 
    color: #ffffff; 
    font-weight: 500; 
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .question-box {
    background: rgba(255, 255, 255, 0.1); /* Daha şeffaf */
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 1rem; padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }
  
  .question-text { 
    color: #bae6fd; /* Sky Blue */
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
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Kâinatın tek yaratıcısı.', question: 'Kendinden büyük bir güce teslim olmak sana ne hissettiriyor?' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhamet sahibi.', question: 'Bugün gökyüzüne bakıp O’nun rahmetini hissettin mi?' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Merhametiyle kuşatan.', question: 'Kendine gösterdiğin şefkat yeterli mi?' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Mülkün gerçek sahibi.', question: 'Sahip olduğunu sandığın ne aslında sadece bir emanet?' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Her eksikten münezzeh.', question: 'Ruhunu bugün hangi olumsuz düşüncelerden arındırmak istersin?' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik veren.', question: 'İçindeki savaşı bitirmek için neye ihtiyacın var?' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Güven veren.', question: 'Bugün kime güvenli bir liman olabilirsin?' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Gözetip koruyan.', question: 'Kontrol etmeyi bırakıp akışa güvenebilir misin?' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'İzzet sahibi, üstün.', question: 'Onurunu korumak için bugün ne yapmalısın?' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yaptıran, onaran.', question: 'Kırık kalbini onarması için O’na izin ver.' },
  { id: 11, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Yaratan.', question: 'Hayatında bugün neyi yeniden inşa etmek istersin?' },
  { id: 12, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Sürekli affeden.', question: 'Bugün kimi affederek kalbini özgürleştirebilirsin?' },
  { id: 13, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Rızık veren.', question: 'Ruhunun şu an neye ihtiyacı var?' },
  { id: 14, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Hayır kapılarını açan.', question: 'Kapanan bir kapının ardındaki hayrı görebiliyor musun?' },
  { id: 15, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Çok seven, sevilen.', question: 'Allah’ın seni ne kadar sevdiğini hissediyor musun?' },
  { id: 16, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Her işi hikmetli.', question: 'Başına gelen zorluktaki gizli hikmeti görebiliyor musun?' },
  { id: 17, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Dualara karşılık veren.', question: 'En samimi duan nedir?' },
  { id: 18, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Alemleri aydınlatan.', question: 'Hayatının hangi karanlık noktasına ışık tutmalısın?' },
  { id: 19, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Hidayet veren, yol gösteren.', question: 'Hangi konuda bir işarete, bir rehbere ihtiyacın var?' },
  { id: 20, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Çok sabırlı.', question: 'Sabrın sonundaki selameti bekliyor musun?' }
];
// ==========================================
// 3. UYGULAMA MANTIĞI (APP COMPONENT)
// ==========================================
function App() {
  const [viewState, setViewState] = useState<'intro' | 'warping' | 'card'>('intro');
  const [flash, setFlash] = useState(false); 
  const [currentEsma, setCurrentEsma] = useState(esmaData[0]);
  const [contentFading, setContentFading] = useState(false);
  const [stars, setStars] = useState<{ id: number; style: any; type: 'small' | 'sparkle' }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; style: any }[]>([]);

  useEffect(() => {
    // 1. ALTIN TOZLARI (Particles)
    // Aydınlık temada göz yormaması için sayıyı optimum tuttuk
    const starCount = 200; 
    const newStars: { id: number; style: any; type: 'small' | 'sparkle' }[] = [];
    
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

    // 2. SÜZÜLEN IŞIK HUZMELERİ (Shooting Stars yerine Light Beams)
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
            <h1 className="text-7xl md:text-9xl mb-6 font-bold title-dark title-font tracking-tighter">
              Hüsn-ü Hal
            </h1>
            <p className="text-xl md:text-3xl subtitle-gold tracking-[0.5em] font-light uppercase mb-12 title-font">
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
                <h2 className="text-8xl md:text-9xl arabic-font gold-text mb-4 drop-shadow-xl">
                  {currentEsma.arabic}
                </h2>
                <h3 className="text-3xl transliteration-text title-font font-light tracking-[0.2em] opacity-90">
                  {currentEsma.transliteration}
                </h3>
              </div>

              {/* Ayırıcı Çizgi */}
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8 opacity-60"></div>

              {/* Anlam ve Soru */}
              <div className="mb-10">
                <p className="text-2xl meaning-text font-light body-font leading-relaxed mb-8">
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