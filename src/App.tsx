import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (Yıldızlar, Giriş ve Kart Dahil)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.2; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }
  .dua-font { fontFamily: 'Playfair Display', serif; font-style: italic; }

  /* --- SAYFA YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #020617; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN VE YILDIZLAR --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center bottom, #1e293b 0%, #0f172a 40%, #020617 100%);
    z-index: 0; overflow: hidden;
  }

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
  }
  @keyframes twinkle {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: var(--opacity); transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
  }

  .light-beams {
    position: absolute; top: 50%; left: 50%; width: 200vw; height: 200vw;
    transform: translate(-50%, -50%);
    background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.03) 0deg, rgba(255, 255, 255, 0) 15deg, rgba(255, 255, 255, 0.03) 30deg);
    animation: rotate-beams 120s linear infinite; z-index: 1; pointer-events: none;
    mask-image: radial-gradient(circle, black 0%, transparent 70%);
  }
  @keyframes rotate-beams { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

  .nebula {
    position: absolute; width: 100%; height: 100%;
    background: radial-gradient(circle at 50% -20%, rgba(251, 191, 36, 0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
    filter: blur(80px); z-index: 2;
  }

  /* --- GİRİŞ EKRANI (INTRO) --- */
  .intro-container {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 30; text-align: center; color: white;
    transition: opacity 1s ease, transform 1s ease;
  }
  .intro-title {
    font-size: 4rem; font-family: 'Cinzel', serif; letter-spacing: 0.2em;
    background: linear-gradient(to right, #fbbf24, #fffbeb, #fbbf24);
    -webkit-background-clip: text; color: transparent;
    text-shadow: 0 0 30px rgba(251, 191, 36, 0.3); margin-bottom: 2rem;
  }
  .start-btn {
    padding: 1rem 3rem; font-size: 1.2rem; letter-spacing: 0.15em; text-transform: uppercase;
    background: transparent; border: 1px solid rgba(251, 191, 36, 0.4); color: #fbbf24;
    cursor: pointer; transition: all 0.4s ease; position: relative; overflow: hidden;
    font-family: 'Cinzel', serif;
  }
  .start-btn:hover { background: rgba(251, 191, 36, 0.1); box-shadow: 0 0 20px rgba(251, 191, 36, 0.2); transform: translateY(-2px); }
  
  .hidden-intro { opacity: 0; pointer-events: none; transform: scale(1.1); }

  /* --- KART VE İÇERİK --- */
  .content-container { 
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; 
    z-index: 20; perspective: 1000px; 
    opacity: 0; pointer-events: none; transition: opacity 1s ease 0.5s;
  }
  .content-visible { opacity: 1; pointer-events: auto; }

  .crystal-card {
    width: 90%; max-width: 550px; max-height: 90vh;
    background: rgba(15, 23, 42, 0.75); 
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255, 0.05) inset;
    backdrop-filter: blur(40px); border-radius: 30px; padding: 0;
    text-align: center; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
  }

  .card-scroll-area {
    padding: 2.5rem 2rem;
    overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(251, 191, 36, 0.3) transparent;
  }
  .card-scroll-area::-webkit-scrollbar { width: 4px; }
  .card-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(251, 191, 36, 0.3); border-radius: 20px; }

  /* 1. ARAPÇA */
  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 10%, #fbbf24 50%, #d97706 90%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4));
    font-size: 5rem; line-height: 1.2; margin-bottom: 0.5rem;
  }
  
  /* 2. OKUNUŞ */
  .transliteration {
    font-family: 'Cinzel', serif; color: #bae6fd; font-size: 1.5rem;
    letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.5rem; opacity: 0.9;
  }

  .divider { width: 60px; height: 1px; background: rgba(251, 191, 36, 0.5); margin: 0 auto 1.5rem auto; }

  /* 3. ANLAM */
  .meaning-box {
    margin-bottom: 2rem; color: #f1f5f9; font-family: 'Inter', sans-serif;
    font-weight: 300; font-size: 1rem; line-height: 1.6;
  }

  /* 4. SORU (TEFEKKÜR) */
  .question-wrapper {
    background: rgba(14, 165, 233, 0.1); border-left: 3px solid #38bdf8;
    padding: 1rem; margin-bottom: 1.5rem; text-align: left; border-radius: 0 10px 10px 0;
  }
  .question-label {
    display: block; font-size: 0.75rem; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; font-weight: 700;
  }
  .question-text {
    font-family: 'Inter', sans-serif; color: #e0f2fe; font-style: italic; font-size: 0.95rem;
  }

  /* 5. DUA */
  .dua-wrapper {
    position: relative; padding: 1.5rem;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(251, 191, 36, 0.05) 100%);
    border-radius: 16px; border: 1px solid rgba(251, 191, 36, 0.15);
  }
  .dua-label {
    position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
    background: #0f172a; padding: 0 10px; color: #fbbf24;
    font-size: 0.8rem; border-radius: 99px; border: 1px solid rgba(251, 191, 36, 0.3);
    text-transform: uppercase; letter-spacing: 0.1em;
  }
  .dua-text {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.1rem; color: #fcd34d; line-height: 1.6;
  }

  .nav-btn {
    width: 100%; padding: 1.2rem;
    background: rgba(255, 255, 255, 0.05); border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.3s;
  }
  .nav-btn:hover { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }

  .fade-wrapper { transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(0.98); }
  .fade-in { opacity: 1; transform: scale(1); }
`;
// ==========================================
// 2. TAM VERİ SETİ (SIRALI BİRLEŞTİRİLMİŞ)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Tek yaratıcının özel ismi, varlığı zorunlu olan, bütün kemâl sıfatları kendisinde toplayan hakiki ma‘bûd.', question: 'Hayatımın merkezinde gerçekten O mu var, yoksa başka öncelikler mi?', dua: 'Rabbim, bütün güzel isimleri kendinde toplayan ve varlığı zorunlu olan Sensin; kalbimi sadece Sana kul olmanın huzuruyla doldur.' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhametiyle lütuf ve ihsanda bulunan.', question: 'O’nun sonsuz merhametinden payıma düşeni alıp, ben de yaratılanlara merhamet ediyor muyum?', dua: 'Ey Rahmân, yarattığın her zerreye ulaşan sonsuz merhametinden, benim muhtaç ve çorak gönlüme de rahmet yağmurları indir.' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Rahmetiyle her şeyi kuşatan.', question: 'Ahirette O\'nun özel sevgisine layık olabilmek için dünyada O\'nu memnun edecek neler yapıyorum?', dua: 'Ey Rahîm, ahirette sadece sevdiklerine lütfedeceğin özel şefkatinle beni kuşat ve beni cennetine layık eyle.' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Bütün varlıkların sahibi/hükümdârı.', question: 'Sahip olduğumu sandığım şeylerin gerçek sahibinin O olduğunu hatırlayıp emanetçi gibi yaşıyor muyum?', dua: 'Mülkün ve hükümranlığın gerçek sahibi Sensin; beni fani dünyanın geçici mülküne köle olmaktan kurtar, Sana hakiki kul eyle.' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Eksiklik ve kusurlardan münezzeh/uzak olan.', question: 'O her türlü eksikten uzakken, ben ruhumu kirleten şeylerden arındırmak için çaba gösteriyor muyum?', dua: 'Ey her türlü eksikten uzak olan Kuddûs; ruhumu günah kirlerinden, kalbimi masivadan (Senden gayrısından) arındır.' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik ve selâmet veren.', question: 'Girdiğim ortamlara huzur ve güven veren bir insan mıyım?', dua: 'Selâm isminle kalbime esenlik ver; beni dünya ve ahiretin korkularından, her türlü tehlikeden selamete çıkar.' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Bütün mahlûkâta emniyet/güven veren ve kendisine güvenilen.', question: 'İnsanlar bana baktığında "bundan zarar gelmez" diyerek bana güvenebiliyor mu?', dua: 'Güvenin kaynağı Sensin; korkularımı emniyete çevir ve beni vadine güvenen, Sana tam teslim olan kullarından eyle.' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Kâinatın bütün işlerini gözetip yöneten.', question: 'Kimsenin görmediği yerlerde bile O’nun beni gözetlediğini bilerek aynı edeple davranabiliyor muyum?', dua: 'Her anımı görüp gözeten Sensin; halimi Sana arz ediyorum, beni nefsimin eline bırakma, idaremi kendi kudret eline al.' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'Ulu, galip, her şeye üstün gelen izzet sahibi.', question: 'İzzet ve şerefi makamda mı arıyorum, yoksa O’na itaat ederek aziz olmaya mı çalışıyorum?', dua: 'İzzet ve şeref ancak Senindir; beni günahların zilletinden kurtar, Sana itaatle şereflendir ve Aziz isminle ruhumu güçlendir.' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yaptırma gücüne sahip olan, her şeyi tasarrufu altına alan.', question: 'Kırılan gönülleri onarmaya gayret ediyor muyum, yoksa insanları kırıp döküyor muyum?', dua: 'Eksikleri tamamlayan ve hükmünü geçiren Cebbâr isminle; kırık kalbimi onar, acziyetimi kudretinle tamamla.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklüğünü izhar eden, son derece ulu.', question: 'Gerçek büyüklük O\'na aitken, ben kime karşı kibirleniyor ve kimi hor görüyorum?', dua: 'Büyüklük ancak Sana yaraşır; nefsimi kibirden arındır ve Senin azametin karşısında boyun eğmenin tadını bana yaşat.' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Her şeyin yaratıcısı.', question: 'O beni en güzel şekilde yaratmışken, ben bedenime ve ruhuma zarar verecek alışkanlıkları terk edebiliyor muyum?', dua: 'Yoktan var eden Hâlik Sensin; beni en güzel surette yarattığın gibi, ahlakımı da yaratılış gayeme uygun eyle.' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Yoktan yaratan, maddesi ve örneği olmadan îcat eden.', question: 'Hayatımda, odamda, işimde O’nun kâinattaki düzenine uygun bir ahenk ve intizam var mı?', dua: 'Her şeyi kusursuzca ve örneksiz yaratan Rabbim; hayatımı rızana uygun, ahenkli ve düzenli bir hale getir.' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Varlığa şekil ve sûret veren.', question: 'O bana en güzel şekli vermiş; ben ahlakımı ve karakterimi güzelleştirmek için ne kadar emek veriyorum?', dua: 'Varlığa şekil veren Musavvir; yüzümü secdeyle güzelleştirdiğin gibi, ruhumu da iman nuruyla şekillendir.' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Kusur ve günahları örten, çokça bağışlayan.', question: 'O benim sayısız günahımı örterken, ben başkalarının hatalarını yüzlerine mi vuruyorum, yoksa örtüyor muyum?', dua: 'Günahları tekrar tekrar örten Gaffâr; yüzüm karası günahlarımı setret, beni utandırma ve mağfiretini benden esirgeme.' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Yenilmeyen, dilediğini yerine getiren.', question: 'İçimdeki kötü arzuları, tembelliği ve nefsani istekleri yenebilecek iradeyi gösteriyor muyum?', dua: 'Mutlak galip olan Kahhâr; nefsimin bitmek bilmeyen kötü arzularını ve içimdeki isyanı kudretinle bastır, beni Sana ram eyle.' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız olarak çokça nimet veren.', question: 'O bana karşılıksız onca nimet vermişken, ben insanlara bir şey verirken karşılık bekliyor muyum?', dua: 'Karşılıksız hibe eden Vehhâb; liyakatime bakmadan, sırf lütfunla bana hikmet, iman ve salih amel bağışla.' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Maddî ve manevî bol rızık veren.', question: 'Rızık endişesiyle O\'nun yasakladığı yollara sapıyor muyum, yoksa "Rızkı veren O\'dur" deyip güveniyor muyum?', dua: 'Rızkı veren ancak Sensin; beni harama muhtaç etme, helal ve geniş rızıkla rızıklandırıp şükrünü eda etmeyi nasip eyle.' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Hayır kapılarını açan.', question: 'Çevremdeki insanların sıkıntılarını gidermek, onlara hayır kapısı olmak için çalışıyor muyum?', dua: 'Her türlü hayır kapısını açan Fettâh; kalbimi imana, aklımı ilme, işlerimi kolaylığa aç; önümdeki engelleri kaldır.' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'İlmi her şeyi kuşatan.', question: 'O her şeyi biliyorken, ben "kimse görmüyor" zannıyla gizli günahlar işlemekten haya ediyor muyum?', dua: 'Gizliyi ve aşikârı bilen Alîm; ilminle beni cehaletin karanlığından kurtar, Seni hakkıyla bilmeyi bana nasip et.' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', meaning: 'Her şeyi teslim alan, hikmeti gereği sıkan.', question: 'Ruhum daraldığında veya maddi sıkıntı çektiğimde bunun bir imtihan olduğunu bilip sabırla O\'na yöneliyor muyum?', dua: 'Bazen daraltan ve sıkan Kâbız isminle gelen imtihanlarda bana sabır ver; daralmalarımın arkasındaki hikmeti anlamayı nasip et.' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Rızkı genişleten, ömürleri uzatan.', question: 'Mutlu ve huzurlu anlarımda şımarıyor muyum, yoksa bu genişliği şükrederek mi değerlendiriyorum?', dua: 'Ruhları ve rızıkları genişleten Bâsıt; gönlüme inşirah (genişlik) ver, ibadetlerinde bana şevk ve genişlik ihsan eyle.' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Kâfirleri ve zalimleri alçaltan.', question: 'Başkalarını küçümseyerek kendimi yükseltmeye çalışıyor muyum?', dua: 'Zalimleri alçaltan Rabbim; beni kibirle yükselip sonra alçalanlardan eyleme, tevazu ile yücelenlerden eyle.' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi', meaning: 'Müminleri yükselten.', question: 'Başkalarının iyiliği için tevazu gösterip O\'nun katında yükselmeyi hedefliyor muyum?', dua: 'Müminleri yükselten Râfi; iman ve ahlak ile derecemi yükselt, beni katında ve kullarının nezdinde değerli kıl.' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'Yücelten, güçlü ve aziz kılan.', question: 'Beni neyin "değerli" kıldığına inanıyorum; dünya malı mı, yoksa iman mı?', dua: 'İzzet veren Muizz; beni İslam’ın izzetiyle aziz kıl, Senden başkasına el açtırma.' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Boyun eğdiren, değersiz kılan.', question: 'Nefsimin kölesi olarak kendi kendimi zelil duruma düşürüyor muyum?', dua: 'Boyun eğdiren Müzill; nefsimi ve şeytanı bana boyun eğdir, beni zelil duruma düşecek hatalardan koru.' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî', meaning: 'Her şeyi işiten.', question: 'Ağzımdan çıkan her sözü O\'nun işittiğinin farkında mıyım?', dua: 'Fısıltıları dahi işiten Semî; dualarımı, sessiz yakarışlarımı ve kalbimin derinindeki âhları işit ve kabul buyur.' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören.', question: 'O\'nun bana verdiği göz nimetini, O\'nun bakmamı yasakladığı haramlardan sakınıyor muyum?', dua: 'Her şeyi gören Basîr; her an Senin gözetiminde olduğumu bilerek yaşamayı ve haramlara bakmaktan gözümü sakınmayı nasip et.' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Nihaî hükmü veren.', question: 'İnsanlar arasında karar verirken O\'nun koyduğu ölçülere mi, menfaatime mi uyuyorum?', dua: 'Mutlak hüküm sahibi Hakem; hayatımda ve ahiretimde hükmüne razı olmayı, adaletten şaşmamayı bana öğret.' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', meaning: 'Adaletli, her şeyi yerli yerinde yapan.', question: 'Kendime, aileme ve çevreme karşı ne kadar adaletliyim?', dua: 'Adaletin kaynağı Adl; bana kendime, çevreme ve Rabbime karşı adaletli olmayı, zulümden uzak durmayı nasip eyle.' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'En gizli ve ince hususları dahi bilen.', question: 'O bana karşı bu kadar lütufkârken, ben insanlara karşı nazik ve ince düşünceli miyim?', dua: 'En ince lütufların sahibi Latîf; beni ummadığım yerlerden rızıklandır ve olayların arkasındaki ince hikmetlerini kavramayı lütfet.' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Gizli ve açık her şeyden haberdar olan.', question: 'Dışım insanları, içim ise Allah\'ı hoşnut edecek durumda mı?', dua: 'Her şeyden haberdar olan Habîr; içimdeki gizli niyetleri Sen biliyorsun, niyetimi halis, amelimi rızana uygun eyle.' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Sabırlı, acele ve kızgınlıkla muamele etmeyen.', question: 'Bana yapılan hatalar karşısında hemen parlıyor muyum, yoksa yumuşaklıkla mı karşılık veriyorum?', dua: 'Cezada acele etmeyen Halîm; isyanıma rağmen bana mühlet verdiğin için şükürler olsun, beni yumuşak huylu ve sabırlı kullarından eyle.' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Zât ve sıfatları bakımından pek yüce olan.', question: 'Gözümde büyüttüğüm dünya dertleri, O\'nun azameti yanında ne kadar küçük kalır?', dua: 'Pek yüce olan Azîm; Senin azametin karşısında küçüklüğümü idrak ettir, Seni hakkıyla tazim etmeyi bana nasip et.' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Çok affedici ve bağışlayıcı olan.', question: 'Sürekli günah işleyip "nasılsa affeder" diyerek O\'nun affını suistimal mi ediyorum?', dua: 'Çok bağışlayan Gafûr; günahlarım ne kadar çok olsa da Senin affın daha büyüktür, beni affınla temizle.' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Yapılan iyi amellerin karşılığını bolca veren.', question: 'Bana yapılan küçücük bir iyiliğe bile teşekkür ederken, O\'nun sonsuz nimetlerine şükrediyor muyum?', dua: 'Az amele çok karşılık veren Şekûr; azıcık ibadetimi kabul buyur, beni verdiği nimetlere nankörlük etmeyen şükredici bir kul eyle.' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yüceler yücesi.', question: 'Hedeflerim ve hayallerim sadece dünya çöplüğü mü, yoksa ulvi gayeler peşinde miyim?', dua: 'Yüceler yücesi Aliyy; himmetimi ve hedeflerimi rızan için yüksek tut, beni süfli heveslerin peşinde koşturma.' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Büyüklüğü bilinemeyecek kadar ulu olan.', question: 'Kibrim, gururum veya egom, O\'nun büyüklüğü karşısında eriyip yok oluyor mu?', dua: 'Büyüklüğü kavranamayan Kebîr; gözümde büyüttüğüm dünya dertlerini Senin büyüklüğünü düşünerek küçültmemi nasip et.' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Her şeyi koruyan ve dengede tutan.', question: 'İmanımı, gözümü, dilimi ve iffetimi haramlardan korumak için O\'na sığınıp tedbir alıyor muyum?', dua: 'Her şeyi koruyan Hafîz; beni, sevdiklerimi ve imanımı her türlü şeytani ve nefsani tehlikeden muhafaza eyle.' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Mahlukatın gıdasını yaratıp veren.', question: 'Bedenimi helal gıdayla beslediğim gibi, ruhumu da ibadetle besliyor muyum?', dua: 'Her canlının gıdasını ve gücünü veren Mukît; bedenimi helal rızıkla, ruhumu ibadet gıdasıyla besle ve güçlendir.' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesaba çeken, her şeyin neticesini bilen.', question: 'Her günün sonunda "Bugün Allah için ne yaptım?" diye kendi nefsimi hesaba çekiyor muyum?', dua: 'Hesap görücü olarak Sen yetersin; beni hesabı kolay verilenlerden eyle, her işimde Senin rızanı hesaba katmayı nasip et.' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Azamet sahibi, mertebesi en yüce olan.', question: 'O\'nun ismini andığımda kalbimde bir ürperti ve saygı oluşuyor mu?', dua: 'Azamet sahibi Celîl; Celalinin tecellisiyle kalbime ürperti, Cemalinin tecellisiyle ruhuma muhabbet ver.' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Çok cömert, nimet ve ihsanı bol olan.', question: 'O bana cömertçe verirken, ben elimdekileri paylaşmaktan korkuyor muyum?', dua: 'İkramı bol Kerîm; cömertliğinle beni dünyada ve ahirette mahcup etme, beni de cömert kullarından eyle.' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Gözeten, koruyan.', question: 'Her an kayıt altında olduğumu bilseydim, şu an yaptıklarımı yapmaya devam eder miydim?', dua: 'Her an gözetleyen Rakîb; her nefesimde Senin kontrolünde olduğumu bilerek, ihsan şuuruyla yaşamayı nasip et.' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Dua ve dilekleri kabul eden.', question: 'Dualarımın kabul olmadığı zamanlarda küsüyor muyum, yoksa "Hakkımda hayırlısı budur" diyebiliyor muyum?', dua: 'Dualara icabet eden Mücîb; ellerimi boş çevirme, dilediğimden daha hayırlısını bana nasip eyle.' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi', meaning: 'İlmi, rahmeti ve kudreti her şeyi kuşatan.', question: 'Kalbim, insanların hatalarını tolere edebilecek kadar geniş mi?', dua: 'Rahmeti geniş Vâsi; daralan göğsüme genişlik ver, ilmimi ve anlayışımı genişlet, beni rahmetinden mahrum etme.' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Her işi, emri ve yasağı yerli yerinde olan.', question: 'Başıma gelen olumsuzluklarda "Bunda da bir hikmet vardır" diyebiliyor muyum?', dua: 'Her işi hikmetli olan Hakîm; başıma gelen her olaydaki hikmeti sezdîr, Senin takdirine itiraz etmekten beni koru.' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Müminleri seven ve onlar tarafından da sevilen.', question: 'Allah’ı her şeyden çok seviyor muyum ve O\'nun sevdiklerini sadece O\'nun rızası için seviyor muyum?', dua: 'Seven ve sevilmeye layık Vedûd; kalbimi Senin aşkınla yak, beni sevdiklerine sevdir ve mahlukatına şefkatle baktır.' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Lütuf ve ikramı bol olan.', question: 'Övgüye layık işler yapmaya çalışıyor muyum, yoksa sadece insanların alkışını mı bekliyorum?', dua: 'Şanı yüce Mecîd; övgüye layık olan Sensin, beni güzel ahlakla övülen ve Senin övgüne mazhar olanlardan eyle.' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Ölüleri dirilten.', question: 'Her sabah uyanırken bana yeni bir gün bahşeden Rabbime, bugün yeniden doğmuş gibi şükrediyor muyum?', dua: 'Öldükten sonra dirilten Bâis; kalbimi gaflet uykusundan uyandır, ahiret günü huzuruna yüz akıyla dirilmeyi nasip et.' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Her şeye muttali olan, kendisine hiçbir şey gizli kalmayan.', question: 'Yalnız kaldığımda, O\'nun şahitliğinden utanıp yapmaktan vazgeçtiğim bir günahım var mı?', dua: 'Her şeye şahit olan Şehîd; yalnızken de kalabalıkta da Senin şahitliğinden hayâ edip günahtan kaçınmayı nasip et.' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', meaning: 'Varlığı değişmeyen tek gerçek Hakk.', question: 'Doğruyu söylemek aleyhime olsa bile Hakk\'ı savunabiliyor muyum?', dua: 'Varlığı değişmeyen tek gerçek Hakk; beni batıl yollardan ayır, Hak yolunda sabit kadem eyle.' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'Güvenilip dayanılan, tam yeterli olan.', question: 'Elimden gelen tüm gayreti gösterdikten sonra endişeyi bırakıp O\'na tam anlamıyla güvenebiliyor muyum?', dua: 'En güzel vekil Sensin; bütün işlerimi, dertlerimi Sana havale ettim, Senin vekaletin bana yeter Rabbim.' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', meaning: 'Gücü ve kuvveti her şeye yeten.', question: 'Bana verilen gücü ve enerjiyi nerede harcıyorum; hayır yolunda mı, boş işlerde mi?', dua: 'Kuvvet sahibi Kavî; bedenime ibadet için güç, irademe günahlara karşı direnç ver.' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Zafiyeti olmayan, güçlü olan.', question: 'Zorluklar ve inancıma yapılan saldırılar karşısında ne kadar sağlam durabiliyorum?', dua: 'Sarsılmaz güç sahibi Metîn; imanımı sarsılmaz kıl, zorluklar karşısında beni metanetli eyle.' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', meaning: 'Müminlere dost ve yardımcı olan.', question: 'Dost seçerken kriterim ne; dünya menfaati mi, yoksa Allah\'a yakınlık mı?', dua: 'Müminlerin dostu Velî; Senden başka dost aratma, Senin dostluğunla şereflenmeyi bana lütfet.' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Bütün övgülerin en yücesine layık olan.', question: 'Hayatımda işler ters gittiğinde de "Elhamdülillah" diyebilecek teslimiyete sahip miyim?', dua: 'Övgülerin sahibi Hamîd; dilimi hamdinden, kalbimi şükründen ayırma, her halimde \'Elhamdulillah\' demeyi nasip et.' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Her şeyin ölçü ve sayısını bilen.', question: 'Ömrümden giden sayılı nefeslerin farkında mıyım, yoksa hiç ölmeyecekmiş gibi mi yaşıyorum?', dua: 'Her şeyin sayısını bilen Muhsî; ömür sermayemi sayılı nefeslerimi boşa harcamaktan koru, her anımı bereketli kıl.' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Her şeyi yoktan var eden.', question: 'Hayatımda iyiye, güzele ve hayra dair yeni başlangıçlar yapma cesaretim var mı?', dua: 'İlk kez yaratan Mübdi’; içimde solup giden güzel hasletleri yeniden yeşert, beni hayırlı başlangıçlara muvaffak kıl.' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Varlıkları ölümlerinden sonra tekrar yaratan.', question: 'Ahirette diriltileceğimi bildiğim halde, neden sanki hesap yokmuş gibi rahatım?', dua: 'Hayatı iade eden Muîd; ahirette beni ve sevdiklerimi ebedi saadet yurdunda yeniden bir araya getir.' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Hayat veren, yaşatan ve dirilten.', question: 'Ölü kalpleri imanla dirilten O ise, ben sözlerimle başkalarının ümidini mi kırıyorum, yoksa onları hayata mı bağlıyorum?', dua: 'Hayat veren Muhyî; ölü kalbimi imanla, kuruyan gözlerimi aşkınla canlandır.' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Öldüren, canları kabzeden.', question: 'Ölümü bir yok oluş değil, Sevgili\'ye kavuşma anı olarak görebilecek bir hazırlığım var mı?', dua: 'Ölümü yaratan Mümît; ölümü bana bir son değil, Sana kavuşmanın bir başlangıcı olarak sevdir, emanetini imanla teslim etmeyi nasip et.' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', meaning: 'Ezelî ve ebedî olarak diri ve ölümsüz olan.', question: 'Kalbim Allah sevgisiyle diri mi, yoksa gaflet içinde ölü gibi mi dolaşıyorum?', dua: 'Diri olan Hayy; beni gafletle yaşayıp manen ölenlerden eyleme, zikrinle kalbimi daima diri tut.' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Her şeyi ayakta tutan.', question: 'Kendi başıma ayakta durduğumu sanıp gaflete mi düşüyorum, yoksa her an O\'nun kudretiyle var olduğumu biliyor muyum?', dua: 'Her şeyi ayakta tutan Kayyûm; varlığım Sana bağlıdır, beni bir an bile nefsimle baş başa bırakma.' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Her şeyi bilen, hiçbir şeye muhtaç olmayan.', question: 'Aradığım huzuru ve mutluluğu maddede mi, yoksa O\'nu bulmakta mı arıyorum?', dua: 'İstediğini bulan Vâcid; ben Seni bulduktan sonra neyi kaybettim ki? Beni Seni bulan ve Seninle doyanlardan eyle.' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şânı yüce ve sonsuz kerem sahibi olan.', question: 'Şeref ve haysiyetimi koruyacak, O\'nun şanına yaraşır bir kul olmaya gayret ediyor muyum?', dua: 'Şanı yüce Mâcid; kereminle beni donat, İslam ahlakıyla beni yücelt.' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Bir, tek, yegâne varlık.', question: 'Kalbimde O\'ndan başka "olmazsa olmaz" dediğim putlaştırdığım sevgiler var mı?', dua: 'Bir ve tek olan Vâhid; kalbimi tevhidin nuruyla aydınlat, Senden başka ilah ve rab tanımaktan beni koru.' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', meaning: 'Herkesin kendisine muhtaç olduğu, kendisi ise kimseye muhtaç olmayan.', question: 'Dertlendiğimde ilk kime koşuyorum; insanlara mı, yoksa kimseye muhtaç olmayan Samed\'e mi?', dua: 'Herkesin muhtaç olduğu Samed; beni Senden başkasına muhtaç etme, ihtiyaçlarımı sadece Sana arz etmeyi nasip et.' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Her şeye gücü yeten.', question: 'O her şeye kadirken, neden geleceğimden bu kadar korkuyorum?', dua: 'Her şeye gücü yeten Kâdir; acizliğimi biliyorum, gücünle bana destek ol ve zorlukları bana kolaylaştır.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'Güç ve kuvvetinde hiçbir sınır olmayan.', question: 'Gücümün yettiği her şeyi yapmaya hakkım olmadığını, O\'nun sınırlarına uymam gerektiğini biliyor muyum?', dua: 'Kudret sahibi Muktedir; elimden gelenin en iyisini yaptıktan sonra Senin takdirine tam teslim olmayı bana öğret.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'Hikmeti gereği istediğini öne alan.', question: 'Hayatımda neyi öne alıyorum; namazı ve ahireti mi, yoksa dünyalık işleri mi?', dua: 'Dilediğini öne alan Mukaddim; beni hayırda yarışanlardan, rızana koşmakta öne geçenlerden eyle.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'Hikmeti gereği dilediğini geriye bırakan.', question: 'Nefsimin acele istediği ama günah olan arzuları erteleyebiliyor muyum?', dua: 'Dilediğini geriye bırakan Muahhir; şerleri, günahları ve beni Sana yaklaştırmayan her şeyi benden uzaklaştır ve geride bırak.' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', meaning: 'Varlığının başlangıcı olmayan, ezelî olan.', question: 'Her işe "Bismillah" diyerek O\'nun adıyla başlıyor muyum?', dua: 'Başlangıcı olmayan Evvel; her işime Senin adınla başlamayı, niyetimi sadece Senin rızan kılmayı nasip et.' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', meaning: 'Varlığının sonu olmayan, ebedî olan.', question: 'Son nefesimde dilimde O\'nun adının olması için bugün dilimi ne ile meşgul ediyorum?', dua: 'Sonu olmayan Âhir; son nefesimi, son sözümü ve akıbetimi hayr eyle.' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Varlığı açık olan.', question: 'Kâinata baktığımda her eserde O\'nun imzasını ve gücünü görebiliyor muyum?', dua: 'Varlığı apaçık olan Zâhir; kâinat kitabında tecelli eden isimlerini okumayı ve eserlerinde Seni görmeyi bana lütfet.' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Zâtı itibarıyla gizli olan, bütün gizlilikleri bilen.', question: 'İç dünyamda, kimsenin bilmediği o yerde O\'nunla aram nasıl?', dua: 'Gizlilikleri bilen Bâtın; iç âlemimi dışımdan daha mamur eyle, kalbimdeki gizli sırları nurunla temizle.' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', meaning: 'Kâinatı yöneten.', question: 'Kendi küçük dünyamı (bedenimi, evimi) O\'nun istediği gibi yönetebiliyor muyum?', dua: 'Kâinatı yöneten Vâlî; işlerimi en güzel şekilde yönet, beni başıboş bırakma.' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Noksanlıklardan berî, aşkın ve yüce olan.', question: 'Düşüncelerimi basit dedikodulardan ve dünya hırslarından arındırıp yüceltebiliyor muyum?', dua: 'Yüce ve aşkın olan Müteâlî; fikrimi ve zikrimi dünyevi bayağılıklardan arındırıp ulvi hakikatlere yükselt.' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', meaning: 'Çokça iyilik eden.', question: 'İyilik yaparken insanların takdirini mi bekliyorum, yoksa sadece O\'nun bilmesi yeterli mi?', dua: 'İyiliği bol Berr; bana iyilik yapmayı sevdir, Senin iyiliğine ve ihsanına layık bir kul olmaya çalışmayı nasip et.' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Kullarını tövbelerini kabul eden.', question: 'Hata yaptığında hemen tövbe kapısına koşuyor muyum, yoksa günahı erteliyor muyum?', dua: 'Tövbeleri kabul eden Tevvâb; günahlarımdan pişmanlıkla Sana dönüyorum, tövbemi kabul et ve beni günahsız gibi tertemiz kıl.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaning: 'Suçluları cezalandıran.', question: 'Bana yapılan haksızlıklarda intikam peşine mi düşüyorum, yoksa adaleti O\'na mı havale ediyorum?', dua: 'Suçluları cezalandıran Müntakım; mazlumların ahını yerde bırakma, zalimlere karşı Senin adaletine sığınıyorum.' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Çokça affeden.', question: 'O\'nun beni affetmesini istediğim şiddette, ben de beni kıranları affedebiliyor muyum?', dua: 'Affı seven Afüvv; Sen affedicisin, affı seversin, beni de affeyle.' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Merhameti ve şefkati çok olan.', question: 'Kalbimde insanlara, hayvanlara ve tabiata karşı bir şefkat ve merhamet taşıyor muyum?', dua: 'Çok şefkatli Raûf; hatalarıma rağmen bana merhametinle muamele et, kalbime şefkat tohumları ek.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', meaning: 'Mülkün gerçek sahibi.', question: 'Elimdekilerin benim değil, O\'nun olduğunu bilerek cömertçe paylaşabiliyor muyum?', dua: 'Mülkün sahibi; elimdeki her şeyin emanet olduğunu unutturma, emaneti sahibine layıkıyla kullanmayı nasip et.' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', meaning: 'Sonsuz yücelik ve ikram sahibi olan.', question: 'O\'na kulluk ederken hem saygı (celal) hem de sevgi (ikram) dengesini koruyabiliyor muyum?', dua: 'Büyüklük ve ikram sahibi; Celalin karşısında haşyetle eğilmeyi, ikramın karşısında şükürle dolmayı bana öğret.' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Adaleti gerçekleştiren.', question: 'Kendi menfaatim zedelense bile adaleti ayakta tutabiliyor muyum?', dua: 'Adaletle hükmeden Muksit; kendi aleyhime bile olsa adaletten ve doğruluktan ayırma.' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', meaning: 'Mahlûkâtı bir araya getiren.', question: 'İnsanları ayrıştıran mı, yoksa birleştiren, gönülleri toplayan mıyım?', dua: 'Zıtları birleştiren Câmi‘; dağınık kalbimi toparla, müminleri sevgi ve birlik etrafında cem eyle.' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', meaning: 'Hiçbir şeye ihtiyacı olmayan.', question: 'Gözüm doymuyor mu, yoksa O\'nun verdikleriyle gönül zenginliğini yakalayabildim mi?', dua: 'Zengin olan Ganî; beni gönül zenginliğine eriştir, Senden başkasına el açtırma.' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'İhtiyaçtan kurtaran zengin kılan.', question: 'İnsanların ihtiyaçlarını gidermelerine vesile olarak onları manen veya madden zenginleştiriyor muyum?', dua: 'Zengin kılan Muğnî; beni kanaat hazinesiyle zenginleştir, hem dünyamı hem ahiretimi mamur eyle.' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni', meaning: 'Hikmeti gereği engel koyan.', question: 'Günah işleme fırsatı elime geçtiğinde, O\'nun korkusu buna engel oluyor mu?', dua: 'Engel olan Mâni; beni günahlardan, kazalardan ve belalardan koru, şerre giden yollarıma engeller koy.' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Hikmeti gereği elem ve zarar verici şeyleri yaratan.', question: 'Başına gelen zarar ve musibetlerin, beni O\'na yaklaştıran birer uyarı olduğunu görebiliyor musun?', dua: 'Zarar verici şeyleri de yaratan Dârr; her türlü zarardan ve elemden Sana sığınırım, Senden gelen her şeye razıyım.' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi', meaning: 'Hayrı ve faydayı yaratan ve veren.', question: 'Varlığım çevreme, insanlığa ve aileme bir fayda sağlıyor mu?', dua: 'Fayda veren Nâfi; ilmimi, malımı ve ömrümü insanlara ve kendime faydalı kıl.' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Nurlandıran, her şeyi aydınlatan.', question: 'Bilgimle, ahlakımla ve duruşumla çevreme ışık saçan bir nur muyum?', dua: 'Alemleri nurlandıran Nûr; aklımı ilim nuruyla, kalbimi iman nuruyla, yüzümü edep nuruyla aydınlat.' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Doğru yolu gösteren.', question: 'İnsanların hidayetine vesile olacak kadar güzel bir Müslümanlık yaşıyor muyum?', dua: 'Hidayet veren Hâdî; beni sırat-ı müstakimden ayırma, şaşırmışlara hidayet nasip eyle.' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî', meaning: 'Örneksiz ve benzersiz olarak yoktan yaratan.', question: 'Yaptığım işi baştan savma mı yapıyorum, yoksa O\'nun sanatkarlığına yakışır bir estetikle mi?', dua: 'Eşsiz yaratan Bedî; hayatımı sıradanlıktan kurtar, kulluğumda ve ahlakımda güzellikler icat etmemi nasip eyle.' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Varlığı sürekli olan, ebedî.', question: 'Geçici dünya hevesleri için ebedi ahiret hayatımı riske atıyor muyum?', dua: 'Sonsuz olan Bâkî; fani dünyada Bâki olanı sevmeyi, ebedi olan rızanı kazanmayı bana hedef eyle.' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Kâinatın gerçek sahibi.', question: 'Ben öldükten sonra arkamdan hayırla anılacak, insanlara faydalı ne bırakıyorum?', dua: 'Her şeyin asıl sahibi Vâris; ben gidiciyim Sen kalıcısın, arkamdan hayırla anılacak sadaka-i cariyeler bırakmayı nasip et.' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Yol gösteren, her işi isabetli olan.', question: 'Kararsız kaldığımda O\'nun kitabına ve Resulü\'nün sünnetine danışarak mı yolumu buluyorum?', dua: 'Doğru yolu gösteren Reşîd; kararlarımda bana isabetli yolu göster, beni yanlış tercihlerden koru.' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Günahkârları hemen cezalandırmayıp onlara mühlet tanıyan.', question: 'O benim günahlarıma bunca zaman sabrederken, ben başkalarının küçük hatalarına neden tahammül edemiyorum?', dua: 'Çok sabırlı Sabûr; isyanlarımıza karşı sabrına sığınıyorum, bana da musibetler karşısında peygamber sabrı lütfeyle.' }
];

// ==========================================
// 3. UYGULAMA MANTIĞI
// ==========================================
function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [stars, setStars] = useState([]);

  // Yıldızları oluştur
  useEffect(() => {
    const starArray = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 2 + 1 + 'px',
      delay: Math.random() * 5 + 's',
      duration: Math.random() * 3 + 2 + 's',
      opacity: Math.random() * 0.7 + 0.3
    }));
    setStars(starArray);
  }, []);

  // Rastgele bir index seç (Mevcut olan hariç)
  const getRandomIndex = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * esmaData.length);
    } while (newIndex === currentIndex && esmaData.length > 1);
    return newIndex;
  };

  const handleStart = () => {
    // Başlarken de rastgele bir isimle başla
    setCurrentIndex(getRandomIndex());
    setStarted(true);
  };

  const handleNext = () => {
    setFading(true);
    setTimeout(() => {
      // Rastgele (Karışık) seçim
      setCurrentIndex(getRandomIndex());
      setFading(false);
    }, 500);
  };

  const currentEsma = esmaData[currentIndex];

  return (
    <>
      <style>{styles}</style>

      {/* ARKA PLAN */}
      <div className="heavenly-background">
        <div className="light-beams"></div>
        <div className="nebula"></div>
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              '--delay': star.delay,
              '--duration': star.duration,
              '--opacity': star.opacity
            }}
          />
        ))}
      </div>

      {/* GİRİŞ EKRANI (Landing) */}
      <div className={`intro-container ${started ? 'hidden-intro' : ''}`}>
        <h1 className="intro-title">ESMA-ÜL HÜSNA</h1>
        <button onClick={handleStart} className="start-btn">
          BAŞLA
        </button>
      </div>

      {/* İÇERİK KARTI */}
      <div className={`content-container ${started ? 'content-visible' : ''}`}>
        <div className="crystal-card">
          
          <div className="card-scroll-area">
            <div className={`fade-wrapper ${fading ? 'fade-out' : 'fade-in'}`}>
              
              {/* 1. ARAPÇA İSİM (EN ÜSTTE) */}
              <div className="mb-2">
                <h2 className="arabic-font gold-mist-text drop-shadow-2xl">{currentEsma.arabic}</h2>
              </div>

              {/* 2. OKUNUŞ (ALTTA) */}
              <div className="mb-4">
                <h3 className="transliteration">{currentEsma.transliteration}</h3>
              </div>

              <div className="divider"></div>

              {/* 3. ANLAM (ALTTA) */}
              <div className="meaning-box">
                {currentEsma.meaning}
              </div>

              {/* 4. TEFEKKÜR SORUSU (ALTTA) */}
              <div className="question-wrapper">
                <span className="question-label">Tefekkür</span>
                <p className="question-text">
                  "{currentEsma.question}"
                </p>
              </div>

              {/* 5. DUA (EN ALTTA) */}
              <div className="dua-wrapper">
                <div className="dua-label">Dua</div>
                <p className="dua-text">
                  "{currentEsma.dua}"
                </p>
              </div>

            </div>
          </div>

          {/* BUTON (Kartın altında sabit) */}
          <button onClick={handleNext} className="nav-btn title-font">
            Sıradaki İsmi Getir
          </button>

        </div>
      </div>
    </>
  );
}

export default App;