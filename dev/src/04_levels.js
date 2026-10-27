/* ---------- campaign data: 5 chapters, each with 3 visual zones + arena + boss ---------- */
const ENM={
  imp:{n:'عفريت جمر',ai:'melee',hp:28,sp:34,dmg:8,r:6,xp:10,bias:{chest:2,helm:2}},
  jackal:{n:'ابن آوى',ai:'lunge',hp:20,sp:58,dmg:7,r:6,xp:8,bias:{boots:3,gloves:2}},
  sandMage:{n:'ساحر الرمل',ai:'kite',hp:22,sp:30,dmg:9,r:5,xp:14,pc:'#e0b060',bias:{amulet:4}},
  scarab:{n:'جعران',ai:'lunge',hp:12,sp:70,dmg:5,r:4,xp:5,gold:2.2,bias:{amulet:2}},
  spider:{n:'عنكبوت الظلال',ai:'lunge',hp:30,sp:60,dmg:9,r:6,xp:13,bias:{gloves:3,boots:2}},
  fungus:{n:'فطر عملاق',ai:'slam',hp:70,sp:20,dmg:12,r:8,xp:18,bias:{chest:3,helm:2}},
  wisp:{n:'شعلة الغابة',ai:'kite',hp:20,sp:36,dmg:9,r:5,xp:15,pc:'#7affd0',bias:{amulet:5}},
  sapling:{n:'غصن حي',ai:'melee',hp:44,sp:30,dmg:10,r:7,xp:14,bias:{weapon:2,helm:2}},
  bat:{n:'خفاش الكهف',ai:'swarm',hp:14,sp:72,dmg:6,r:4,xp:7,bias:{boots:3}},
  golem:{n:'جولم حجري',ai:'slam',hp:96,sp:22,dmg:15,r:9,xp:26,bias:{weapon:4,chest:2}},
  shardling:{n:'شظية حية',ai:'kite',hp:26,sp:32,dmg:9,r:5,xp:16,pc:'#58d0ff',fan:3,bias:{amulet:3,gloves:2}},
  mummy:{n:'مومياء',ai:'melee',hp:56,sp:26,dmg:11,r:6,xp:18,bias:{chest:3,helm:2}},
  skeleton:{n:'هيكل رامٍ',ai:'archer',hp:24,sp:30,dmg:10,r:5,xp:15,pc:'#e8e0c0',bias:{weapon:3,gloves:2}},
  scorpion:{n:'عقرب',ai:'lunge',hp:36,sp:62,dmg:11,r:6,xp:17,bias:{boots:3,gloves:2}},
  wraith:{n:'شبح المقبرة',ai:'kite',hp:30,sp:40,dmg:11,r:6,xp:20,pc:'#a8a0ff',bias:{amulet:4,helm:2}},
  knight:{n:'فارس الرماد',ai:'melee',hp:85,sp:30,dmg:14,r:7,xp:28,bias:{weapon:3,chest:3,helm:3}},
  cinder:{n:'ساحر الجمر',ai:'kite',hp:34,sp:30,dmg:12,r:6,xp:24,pc:'#ff6a2a',fan:3,bias:{amulet:4,weapon:2}},
  brute:{n:'وحش الحمم',ai:'slam',hp:120,sp:24,dmg:18,r:9,xp:34,bias:{weapon:4,chest:3}},
  hound:{n:'كلب الجحيم',ai:'lunge',hp:44,sp:70,dmg:13,r:6,xp:22,bias:{boots:4,gloves:3}}
};
const BOSSES=[
 {id:'scorpion',n:'ملكة العقارب',hp:520,dmg:11,r:13,sp:24,xp:160,col:'#e0a040',atk:['charge','shots','slam','summon','charge','rain'],sum:'scarab',intro:'اقتربت من عشي؟ حياتك قصيرة يا غريب.',gold:['#3a2410','#7a4a20','#e0a040']},
 {id:'mothertree',n:'الشجرة الأم',hp:700,dmg:12,r:14,sp:0,xp:230,col:'#7affd0',atk:['rain','ring','summon','spiral','slam','rain'],sum:'sapling',intro:'نامت جذوري أجيالًا... ومن أيقظكم ستدفعون الثمن.',gold:['#1a3a24','#3a6a3a','#7affd0']},
 {id:'golem',n:'حارس الكريستال',hp:900,dmg:14,r:15,sp:16,xp:300,col:'#58d0ff',atk:['slam','rain','charge','ring','slam','spiral'],sum:'shardling',intro:'القلب... لن يصل... إلى... أحد.',gold:['#2a3040','#4a5a78','#58d0ff']},
 {id:'pharaoh',n:'الفرعون المنسي',hp:1100,dmg:15,r:12,sp:26,xp:380,col:'#ffd24a',atk:['summon','spiral','shots','slam','charge','rain','ring'],sum:'mummy',intro:'أنا من حكمت قبل أن تُخلق الرمال. اركع.',gold:['#4a3a10','#a88a2a','#ffd24a']},
 {id:'ashking',n:'ملك الرماد',hp:1500,dmg:17,r:14,sp:28,xp:600,col:'#ff7a2f',atk:['charge','ring','shots','summon','slam','rain','spiral','charge'],sum:'imp',intro:'جئت تبي قلب الواحة؟ تعال خذه من بين الجمر.',gold:['#3a1812','#7a2a1a','#ff7a2f']}
];
/* zones: x ranges are fractions of level width up to the gate. g=ground palette, p=props [species,weight], r=rocks, en=[type,count,mult] */
const LV=[
 {name:'واحة الجمر',sub:'الفصل الأول',w:104,h:46,mus:0,liq:'water',boss:0,mini:'jackal',goal:24,ilv:1,
  brk:['jar','crate'],
  intro:[['الراوي','الواحة اللي كانت تسقي القوافل صارت صامتة، والنخل فيها يلمع بحمرة غريبة.'],['العم سالم','يا ولدي... الحمد لله إنك وصلت.'],['العم سالم','خذ هذا السيف الخشبي. ما هو شي، بس الصناديق في الطريق فيها أحسن منه بكثير.'],['العم سالم','وكل وحش تقتله يمكن يسقط لك سلاح أو درع. افتح الحقيبة بزر I وألبس الأفضل.'],['العم سالم','لازم تكسر الختم على البوابة الشرقية. وانتبه من ملكة العقارب اللي ساكنة هناك.']],
  zones:[
   {to:.28,nm:'ضفاف الواحة',g:{a:['#cfae74','#c19f63','#dbbd86'],dec:['tuft','pebble','flower','shell']},p:[['datePalm',5],['shortPalm',3],['leanPalm',3],['shrub',4],['reeds',2],['acacia',1]],pd:.36,r:[['boulderSand',3],['rubbleSand',3],['slabSand',2]],rd:.025,
    fog:{a:.5,r:175,c:[232,214,170]},amb:'motes',en:[['jackal',4,1],['scarab',6,1],['imp',3,1]]},
   {to:.62,nm:'النخيل الذابل',g:{a:['#a8a05a','#968e4c','#b8b068'],dec:['dry','pebble','bone','tuft']},p:[['deadPalm',4],['dryShrub',4],['acacia',3],['cactus',3],['thornBush',1],['shortPalm',1]],pd:.3,r:[['boulderSand',3],['boulderGrey',2],['slabSand',2],['rubbleSand',2]],rd:.03,
    fog:{a:.82,r:130,c:[28,30,14]},amb:'fireflies',en:[['imp',6,1.1],['jackal',5,1.1],['sandMage',3,1],['scarab',5,1.1]]},
   {to:1,nm:'خرائب الجمر',g:{a:['#5a5058','#4b424a','#6a6068'],dec:['crack','ember','pebble','bone']},p:[['charred',4],['deadTree',3],['column',2],['urn',1],['skullPile',1]],pd:.24,r:[['emberStone',5],['boulderDark',3],['slabGrey',2],['rubbleGrey',2]],rd:.05,
    fog:{a:.9,r:112,c:[18,10,26]},amb:'embers',en:[['imp',6,1.4],['jackal',4,1.4],['sandMage',4,1.4],['scarab',4,1.3]]}],
  arena:{g:['#4a3a30','#3e2e26','#5a463a'],props:[['column',1],['brazier',1]],fog:{a:.9,r:125,c:[40,16,6]}},
  outro:[['الراوي','سقطت ملكة العقارب، وانكشف خلف عشها ممر ينزل إلى ظلام الغابة.'],['العم سالم','هذي بداية بس يا بطل. ختم الجمر ما انكسر كله.']]},
 {name:'غابة الهمس',sub:'الفصل الثاني',w:116,h:50,mus:1,liq:'water',boss:1,mini:'spider',goal:30,ilv:3,
  brk:['pod','crate'],
  intro:[['الراوي','تحت الأرض رجع الضوء... بس هذا ما هو ضوء الشمس. هذي غابة تهمس بأسماء الداخلين.'],['ياقوت','أنا ياقوت، تاجر القوافل. الغابة هذي خذت نصف رجالي. اشترِ مني قبل ما تكمل.']],
  zones:[
   {to:.3,nm:'أطراف الغابة',g:{a:['#4a6a34','#3e5c2c','#5a7c3e'],dec:['grass','flower','leaf','pebble']},p:[['oak',5],['fig',3],['shrub',4],['cypress',2],['log',2]],pd:.42,r:[['boulderMoss',4],['rubbleGrey',2]],rd:.025,
    fog:{a:.7,r:140,c:[10,24,14]},amb:'fireflies',en:[['spider',5,1.2],['sapling',4,1.2],['wisp',3,1.2],['fungus',2,1.1]]},
   {to:.66,nm:'قلب الهمس',g:{a:['#2a4a30','#22402a','#365a3a'],dec:['moss','mush','leaf','root']},p:[['ancient',2],['cypress',4],['oak',3],['mushroom',5],['thornBush',2],['deadTree',1],['log',2]],pd:.5,r:[['boulderMoss',4],['boulderDark',1]],rd:.03,
    fog:{a:.88,r:112,c:[6,20,18]},amb:'spores',en:[['spider',6,1.4],['sapling',6,1.4],['wisp',4,1.4],['fungus',4,1.3]]},
   {to:1,nm:'الأرض الفاسدة',g:{a:['#3a2c48','#2e2240','#463658'],dec:['moss','mush','root','crack']},p:[['deadTree',4],['mushroom',4],['ancient',1],['thornBush',3],['cypress',1]],pd:.4,r:[['boulderDark',3],['obsidian',1],['rubbleGrey',2]],rd:.04,
    fog:{a:.92,r:104,c:[24,10,34]},amb:'spores',en:[['spider',6,1.7],['sapling',5,1.7],['wisp',5,1.7],['fungus',5,1.5]]}],
  arena:{g:['#2a2a20','#222218','#3a3a2c'],props:[['ancient',1],['mushroom',1]],fog:{a:.9,r:120,c:[10,22,16]}},
  outro:[['الراوي','سكتت الغابة. وبين الجذور المحترقة انفتح درب مظلم ينزل إلى الصخر.'],['ياقوت','المناجم القديمة! ما أحد دخلها من أيام جدي. خذ حذرك.']]},
 {name:'مناجم الكريستال',sub:'الفصل الثالث',w:116,h:52,mus:2,liq:'lava',boss:2,mini:'golem',goal:34,ilv:5,
  brk:['crate','ore'],
  intro:[['الراوي','الظلام هنا كثيف. ما يضيء المكان إلا بلورات تنبض كأنها قلب حي.'],['ياقوت','المنجم هذا كان يطلع حجر الجمر. تقول الأساطير إن قلب الواحة انكسر هنا.']],
  zones:[
   {to:.3,nm:'مدخل المنجم',g:{a:['#4a4650','#3e3a46','#585462'],dec:['pebble','crack','rail','bone']},p:[['mineSupport',3],['cart',2],['stalagmite',3],['oreRock',3],['rubbleGrey',3],['brazier',1]],pd:.2,r:[['boulderGrey',3],['oreRock',2]],rd:.03,walls:26,
    fog:{a:.82,r:120,c:[10,10,18]},amb:'dust',en:[['bat',7,1.2],['golem',2,1.1],['shardling',3,1.2]]},
   {to:.66,nm:'كهوف الكريستال',g:{a:['#2e3a52','#263148','#3a4862'],dec:['crystal','pebble','crack','mush']},p:[['crystalCyan',5],['crystalPink',3],['crystalGreen',3],['stalagmite',3],['mushroom',2],['boulderGrey',1]],pd:.3,r:[['boulderGrey',2],['oreRock',2]],rd:.025,walls:34,
    fog:{a:.88,r:112,c:[6,12,30]},amb:'glints',en:[['bat',8,1.4],['golem',3,1.3],['shardling',6,1.4]]},
   {to:1,nm:'قلب المنجم',g:{a:['#4a3a32','#3e3028','#5a463a'],dec:['ember','crack','pebble','bone']},p:[['crystalAmber',5],['stalagDark',3],['oreRock',3],['cart',1],['skullPile',2],['brazier',2]],pd:.28,r:[['boulderDark',3],['emberStone',2]],rd:.03,walls:30,
    fog:{a:.9,r:108,c:[30,12,6]},amb:'embers',en:[['bat',6,1.6],['golem',4,1.5],['shardling',5,1.6],['imp',3,1.5]]}],
  arena:{g:['#2a3040','#222836','#3a4256'],props:[['crystalCyan',1],['column',1]],fog:{a:.88,r:125,c:[8,14,34]}},
  outro:[['الراوي','تحطم الحارس، وتناثرت بلوراته كالنجوم. وتحت الحطام ظهر درج ينزل إلى رمال بعيدة.'],['ياقوت','طريق الفراعنة! الله يحفظك.']]},
 {name:'مقابر الفراعنة',sub:'الفصل الرابع',w:116,h:50,mus:3,liq:'water',boss:3,mini:'wraith',goal:36,ilv:8,
  brk:['jar','urn'],
  intro:[['الراوي','خرجت من تحت الأرض لصحراء من ذهب الليل... وفي وسطها مدينة من الأموات.'],['ياقوت','أصحاب هالمقابر دفنوا أسرارهم مع سيوفهم. اللي تلقاه هنا غير.']],
  zones:[
   {to:.3,nm:'طريق الأهرام',g:{a:['#d4b27a','#c4a266','#e0c28c'],dec:['tuft','pebble','shell','rune']},p:[['cactus',3],['obelisk',2],['column',3],['slabTomb',3],['deadPalm',2],['statue',1],['shortPalm',1]],pd:.22,r:[['boulderSand',3],['rubbleSand',3],['slabTomb',2]],rd:.03,
    fog:{a:.56,r:170,c:[220,170,110]},amb:'dust',en:[['scorpion',6,1.3],['mummy',4,1.3],['skeleton',3,1.2]]},
   {to:.64,nm:'مدينة الموتى',g:{a:['#a8946a','#9a8660','#b8a478'],dec:['rune','pebble','bone','crack']},p:[['column',4],['sarcophagus',3],['urn',3],['statue',2],['banner',2],['skullPile',2],['brazier',2]],pd:.32,r:[['slabTomb',3],['rubbleSand',2]],rd:.025,
    fog:{a:.7,r:140,c:[74,52,36]},amb:'dust',en:[['mummy',6,1.5],['skeleton',6,1.4],['wraith',3,1.4],['scorpion',4,1.5]]},
   {to:1,nm:'قاعة الذهب',g:{a:['#3a3040','#30283a','#443a4c'],dec:['rune','gold','crack','bone']},p:[['statue',3],['obelisk',2],['brazier',3],['banner',3],['column',3],['sarcophagus',2]],pd:.3,r:[['slabTomb',2],['boulderDark',2]],rd:.02,
    fog:{a:.9,r:110,c:[22,12,30]},amb:'glints',en:[['mummy',6,1.7],['skeleton',6,1.6],['wraith',5,1.6],['scorpion',3,1.7]]}],
  arena:{g:['#5a4a2a','#4a3c22','#6a5a34'],props:[['statue',1],['brazier',1]],fog:{a:.88,r:125,c:[34,22,6]}},
  outro:[['الراوي','انهار عرش الفرعون، وانفتح في الأفق بوابة حمراء تلتهب فوق جبل أسود.'],['ياقوت','قلعة الرماد... مكانه هناك. هذي آخر نقطة نلتقي فيها يا بطل.']]},
 {name:'قلعة الجمر',sub:'الفصل الخامس',w:104,h:46,mus:4,liq:'lava',boss:4,mini:'knight',goal:38,ilv:11,
  brk:['crate','urn'],
  intro:[['الراوي','الحجر هنا حار تحت القدمين. والسماء كلها جمر يتطاير.'],['ياقوت','هذا الأخير يا بطل. اللي عندك من غنائم يكفي أو ما يكفي... اشترِ وجهز.']],
  zones:[
   {to:.3,nm:'جسر الرماد',g:{a:['#4a4048','#3e343c','#5a505a'],dec:['ember','crack','pebble','bone']},p:[['charred',4],['obsSpike',2],['emberStone',4],['rubbleGrey',3],['skullPile',2],['brazier',1]],pd:.2,r:[['emberStone',4],['boulderDark',3]],rd:.04,
    fog:{a:.84,r:120,c:[26,10,10]},amb:'embers',en:[['imp',5,1.8],['hound',5,1.7],['cinder',3,1.7],['knight',2,1.6]]},
   {to:.66,nm:'ساحات الجمر',g:{a:['#2c2430','#241c28','#382e3c'],dec:['crack','ember','rune','pebble']},p:[['obsSpike',4],['obsidian',3],['emberStone',4],['brazier',3],['banner',3],['column',2],['skullPile',2]],pd:.28,r:[['obsidian',3],['emberStone',3]],rd:.04,
    fog:{a:.9,r:108,c:[22,6,12]},amb:'embers',en:[['knight',5,1.9],['hound',5,1.9],['cinder',5,1.9],['brute',2,1.7],['imp',4,1.9]]},
   {to:1,nm:'عرش الرماد',g:{a:['#3a1e22','#2c1618','#4a2a2e'],dec:['ember','crack','rune','bone']},p:[['statue',3],['brazier',4],['banner',3],['emberStone',3],['obsSpike',2]],pd:.22,r:[['emberStone',4],['obsidian',2]],rd:.04,
    fog:{a:.93,r:102,c:[34,4,4]},amb:'embers',en:[['knight',6,2.1],['hound',5,2.1],['cinder',6,2.1],['brute',4,2],['imp',4,2.1]]}],
  arena:{g:['#3a1816','#2c1210','#4a2220'],props:[['obsSpike',1],['brazier',1]],fog:{a:.92,r:125,c:[44,8,4]}},
  outro:[['الراوي','سقط ملك الرماد، وانطفأت النار في عينيه.'],['الراوي','رجع قلب الواحة ينبض بين يديك، وفاض الماء من الأرض من جديد.'],['العم سالم','عاشت يدك يا ولدي. الواحة اليوم عادت لأهلها.']]}
];
const CINE=[
 {d:5.5,a:[105,300],b:[175,335],t:'كانت واحة الجمر أجمل قرى الصحراء، ماؤها ما ينضب ونخلها ما يعطش.'},
 {d:5,a:[400,310],b:[640,335],t:'إلى أن جاءت ليلة الرماد.'},
 {d:6.5,a:[850,290],b:[905,335],t:'ملك الرماد سرق قلب الواحة، الحجر اللي يطلع الماء والنور لكل البيوت.'},
 {d:5.5,a:[1100,330],b:[300,300],t:'ومن يومها صارت الأرض تلد وحوشاً من الجمر والظلام، في كل مكان.'},
 {d:6,a:[110,335],b:[70,330],t:'ولا بقي أحد يقدر يوقف في وجهه، إلا غريب وصل الليلة.'}];

LV[0].outroCine=['سقطت ملكة العقارب وانكسر عشها. وبين الحطام لمع شيء لا يشبه الرمل.','شظية صغيرة من حجر الجمر، دافئة تنبض. ضمّتها يدك فسمعت الواحة تتنفس من بعيد.','قلب الواحة انكسر خمس شظايا، وهذي أولها. والباقي عند حراس ملك الرماد.'];
LV[1].outroCine=['تساقطت أوراق الشجرة الأم، وسكتت الهمسات بعد أجيال طويلة.','وبين جذورها اشتعلت الشظية الثانية بضوء أخضر هادئ.','والأرض تحت قدميك بدأت تهتز... كأن شيئًا يحفر من تحتك.'];
LV[2].outroCine=['تفتت الحارس كأنه ما كان إلا بلورات تجمعت بالخطأ.','وفي صدره الشظية الثالثة تضيء الكهف كله.','ومن بعيد هبّت ريح دافية تحمل رائحة رمل ومعابد قديمة.'];
LV[3].outroCine=['خرّ الفرعون على عرشه، وانطفأت العيون الذهبية في وجوه الأموات.','الشظية الرابعة كانت في يده، باردة كالقبر وحارة كالشمس معًا.','وعلى الأفق جبل أسود تتصاعد منه النار. هناك آخر الطريق.'];
LV[4].outroCine=['انهار ملك الرماد على ركبتيه، والجمر في عينيه يخبو شيئًا فشيئًا.','والشظايا الخمس رجعت تنبض معًا في يدك، وتلتحم قلبًا واحدًا.','ومن بعيد سمعت الواحة تغني للمرة الأولى منذ ليلة الرماد.'];
LV[1].cine=[{d:6,f:[.02,.22],t:'نزلت من عشّ العقارب والواحة تختفي وراءك. وقدامك غابة ما عرفت الشمس.'},{d:6,f:[.3,.55],t:'يقولون إن الجذور تحفظ أصوات من مرّوا عليها... واليوم تهمس باسمك.'},{d:6,f:[.6,.92],t:'والشظية الثانية تنبض في آخر الغابة، عند الشجرة الأم.'}];
LV[2].cine=[{d:6,f:[.02,.22],t:'تحت الجذور فتحت الأرض فمها، ونزلت إلى مناجم الحجر القديم.'},{d:6,f:[.3,.6],t:'هنا كانوا يستخرجون حجر الجمر، قبل أن يحبس ملك الرماد قلب الواحة في الظلام.'},{d:6,f:[.62,.92],t:'وفي العمق حارس من بلور ما نام منذ مئة عام.'}];
LV[3].cine=[{d:6,f:[.02,.22],t:'صعدت من الظلام إلى صحراء من ذهب الليل، والرياح تحمل أنين من سبقك.'},{d:6,f:[.3,.6],t:'مدينة كاملة للأموات: فراعنة دُفنوا مع كنوزهم وغضبهم.'},{d:6,f:[.62,.92],t:'والفرعون المنسي ينتظر في قاعة الذهب.'}];
LV[4].cine=[{d:6,f:[.02,.22],t:'وصلت أخيرًا إلى قلعة الجمر. السماء كلها نار تتطاير.'},{d:6,f:[.3,.6],t:'هنا حبس ملك الرماد الواحة في قلب حجر... وهنا ينتهي كل شيء.'},{d:6,f:[.62,.92],t:'أربع شظايا في جيبك، وواحدة ما زالت تنتظر على عرشه.'}];
