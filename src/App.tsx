import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (GÜNCELLENDİ)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.1; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }
  .dua-font { fontFamily: 'Playfair Display', serif; font-style: italic; }

  /* --- SAYFA YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN (UZAY/GÖKYÜZÜ) --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center bottom, #1e293b 0%, #0f172a 40%, #020617 100%);
    z-index: 0; overflow: hidden; perspective: 1000px;
  }

  .light-beams {
    position: absolute; top: 50%; left: 50%; width: 200vw; height: 200vw;
    transform: translate(-50%, -50%);
    background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.03) 0deg, rgba(255, 255, 255, 0) 15deg, rgba(255, 255, 255, 0.03) 30deg);
    animation: rotate-beams 80s linear infinite; z-index: 1; pointer-events: none;
    mask-image: radial-gradient(circle, black 0%, transparent 70%);
  }
  @keyframes rotate-beams { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

  .nebula {
    position: absolute; width: 100%; height: 100%;
    background: radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.1) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
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

  /* --- GİRİŞ EKRANI --- */
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

  /* --- KART VE İÇERİK --- */
  .content-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1200px; }
  .card-explosion { animation: card-appear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes card-appear { from { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(10px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }

  .crystal-card {
    width: 90%; max-width: 600px; max-height: 85vh; overflow-y: auto;
    background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255, 0.05) inset;
    backdrop-filter: blur(30px); border-radius: 40px; padding: 2.5rem 2rem;
    text-align: center; position: relative;
    scrollbar-width: thin; scrollbar-color: rgba(251, 191, 36, 0.3) transparent;
  }
  .crystal-card::-webkit-scrollbar { width: 6px; }
  .crystal-card::-webkit-scrollbar-thumb { background-color: rgba(251, 191, 36, 0.3); border-radius: 20px; }

  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 10%, #fbbf24 50%, #d97706 90%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.5));
  }
  .transliteration-mist { color: #e0f2fe; font-weight: 300; text-shadow: 0 0 10px rgba(224, 242, 254, 0.3); margin-bottom: 5px; }
  
  /* --- ANLAM VE SORU --- */
  .meaning-text { color: #f1f5f9; font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.6; }
  
  /* --- DUA KUTUSU --- */
  .dua-wrapper {
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative;
    padding: 2rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    border: 1px solid rgba(251, 191, 36, 0.15);
  }
  
  .dua-icon {
    position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
    background: #0f172a; padding: 0 15px; color: #fbbf24;
    font-size: 1.2rem; border-radius: 50%;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
  }

  .dua-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.25rem;
    color: #fcd34d;
    line-height: 1.7;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .action-btn {
    border: 1px solid #fbbf24; color: #fbbf24; background: transparent;
    padding: 1rem 3rem; border-radius: 999px;
    text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; font-weight: 700;
    transition: all 0.3s; cursor: pointer;
  }
  .action-btn:hover { background: #fbbf24; color: #0f172a; box-shadow: 0 0 30px rgba(251, 191, 36, 0.6); }

  .fade-wrapper { transition: all 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(0.95); filter: blur(5px); }
  .fade-in { opacity: 1; transform: scale(1); filter: blur(0); }
`;

// ==========================================
// 2. TAM VERİ SETİ (99 İSİM VE DUALAR)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', dua: 'Rabbim, bütün güzel isimleri kendinde toplayan ve varlığı zorunlu olan Sensin; kalbimi sadece Sana kul olmanın huzuruyla doldur.' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', dua: 'Ey Rahmân, yarattığın her zerreye ulaşan sonsuz merhametinden, benim muhtaç ve çorak gönlüme de rahmet yağmurları indir.' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', dua: 'Ey Rahîm, ahirette sadece sevdiklerine lütfedeceğin özel şefkatinle beni kuşat ve beni cennetine layık eyle.' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', dua: 'Mülkün ve hükümranlığın gerçek sahibi Sensin; beni fani dünyanın geçici mülküne köle olmaktan kurtar, Sana hakiki kul eyle.' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', dua: 'Ey her türlü eksikten uzak olan Kuddûs; ruhumu günah kirlerinden, kalbimi masivadan (Senden gayrısından) arındır.' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', dua: 'Selâm isminle kalbime esenlik ver; beni dünya ve ahiretin korkularından, her türlü tehlikeden selamete çıkar.' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', dua: 'Güvenin kaynağı Sensin; korkularımı emniyete çevir ve beni vadine güvenen, Sana tam teslim olan kullarından eyle.' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', dua: 'Her anımı görüp gözeten Sensin; halimi Sana arz ediyorum, beni nefsimin eline bırakma, idaremi kendi kudret eline al.' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', dua: 'İzzet ve şeref ancak Senindir; beni günahların zilletinden kurtar, Sana itaatle şereflendir ve Aziz isminle ruhumu güçlendir.' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', dua: 'Eksikleri tamamlayan ve hükmünü geçiren Cebbâr isminle; kırık kalbimi onar, acziyetimi kudretinle tamamla.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', dua: 'Büyüklük ancak Sana yaraşır; nefsimi kibirden arındır ve Senin azametin karşısında boyun eğmenin tadını bana yaşat.' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', dua: 'Yoktan var eden Hâlik Sensin; beni en güzel surette yarattığın gibi, ahlakımı da yaratılış gayeme uygun eyle.' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', dua: 'Her şeyi kusursuzca ve örneksiz yaratan Rabbim; hayatımı rızana uygun, ahenkli ve düzenli bir hale getir.' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', dua: 'Varlığa şekil veren Musavvir; yüzümü secdeyle güzelleştirdiğin gibi, ruhumu da iman nuruyla şekillendir.' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', dua: 'Günahları tekrar tekrar örten Gaffâr; yüzüm karası günahlarımı setret, beni utandırma ve mağfiretini benden esirgeme.' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', dua: 'Mutlak galip olan Kahhâr; nefsimin bitmek bilmeyen kötü arzularını ve içimdeki isyanı kudretinle bastır, beni Sana ram eyle.' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', dua: 'Karşılıksız hibe eden Vehhâb; liyakatime bakmadan, sırf lütfunla bana hikmet, iman ve salih amel bağışla.' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', dua: 'Rızkı veren ancak Sensin; beni harama muhtaç etme, helal ve geniş rızıkla rızıklandırıp şükrünü eda etmeyi nasip eyle.' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', dua: 'Her türlü hayır kapısını açan Fettâh; kalbimi imana, aklımı ilme, işlerimi kolaylığa aç; önümdeki engelleri kaldır.' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', dua: 'Gizliyi ve aşikârı bilen Alîm; ilminle beni cehaletin karanlığından kurtar, Seni hakkıyla bilmeyi bana nasip et.' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', dua: 'Bazen daraltan ve sıkan Kâbız isminle gelen imtihanlarda bana sabır ver; daralmalarımın arkasındaki hikmeti anlamayı nasip et.' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', dua: 'Ruhları ve rızıkları genişleten Bâsıt; gönlüme inşirah (genişlik) ver, ibadetlerinde bana şevk ve genişlik ihsan eyle.' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', dua: 'Zalimleri alçaltan Rabbim; beni kibirle yükselip sonra alçalanlardan eyleme, tevazu ile yücelenlerden eyle.' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi', dua: 'Müminleri yükselten Râfi; iman ve ahlak ile derecemi yükselt, beni katında ve kullarının nezdinde değerli kıl.' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', dua: 'İzzet veren Muizz; beni İslam’ın izzetiyle aziz kıl, Senden başkasına el açtırma.' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', dua: 'Boyun eğdiren Müzill; nefsimi ve şeytanı bana boyun eğdir, beni zelil duruma düşecek hatalardan koru.' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî', dua: 'Fısıltıları dahi işiten Semî; dualarımı, sessiz yakarışlarımı ve kalbimin derinindeki âhları işit ve kabul buyur.' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', dua: 'Her şeyi gören Basîr; her an Senin gözetiminde olduğumu bilerek yaşamayı ve haramlara bakmaktan gözümü sakınmayı nasip et.' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', dua: 'Mutlak hüküm sahibi Hakem; hayatımda ve ahiretimde hükmüne razı olmayı, adaletten şaşmamayı bana öğret.' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', dua: 'Adaletin kaynağı Adl; bana kendime, çevreme ve Rabbime karşı adaletli olmayı, zulümden uzak durmayı nasip eyle.' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', dua: 'En ince lütufların sahibi Latîf; beni ummadığım yerlerden rızıklandır ve olayların arkasındaki ince hikmetlerini kavramayı lütfet.' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', dua: 'Her şeyden haberdar olan Habîr; içimdeki gizli niyetleri Sen biliyorsun, niyetimi halis, amelimi rızana uygun eyle.' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', dua: 'Cezada acele etmeyen Halîm; isyanıma rağmen bana mühlet verdiğin için şükürler olsun, beni yumuşak huylu ve sabırlı kullarından eyle.' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', dua: 'Pek yüce olan Azîm; Senin azametin karşısında küçüklüğümü idrak ettir, Seni hakkıyla tazim etmeyi bana nasip et.' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', dua: 'Çok bağışlayan Gafûr; günahlarım ne kadar çok olsa da Senin affın daha büyüktür, beni affınla temizle.' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', dua: 'Az amele çok karşılık veren Şekûr; azıcık ibadetimi kabul buyur, beni verdiği nimetlere nankörlük etmeyen şükredici bir kul eyle.' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', dua: 'Yüceler yücesi Aliyy; himmetimi ve hedeflerimi rızan için yüksek tut, beni süfli heveslerin peşinde koşturma.' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', dua: 'Büyüklüğü kavranamayan Kebîr; gözümde büyüttüğüm dünya dertlerini Senin büyüklüğünü düşünerek küçültmemi nasip et.' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', dua: 'Her şeyi koruyan Hafîz; beni, sevdiklerimi ve imanımı her türlü şeytani ve nefsani tehlikeden muhafaza eyle.' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', dua: 'Her canlının gıdasını ve gücünü veren Mukît; bedenimi helal rızıkla, ruhumu ibadet gıdasıyla besle ve güçlendir.' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', dua: 'Hesap görücü olarak Sen yetersin; beni hesabı kolay verilenlerden eyle, her işimde Senin rızanı hesaba katmayı nasip et.' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', dua: 'Azamet sahibi Celîl; Celalinin tecellisiyle kalbime ürperti, Cemalinin tecellisiyle ruhuma muhabbet ver.' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', dua: 'İkramı bol Kerîm; cömertliğinle beni dünyada ve ahirette mahcup etme, beni de cömert kullarından eyle.' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', dua: 'Her an gözetleyen Rakîb; her nefesimde Senin kontrolünde olduğumu bilerek, ihsan şuuruyla yaşamayı nasip et.' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', dua: 'Dualara icabet eden Mücîb; ellerimi boş çevirme, dilediğimden daha hayırlısını bana nasip eyle.' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi', dua: 'Rahmeti geniş Vâsi; daralan göğsüme genişlik ver, ilmimi ve anlayışımı genişlet, beni rahmetinden mahrum etme.' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', dua: 'Her işi hikmetli olan Hakîm; başıma gelen her olaydaki hikmeti sezdîr, Senin takdirine itiraz etmekten beni koru.' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', dua: 'Seven ve sevilmeye layık Vedûd; kalbimi Senin aşkınla yak, beni sevdiklerine sevdir ve mahlukatına şefkatle baktır.' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', dua: 'Şanı yüce Mecîd; övgüye layık olan Sensin, beni güzel ahlakla övülen ve Senin övgüne mazhar olanlardan eyle.' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', dua: 'Öldükten sonra dirilten Bâis; kalbimi gaflet uykusundan uyandır, ahiret günü huzuruna yüz akıyla dirilmeyi nasip et.' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', dua: 'Her şeye şahit olan Şehîd; yalnızken de kalabalıkta da Senin şahitliğinden hayâ edip günahtan kaçınmayı nasip et.' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', dua: 'Varlığı değişmeyen tek gerçek Hakk; beni batıl yollardan ayır, Hak yolunda sabit kadem eyle.' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', dua: 'En güzel vekil Sensin; bütün işlerimi, dertlerimi Sana havale ettim, Senin vekaletin bana yeter Rabbim.' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', dua: 'Kuvvet sahibi Kavî; bedenime ibadet için güç, irademe günahlara karşı direnç ver.' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', dua: 'Sarsılmaz güç sahibi Metîn; imanımı sarsılmaz kıl, zorluklar karşısında beni metanetli eyle.' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', dua: 'Müminlerin dostu Velî; Senden başka dost aratma, Senin dostluğunla şereflenmeyi bana lütfet.' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', dua: 'Övgülerin sahibi Hamîd; dilimi hamdinden, kalbimi şükründen ayırma, her halimde \'Elhamdulillah\' demeyi nasip et.' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', dua: 'Her şeyin sayısını bilen Muhsî; ömür sermayemi sayılı nefeslerimi boşa harcamaktan koru, her anımı bereketli kıl.' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', dua: 'İlk kez yaratan Mübdi’; içimde solup giden güzel hasletleri yeniden yeşert, beni hayırlı başlangıçlara muvaffak kıl.' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', dua: 'Hayatı iade eden Muîd; ahirette beni ve sevdiklerimi ebedi saadet yurdunda yeniden bir araya getir.' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', dua: 'Hayat veren Muhyî; ölü kalbimi imanla, kuruyan gözlerimi aşkınla canlandır.' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', dua: 'Ölümü yaratan Mümît; ölümü bana bir son değil, Sana kavuşmanın bir başlangıcı olarak sevdir, emanetini imanla teslim etmeyi nasip et.' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', dua: 'Diri olan Hayy; beni gafletle yaşayıp manen ölenlerden eyleme, zikrinle kalbimi daima diri tut.' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', dua: 'Her şeyi ayakta tutan Kayyûm; varlığım Sana bağlıdır, beni bir an bile nefsimle baş başa bırakma.' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', dua: 'İstediğini bulan Vâcid; ben Seni bulduktan sonra neyi kaybettim ki? Beni Seni bulan ve Seninle doyanlardan eyle.' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', dua: 'Şanı yüce Mâcid; kereminle beni donat, İslam ahlakıyla beni yücelt.' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', dua: 'Bir ve tek olan Vâhid; kalbimi tevhidin nuruyla aydınlat, Senden başka ilah ve rab tanımaktan beni koru.' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', dua: 'Herkesin muhtaç olduğu Samed; beni Senden başkasına muhtaç etme, ihtiyaçlarımı sadece Sana arz etmeyi nasip et.' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', dua: 'Her şeye gücü yeten Kâdir; acizliğimi biliyorum, gücünle bana destek ol ve zorlukları bana kolaylaştır.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', dua: 'Kudret sahibi Muktedir; elimden gelenin en iyisini yaptıktan sonra Senin takdirine tam teslim olmayı bana öğret.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', dua: 'Dilediğini öne alan Mukaddim; beni hayırda yarışanlardan, rızana koşmakta öne geçenlerden eyle.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', dua: 'Dilediğini geriye bırakan Muahhir; şerleri, günahları ve beni Sana yaklaştırmayan her şeyi benden uzaklaştır ve geride bırak.' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', dua: 'Başlangıcı olmayan Evvel; her işime Senin adınla başlamayı, niyetimi sadece Senin rızan kılmayı nasip et.' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', dua: 'Sonu olmayan Âhir; son nefesimi, son sözümü ve akıbetimi hayr eyle.' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', dua: 'Varlığı apaçık olan Zâhir; kâinat kitabında tecelli eden isimlerini okumayı ve eserlerinde Seni görmeyi bana lütfet.' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', dua: 'Gizlilikleri bilen Bâtın; iç âlemimi dışımdan daha mamur eyle, kalbimdeki gizli sırları nurunla temizle.' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', dua: 'Kâinatı yöneten Vâlî; işlerimi en güzel şekilde yönet, beni başıboş bırakma.' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', dua: 'Yüce ve aşkın olan Müteâlî; fikrimi ve zikrimi dünyevi bayağılıklardan arındırıp ulvi hakikatlere yükselt.' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', dua: 'İyiliği bol Berr; bana iyilik yapmayı sevdir, Senin iyiliğine ve ihsanına layık bir kul olmaya çalışmayı nasip et.' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', dua: 'Tövbeleri kabul eden Tevvâb; günahlarımdan pişmanlıkla Sana dönüyorum, tövbemi kabul et ve beni günahsız gibi tertemiz kıl.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', dua: 'Suçluları cezalandıran Müntakım; mazlumların ahını yerde bırakma, zalimlere karşı Senin adaletine sığınıyorum.' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', dua: 'Affı seven Afüvv; Sen affedicisin, affı seversin, beni de affeyle.' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', dua: 'Çok şefkatli Raûf; hatalarıma rağmen bana merhametinle muamele et, kalbime şefkat tohumları ek.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', dua: 'Mülkün sahibi; elimdeki her şeyin emanet olduğunu unutturma, emaneti sahibine layıkıyla kullanmayı nasip et.' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', dua: 'Büyüklük ve ikram sahibi; Celalin karşısında haşyetle eğilmeyi, ikramın karşısında şükürle dolmayı bana öğret.' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', dua: 'Adaletle hükmeden Muksit; kendi aleyhime bile olsa adaletten ve doğruluktan ayırma.' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', dua: 'Zıtları birleştiren Câmi‘; dağınık kalbimi toparla, müminleri sevgi ve birlik etrafında cem eyle.' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', dua: 'Zengin olan Ganî; beni gönül zenginliğine eriştir, Senden başkasına el açtırma.' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', dua: 'Zengin kılan Muğnî; beni kanaat hazinesiyle zenginleştir, hem dünyamı hem ahiretimi mamur eyle.' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni', dua: 'Engel olan Mâni; beni günahlardan, kazalardan ve belalardan koru, şerre giden yollarıma engeller koy.' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', dua: 'Zarar verici şeyleri de yaratan Dârr; her türlü zarardan ve elemden Sana sığınırım, Senden gelen her şeye razıyım.' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi', dua: 'Fayda veren Nâfi; ilmimi, malımı ve ömrümü insanlara ve kendime faydalı kıl.' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', dua: 'Alemleri nurlandıran Nûr; aklımı ilim nuruyla, kalbimi iman nuruyla, yüzümü edep nuruyla aydınlat.' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', dua: 'Hidayet veren Hâdî; beni sırat-ı müstakimden ayırma, şaşırmışlara hidayet nasip eyle.' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî', dua: 'Eşsiz yaratan Bedî; hayatımı sıradanlıktan kurtar, kulluğumda ve ahlakımda güzellikler icat etmemi nasip eyle.' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', dua: 'Sonsuz olan Bâkî; fani dünyada Bâki olanı sevmeyi, ebedi olan rızanı kazanmayı bana hedef eyle.' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', dua: 'Her şeyin asıl sahibi Vâris; ben gidiciyim Sen kalıcısın, arkamdan hayırla anılacak sadaka-i cariyeler bırakmayı nasip et.' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', dua: 'Doğru yolu gösteren Reşîd; kararlarımda bana isabetli yolu göster, beni yanlış tercihlerden koru.' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', dua: 'Çok sabırlı Sabûr; isyanlarımıza karşı sabrına sığınıyorum, bana da musibetler karşısında peygamber sabrı lütfeyle.' }
];

// ==========================================
// 3. YARDIMCI FONKSİYONLAR
// ==========================================
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
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
    // Yıldızları oluştur
    const starCount = 200;
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      const isSparkle = Math.random() > 0.95; 
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
    
    // Kartları karıştır
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
      // Deste biterse yeniden karıştır
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

      {/* ARKA PLAN */}
      <div className={`heavenly-background ${viewState === 'warping' ? 'warping' : ''}`}>
        <div className="light-beams"></div>
        <div className="nebula"></div>
        <div className="star-field">
          {stars.map((star) => (
            <div key={star.id} className={star.type === 'sparkle' ? 'star-sparkle' : 'star-small'} style={star.style}></div>
          ))}
        </div>
      </div>

      {/* GİRİŞ */}
      {viewState !== 'card' && (
        <div className="intro-container" style={{ opacity: viewState === 'warping' ? 0 : 1 }}>
          <div className="text-center px-4 relative z-10 extreme-zoom-in">
            <h1 className="text-6xl md:text-9xl mb-6 font-bold title-glow title-font tracking-tighter">Hüsn-ü Hal</h1>
            <p className="text-xl md:text-2xl subtitle-light tracking-[0.5em] uppercase mb-12 title-font">Esma-ül Hüsna Tefekkürü</p>
            <button onClick={handleStart} className="start-btn title-font">Bismillah</button>
          </div>
        </div>
      )}

      {/* KART */}
      {viewState === 'card' && (
        <div className="content-container">
          <div className="crystal-card card-explosion">
            <div className={`fade-wrapper ${contentFading ? 'fade-out' : 'fade-in'}`}>
              
              <div className="mb-6">
                <h2 className="text-8xl arabic-font gold-mist-text mb-4 drop-shadow-2xl">{currentEsma.arabic}</h2>
                <h3 className="text-3xl transliteration-mist title-font font-normal tracking-[0.1em]">{currentEsma.transliteration}</h3>
              </div>

              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8 opacity-70"></div>

              {/* DUA KISMI */}
              <div className="dua-wrapper">
                <div className="dua-icon">🤲</div>
                <p className="dua-text">
                  "{currentEsma.dua}"
                </p>
              </div>

              <button onClick={handleNextEsma} className="action-btn title-font">Sıradaki İsmi Getir</button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;