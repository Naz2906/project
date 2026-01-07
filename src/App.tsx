import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (DUA KISMI EKLENDİ)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.1; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }

  /* --- SAYFA YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center bottom, #1e293b 0%, #0f172a 40%, #020617 100%);
    z-index: 0; overflow: hidden; perspective: 1000px;
  }

  .light-beams {
    position: absolute; top: 50%; left: 50%; width: 200vw; height: 200vw;
    transform: translate(-50%, -50%);
    background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.03) 0deg, rgba(255, 255, 255, 0) 15deg, rgba(255, 255, 255, 0.03) 30deg);
    animation: rotate-beams 60s linear infinite; z-index: 1; pointer-events: none;
    mask-image: radial-gradient(circle, black 0%, transparent 70%);
  }
  @keyframes rotate-beams { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

  .ambient-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
    filter: blur(80px); animation: pulse-glow 8s infinite ease-in-out; z-index: 1;
  }
  @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); } }

  .nebula {
    position: absolute; width: 100%; height: 100%;
    background: radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%);
    filter: blur(60px); z-index: 2;
  }

  /* --- YILDIZLAR --- */
  .star-field { position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; z-index: 3; }
  .star-small {
    position: absolute; background: #fff; border-radius: 50%; width: 2px; height: 2px;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8); animation: twinkle 4s infinite ease-in-out;
  }
  .star-sparkle {
    position: absolute; background: #fffbeb; width: 3px; height: 3px; border-radius: 50%;
    animation: float-sparkle 6s infinite ease-in-out; box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
  }
  @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
  @keyframes float-sparkle { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; } 50% { transform: translateY(-20px) scale(1.3); opacity: 1; } }

  .warping .star-small, .warping .star-sparkle {
    transition: transform 1.5s ease-in; transform: scale(0) translateZ(-1000px) !important; opacity: 0; 
  }

  /* --- GİRİŞ --- */
  .intro-container {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;
    transition: opacity 1.2s ease-in-out;
  }
  .extreme-zoom-in { animation: extreme-zoom 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; text-align: center; }
  @keyframes extreme-zoom { 0% { opacity: 0; transform: scale(0.8) translateZ(-500px); letter-spacing: -10px; filter: blur(15px); } 100% { opacity: 1; transform: scale(1) translateZ(0); letter-spacing: normal; filter: blur(0); } }
  
  .title-glow { color: #ffffff; text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(14, 165, 233, 0.5); }
  .subtitle-light { color: #bae6fd; letter-spacing: 0.6em; text-shadow: 0 0 15px rgba(186, 230, 253, 0.5); font-weight: 600; }

  .start-btn {
    padding: 1.2rem 4rem; font-size: 1.3rem; color: #020617; background: #fff; border: none; border-radius: 999px; cursor: pointer; margin-top: 3.5rem;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4); transition: all 0.4s ease; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; position: relative; overflow: hidden;
  }
  .start-btn:hover { transform: scale(1.05); box-shadow: 0 0 60px rgba(255, 255, 255, 0.8); }
  .start-btn::after {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.8), transparent);
    transform: rotate(45deg) translate(-100%, -100%); animation: shimmer 3s infinite;
  }
  @keyframes shimmer { 100% { transform: rotate(45deg) translate(100%, 100%); } }

  /* --- KART --- */
  .content-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1200px; }
  .card-explosion { animation: card-appear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes card-appear { from { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(10px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }

  .crystal-card {
    width: 90%; max-width: 550px; /* Kartı biraz daralttık */
    background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255, 0.1) inset;
    backdrop-filter: blur(25px); border-radius: 40px; padding: 2.5rem 2rem;
    text-align: center; position: relative; overflow: hidden;
  }
  
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 10%, #fbbf24 50%, #d97706 90%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.5));
  }
  .transliteration-mist { color: #e0f2fe; font-weight: 300; text-shadow: 0 0 15px rgba(224, 242, 254, 0.5); }
  .meaning-mist { color: #ffffff; font-weight: 500; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }

  .question-box {
    background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 1rem; padding: 1.2rem; margin-bottom: 1.5rem;
  }
  .question-text { color: #bae6fd; font-style: italic; text-shadow: 0 0 8px rgba(186, 230, 253, 0.3); font-size: 1.1rem; }

  /* --- YENİ: DUA KUTUSU --- */
  .dua-container {
    position: relative;
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
    border-top: 1px solid rgba(251, 191, 36, 0.2);
    border-bottom: 1px solid rgba(251, 191, 36, 0.2);
    background: radial-gradient(circle, rgba(251, 191, 36, 0.05) 0%, transparent 70%);
  }
  
  .dua-label {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: #0f172a; padding: 0 15px;
    color: #fbbf24; font-family: 'Cinzel', serif; font-size: 0.9rem; letter-spacing: 0.2em;
    border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 20px;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
  }

  .dua-text {
    font-family: 'Scheherazade New', serif; /* Dua için özel font */
    font-size: 1.6rem; 
    color: #fef3c7;
    line-height: 1.3;
    font-weight: 400;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  }

  .action-btn {
    border: 1px solid #fbbf24; color: #fbbf24; background: rgba(0,0,0,0.3);
    padding: 1rem 3rem; border-radius: 999px;
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
// 2. VERİ SETİ (DUA EKLENDİ)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Kâinatın tek yaratıcısı.', question: 'Hayatımın merkezinde gerçekten O mu var?', dua: 'Allah’ım, kalbimi Senden gayrısından temizle.' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhamet sahibi.', question: 'Merhametinden payıma düşeni alıp yansıtabiliyor muyum?', dua: 'Ey Rabbim, rahmetinle kuşat beni, merhametsiz bırakma.' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Ahirette müminlere merhamet eden.', question: 'O’nun özel sevgisine layık olabiliyor muyum?', dua: 'Allah’ım, beni ahirette rahmetinle muamele görenlerden eyle.' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Mülkün sahibi.', question: 'Emanetçi olduğumu unutup sahipleniyor muyum?', dua: 'Rabbim, beni mülküne köle değil, Zatına kul eyle.' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Eksiklikten uzak.', question: 'Ruhumu kirleten şeylerden arınıyor muyum?', dua: 'Allah’ım, ruhumu günah kirlerinden arındır ve pak kıl.' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik veren.', question: 'Varlığım çevreme huzur veriyor mu?', dua: 'Ey Selâm, kalbime ve yurduma huzur ve esenlik ver.' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Güven veren.', question: 'İnsanlar bana ne kadar güvenebiliyor?', dua: 'Allah’ım, beni güvenilen ve emanete hıyanet etmeyen kullarından eyle.' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Gözetip koruyan.', question: 'Her an gözetlendiğimi bilerek yaşıyor muyum?', dua: 'Rabbim, beni nefsimin şerrinden gözet ve koru.' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'Üstün ve şerefli.', question: 'İzzeti nerede arıyorum?', dua: 'Allah’ım, beni Sana itaatle aziz kıl, isyanla zelil etme.' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yapan, onaran.', question: 'Kırık gönülleri onarıyor muyum?', dua: 'Ey Cebbâr, kırık kalbimi onar ve eksiklerimi tamamla.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklük sahibi.', question: 'Kime karşı kibirleniyorum?', dua: 'Rabbim, büyüklük Sana aittir, beni kibirden ve gururdan muhafaza et.' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Yaratan.', question: 'Yaratılışıma uygun yaşıyor muyum?', dua: 'Allah’ım, beni yarattığın fıtrat üzere sabit kıl.' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Kusursuz yaratan.', question: 'Hayatımda bir ahenk var mı?', dua: 'Rabbim, içimdeki ve dışımdaki düzensizlikleri ıslah et.' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Şekil veren.', question: 'Ahlakımı güzelleştirmek için ne yapıyorum?', dua: 'Allah’ım, suretimi güzel yarattığın gibi ahlakımı da güzelleştir.' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Günahları örten.', question: 'Ben başkalarının ayıplarını örtüyor muyum?', dua: 'Ey Gaffâr, günahlarımı ört ve beni mahcup etme.' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Her şeye galip gelen.', question: 'Nefsimi yenebiliyor muyum?', dua: 'Rabbim, nefsimin kötü arzularını kahret ve beni ona esir etme.' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız veren.', question: 'Karşılık beklemeden iyilik yapıyor muyum?', dua: 'Allah’ım, bana katından rahmet ve hidayet hibe et.' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Rızık veren.', question: 'Rızık endişesi taşıyor muyum?', dua: 'Ey Rezzâk, bize helal ve geniş rızıklar ihsan eyle.' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Kapıları açan.', question: 'Başkalarına hayır kapısı oluyor muyum?', dua: 'Rabbim, önümdeki engelleri kaldır ve hayır kapılarını aç.' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'Her şeyi bilen.', question: 'Gizli niyetlerimden utanıyor muyum?', dua: 'Allah’ım, faydasız ilimden ve ürpermeyen kalpten Sana sığınırım.' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', meaning: 'Sıkan, daraltan.', question: 'Darlık anında sabredebiliyor muyum?', dua: 'Rabbim, kalbimi sıkıntılarla daraltma, inşirah ver.' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Genişleten.', question: 'Genişlik anında şükrediyor muyum?', dua: 'Ey Bâsıt, rızkımızı, ilmimi ve göğsümü genişlet.' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Alçaltan.', question: 'Başkalarını küçümsüyor muyum?', dua: 'Allah’ım, zalimleri alçalt, mazlumları koru.' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi`', meaning: 'Yükselten.', question: 'Manevi olarak yükselmeyi hedefliyor muyum?', dua: 'Rabbim, katındaki derecemi iman ve salih amelle yükselt.' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'İzzet veren.', question: 'Gerçek onuru nerede arıyorum?', dua: 'Allah’ım, İslam ile bizi aziz kıl.' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Zelil eden.', question: 'Nefsimin kölesi miyim?', dua: 'Rabbim, Senden başkasına boyun eğdirip bizi zelil etme.' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî`', meaning: 'Her şeyi işiten.', question: 'Söylediklerime dikkat ediyor muyum?', dua: 'Ey Semî, dualarımı ve gizli yakarışlarımı işit ve kabul et.' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören.', question: 'Gözümü haramdan sakınıyor muyum?', dua: 'Allah’ım, her halimi gördüğünü bilerek yaşamayı nasip et.' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Hüküm veren.', question: 'O’nun hükümlerine razı mıyım?', dua: 'Rabbim, hakkımda verdiğin hükme rıza göstermemi nasip et.' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', meaning: 'Adaletli.', question: 'Kendime ve çevreme adil miyim?', dua: 'Allah’ım, bizi zulmetmekten ve zulme uğramaktan koru.' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'Lütuf sahibi.', question: 'İnsanlara karşı nazik miyim?', dua: 'Ey Latîf, bana lütfunla ve kereminle muamele et.' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Haberdar olan.', question: 'İçim dışım bir mi?', dua: 'Rabbim, gizli ve aşikar her halimden Sen haberdarsın, beni ıslah et.' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Yumuşak huylu.', question: 'Öfkemi yenebiliyor muyum?', dua: 'Allah’ım, beni acelecilikten koru, hilm sahibi eyle.' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Pek yüce.', question: 'Dertlerim O’ndan büyük mü?', dua: 'Ey Azîm, azametinin karşısında aczimi itiraf ediyorum, beni bağışla.' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Bağışlayıcı.', question: 'Kendimi affettim mi?', dua: 'Rabbim, günahlarım ne kadar çoksa Senin affın daha büyüktür.' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Şükre karşılık veren.', question: 'Nimetlere şükrediyor muyum?', dua: 'Allah’ım, beni Sana çokça şükreden kullarından eyle.' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yüce.', question: 'Hedeflerim ulvi mi?', dua: 'Ey Aliyy, himmetimi ve gayemi rızan doğrultusunda yüce tut.' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Büyük.', question: 'Egomu yenebiliyor muyum?', dua: 'Rabbim, tekbirlerle Seni yüceltir, nefsimi küçültürüm.' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Koruyan.', question: 'İmanımı koruyor muyum?', dua: 'Ey Hafîz, beni, ailemi ve imanımı her türlü şerden muhafaza et.' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Gıdalandıran.', question: 'Ruhumu besliyor muyum?', dua: 'Allah’ım, bedenimi helal rızıkla, ruhumu zikrinle doyur.' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesap gören.', question: 'Kendimi hesaba çekiyor muyum?', dua: 'Rabbim, hesabımı kolaylaştır, beni zorlu sorgudan koru.' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Celal sahibi.', question: 'O’na saygı duyuyor muyum?', dua: 'Ey Celîl, kalbime Seni tazim etme şuuru yerleştir.' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Cömert.', question: 'Paylaşmaktan korkuyor muyum?', dua: 'Allah’ım, cimrilikten Sana sığınırım, beni cömert eyle.' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Gözetleyen.', question: 'Yalnızken nasıl davranıyorum?', dua: 'Rabbim, her an Senin gözetiminde olduğumu unutturma.' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Cevap veren.', question: 'Dualarıma güveniyor muyum?', dua: 'Ey Mücîb, dualarıma icabet et, beni kapından boş çevirme.' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi`', meaning: 'Geniş.', question: 'Kalbim ne kadar geniş?', dua: 'Allah’ım, rahmetin gibi ahlakımı ve göğsümü de genişlet.' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Hikmet sahibi.', question: 'Olaylardaki hikmeti görebiliyor muyum?', dua: 'Rabbim, bana işlerin iç yüzünü görecek feraset ve hikmet ver.' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Seven.', question: 'O’nu her şeyden çok seviyor muyum?', dua: 'Allah’ım, Seni sevmeyi ve Seni seveni sevmeyi bana nasip et.' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Şanı yüce.', question: 'Şerefli bir hayat yaşıyor muyum?', dua: 'Ey Mecîd, şanına layık bir kul olabilmem için beni destekle.' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Dirilten.', question: 'Her gün yeniden doğuyor muyum?', dua: 'Rabbim, öldükten sonra dirilişe imanımı kavi kıl.' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Şahit.', question: 'O’nun şahitliği yetmez mi?', dua: 'Allah’ım, her yerde hazır ve nazır olduğunu bana hissettir.' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', meaning: 'Gerçek.', question: 'Hakikati savunuyor muyum?', dua: 'Ey Hakk, bana hakkı hak olarak gösterip ona uymayı nasip et.' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'Vekil.', question: 'O’na tam güveniyor muyum?', dua: 'Allah’ım, işlerimi Sana havale ettim, Sen ne güzel vekilsin.' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', meaning: 'Güçlü.', question: 'Gücümü nerede harcıyorum?', dua: 'Rabbim, gücümü Senin yolunda ve rızan için kullanmamı sağla.' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Sarsılmaz.', question: 'Zorluklarda sağlam durabiliyor muyum?', dua: 'Allah’ım, dinin üzerine ayaklarımı sabit ve metin kıl.' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', meaning: 'Dost.', question: 'Dostum Allah mı?', dua: 'Ey Velî, dünyada ve ahirette benim dostum ve sahibim Sensin.' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Övgüye layık.', question: 'Her halükarda hamd ediyor muyum?', dua: 'Rabbim, verdiğin ve vermediğin her şey için Sana hamd olsun.' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Sayan.', question: 'Ömür sermayemi biliyor muyum?', dua: 'Allah’ım, sayılı nefeslerimi gafletle tüketmekten beni koru.' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Başlatan.', question: 'Yeni başlangıçlara hazır mıyım?', dua: 'Rabbim, her hayırlı işe Senin adınla başlamayı nasip et.' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Geri döndüren.', question: 'Dönüşümün O’na olduğunu biliyor muyum?', dua: 'Allah’ım, Sana dönüşümü güzelleştir, yüzümü ağart.' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Hayat veren.', question: 'Kalbim diri mi?', dua: 'Ey Muhyî, ölü kalbimi iman ve Kur’an nuruyla dirilt.' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Öldüren.', question: 'Ölüme hazır mıyım?', dua: 'Rabbim, emanetini teslim ederken iman üzere çene kapamayı nasip et.' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', meaning: 'Diri.', question: 'Baki olana mı yöneliyorum?', dua: 'Ya Hayy, Senin hayatınla kalbime ebedi bir hayat ver.' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Ayakta tutan.', question: 'O’nun desteğini hissediyor muyum?', dua: 'Ey Kayyûm, rahmetinle yardım istiyorum, beni nefsimle baş başa bırakma.' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Bulan.', question: 'Huzuru O’nda buldum mu?', dua: 'Allah’ım, kaybettiğim manevi değerlerimi bulmayı bana nasip et.' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şanlı.', question: 'O’nun şanına yaraşır yaşıyor muyum?', dua: 'Rabbim, ikramın ve şanın hürmetine günahlarımı bağışla.' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Bir.', question: 'Kalbimdeki putları kırdım mı?', dua: 'Allah’ım, kalbimi tevhidinle birle, sevgini parçalatma.' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', meaning: 'Muhtaç olunan.', question: 'Kime muhtacım?', dua: 'Ey Samed, beni Senden başkasına muhtaç etme, el açtırma.' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Kudretli.', question: 'Gelecekten korkuyor muyum?', dua: 'Rabbim, her şeye gücün yeter, aczimi kuvvetinle destekle.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'İktidar sahibi.', question: 'Sınırlarımı biliyor muyum?', dua: 'Allah’ım, kudretin karşısında boyun eğdim, beni affet.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'Öne alan.', question: 'Neyi öne alıyorum?', dua: 'Rabbim, rızanı ve ahireti dünya işlerinin önüne almayı nasip et.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'Erteleyen.', question: 'Günahları erteliyor muyum?', dua: 'Allah’ım, tövbeyi ve hayırlı amelleri ertelemekten beni koru.' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', meaning: 'İlk.', question: 'Başlangıcım Besmele mi?', dua: 'Ey Evvel, evvelimi ve ahirimi hayırlı eyle.' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', meaning: 'Son.', question: 'Sonum nasıl olacak?', dua: 'Rabbim, son nefesimde kelime-i şehadet getirmeyi nasip et.' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Aşikar.', question: 'Eserlerinde O’nu görüyor muyum?', dua: 'Allah’ım, varlığının delillerini görecek göz ver.' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Gizli.', question: 'İçim O’na aşikar mı?', dua: 'Ey Bâtın, içimi dışımdan, gizlimi açığımdan daha hayırlı kıl.' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', meaning: 'Yöneten.', question: 'Hayatımı kime teslim ettim?', dua: 'Rabbim, işlerimi en güzel şekilde yönet, beni başıboş bırakma.' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Yüce.', question: 'Düşüncelerim yüce mi?', dua: 'Allah’ım, Seni noksan sıfatlardan tenzih ve takdis ederim.' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', meaning: 'İyilik sahibi.', question: 'Karşılıksız iyilik yaptım mı?', dua: 'Ey Berr, bana iyilik yapmayı ve iyilerle olmayı sevdir.' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Tövbeleri kabul eden.', question: 'Tövbe ettim mi?', dua: 'Rabbim, tövbemi kabul et ve beni günah işlemekten alıkoy.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaning: 'İntikam alan.', question: 'Adaleti O’na bıraktım mı?', dua: 'Allah’ım, zalimlerin şerrinden Sana sığınırım.' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Affeden.', question: 'Ben affedebiliyor muyum?', dua: 'Ey Afüvv, Sen affedicisin, affı seversin, beni de affet.' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Şefkatli.', question: 'Merhametli miyim?', dua: 'Rabbim, kalbime şefkat, merhamet ve incelik ver.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', meaning: 'Mülkün sahibi.', question: 'Gerçek sahibin O olduğunu biliyor muyum?', dua: 'Allah’ım, mülk Senindir, beni kanaatkar eyle.' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', meaning: 'Celal ve ikram sahibi.', question: 'O’na layık kul muyum?', dua: 'Ey Celal ve İkram sahibi, Senden cennetini ve rızanı isterim.' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Adil.', question: 'Haktan ayrılıyor muyum?', dua: 'Rabbim, her işimde adaletli olmayı ve haktan ayrılmamayı nasip et.' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', meaning: 'Toplayan.', question: 'Gönülleri birleştiriyor muyum?', dua: 'Allah’ım, dağınık kalbimi zikrinle topla, müminleri birleştir.' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', meaning: 'Zengin.', question: 'Gönlüm zengin mi?', dua: 'Ey Ganî, beni Senden başkasına muhtaç eyleme, gönül zenginliği ver.' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'Zengin eden.', question: 'Başkalarını zenginleştiriyor muyum?', dua: 'Rabbim, beni, ailemi ve sevdiklerimi fazlınla zenginleştir.' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni`', meaning: 'Engel olan.', question: 'Haramlardan kaçıyor muyum?', dua: 'Allah’ım, beni günah işlemekten ve şerre düşmekten men et.' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Elem veren.', question: 'Musibetlerin uyarısını anlıyor muyum?', dua: 'Rabbim, her zarar ve fayda senin elindedir, beni zarardan koru.' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi`', meaning: 'Fayda veren.', question: 'İnsanlara faydalı mıyım?', dua: 'Ey Nâfi, beni insanlara faydalı olan hayırlı kullarından eyle.' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Nur.', question: 'Çevreme ışık saçıyor muyum?', dua: 'Allah’ım, kabrimi, kalbimi ve yüzümü nurunla aydınlat.' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Hidayet veren.', question: 'Hidayet üzere miyim?', dua: 'Ey Hâdî, bizi sırat-ı müstakimden ayırma, hidayetini daim kıl.' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî`', meaning: 'Eşsiz yaratan.', question: 'Sanatını görüyor muyum?', dua: 'Rabbim, yaratışındaki güzellikleri görmeyi ve şükretmeyi nasip et.' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Baki olan.', question: 'Fanilere mi bağlanıyorum?', dua: 'Allah’ım, Baki olan sadece Sensin, kalbimi fani olandan çevir.' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Mirasçı.', question: 'Arkamda ne bırakıyorum?', dua: 'Ey Vâris, mülkün gerçek sahibi Sensin, emanetini hayırla teslim al.' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Doğru yolu gösteren.', question: 'Doğru kararlar alıyor muyum?', dua: 'Rabbim, işlerimde bana rüşdü (doğru yolu) ilham et.' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Çok sabırlı.', question: 'Sabredebiliyor muyum?', dua: 'Ey Sabûr, başıma gelenlere karşı bana güzel bir sabır ver.' }
];

// ==========================================
// 3. YARDIMCI FONKSİYON: KARIŞTIRMA
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
// 4. UYGULAMA MANTIĞI
// ==========================================
function App() {
  const [viewState, setViewState] = useState('intro');
  const [contentFading, setContentFading] = useState(false);
  const [stars, setStars] = useState([]);
  const [shuffledDeck, setShuffledDeck] = useState([]); 
  const [deckIndex, setDeckIndex] = useState(0); 
  const [currentEsma, setCurrentEsma] = useState(null); 

  useEffect(() => {
    const starCount = 180;
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

      {/* --- ARKA PLAN --- */}
      <div className={`heavenly-background ${viewState === 'warping' ? 'warping' : ''}`}>
        <div className="light-beams"></div>
        <div className="ambient-glow"></div>
        <div className="nebula"></div>
        <div className="star-field">
          {stars.map((star) => (
            <div key={star.id} className={star.type === 'sparkle' ? 'star-sparkle' : 'star-small'} style={star.style}></div>
          ))}
        </div>
      </div>

      {/* --- GİRİŞ EKRANI --- */}
      {viewState !== 'card' && (
        <div className="intro-container" style={{ opacity: viewState === 'warping' ? 0 : 1 }}>
          <div className="text-center px-4 relative z-10 extreme-zoom-in">
            <h1 className="text-7xl md:text-9xl mb-6 font-bold title-glow title-font tracking-tighter">Hüsn-ü Hal</h1>
            <p className="text-xl md:text-3xl subtitle-light tracking-[0.5em] uppercase mb-12 title-font">Esma-ül Hüsna</p>
            <button onClick={handleStart} className="start-btn title-font">Bismillah</button>
          </div>
        </div>
      )}

      {/* --- KART EKRANI --- */}
      {viewState === 'card' && (
        <div className="content-container">
          <div className="crystal-card card-explosion">
            <div className={`fade-wrapper ${contentFading ? 'fade-out' : 'fade-in'}`}>
              
              <div className="mb-4">
                <h2 className="text-8xl arabic-font gold-mist-text mb-2 drop-shadow-xl">{currentEsma.arabic}</h2>
                <h3 className="text-2xl transliteration-mist title-font font-light tracking-[0.2em] opacity-90">{currentEsma.transliteration}</h3>
              </div>

              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6 opacity-60"></div>

              <p className="text-lg meaning-mist font-light body-font leading-relaxed mb-6 px-4">{currentEsma.meaning}</p>
              
              <div className="question-box">
                <p className="question-text body-font">"{currentEsma.question}"</p>
              </div>

              {/* --- YENİ EKLENEN DUA KISMI --- */}
              <div className="dua-container">
                <div className="dua-label">🤲 Dua</div>
                <p className="dua-text">
                  {currentEsma.dua}
                </p>
              </div>

              <button onClick={handleNextEsma} className="action-btn body-font">Tefekküre Devam Et</button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;