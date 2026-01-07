import { useState, useEffect } from 'react';

// ==========================================
// 1. CSS STİLLERİ (Tasavvufi ve Modern)
// ==========================================
const styles = `
  /* FONT AİLESİ */
  @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;700&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
  
  .arabic-font { font-family: 'Scheherazade New', serif; line-height: 1.2; }
  .title-font { fontFamily: 'Cinzel', serif; }
  .body-font { fontFamily: 'Inter', sans-serif; }
  .dua-font { fontFamily: 'Playfair Display', serif; font-style: italic; }

  /* --- SAYFA YAPISI --- */
  body, html { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; height: 100%; width: 100%; }

  /* --- ARKA PLAN (Derin Uzay / Manevi Atmosfer) --- */
  .heavenly-background {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center bottom, #1e293b 0%, #0f172a 40%, #020617 100%);
    z-index: 0; overflow: hidden;
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

  /* --- KART VE İÇERİK --- */
  .content-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; perspective: 1000px; }

  .crystal-card {
    width: 90%; max-width: 550px; max-height: 85vh;
    background: rgba(15, 23, 42, 0.75); 
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255, 0.05) inset;
    backdrop-filter: blur(40px); border-radius: 30px; padding: 0;
    text-align: center; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    transition: transform 0.3s ease;
  }

  .card-scroll-area {
    padding: 2.5rem 2rem;
    overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(251, 191, 36, 0.3) transparent;
  }
  .card-scroll-area::-webkit-scrollbar { width: 4px; }
  .card-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(251, 191, 36, 0.3); border-radius: 20px; }

  .gold-mist-text {
    background: linear-gradient(to bottom, #fffbeb 10%, #fbbf24 50%, #d97706 90%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4));
  }
  
  .meaning-box {
    margin: 1.5rem 0;
    padding: 0 1rem;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
  }

  /* --- DUA KUTUSU --- */
  .dua-wrapper {
    margin-top: 1.5rem;
    position: relative;
    padding: 2rem 1.5rem;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(251, 191, 36, 0.02) 100%);
    border-radius: 16px;
    border: 1px solid rgba(251, 191, 36, 0.1);
  }
  
  .dua-icon {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: #0f172a; padding: 0 12px; color: #fbbf24;
    font-size: 1rem; border-radius: 99px; border: 1px solid rgba(251, 191, 36, 0.2);
  }

  .dua-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.15rem;
    color: #fcd34d;
    line-height: 1.6;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .nav-btn {
    width: 100%;
    padding: 1.2rem;
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.3s;
  }
  .nav-btn:hover { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }

  .fade-wrapper { transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-out { opacity: 0; transform: scale(0.98); }
  .fade-in { opacity: 1; transform: scale(1); }
`;

// ==========================================
// 2. BİRLEŞTİRİLMİŞ VERİ SETİ
// (İsim + Anlam + Dua)
// ==========================================
const esmaData = [
  { id: 1, arabic: 'اللَّهُ', transliteration: 'Allah', meaning: 'Tek yaratıcının özel ismi, varlığı zorunlu olan, bütün kemâl sıfatları kendisinde toplayan hakiki ma‘bûd.', dua: 'Rabbim, bütün güzel isimleri kendinde toplayan ve varlığı zorunlu olan Sensin; kalbimi sadece Sana kul olmanın huzuruyla doldur.' },
  { id: 2, arabic: 'الرَّحْمنُ', transliteration: 'er-Rahmân', meaning: 'Sonsuz merhametiyle lütuf ve ihsanda bulunan.', dua: 'Ey Rahmân, yarattığın her zerreye ulaşan sonsuz merhametinden, benim muhtaç ve çorak gönlüme de rahmet yağmurları indir.' },
  { id: 3, arabic: 'الرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Rahmetiyle her şeyi kuşatan.', dua: 'Ey Rahîm, ahirette sadece sevdiklerine lütfedeceğin özel şefkatinle beni kuşat ve beni cennetine layık eyle.' },
  { id: 4, arabic: 'الْمَلِكُ', transliteration: 'el-Melik', meaning: 'Bütün varlıkların sahibi/hükümdârı.', dua: 'Mülkün ve hükümranlığın gerçek sahibi Sensin; beni fani dünyanın geçici mülküne köle olmaktan kurtar, Sana hakiki kul eyle.' },
  { id: 5, arabic: 'الْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Eksiklik ve kusurlardan münezzeh/uzak olan, bütün kemâl sıfatları kendisinde toplayan.', dua: 'Ey her türlü eksikten uzak olan Kuddûs; ruhumu günah kirlerinden, kalbimi masivadan (Senden gayrısından) arındır.' },
  { id: 6, arabic: 'السَّلاَمُ', transliteration: 'es-Selâm', meaning: 'Esenlik ve selâmet veren, yaratılmışlara özgü değişikliklerden ve yok oluştan münezzeh olan.', dua: 'Selâm isminle kalbime esenlik ver; beni dünya ve ahiretin korkularından, her türlü tehlikeden selamete çıkar.' },
  { id: 7, arabic: 'الْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Bütün mahlûkâta emniyet/güven veren ve kendisine güvenilen.', dua: 'Güvenin kaynağı Sensin; korkularımı emniyete çevir ve beni vadine güvenen, Sana tam teslim olan kullarından eyle.' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Kâinatın bütün işlerini gözetip yöneten, her şeyi hükmü altına alan.', dua: 'Her anımı görüp gözeten Sensin; halimi Sana arz ediyorum, beni nefsimin eline bırakma, idaremi kendi kudret eline al.' },
  { id: 9, arabic: 'الْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'Ulu, galip, her şeye üstün gelen izzet sahibi.', dua: 'İzzet ve şeref ancak Senindir; beni günahların zilletinden kurtar, Sana itaatle şereflendir ve Aziz isminle ruhumu güçlendir.' },
  { id: 10, arabic: 'الْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'Dilediğini yaptırma gücüne sahip olan, her şeyi tasarrufu altına alan ve irâdesini her durumda yürüten.', dua: 'Eksikleri tamamlayan ve hükmünü geçiren Cebbâr isminle; kırık kalbimi onar, acziyetimi kudretinle tamamla.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklüğünü izhar eden, son derece ulu, yüce.', dua: 'Büyüklük ancak Sana yaraşır; nefsimi kibirden arındır ve Senin azametin karşısında boyun eğmenin tadını bana yaşat.' },
  { id: 12, arabic: 'الْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Her şeyin yaratıcısı, hikmeti gereği her şeyi ölçülü yaratan.', dua: 'Yoktan var eden Hâlik Sensin; beni en güzel surette yarattığın gibi, ahlakımı da yaratılış gayeme uygun eyle.' },
  { id: 13, arabic: 'الْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Yoktan yaratan, maddesi ve örneği olmadan îcat eden.', dua: 'Her şeyi kusursuzca ve örneksiz yaratan Rabbim; hayatımı rızana uygun, ahenkli ve düzenli bir hale getir.' },
  { id: 14, arabic: 'الْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Varlığa şekil ve sûret veren.', dua: 'Varlığa şekil veren Musavvir; yüzümü secdeyle güzelleştirdiğin gibi, ruhumu da iman nuruyla şekillendir.' },
  { id: 15, arabic: 'الْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Kusur ve günahları örten, çokça bağışlayan.', dua: 'Günahları tekrar tekrar örten Gaffâr; yüzüm karası günahlarımı setret, beni utandırma ve mağfiretini benden esirgeme.' },
  { id: 16, arabic: 'الْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Yenilmeyen, dilediğini yerine getiren, kendisine her şeyin boyun eğdiği yegâne kudret ve tasarruf sahibi.', dua: 'Mutlak galip olan Kahhâr; nefsimin bitmek bilmeyen kötü arzularını ve içimdeki isyanı kudretinle bastır, beni Sana ram eyle.' },
  { id: 17, arabic: 'الْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız olarak çokça nimet veren ve ihsanda bulunan.', dua: 'Karşılıksız hibe eden Vehhâb; liyakatime bakmadan, sırf lütfunla bana hikmet, iman ve salih amel bağışla.' },
  { id: 18, arabic: 'الرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Maddî ve manevî bol rızık veren, her türlü rızık imkânlarını yaratan.', dua: 'Rızkı veren ancak Sensin; beni harama muhtaç etme, helal ve geniş rızıkla rızıklandırıp şükrünü eda etmeyi nasip eyle.' },
  { id: 19, arabic: 'الْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Hayır kapılarını açan, hükmüyle adaleti sağlayan.', dua: 'Her türlü hayır kapısını açan Fettâh; kalbimi imana, aklımı ilme, işlerimi kolaylığa aç; önümdeki engelleri kaldır.' },
  { id: 20, arabic: 'الْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'İlmi her şeyi kuşatan.', dua: 'Gizliyi ve aşikârı bilen Alîm; ilminle beni cehaletin karanlığından kurtar, Seni hakkıyla bilmeyi bana nasip et.' },
  { id: 21, arabic: 'الْقَابِضُ', transliteration: 'el-Kâbız', meaning: 'Her şeyi teslim alan, hikmeti gereği rızkı ve her türlü nimeti ölçülü veren, eceli gelenlerin ruhlarını teslim alan.', dua: 'Bazen daraltan ve sıkan Kâbız isminle gelen imtihanlarda bana sabır ver; daralmalarımın arkasındaki hikmeti anlamayı nasip et.' },
  { id: 22, arabic: 'الْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Rızkı ve her türlü rızık imkânını genişleten, ömürleri uzatan.', dua: 'Ruhları ve rızıkları genişleten Bâsıt; gönlüme inşirah (genişlik) ver, ibadetlerinde bana şevk ve genişlik ihsan eyle.' },
  { id: 23, arabic: 'الْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Kâfirleri ve zalimleri alçaltan.', dua: 'Zalimleri alçaltan Rabbim; beni kibirle yükselip sonra alçalanlardan eyleme, tevazu ile yücelenlerden eyle.' },
  { id: 24, arabic: 'الرَّافِعُ', transliteration: 'er-Râfi', meaning: 'Müminleri yükselten, izzetli ve şerefli kılan.', dua: 'Müminleri yükselten Râfi; iman ve ahlak ile derecemi yükselt, beni katında ve kullarının nezdinde değerli kıl.' },
  { id: 25, arabic: 'الْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'Yücelten, güçlü ve aziz kılan.', dua: 'İzzet veren Muizz; beni İslam’ın izzetiyle aziz kıl, Senden başkasına el açtırma.' },
  { id: 26, arabic: 'الْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Boyun eğdiren, değersiz kılan.', dua: 'Boyun eğdiren Müzill; nefsimi ve şeytanı bana boyun eğdir, beni zelil duruma düşecek hatalardan koru.' },
  { id: 27, arabic: 'السَّمِيعُ', transliteration: 'es-Semî', meaning: 'Her şeyi işiten.', dua: 'Fısıltıları dahi işiten Semî; dualarımı, sessiz yakarışlarımı ve kalbimin derinindeki âhları işit ve kabul buyur.' },
  { id: 28, arabic: 'الْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören.', dua: 'Her şeyi gören Basîr; her an Senin gözetiminde olduğumu bilerek yaşamayı ve haramlara bakmaktan gözümü sakınmayı nasip et.' },
  { id: 29, arabic: 'الْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Nihaî hükmü veren.', dua: 'Mutlak hüküm sahibi Hakem; hayatımda ve ahiretimde hükmüne razı olmayı, adaletten şaşmamayı bana öğret.' },
  { id: 30, arabic: 'الْعَدْلُ', transliteration: 'el-Adl', meaning: 'Adaletli, her şeyi yerli yerinde yapan.', dua: 'Adaletin kaynağı Adl; bana kendime, çevreme ve Rabbime karşı adaletli olmayı, zulümden uzak durmayı nasip eyle.' },
  { id: 31, arabic: 'اللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'En gizli ve ince hususları dahi bilen, lütufta bulunan, zâtı duyularla algılanamayan, fiillerini rıfk ile gerçekleştiren.', dua: 'En ince lütufların sahibi Latîf; beni ummadığım yerlerden rızıklandır ve olayların arkasındaki ince hikmetlerini kavramayı lütfet.' },
  { id: 32, arabic: 'الْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Gizli ve açık her şeyden haberdar olan, dilediğini haber veren.', dua: 'Her şeyden haberdar olan Habîr; içimdeki gizli niyetleri Sen biliyorsun, niyetimi halis, amelimi rızana uygun eyle.' },
  { id: 33, arabic: 'الْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Sabırlı, acele ve kızgınlıkla muamele etmeyen, kudreti olduğu hâlde hemen cezalandırmayan.', dua: 'Cezada acele etmeyen Halîm; isyanıma rağmen bana mühlet verdiğin için şükürler olsun, beni yumuşak huylu ve sabırlı kullarından eyle.' },
  { id: 34, arabic: 'الْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Zât ve sıfatları bakımından pek yüce olan, azametli olan.', dua: 'Pek yüce olan Azîm; Senin azametin karşısında küçüklüğümü idrak ettir, Seni hakkıyla tazim etmeyi bana nasip et.' },
  { id: 35, arabic: 'الْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Çok affedici ve bağışlayıcı olan.', dua: 'Çok bağışlayan Gafûr; günahlarım ne kadar çok olsa da Senin affın daha büyüktür, beni affınla temizle.' },
  { id: 36, arabic: 'الشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Yapılan iyi amellerin karşılığını bolca veren.', dua: 'Az amele çok karşılık veren Şekûr; azıcık ibadetimi kabul buyur, beni verdiği nimetlere nankörlük etmeyen şükredici bir kul eyle.' },
  { id: 37, arabic: 'الْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yücelik ve hükümranlıkta kendisine eşit veya kendisinden daha üstün bir varlık bulunmayan.', dua: 'Yüceler yücesi Aliyy; himmetimi ve hedeflerimi rızan için yüksek tut, beni süfli heveslerin peşinde koşturma.' },
  { id: 38, arabic: 'الْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Zâtının ve sıfatlarının mahiyeti bilinemeyecek kadar büyük ve ulu olan.', dua: 'Büyüklüğü kavranamayan Kebîr; gözümde büyüttüğüm dünya dertlerini Senin büyüklüğünü düşünerek küçültmemi nasip et.' },
  { id: 39, arabic: 'الْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Her şey gözetiminde olan, koruyan ve kâinatı dengede tutan.', dua: 'Her şeyi koruyan Hafîz; beni, sevdiklerimi ve imanımı her türlü şeytani ve nefsani tehlikeden muhafaza eyle.' },
  { id: 40, arabic: 'الْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Mahlukatın gıdasını yaratıp veren, güç yetiren ve koruyup gözeten.', dua: 'Her canlının gıdasını ve gücünü veren Mukît; bedenimi helal rızıkla, ruhumu ibadet gıdasıyla besle ve güçlendir.' },
  { id: 41, arabic: 'الْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesaba çeken, her şeyin neticesini bilen.', dua: 'Hesap görücü olarak Sen yetersin; beni hesabı kolay verilenlerden eyle, her işimde Senin rızanı hesaba katmayı nasip et.' },
  { id: 42, arabic: 'الْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Hiçbir kayıt ve kıyas kabul etmeksizin azamet sahibi, kıymeti ve mertebesi en yüce olan.', dua: 'Azamet sahibi Celîl; Celalinin tecellisiyle kalbime ürperti, Cemalinin tecellisiyle ruhuma muhabbet ver.' },
  { id: 43, arabic: 'الْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Çok cömert, nimet ve ihsanı bol olan.', dua: 'İkramı bol Kerîm; cömertliğinle beni dünyada ve ahirette mahcup etme, beni de cömert kullarından eyle.' },
  { id: 44, arabic: 'الرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Gözeten, koruyan ve bütün işler murakabesi/kontrolü altında olan.', dua: 'Her an gözetleyen Rakîb; her nefesimde Senin kontrolünde olduğumu bilerek, ihsan şuuruyla yaşamayı nasip et.' },
  { id: 45, arabic: 'الْمُجِيبُ', transliteration: 'el-Mücîb', meaning: 'Dua ve dilekleri kabul eden.', dua: 'Dualara icabet eden Mücîb; ellerimi boş çevirme, dilediğimden daha hayırlısını bana nasip eyle.' },
  { id: 46, arabic: 'الْوَاسِعُ', transliteration: 'el-Vâsi', meaning: 'İlmi, rahmeti ve kudreti her şeyi kuşatan.', dua: 'Rahmeti geniş Vâsi; daralan göğsüme genişlik ver, ilmimi ve anlayışımı genişlet, beni rahmetinden mahrum etme.' },
  { id: 47, arabic: 'الْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Her işi, emri ve yasağı yerli yerinde olan.', dua: 'Her işi hikmetli olan Hakîm; başıma gelen her olaydaki hikmeti sezdîr, Senin takdirine itiraz etmekten beni koru.' },
  { id: 48, arabic: 'الْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Müminleri seven ve onlar tarafından da sevilen.', dua: 'Seven ve sevilmeye layık Vedûd; kalbimi Senin aşkınla yak, beni sevdiklerine sevdir ve mahlukatına şefkatle baktır.' },
  { id: 49, arabic: 'الْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Her türlü eksiklikten münezzeh, lütuf ve ikramı bol olan.', dua: 'Şanı yüce Mecîd; övgüye layık olan Sensin, beni güzel ahlakla övülen ve Senin övgüne mazhar olanlardan eyle.' },
  { id: 50, arabic: 'الْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Ölüleri dirilten, peygamberler gönderen.', dua: 'Öldükten sonra dirilten Bâis; kalbimi gaflet uykusundan uyandır, ahiret günü huzuruna yüz akıyla dirilmeyi nasip et.' },
  { id: 51, arabic: 'الشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Her şeye muttali olan, kendisine hiçbir şey gizli kalmayan.', dua: 'Her şeye şahit olan Şehîd; yalnızken de kalabalıkta da Senin şahitliğinden hayâ edip günahtan kaçınmayı nasip et.' },
  { id: 52, arabic: 'الْحَقُّ', transliteration: 'el-Hakk', meaning: 'Bizzat ve sürekli olarak var olan, varlığı kendinden olan, uluhiyet ve rububiyeti gerçek olan.', dua: 'Varlığı değişmeyen tek gerçek Hakk; beni batıl yollardan ayır, Hak yolunda sabit kadem eyle.' },
  { id: 53, arabic: 'الْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'Bütün yaratıkların işlerinin görülmesinde güvenilip dayanılan, bu konuda tam yeterli olan.', dua: 'En güzel vekil Sensin; bütün işlerimi, dertlerimi Sana havale ettim, Senin vekaletin bana yeter Rabbim.' },
  { id: 54, arabic: 'الْقَوِيُّ', transliteration: 'el-Kavî', meaning: 'Gücü ve kuvveti her şeye yeten.', dua: 'Kuvvet sahibi Kavî; bedenime ibadet için güç, irademe günahlara karşı direnç ver.' },
  { id: 55, arabic: 'الْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Âcizliği, zafiyeti ve güçsüzlüğü olmayan, güçlü olan.', dua: 'Sarsılmaz güç sahibi Metîn; imanımı sarsılmaz kıl, zorluklar karşısında beni metanetli eyle.' },
  { id: 56, arabic: 'الْوَلِيُّ', transliteration: 'el-Velî', meaning: 'Müminlere dost ve yardımcı olan.', dua: 'Müminlerin dostu Velî; Senden başka dost aratma, Senin dostluğunla şereflenmeyi bana lütfet.' },
  { id: 57, arabic: 'الْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Çok övülen, bütün övgülere ve övgülerin en yücesine layık olan.', dua: 'Övgülerin sahibi Hamîd; dilimi hamdinden, kalbimi şükründen ayırma, her halimde \'Elhamdulillah\' demeyi nasip et.' },
  { id: 58, arabic: 'الْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Gizli ve âşikâr her şeyin ölçü ve sayısını bütün ayrıntılarıyla bilen.', dua: 'Her şeyin sayısını bilen Muhsî; ömür sermayemi sayılı nefeslerimi boşa harcamaktan koru, her anımı bereketli kıl.' },
  { id: 59, arabic: 'الْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Her şeyi yoktan var eden.', dua: 'İlk kez yaratan Mübdi’; içimde solup giden güzel hasletleri yeniden yeşert, beni hayırlı başlangıçlara muvaffak kıl.' },
  { id: 60, arabic: 'الْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Varlıkları ölümlerinden sonra tekrar yaratan.', dua: 'Hayatı iade eden Muîd; ahirette beni ve sevdiklerimi ebedi saadet yurdunda yeniden bir araya getir.' },
  { id: 61, arabic: 'الْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Hayat veren, yaşatan ve dirilten.', dua: 'Hayat veren Muhyî; ölü kalbimi imanla, kuruyan gözlerimi aşkınla canlandır.' },
  { id: 62, arabic: 'الْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Öldüren, canları kabzeden.', dua: 'Ölümü yaratan Mümît; ölümü bana bir son değil, Sana kavuşmanın bir başlangıcı olarak sevdir, emanetini imanla teslim etmeyi nasip et.' },
  { id: 63, arabic: 'الْحَيُّ', transliteration: 'el-Hayy', meaning: 'Ezelî ve ebedî olarak diri ve ölümsüz olan.', dua: 'Diri olan Hayy; beni gafletle yaşayıp manen ölenlerden eyleme, zikrinle kalbimi daima diri tut.' },
  { id: 64, arabic: 'الْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Varlığı kendinden olan, her şeyin varlığı kendisine bağlı olan, kâinatı idare eden.', dua: 'Her şeyi ayakta tutan Kayyûm; varlığım Sana bağlıdır, beni bir an bile nefsimle baş başa bırakma.' },
  { id: 65, arabic: 'الْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Her şeyi bilen, hiçbir şeye muhtaç olmayan, emrini ve isteğini daima gerçekleştiren.', dua: 'İstediğini bulan Vâcid; ben Seni bulduktan sonra neyi kaybettim ki? Beni Seni bulan ve Seninle doyanlardan eyle.' },
  { id: 66, arabic: 'الْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şânı yüce ve sonsuz kerem sahibi olan.', dua: 'Şanı yüce Mâcid; kereminle beni donat, İslam ahlakıyla beni yücelt.' },
  { id: 67, arabic: 'الْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Bir, tek, yegâne varlık; zâtında, ilah ve rab oluşunda ortağı olmayan.', dua: 'Bir ve tek olan Vâhid; kalbimi tevhidin nuruyla aydınlat, Senden başka ilah ve rab tanımaktan beni koru.' },
  { id: 68, arabic: 'الصَّمَدُ', transliteration: 'es-Samed', meaning: 'Herkesin kendisine muhtaç olduğu, kendisi ise kimseye muhtaç olmayan, ezelî ve ebedî olan.', dua: 'Herkesin muhtaç olduğu Samed; beni Senden başkasına muhtaç etme, ihtiyaçlarımı sadece Sana arz etmeyi nasip et.' },
  { id: 69, arabic: 'الْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Her şeye gücü yeten.', dua: 'Her şeye gücü yeten Kâdir; acizliğimi biliyorum, gücünle bana destek ol ve zorlukları bana kolaylaştır.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'Güç ve kuvvetinde hiçbir sınır olmayan.', dua: 'Kudret sahibi Muktedir; elimden gelenin en iyisini yaptıktan sonra Senin takdirine tam teslim olmayı bana öğret.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'Hikmeti gereği istediğini öne alan, ileri geçiren.', dua: 'Dilediğini öne alan Mukaddim; beni hayırda yarışanlardan, rızana koşmakta öne geçenlerden eyle.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'Hikmeti gereği dilediğini geriye bırakan.', dua: 'Dilediğini geriye bırakan Muahhir; şerleri, günahları ve beni Sana yaklaştırmayan her şeyi benden uzaklaştır ve geride bırak.' },
  { id: 73, arabic: 'الأَوَّلُ', transliteration: 'el-Evvel', meaning: 'Varlığının başlangıcı olmayan, ezelî olan.', dua: 'Başlangıcı olmayan Evvel; her işime Senin adınla başlamayı, niyetimi sadece Senin rızan kılmayı nasip et.' },
  { id: 74, arabic: 'الآخِرُ', transliteration: 'el-Âhir', meaning: 'Varlığının sonu olmayan, ebedî olan.', dua: 'Sonu olmayan Âhir; son nefesimi, son sözümü ve akıbetimi hayr eyle.' },
  { id: 75, arabic: 'الظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Varlığını ve birliğini belgeleyen birçok delilin bulunması açısından varlığı açık olan.', dua: 'Varlığı apaçık olan Zâhir; kâinat kitabında tecelli eden isimlerini okumayı ve eserlerinde Seni görmeyi bana lütfet.' },
  { id: 76, arabic: 'الْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Zâtı itibarıyla gizli olan, bütün gizlilikleri bilen.', dua: 'Gizlilikleri bilen Bâtın; iç âlemimi dışımdan daha mamur eyle, kalbimdeki gizli sırları nurunla temizle.' },
  { id: 77, arabic: 'الْوَالِي', transliteration: 'el-Vâlî', meaning: 'Kâinatı yöneten, onlar için gerekli olan her şeyi üstlenen.', dua: 'Kâinatı yöneten Vâlî; işlerimi en güzel şekilde yönet, beni başıboş bırakma.' },
  { id: 78, arabic: 'الْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Noksanlıklardan berî, aşkın ve yüce olan.', dua: 'Yüce ve aşkın olan Müteâlî; fikrimi ve zikrimi dünyevi bayağılıklardan arındırıp ulvi hakikatlere yükselt.' },
  { id: 79, arabic: 'الْبَرُّ', transliteration: 'el-Berr', meaning: 'Çokça iyilik eden.', dua: 'İyiliği bol Berr; bana iyilik yapmayı sevdir, Senin iyiliğine ve ihsanına layık bir kul olmaya çalışmayı nasip et.' },
  { id: 80, arabic: 'التَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Kullarını tövbelerini kabul eden.', dua: 'Tövbeleri kabul eden Tevvâb; günahlarımdan pişmanlıkla Sana dönüyorum, tövbemi kabul et ve beni günahsız gibi tertemiz kıl.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaning: 'Suçluları yaptıklarına karşılık cezalandıran.', dua: 'Suçluları cezalandıran Müntakım; mazlumların ahını yerde bırakma, zalimlere karşı Senin adaletine sığınıyorum.' },
  { id: 82, arabic: 'الْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Çokça affeden.', dua: 'Affı seven Afüvv; Sen affedicisin, affı seversin, beni de affeyle.' },
  { id: 83, arabic: 'الرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Merhameti ve şefkati çok olan.', dua: 'Çok şefkatli Raûf; hatalarıma rağmen bana merhametinle muamele et, kalbime şefkat tohumları ek.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-mülk', meaning: 'Mülkün gerçek sahibi, tüm mevcûdâtı idare eden.', dua: 'Mülkün sahibi; elimdeki her şeyin emanet olduğunu unutturma, emaneti sahibine layıkıyla kullanmayı nasip et.' },
  { id: 85, arabic: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', transliteration: 'Zü’l-celâli ve’l-ikrâm', meaning: 'Sonsuz yücelik ve ikram sahibi olan.', dua: 'Büyüklük ve ikram sahibi; Celalin karşısında haşyetle eğilmeyi, ikramın karşısında şükürle dolmayı bana öğret.' },
  { id: 86, arabic: 'الْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Adaleti gerçekleştiren, hakkaniyetle hükmeden.', dua: 'Adaletle hükmeden Muksit; kendi aleyhime bile olsa adaletten ve doğruluktan ayırma.' },
  { id: 87, arabic: 'الْجَامِعُ', transliteration: 'el-Câmi‘', meaning: 'Dünya ve ahirette bütün mahlûkâtı bir araya getirme kudretine sahip olan.', dua: 'Zıtları birleştiren Câmi‘; dağınık kalbimi toparla, müminleri sevgi ve birlik etrafında cem eyle.' },
  { id: 88, arabic: 'الْغَنِيُّ', transliteration: 'el-Ganî', meaning: 'Hiçbir şeye ihtiyacı olmayan.', dua: 'Zengin olan Ganî; beni gönül zenginliğine eriştir, Senden başkasına el açtırma.' },
  { id: 89, arabic: 'الْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'İhtiyaçtan kurtaran zengin kılan.', dua: 'Zengin kılan Muğnî; beni kanaat hazinesiyle zenginleştir, hem dünyamı hem ahiretimi mamur eyle.' },
  { id: 90, arabic: 'الْمَانِعُ', transliteration: 'el-Mâni', meaning: 'Hikmeti gereği engel koyan, mâni olan.', dua: 'Engel olan Mâni; beni günahlardan, kazalardan ve belalardan koru, şerre giden yollarıma engeller koy.' },
  { id: 91, arabic: 'الضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Hikmeti gereği elem ve zarar verici şeyleri yaratan.', dua: 'Zarar verici şeyleri de yaratan Dârr; her türlü zarardan ve elemden Sana sığınırım, Senden gelen her şeye razıyım.' },
  { id: 92, arabic: 'النَّافِعُ', transliteration: 'en-Nâfi', meaning: 'Hayrı ve faydayı yaratan ve veren.', dua: 'Fayda veren Nâfi; ilmimi, malımı ve ömrümü insanlara ve kendime faydalı kıl.' },
  { id: 93, arabic: 'النُّورُ', transliteration: 'en-Nûr', meaning: 'Nurlandıran, her şeyi aydınlatan, kalplere nur ve iman veren.', dua: 'Alemleri nurlandıran Nûr; aklımı ilim nuruyla, kalbimi iman nuruyla, yüzümü edep nuruyla aydınlat.' },
  { id: 94, arabic: 'الْهَادِي', transliteration: 'el-Hâdî', meaning: 'Doğru yolu gösteren, hidâyete erdiren.', dua: 'Hidayet veren Hâdî; beni sırat-ı müstakimden ayırma, şaşırmışlara hidayet nasip eyle.' },
  { id: 95, arabic: 'الْبَدِيعُ', transliteration: 'el-Bedî', meaning: 'Örneksiz ve benzersiz olarak yoktan yaratan.', dua: 'Eşsiz yaratan Bedî; hayatımı sıradanlıktan kurtar, kulluğumda ve ahlakımda güzellikler icat etmemi nasip eyle.' },
  { id: 96, arabic: 'الْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Varlığı sürekli olan, ebedî, sonsuz olan.', dua: 'Sonsuz olan Bâkî; fani dünyada Bâki olanı sevmeyi, ebedi olan rızanı kazanmayı bana hedef eyle.' },
  { id: 97, arabic: 'الْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Varlığının sonunun bulunmaması vasfıyla kâinatın gerçek sahibi.', dua: 'Her şeyin asıl sahibi Vâris; ben gidiciyim Sen kalıcısın, arkamdan hayırla anılacak sadaka-i cariyeler bırakmayı nasip et.' },
  { id: 98, arabic: 'الرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Yol gösteren, her işi isabetli olan.', dua: 'Doğru yolu gösteren Reşîd; kararlarımda bana isabetli yolu göster, beni yanlış tercihlerden koru.' },
  { id: 99, arabic: 'الصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Günahkârları hemen cezalandırmayıp onlara mühlet tanıyan.', dua: 'Çok sabırlı Sabûr; isyanlarımıza karşı sabrına sığınıyorum, bana da musibetler karşısında peygamber sabrı lütfeyle.' }
];

// ==========================================
// 3. UYGULAMA MANTIĞI
// ==========================================
function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  
  // Sıradaki isme geçiş (Döngüsel)
  const handleNext = () => {
    setFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % esmaData.length);
      setFading(false);
    }, 500); // Yarım saniyelik geçiş süresi
  };

  const currentEsma = esmaData[currentIndex];

  return (
    <>
      <style>{styles}</style>

      {/* ARKA PLAN */}
      <div className="heavenly-background">
        <div className="light-beams"></div>
        <div className="nebula"></div>
      </div>

      {/* İÇERİK */}
      <div className="content-container">
        <div className="crystal-card">
          
          <div className="card-scroll-area">
            <div className={`fade-wrapper ${fading ? 'fade-out' : 'fade-in'}`}>
              
              {/* İSİM KISMI */}
              <div className="mb-6">
                <h2 className="text-8xl arabic-font gold-mist-text mb-2 drop-shadow-2xl">{currentEsma.arabic}</h2>
                <h3 className="text-2xl title-font text-sky-200 tracking-[0.2em] uppercase font-light opacity-90">{currentEsma.transliteration}</h3>
              </div>

              <div className="h-px w-24 bg-amber-500/40 mx-auto mb-6"></div>

              {/* ANLAM KISMI */}
              <p className="meaning-box">
                {currentEsma.meaning}
              </p>

              {/* DUA KISMI */}
              <div className="dua-wrapper">
                <div className="dua-icon">🤲</div>
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