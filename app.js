(function () {
'use strict';

/* ======================= i18n ======================= */
var DICT = window.I18N.ui, OPT = window.I18N.opt;
var LANG = 'ru';
function t(k, a) {
  var e = DICT[k]; var s = e ? (LANG === 'en' ? e[1] : e[0]) : k;
  if (a) Object.keys(a).forEach(function (x) { s = s.split('{' + x + '}').join(a[x]); });
  return s;
}
function ov(v) { if (v == null) return ''; return LANG === 'en' && OPT[v] ? OPT[v] : String(v); }
function L(o) { return typeof o === 'string' ? o : (LANG === 'en' ? o[1] : o[0]); }
function plural(n, key) {
  var f = DICT[key]; if (!f) return n + ' ' + key;
  if (LANG === 'en') return n + ' ' + (n === 1 ? f[1][0] : f[1][1]);
  var w = f[0], m10 = n % 10, m100 = n % 100;
  return n + ' ' + ((m10 === 1 && m100 !== 11) ? w[0] : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? w[1] : w[2]);
}

/* ======================= Utils ======================= */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function has(v) { return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length); }
function num(v) { var x = parseFloat(String(v).replace(',', '.')); return isNaN(x) ? null : x; }
function fmtDate(iso) { if (!iso) return ''; var p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso; }
function isoOf(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function addDays(iso, n) { var d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d; }
function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function locale() { return LANG === 'en' ? 'en-GB' : 'ru-RU'; }
function monthName(y, m) { var s = new Date(y, m, 1).toLocaleDateString(locale(), { month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1).replace(' г.', ''); }
function wdNames() { var base = new Date(2024, 0, 1); var out = []; for (var i = 0; i < 7; i++) { var d = new Date(base); d.setDate(1 + i); var s = d.toLocaleDateString(locale(), { weekday: 'short' }); out.push(s.charAt(0).toUpperCase() + s.slice(1).replace('.', '')); } return out; }

var IC = {
  dot: '<circle cx="12" cy="12" r="2.5"/>',
  scope: '<rect x="4" y="3" width="7" height="12" rx="3.5"/><path d="M7.5 15v2a4 4 0 0 0 8 0v-3a3 3 0 0 1 6 0"/>',
  knife: '<path d="M3 21 14.5 9.5M14.5 9.5l5-5a2.1 2.1 0 0 1 0 3L12 15l-2.5-2.5z"/>',
  filter: '<path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.7.8 3 2.6 3.5 5.2"/>',
  mdt: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="17" r="2.5"/><circle cx="19" cy="17" r="2.5"/><path d="M12 10v3M7.2 15.5 10 13h4l2.8 2.5"/>',
  alert: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  ext: '<path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  down: '<path d="m6 9 6 6 6-6"/>', clip: '<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>', upload: '<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>', expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>', shrink: '<path d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/>', check: '<path d="m5 12 5 5 9-10"/>', file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5z"/><path d="M14 3v5h5"/>', home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>', bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 1h13v-3"/><path d="M8 7h7M8 10.5h5"/>', clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 13.5h7M8.5 17h4"/>', shuffle: '<path d="M3 7h3.5c4 0 5.5 10 10 10H21M3 17h3.5c1.8 0 3-1.9 4.2-4.2M13.3 9.2C14.5 7.4 15.4 7 17 7h4"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>', history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 4v4h4"/><path d="M12 8v4.5l3 2"/>', chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>', lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>', sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>', doc: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8.5 12.5h7M8.5 16h7"/>', tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M11 18h2"/>', up: '<path d="m6 15 6-6 6 6"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>', cap: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c1.5 1.5 3.4 2.3 5.5 2.3s4-.8 5.5-2.3v-5M21.5 9v5.5"/>', sheet: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9h17M3.5 14h17M9.5 9v11"/>', bed: '<path d="M3 18V6M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="7" cy="11" r="2"/>', cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6 1.6A3.8 3.8 0 0 1 17.5 18.5z"/>', stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="11" r="2"/>', refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4"/>', stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>', send: '<path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/>', panel: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9 4.5v15"/>', logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>', shield: '<path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'
};
function ico(n, s) { s = s || 18; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>'; }

/* ======================= Registry schema ======================= */
var LOCS = ['Слепая кишка', 'Восходящая ободочная', 'Печёночный изгиб', 'Поперечная ободочная', 'Селезёночный изгиб', 'Нисходящая ободочная', 'Сигмовидная кишка', 'Ректосигмоидный отдел', 'Прямая кишка', 'Анальный канал'];
var RIGHT = ['Слепая кишка', 'Восходящая ободочная', 'Печёночный изгиб'];
var P_RIGHT = ['Илеоцекальная резекция', 'Правосторонняя гемиколэктомия', 'Расширенная правосторонняя гемиколэктомия'];
var P_TRANS = ['Резекция поперечной ободочной кишки'];
var P_LEFT = ['Резекция селезёночного изгиба', 'Левосторонняя гемиколэктомия'];
var P_SIG = ['Резекция сигмовидной кишки'];
var P_AR = ['Передняя резекция прямой кишки', 'Низкая передняя резекция прямой кишки', 'Интерсфинктерная резекция прямой кишки'];
var P_APR = ['Брюшно-промежностная экстирпация прямой кишки'];
var P_HART = ['Обструктивная резекция (операция Гартмана)'];
var P_TEO = ['Трансанальная эндоскопическая операция (ТЭО)'];
var P_COLECT = ['Субтотальная колэктомия', 'Тотальная колэктомия', 'Колпроктэктомия'];
var P_EVISC = ['Тазовая эвисцерация'];
var P_STFORM = ['Формирование стомы'];
var P_STCLOSE = ['Закрытие петлевой стомы', 'Восстановление непрерывности после операции Гартмана'];
var P_CRS = ['Циторедуктивная операция'];
var PROC_GROUPS = [
  [['Ободочная кишка', 'Colon'], P_RIGHT.concat(P_TRANS, P_LEFT, P_SIG)],
  [['Прямая кишка', 'Rectum'], P_AR.concat(P_APR, P_HART, P_TEO, P_EVISC)],
  [['Колэктомии', 'Colectomies'], P_COLECT],
  [['Стомы', 'Stomas'], P_STFORM.concat(P_STCLOSE)],
  [['Другие', 'Other'], P_CRS.concat(['Другое'])]
];
var PROCS = []; PROC_GROUPS.forEach(function (g) { PROCS = PROCS.concat(g[1]); });
var P_COLON = P_RIGHT.concat(P_TRANS, P_LEFT, P_SIG, P_COLECT);
var P_RECTAL = P_AR.concat(P_APR, P_HART, P_EVISC);
var P_IMA = P_SIG.concat(P_AR, P_APR, P_HART, P_LEFT);
function hasProc(d) { return d.kind === 'Эндоскопическое' ? !!d.endo : !!d.proc; }
function hasSurg(d) { return d.kind !== 'Эндоскопическое' && !!d.proc; }
function secHasData(sec, d) { return sec.fields.some(function (x) { return has(d[x.id]); }); }
var IC_BLEED = 'Кровотечение';
var ICX = {
  right: ['Кровотечение из верхних брыжеечных сосудов', 'Кровотечение из ствола Генле', 'Повреждение двенадцатиперстной кишки', 'Повреждение поджелудочной железы', 'Повреждение правого мочеточника', 'Повреждение гонадных сосудов', 'Повреждение тонкой кишки', 'Перфорация опухоли', 'Ишемия кишки в зоне анастомоза'],
  trans: ['Кровотечение из средних ободочных сосудов', 'Повреждение поджелудочной железы', 'Повреждение селезёнки', 'Повреждение желудка', 'Повреждение двенадцатиперстной кишки', 'Повреждение тонкой кишки', 'Перфорация опухоли', 'Ишемия кишки в зоне анастомоза'],
  left: ['Кровотечение из нижних брыжеечных сосудов', 'Повреждение селезёнки', 'Повреждение хвоста поджелудочной железы', 'Повреждение левого мочеточника', 'Повреждение гонадных сосудов', 'Повреждение подчревных нервов', 'Повреждение тонкой кишки', 'Перфорация опухоли', 'Ишемия низводимой кишки', 'Недостаточная длина кишки для анастомоза'],
  rect: ['Кровотечение из нижних брыжеечных сосудов', 'Кровотечение из пресакрального венозного сплетения', 'Повреждение мочеточника', 'Повреждение мочевого пузыря', 'Повреждение уретры', 'Повреждение влагалища', 'Повреждение семенных пузырьков или простаты', 'Повреждение тазовых нервов', 'Повреждение селезёнки', 'Перфорация прямой кишки', 'Перфорация опухоли', 'Дефект мезоректальной фасции', 'Неполное прошивание степлером', 'Положительная проба на герметичность', 'Ишемия низводимой кишки', 'Недостаточная длина кишки для анастомоза', 'Газовая эмболия (TaTME)'],
  apr: ['Кровотечение из пресакрального венозного сплетения', 'Кровотечение на промежностном этапе', 'Повреждение мочеточника', 'Повреждение мочевого пузыря', 'Повреждение уретры', 'Повреждение влагалища', 'Повреждение семенных пузырьков или простаты', 'Повреждение тазовых нервов', 'Перфорация прямой кишки', 'Перфорация опухоли', 'Дефект мезоректальной фасции'],
  hart: ['Кровотечение из нижних брыжеечных сосудов', 'Кровотечение из пресакрального венозного сплетения', 'Повреждение мочеточника', 'Повреждение мочевого пузыря', 'Повреждение тонкой кишки', 'Перфорация опухоли', 'Ишемия кишки для стомы'],
  teo: ['Вскрытие брюшной полости', 'Кровотечение', 'Повреждение влагалища', 'Повреждение уретры', 'Фрагментация препарата', 'Невозможность ушить дефект'],
  evisc: ['Массивное кровотечение из внутренних подвздошных сосудов', 'Кровотечение из пресакрального венозного сплетения', 'Повреждение наружных подвздошных сосудов', 'Повреждение мочеточника', 'Повреждение тонкой кишки', 'Повреждение запирательного нерва', 'Повреждение седалищного нерва', 'Перфорация опухоли'],
  stform: ['Кровотечение', 'Повреждение кишки', 'Ишемия стомы'],
  stclose: ['Кровотечение', 'Повреждение тонкой кишки', 'Невозможность закрытия, повторная стома'],
  crs: ['Кровотечение', 'Повреждение тонкой кишки', 'Повреждение мочеточника', 'Повреждение мочевого пузыря', 'Повреждение диафрагмы', 'Повреждение селезёнки'],
  llnd: ['Повреждение запирательного нерва', 'Кровотечение из внутренних подвздошных сосудов', 'Повреждение наружной подвздошной вены']
};
function uniq(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }
function intraOpts(d) {
  var pr = d.proc, l = [];
  if (P_RIGHT.indexOf(pr) >= 0) l = ICX.right;
  else if (P_TRANS.indexOf(pr) >= 0) l = ICX.trans;
  else if (P_LEFT.indexOf(pr) >= 0 || P_SIG.indexOf(pr) >= 0) l = ICX.left;
  else if (P_AR.indexOf(pr) >= 0) l = ICX.rect;
  else if (P_APR.indexOf(pr) >= 0) l = ICX.apr;
  else if (P_HART.indexOf(pr) >= 0) l = ICX.hart;
  else if (P_TEO.indexOf(pr) >= 0) l = ICX.teo;
  else if (P_COLECT.indexOf(pr) >= 0) l = uniq(ICX.right.concat(ICX.left));
  else if (P_EVISC.indexOf(pr) >= 0) l = ICX.evisc;
  else if (P_STFORM.indexOf(pr) >= 0) l = ICX.stform;
  else if (P_STCLOSE.indexOf(pr) >= 0) l = ICX.stclose;
  else if (P_CRS.indexOf(pr) >= 0) l = ICX.crs;
  else l = [IC_BLEED];
  if (d.llnd === 'Да') l = l.concat(ICX.llnd);
  return uniq(l.concat(['Другое']));
}
var IC_ALL = []; Object.keys(ICX).forEach(function (k) { IC_ALL = IC_ALL.concat(ICX[k]); }); IC_ALL = uniq(IC_ALL.concat([IC_BLEED, 'Другое']));
var LN_ST = [['263P', 'Внутренние подвздошные, проксимальные', 'Internal iliac, proximal', 2], ['263D', 'Внутренние подвздошные, дистальные', 'Internal iliac, distal', 2], ['283', 'Запирательные', 'Obturator', 2], ['273', 'Общие подвздошные', 'Common iliac', 2], ['293', 'Наружные подвздошные', 'External iliac', 2], ['260', 'Латеральные крестцовые', 'Lateral sacral', 2], ['270', 'Срединные крестцовые', 'Median sacral', 1], ['280', 'Бифуркации аорты', 'Aortic bifurcation', 1], ['292', 'Паховые', 'Inguinal', 2]];
function inP(list) { return function (d) { return d.kind !== 'Эндоскопическое' && list.indexOf(d.proc) >= 0; }; }
var TACTICS = ['Операция', 'Неоадъювантная химиотерапия (НАХТ)', 'Неоадъювантная лучевая терапия (НАЛТ)', 'Неоадъювантная химиолучевая терапия (НАХЛТ)', 'Тотальная неоадъювантная терапия (TNT)', 'Адъювантная химиотерапия (АХТ)', 'Химиотерапия (ХТ)', 'Лучевая терапия (ЛТ)', 'Химиолучевая терапия (ХЛТ)', 'Watch & wait'];
var NEO_T = TACTICS.slice(1, 5);
function tacShort(v) { var m = /\(([^)]+)\)$/.exec(v); return m ? m[1] : v; }
function hasTac(d, list) { return (d.tactic || []).some(function (x) { return list.indexOf(x) >= 0; }); }
var YN = ['Нет', 'Да'];
var MIS = ['Лапароскопический', 'Робот-ассистированный', 'Трансанальный (TaTME)', 'Гибридный (лапароскопия + TaTME)'];
var ACCESS = ['Лапароскопический', 'Робот-ассистированный', 'Открытый', 'Трансанальный (TaTME)', 'Гибридный (лапароскопия + TaTME)'];
var ENDO = ['ESD', 'EMR', 'Полипэктомия', 'Стентирование', 'Баллонная дилатация', 'Другое'];
var NOT_ENDO = function (d) { return d.kind !== 'Эндоскопическое'; };
var APPROACH = ['TNT', 'Оппортунистическая TNT', 'Оппортунистический W&W после ХТ', 'Оппортунистический W&W после ЛТ', 'ТЭО', 'Операция после ЛТ', 'Первичная операция'];
function f(id, ru, en, type, o) { var x = { id: id, label: [ru, en], type: type }; if (o) Object.keys(o).forEach(function (k) { x[k] = o[k]; }); return x; }

var SURGEONS = ['Мамлин', 'Хамзина', 'Кожахметов', 'Батырбеков', 'Ускенбаев', 'Адылханов', 'Усипбеков', 'Дигай'];
var RESIDENTS = ['Ахрор', 'Шамшырак', 'Жанна', 'Ануар'];
var STOMAS = ['Нет', 'Петлевая илеостома', 'Концевая илеостома', 'Петлевая трансверзостома', 'Петлевая сигмостома', 'Петлевая колостома', 'Концевая колостома', 'Раздельная двуствольная колостома'];
var INCISIONS = ['Срединная лапаротомия', 'Нижнесрединная лапаротомия', 'Верхнесрединная лапаротомия', 'Поперечная лапаротомия', 'Лапаротомия по Пфанненштилю'];
var EXTRACT = ['Поперечная минилапаротомия в левой подвздошной области', 'Поперечная минилапаротомия в правой подвздошной области', 'Поперечная минилапаротомия над лоном (Пфанненштиль)', 'Срединная минилапаротомия', 'Через место стомы', 'Через троакарную рану', 'Трансанально', 'Трансвагинально', 'Через промежностную рану'];
var AN_GROUPS = [
  [['Техника', 'Technique'], ['Ручной', 'Аппаратный циркулярный', 'Аппаратный линейный', 'Комбинированный'], true],
  [['Конфигурация', 'Configuration'], ['Конец в конец', 'Бок в бок', 'Конец в бок', 'Бок в конец', 'J-резервуар', 'Колопластический резервуар'], true],
  [['Где формировался', 'Where formed'], ['Интракорпоральный', 'Экстракорпоральный', 'Трансанальный'], true],
  [['Ряды швов', 'Suture rows'], ['Однорядный', 'Двухрядный'], true]
];
var AN_ALL = []; AN_GROUPS.forEach(function (g) { AN_ALL = AN_ALL.concat(g[1]); });
var REV_DEV = ['Выпот (асцит)', 'Цирротически изменённая печень', 'Жировой гепатоз', 'Очаговые образования (метастазы) в печени', 'Желчнокаменная болезнь', 'Спаечный процесс', 'Выраженный спаечный процесс', 'Долихосигма', 'Раздутые петли тонкой кишки', 'Канцероматоз брюшины', 'Пупочная грыжа', 'Постлучевые изменения в малом тазу', 'Прорастание опухоли в соседние органы'];
var PHASES = [['pre', 'ph.pre', 'ph.preSub'], ['op', 'ph.op', 'ph.opSub'], ['post', 'ph.post', 'ph.postSub']];
var SECTIONS = [
  { id: 'pat', phase: 'pre', title: ['Пациент', 'Patient'], fields: [
    f('fio', 'ФИО', 'Full name', 'text', { wide: true }),
    f('ib', '№ истории болезни (ИБ)', 'Case record no. (ИБ)', 'text', { ph: '2026/12345', lock: true, check: ibCheck }),
    f('sex', 'Пол', 'Sex', 'seg', { options: ['М', 'Ж'] }),
    f('age', 'Возраст', 'Age', 'num', { unit: 'u.years' }),
    f('bmi', 'ИМТ', 'BMI', 'num'),
    f('asa', 'ASA', 'ASA', 'sel', { options: ['I', 'II', 'III', 'IV'] }),
    f('ecog', 'ECOG', 'ECOG', 'sel', { options: ['0', '1', '2', '3', '4'] }),
    f('studyNo', '№ в исследовании', 'Study no.', 'text')
  ]},
  { id: 'dx', phase: 'pre', title: ['Диагноз и обследование', 'Diagnosis and work-up'], fields: [
    f('loc', 'Локализация', 'Location', 'sel', { options: LOCS }),
    f('rLevel', 'Отдел прямой кишки', 'Rectal level', 'sel', { options: ['Нижнеампулярный', 'Среднеампулярный', 'Верхнеампулярный'], show: function (d) { return d.loc === 'Прямая кишка'; } }),
    f('cT', 'cT', 'cT', 'sel', { options: ['cTx', 'cT0', 'cT1', 'cT2', 'cT3', 'cT4a', 'cT4b'] }),
    f('cN', 'cN', 'cN', 'sel', { options: ['cN0', 'cN1', 'cN2', 'cN3'] }),
    f('cM', 'cM', 'cM', 'sel', { options: ['cM0', 'cM1'] }),
    f('stage', 'Стадия', 'Stage', 'sel', { options: ['I', 'II', 'III', 'IV'] }),
    f('grade', 'Степень дифференцировки (биопсия)', 'Grade (biopsy)', 'sel', { options: ['G1', 'G2', 'G3', 'Gx'] }),
    f('hist', 'Гистология (биопсия)', 'Histology (biopsy)', 'sel', { options: ['Аденокарцинома', 'Муцинозная аденокарцинома', 'Перстневидноклеточный рак', 'Нейроэндокринная опухоль', 'Другое'] }),
    f('dxText', 'Клинический диагноз', 'Clinical diagnosis', 'long', { wide: true })
  ]},
  { id: 'tx', phase: 'pre', title: ['Тактика лечения', 'Treatment strategy'], fields: [
    f('tactic', 'Тактика', 'Strategy', 'multi', { options: TACTICS, dd: true, hint: 'f.ddOrder', ordered: true }),
    f('neo', 'Режим неоадъювантной терапии', 'Neoadjuvant regimen', 'sel', { options: ['ХЛТ (длинный курс)', 'Короткий курс ЛТ', 'TNT', 'ПХТ'], show: function (d) { return hasTac(d, NEO_T); } }),
    f('phase', 'Текущий этап', 'Current phase', 'sel', { options: ['Подготовка к лечению', 'Лучевая терапия', 'Химиотерапия', 'Watch & wait', 'Операция', 'Локальный рецидив', 'Наблюдение'] }),
    f('research', 'Исследование', 'Study', 'sel', { options: ['TNT', 'Opportunistic W&W', 'ТЭО'] })
  ]},
  { id: 'op', phase: 'op', title: ['Операция', 'Operation'], fields: [
    f('kind', 'Вид вмешательства', 'Procedure type', 'seg', { options: ['Хирургическое', 'Эндоскопическое'], wide: true }),
    f('endo', 'Эндоскопическое вмешательство', 'Endoscopic procedure', 'sel', { options: ENDO, show: function (d) { return d.kind === 'Эндоскопическое'; } }),
    f('date', 'Дата вмешательства', 'Date of procedure', 'date'),
    f('urg', 'Срочность', 'Urgency', 'seg', { options: ['Плановая', 'Экстренная'] }),
    f('proc', 'Операция', 'Operation', 'sel', { options: PROCS, groups: PROC_GROUPS, show: NOT_ENDO, wide: true }),
    f('surgeon', 'Хирург', 'Surgeon', 'sel', { options: SURGEONS, show: hasProc }),
    f('assist', 'Ассистенты', 'Assistants', 'multi', { options: SURGEONS.concat(RESIDENTS), dd: true, show: hasProc }),
    f('access', 'Доступ', 'Access', 'sel', { options: ACCESS, show: hasSurg }),
    f('incision', 'Лапаротомия', 'Laparotomy', 'sel', { options: INCISIONS, show: function (d) { return hasSurg(d) && (d.access === 'Открытый' || d.conv === 'Да'); } }),
    f('opTime', 'Длительность операции', 'Operative time', 'num', { unit: 'u.min', show: hasProc }),
    f('ebl', 'Кровопотеря', 'Blood loss', 'num', { unit: 'u.ml', show: hasSurg }),
    f('revDev', 'Находки при ревизии: отличия от нормы', 'Exploration: findings that differ from normal', 'multi', { options: REV_DEV, dd: true, wide: true, none: 'f.revStd', show: function (d) { return hasSurg(d) && P_TEO.concat(P_STCLOSE).indexOf(d.proc) < 0; } }),
    f('revision', 'Другие находки при ревизии (свободный текст)', 'Other findings (free text)', 'long', { wide: true, rows: 2, ph: 'f.revisionPh', show: function (d) { return hasSurg(d) && P_TEO.concat(P_STCLOSE).indexOf(d.proc) < 0; } }),
    f('anast', 'Анастомоз', 'Anastomosis', 'seg', { options: YN, show: function (d) { return hasSurg(d) && P_TEO.concat(P_APR, P_HART, P_STFORM).indexOf(d.proc) < 0; } }),
    f('stoma', 'Стома', 'Stoma', 'sel', { options: STOMAS, show: function (d) { return hasSurg(d) && P_TEO.concat(P_STCLOSE).indexOf(d.proc) < 0; } }),
    f('stomaSite', 'Место выведения стомы', 'Stoma site', 'sel', { options: ['Правая подвздошная область', 'Левая подвздошная область', 'Справа от пупка', 'Слева от пупка', 'Эпигастральная область'], show: function (d) { return hasSurg(d) && d.stoma && d.stoma !== 'Нет'; } }),
    f('drain', 'Дренирование', 'Drains', 'multi', { options: ['Малый таз', 'Правый боковой канал', 'Левый боковой канал', 'Подпечёночное пространство', 'Промежностная рана', 'Не дренировалось'], dd: true, show: hasSurg }),
    f('postRoute', 'Перевод после операции', 'Transfer after surgery', 'seg', { options: ['Палата пробуждения', 'Реанимация (ОАРИТ)'], show: hasProc, wide: true })
  ]},
  { id: 'cx', phase: 'post', title: ['Послеоперационные осложнения', 'Postoperative complications'], when: function (d) { return hasProc(d); }, fields: [
    f('cd', 'Clavien-Dindo, макс.', 'Clavien-Dindo, max', 'sel', { options: ['Нет', 'I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V'] }),
    f('leak', 'Несостоятельность (ISREC)', 'Anastomotic leak (ISREC)', 'sel', { options: ['Нет', 'A', 'B', 'C'], show: function (d) { return d.anast === 'Да'; } }),
    f('ssi', 'Инфекция области хирургического вмешательства (ИОХВ)', 'Surgical site infection (SSI)', 'sel', { options: ['Нет', 'Поверхностная', 'Глубокая', 'Органная/полостная'] }),
    f('vte', 'Венозные тромбоэмболии', 'Venous thromboembolism', 'sel', { options: ['Нет', 'ТГВ', 'ТЭЛА'] }),
    f('los', 'Койко-день', 'Length of stay', 'num', { unit: 'u.days' }),
    f('cxNote', 'Описание осложнений', 'Complications, details', 'long', { wide: true })
  ]},
  { id: 'path', phase: 'post', title: ['Патоморфология', 'Pathology'], when: function (d) { return (hasSurg(d) && P_STFORM.concat(P_STCLOSE).indexOf(d.proc) < 0) || (d.kind === 'Эндоскопическое' && ['ESD', 'EMR', 'Полипэктомия'].indexOf(d.endo) >= 0); }, fields: [
    f('y', 'После неоадъюванта (y)', 'After neoadjuvant (y)', 'seg', { options: YN, show: function (d) { return hasTac(d, NEO_T); } }),
    f('pT', 'pT', 'pT', 'sel', { options: ['pT0', 'pTis', 'pT1', 'pT2', 'pT3', 'pT4a', 'pT4b'] }),
    f('pN', 'pN', 'pN', 'sel', { options: ['pN0', 'pN1a', 'pN1b', 'pN1c', 'pN2a', 'pN2b'] }),
    f('pTRG', 'Регресс опухоли (TRG)', 'Tumour regression (TRG)', 'sel', { options: ['0', '1', '2', '3'], show: function (d) { return hasTac(d, NEO_T); } }),
    f('gPost', 'Степень дифференцировки', 'Grade', 'sel', { options: ['G1', 'G2', 'G3'] }),
    f('lnT', 'Лимфоузлов удалено', 'Lymph nodes removed', 'num'),
    f('lnP', 'Из них поражено', 'Positive nodes', 'num'),
    f('r', 'Радикальность', 'Resection margin', 'seg', { options: ['R0', 'R1', 'R2'] }),
    f('lvi', 'Лимфоваскулярная инвазия (LVI)', 'Lymphovascular invasion (LVI)', 'seg', { options: YN }),
    f('pni', 'Периневральная инвазия (PNI)', 'Perineural invasion (PNI)', 'seg', { options: YN })
  ]},
  { id: 'late', phase: 'post', title: ['Отдалённые результаты', 'Long-term outcomes'], when: function (d) { return hasProc(d); }, fields: [
    f('closure', 'Дата закрытия стомы', 'Stoma closure date', 'date', { show: function (d) { return d.stoma && d.stoma !== 'Нет'; } }),
    f('recur', 'Рецидив', 'Recurrence', 'sel', { options: ['Нет', 'Местный рецидив', 'Отдалённые метастазы', 'Местный рецидив и метастазы'] }),
    f('recurDate', 'Дата выявления', 'Date detected', 'date', { show: function (d) { return d.recur && d.recur !== 'Нет'; } }),
    f('vital', 'Статус', 'Vital status', 'seg', { options: ['Жив', 'Умер'] }),
    f('lastFu', 'Последний контакт', 'Last contact', 'date')
  ]}
];

var MODULES = [
  { id: 'rectum', sec: 'dx', title: ['МРТ малого таза', 'Pelvic MRI'], why: ['локализация: прямая кишка', 'location: rectum'], when: function (d) { return d.loc === 'Прямая кишка'; }, fields: [
    f('rHeight', 'Нижний полюс опухоли от анального края', 'Tumour lower edge from anal verge', 'num', { unit: 'u.cm' }),
    f('mrT', 'mrT', 'mrT', 'sel', { options: ['mrT1', 'mrT2', 'mrT3a', 'mrT3b', 'mrT3c', 'mrT3d', 'mrT4a', 'mrT4b'] }),
    f('mrCRM', 'CRM (мезоректальная фасция)', 'CRM (mesorectal fascia)', 'seg', { options: ['Отрицательный', 'Положительный'] }),
    f('emvi', 'EMVI', 'EMVI', 'seg', { options: ['Отрицательный', 'Положительный'] }),
    f('mrLat', 'Увеличенные боковые лимфоузлы', 'Enlarged lateral nodes', 'seg', { options: YN }),
    f('llBefore', 'Размер бокового узла до лечения', 'Lateral node size before treatment', 'num', { unit: 'u.mm', show: function (d) { return d.mrLat === 'Да'; } }),
    f('llAfter', 'Размер после неоадъюванта', 'Size after neoadjuvant', 'num', { unit: 'u.mm', show: function (d) { return d.mrLat === 'Да' && hasTac(d, NEO_T); } })
  ]},
  { id: 'neoMod', sec: 'tx', title: ['Неоадъювантная терапия', 'Neoadjuvant therapy'], why: ['проводилась неоадъювантная терапия', 'neoadjuvant therapy given'], when: function (d) { return hasTac(d, NEO_T); }, fields: [
    f('tntScheme', 'Схема', 'Regimen', 'sel', { options: ['SCRT → CAPOX', 'SCRT → FOLFOX', 'ХЛТ → консолидирующая ПХТ', 'Индукционная ПХТ → ХЛТ', 'Другое'] }),
    f('rtStart', 'Начало лучевой', 'RT start', 'date'),
    f('rtEnd', 'Конец лучевой', 'RT end', 'date'),
    f('mrTRGrt', 'mrTRG после ЛТ', 'mrTRG after RT', 'sel', { options: ['1', '2', '3', '4', '5'] }),
    f('consChemo', 'Консолидирующая ХТ', 'Consolidation chemo', 'text'),
    f('chStart', 'Начало ХТ', 'Chemo start', 'date'),
    f('chEnd', 'Конец ХТ', 'Chemo end', 'date'),
    f('cycles', 'Циклов ХТ', 'Chemo cycles', 'num'),
    f('mrTRGcons', 'mrTRG после консолидации', 'mrTRG after consolidation', 'sel', { options: ['1', '2', '3', '4', '5'] }),
    f('resp', 'Клинический ответ', 'Clinical response', 'sel', { options: ['cCR', 'near-cCR', 'Неполный ответ'] }),
    f('interval', 'Интервал до операции', 'Interval to surgery', 'num', { unit: 'u.weeks' }),
    f('toxText', 'Токсичность', 'Toxicity', 'long', { wide: true })
  ]},
  { id: 'mis', sec: 'op', title: ['Малоинвазивный доступ', 'Minimally invasive access'], why: ['доступ: лапароскопия, робот или TaTME', 'access: laparoscopic, robotic or TaTME'], when: function (d) { return NOT_ENDO(d) && MIS.indexOf(d.access) >= 0; }, fields: [
    f('conv', 'Конверсия', 'Conversion', 'seg', { options: YN }),
    f('convReason', 'Причина конверсии', 'Reason for conversion', 'sel', { options: ['Спаечный процесс', 'Местнораспространённая опухоль', 'Кровотечение', 'Ожирение, анатомия', 'Повреждение органа', 'Технические сложности', 'Другое'], show: function (d) { return d.conv === 'Да'; } }),
    f('extract', 'Извлечение препарата', 'Specimen extraction', 'sel', { options: EXTRACT }),
    f('extractLen', 'Длина разреза', 'Incision length', 'num', { unit: 'u.cm', show: function (d) { return /разрез|минилапаротом|Пфанненштил/i.test(d.extract || ''); } })
  ]},
  { id: 'opRight', sec: 'op', title: ['Сосуды и мобилизация', 'Vessels and mobilisation'], why: ['операция: резекция правых отделов', 'operation: right-sided resection'], when: inP(P_RIGHT), fields: [
    f('lnd', 'Лимфодиссекция', 'Lymphadenectomy', 'seg', { options: ['D2', 'D3'] }),
    f('cme', 'Полная мезоколонэктомия (CME)', 'Complete mesocolic excision (CME)', 'seg', { options: YN }),
    f('ligIC', 'Подвздошно-ободочные сосуды', 'Ileocolic vessels', 'sel', { options: ['Центральная перевязка (у ВБВ)', 'Стандартная перевязка'] }),
    f('ligRC', 'Правые ободочные сосуды', 'Right colic vessels', 'sel', { options: ['Отсутствуют', 'Центральная перевязка', 'Стандартная перевязка'] }),
    f('ligMC', 'Средние ободочные сосуды', 'Middle colic vessels', 'sel', { options: ['Сохранены', 'Пересечена правая ветвь', 'Перевязка у основания'] }),
    f('henle', 'Гастроколический ствол Генле', 'Gastrocolic trunk of Henle', 'sel', { options: ['Не выделялся', 'Выделен, пересечена правая ободочная вена', 'Выделен, пересечена правая желудочно-сальниковая вена'] }),
    f('pMargin', 'Проксимальный отступ от опухоли', 'Proximal margin', 'num', { unit: 'u.cm' }),
    f('dMargin', 'Дистальный отступ от опухоли', 'Distal margin', 'num', { unit: 'u.cm' })
  ]},
  { id: 'opTrans', sec: 'op', title: ['Сосуды и мобилизация', 'Vessels and mobilisation'], why: ['операция: резекция поперечной ободочной кишки', 'operation: transverse colectomy'], when: inP(P_TRANS), fields: [
    f('lnd', 'Лимфодиссекция', 'Lymphadenectomy', 'seg', { options: ['D2', 'D3'] }),
    f('cme', 'Полная мезоколонэктомия (CME)', 'Complete mesocolic excision (CME)', 'seg', { options: YN }),
    f('ligMC', 'Средние ободочные сосуды', 'Middle colic vessels', 'sel', { options: ['Перевязка у основания', 'Пересечена правая ветвь', 'Пересечена левая ветвь'] }),
    f('flex', 'Мобилизация изгибов', 'Flexure mobilisation', 'multi', { options: ['Печёночный изгиб', 'Селезёночный изгиб'] }),
    f('omentum', 'Резекция большого сальника', 'Omentectomy', 'seg', { options: YN }),
    f('pMargin', 'Проксимальный отступ от опухоли', 'Proximal margin', 'num', { unit: 'u.cm' }),
    f('dMargin', 'Дистальный отступ от опухоли', 'Distal margin', 'num', { unit: 'u.cm' })
  ]},
  { id: 'opLeft', sec: 'op', title: ['Сосуды и мобилизация', 'Vessels and mobilisation'], why: ['операция: резекция левых отделов', 'operation: left-sided resection'], when: inP(P_LEFT), fields: [
    f('lnd', 'Лимфодиссекция', 'Lymphadenectomy', 'seg', { options: ['D2', 'D3'] }),
    f('cme', 'Полная мезоколонэктомия (CME)', 'Complete mesocolic excision (CME)', 'seg', { options: YN }),
    f('ligLC', 'Левая ободочная артерия', 'Left colic artery', 'sel', { options: ['Перевязка у основания', 'Сохранена'] }),
    f('ligMCl', 'Левая ветвь средней ободочной артерии', 'Left branch of middle colic artery', 'sel', { options: ['Пересечена', 'Сохранена'] }),
    f('pMargin', 'Проксимальный отступ от опухоли', 'Proximal margin', 'num', { unit: 'u.cm' }),
    f('dMargin', 'Дистальный отступ от опухоли', 'Distal margin', 'num', { unit: 'u.cm' })
  ]},
  { id: 'opIma', sec: 'op', title: ['Сосуды и мобилизация', 'Vessels and mobilisation'], why: ['операция на сигмовидной или прямой кишке', 'sigmoid or rectal operation'], when: inP(P_SIG.concat(P_AR, P_APR, P_HART)), fields: [
    f('ima', 'Уровень перевязки нижней брыжеечной артерии', 'Inferior mesenteric artery ligation', 'sel', { options: ['Высокая (у аорты)', 'Низкая (ниже отхождения левой ободочной)', 'Сохранена, пересечены сигмовидные ветви'] }),
    f('imv', 'Нижняя брыжеечная вена', 'Inferior mesenteric vein', 'sel', { options: ['У нижнего края поджелудочной железы', 'На уровне НБА', 'Сохранена'] }),
    f('lnd', 'Лимфодиссекция', 'Lymphadenectomy', 'seg', { options: ['D2', 'D3'] }),
    f('sfm', 'Мобилизация селезёночного изгиба', 'Splenic flexure mobilisation', 'sel', { options: ['Нет', 'Частичная', 'Полная'] }),
    f('pMargin', 'Проксимальный отступ от опухоли', 'Proximal margin', 'num', { unit: 'u.cm' }),
    f('dMargin', 'Дистальный отступ от опухоли', 'Distal margin', 'num', { unit: 'u.cm' })
  ]},
  { id: 'opRect', sec: 'op', title: ['Мобилизация прямой кишки', 'Rectal mobilisation'], why: ['операция на прямой кишке', 'rectal operation'], when: inP(P_AR.concat(P_APR, P_HART, P_EVISC)), fields: [
    f('mre', 'Мезоректумэктомия', 'Mesorectal excision', 'seg', { options: ['Тотальная (ТМЭ)', 'Частичная (ПМЭ)'] }),
    f('nerve', 'Сохранение вегетативных нервов таза', 'Pelvic autonomic nerve preservation', 'sel', { options: ['Полное', 'Частичное', 'Не сохранены'] }),
    f('isrType', 'Тип интерсфинктерной резекции', 'Intersphincteric resection type', 'sel', { options: ['Парциальная', 'Субтотальная', 'Тотальная'], show: function (d) { return d.proc === 'Интерсфинктерная резекция прямой кишки'; } }),
    f('llnd', 'Боковая (латеральная) лимфодиссекция', 'Lateral lymph node dissection', 'seg', { options: YN })
  ]},
  { id: 'llndMod', sec: 'op', title: ['Боковая лимфодиссекция', 'Lateral lymph node dissection'], why: ['боковая лимфодиссекция: да', 'lateral node dissection: yes'], when: function (d) { return inP(P_RECTAL)(d) && d.llnd === 'Да'; }, fields: [
    f('llSt', 'Удалённые группы лимфоузлов (JSCCR)', 'Node stations removed (JSCCR)', 'nodes', { wide: true })
  ]},
  { id: 'opAn', sec: 'op', title: ['Анастомоз', 'Anastomosis'], why: ['анастомоз: да', 'anastomosis: yes'], when: function (d) { return hasSurg(d) && d.anast === 'Да'; }, fields: [
    f('anDet', 'Анастомоз: отметьте нужное', 'Anastomosis: tick what applies', 'multi', { options: AN_ALL, groups: AN_GROUPS, dd: true, wide: true }),
    f('circSize', 'Диаметр циркулярного аппарата', 'Circular stapler size', 'num', { unit: 'u.mm', show: function (d) { return (d.anDet || []).indexOf('Аппаратный циркулярный') >= 0; } }),
    f('anHeight', 'Высота анастомоза от анального края', 'Anastomosis height from anal verge', 'num', { unit: 'u.cm', show: inP(P_AR.concat(P_SIG)) }),
    f('leakTest', 'Проба на герметичность', 'Air leak test', 'sel', { options: ['Отрицательная', 'Положительная, дополнительные швы', 'Не проводилась'], show: function (d) { return P_RIGHT.concat(P_TRANS).indexOf(d.proc) < 0; } }),
    f('icg', 'ICG-перфузия', 'ICG perfusion', 'seg', { options: YN }),
    f('taDrain', 'Трансанальный дренаж', 'Transanal drain', 'seg', { options: YN, show: inP(P_AR) })
  ]},
  { id: 'opApr', sec: 'op', title: ['Промежностный этап', 'Perineal stage'], why: ['операция: брюшно-промежностная экстирпация', 'operation: abdominoperineal resection'], when: inP(P_APR), fields: [
    f('aprType', 'Вариант', 'Type', 'sel', { options: ['Стандартная', 'Экстралеваторная (ELAPE)', 'Ишиоректальная', 'Интерсфинктерная'] }),
    f('aprPos', 'Положение на промежностном этапе', 'Position for perineal stage', 'seg', { options: ['На спине', 'На животе (jack-knife)'] }),
    f('perClose', 'Закрытие промежности', 'Perineal closure', 'sel', { options: ['Первичный шов', 'Биологическая сетка', 'Синтетическая сетка', 'Мышечный лоскут', 'Другое'] })
  ]},
  { id: 'opHart', sec: 'op', title: ['Операция Гартмана', 'Hartmann procedure'], why: ['операция: обструктивная резекция', 'operation: Hartmann procedure'], when: inP(P_HART), fields: [
    f('hartInd', 'Показание', 'Indication', 'sel', { options: ['Кишечная непроходимость', 'Перфорация', 'Кровотечение', 'Высокий риск несостоятельности', 'Паллиативная'] }),
    f('stumpLen', 'Уровень культи от анального края', 'Rectal stump from anal verge', 'num', { unit: 'u.cm' })
  ]},
  { id: 'opTeo', sec: 'op', title: ['Трансанальная эндоскопическая операция', 'Transanal endoscopic surgery'], why: ['операция: ТЭО', 'operation: TEO'], when: inP(P_TEO), fields: [
    f('teoPlat', 'Платформа', 'Platform', 'seg', { options: ['TEM', 'TEO', 'TAMIS'] }),
    f('teoDist', 'Расстояние от анального края', 'Distance from anal verge', 'num', { unit: 'u.cm' }),
    f('lesSize', 'Размер образования', 'Lesion size', 'num', { unit: 'u.mm' }),
    f('teoDepth', 'Глубина иссечения', 'Excision depth', 'seg', { options: ['Полностенное', 'Подслизистое'] }),
    f('enbloc', 'Удаление единым блоком', 'En bloc resection', 'seg', { options: YN }),
    f('defClose', 'Ушивание дефекта', 'Defect closure', 'seg', { options: YN }),
    f('periEntry', 'Вскрытие брюшной полости', 'Peritoneal entry', 'seg', { options: YN })
  ]},
  { id: 'opColect', sec: 'op', title: ['Колэктомия', 'Colectomy'], why: ['операция: колэктомия', 'operation: colectomy'], when: inP(P_COLECT), fields: [
    f('colRec', 'Реконструкция', 'Reconstruction', 'sel', { options: ['Илеоректальный анастомоз', 'Илеосигмоидный анастомоз', 'Илеоанальный резервуарный анастомоз (IPAA)', 'Концевая илеостома'] }),
    f('colInd', 'Показание', 'Indication', 'sel', { options: ['Синхронные опухоли', 'Наследственный синдром (Линч, ФАП)', 'Воспалительные заболевания кишечника', 'Кишечная непроходимость', 'Другое'] })
  ]},
  { id: 'opEvisc', sec: 'op', title: ['Тазовая эвисцерация', 'Pelvic exenteration'], why: ['операция: тазовая эвисцерация', 'operation: pelvic exenteration'], when: inP(P_EVISC), fields: [
    f('evType', 'Вариант', 'Type', 'seg', { options: ['Передняя', 'Задняя', 'Тотальная'] }),
    f('evOrg', 'Удалённые органы', 'Organs removed', 'multi', { options: ['Мочевой пузырь', 'Мочеточник', 'Предстательная железа', 'Семенные пузырьки', 'Матка', 'Влагалище', 'Яичники', 'Крестец', 'Тонкая кишка'], dd: true, wide: true }),
    f('urRec', 'Реконструкция мочевых путей', 'Urinary reconstruction', 'sel', { options: ['Нет', 'Уретерокутанеостомия', 'Илеальный кондуит (Брикер)', 'Ортотопический резервуар'] }),
    f('perClose', 'Закрытие промежности', 'Perineal closure', 'sel', { options: ['Первичный шов', 'Биологическая сетка', 'Синтетическая сетка', 'Мышечный лоскут', 'Другое'] })
  ]},
  { id: 'opStForm', sec: 'op', title: ['Формирование стомы', 'Stoma formation'], why: ['операция: формирование стомы', 'operation: stoma formation'], when: inP(P_STFORM), fields: [
    f('stInd', 'Показание', 'Indication', 'sel', { options: ['Кишечная непроходимость', 'Разгрузка перед лечением', 'Паллиативная', 'Несостоятельность анастомоза', 'Другое'] })
  ]},
  { id: 'opStClose', sec: 'op', title: ['Закрытие стомы', 'Stoma closure'], why: ['операция: закрытие стомы', 'operation: stoma closure'], when: inP(P_STCLOSE), fields: [
    f('clType', 'Закрываемая стома', 'Stoma closed', 'sel', { options: STOMAS.slice(1) }),
    f('clWeeks', 'Срок после формирования', 'Time since formation', 'num', { unit: 'u.weeks' }),
    f('skin', 'Ушивание кожи', 'Skin closure', 'sel', { options: ['Кисетный шов', 'Первичный шов', 'Открытое ведение'] }),
    f('clMesh', 'Профилактическая сетка', 'Prophylactic mesh', 'seg', { options: YN })
  ]},
  { id: 'opCrs', sec: 'op', title: ['Циторедуктивная операция', 'Cytoreductive surgery'], why: ['операция: циторедукция', 'operation: cytoreduction'], when: inP(P_CRS), fields: [
    f('pci', 'Перитонеальный индекс (PCI)', 'Peritoneal cancer index (PCI)', 'num'),
    f('cc', 'Полнота циторедукции', 'Completeness of cytoreduction', 'seg', { options: ['CC-0', 'CC-1', 'CC-2', 'CC-3'] }),
    f('ipc', 'Внутрибрюшинная химиотерапия', 'Intraperitoneal chemotherapy', 'sel', { options: ['Нет', 'HIPEC', 'PIPAC', 'EPIC'] }),
    f('ipcDrug', 'Препарат', 'Drug', 'text', { show: function (d) { return d.ipc && d.ipc !== 'Нет'; } })
  ]},
  { id: 'opIntra', sec: 'op', last: true, title: ['Интраоперационные осложнения', 'Intraoperative complications'], why: ['список зависит от выбранной операции', 'the list depends on the operation'], when: hasSurg, fields: [
    f('intraCx', 'Осложнения во время операции', 'Complications during surgery', 'multi', { options: IC_ALL, optionsFn: intraOpts, dd: true, none: 'f.ddNone' }),
    f('intraNote', 'Описание и что сделано', 'Details and management', 'long', { wide: true, show: function (d) { return (d.intraCx || []).length > 0; } })
  ]},
  { id: 'endoRes', sec: 'op', title: ['Эндоскопическая резекция', 'Endoscopic resection'], why: ['вмешательство: ESD, EMR или полипэктомия', 'procedure: ESD, EMR or polypectomy'], when: function (d) { return d.kind === 'Эндоскопическое' && ['ESD', 'EMR', 'Полипэктомия'].indexOf(d.endo) >= 0; }, fields: [
    f('lesSize', 'Размер образования', 'Lesion size', 'num', { unit: 'u.mm' }),
    f('paris', 'Макроскопический тип (Paris)', 'Paris classification', 'sel', { options: ['0-Ip', '0-Isp', '0-Is', '0-IIa', '0-IIb', '0-IIc', 'LST-G', 'LST-NG'] }),
    f('enbloc', 'Удаление единым блоком', 'En bloc resection', 'seg', { options: YN }),
    f('endoCx', 'Осложнение', 'Complication', 'sel', { options: ['Нет', 'Кровотечение', 'Перфорация', 'Постполипэктомический синдром'] })
  ]},
  { id: 'endoStent', sec: 'op', title: ['Стентирование', 'Stenting'], why: ['вмешательство: стентирование', 'procedure: stenting'], when: function (d) { return d.kind === 'Эндоскопическое' && d.endo === 'Стентирование'; }, fields: [
    f('stentInd', 'Цель', 'Aim', 'seg', { options: ['Мост к операции', 'Паллиативное'] }),
    f('stentLen', 'Длина стента', 'Stent length', 'num', { unit: 'u.mm' }),
    f('techOk', 'Технический успех', 'Technical success', 'seg', { options: YN }),
    f('clinOk', 'Клинический успех', 'Clinical success', 'seg', { options: YN })
  ]},
  { id: 'endoDil', sec: 'op', title: ['Баллонная дилатация', 'Balloon dilation'], why: ['вмешательство: баллонная дилатация', 'procedure: balloon dilation'], when: function (d) { return d.kind === 'Эндоскопическое' && d.endo === 'Баллонная дилатация'; }, fields: [
    f('strCause', 'Причина стриктуры', 'Stricture cause', 'sel', { options: ['Анастомотическая', 'Воспалительная', 'Опухолевая', 'Другое'] }),
    f('balloon', 'Диаметр баллона', 'Balloon diameter', 'num', { unit: 'u.mm' }),
    f('sessions', 'Номер сеанса', 'Session number', 'num')
  ]},
  { id: 'ileo', sec: 'cx', title: ['Илеостома', 'Ileostomy'], why: ['выведена илеостома', 'ileostomy formed'], when: function (d) { return /илеостома/.test(d.stoma || ''); }, fields: [
    f('ho', 'Высокий сброс (high-output)', 'High output', 'seg', { options: YN }),
    f('readm', 'Реадмиссия по дегидратации', 'Readmission, dehydration', 'seg', { options: YN }),
    f('stomaCx', 'Осложнения стомы', 'Stoma complications', 'sel', { options: ['Нет', 'Дерматит', 'Ретракция', 'Пролапс', 'Парастомальная грыжа'] })
  ]},
  { id: 'vteMod', sec: 'cx', title: ['Венозные тромбоэмболии', 'Venous thromboembolism'], why: ['осложнение: ТГВ или ТЭЛА', 'complication: DVT or PE'], when: function (d) { return d.vte === 'ТГВ' || d.vte === 'ТЭЛА'; }, fields: [
    f('caprini', 'Шкала Caprini', 'Caprini score', 'num'),
    f('proph', 'Профилактика', 'Prophylaxis', 'sel', { options: ['Нет', 'НМГ до выписки', 'НМГ 28 дней'] }),
    f('vteDay', 'Сутки после операции', 'Postoperative day', 'num'),
    f('vteTx', 'Лечение', 'Treatment', 'text'),
    f('vteOut', 'Исход', 'Outcome', 'sel', { options: ['Выздоровление', 'Остаточные изменения', 'Летальный исход'] })
  ]},
  { id: 'rectPath', sec: 'path', title: ['Препарат прямой кишки', 'Rectal specimen'], why: ['операция на прямой кишке', 'rectal operation'], when: function (d) { return inP(P_AR.concat(P_APR, P_HART, P_EVISC))(d); }, fields: [
    f('tme', 'Качество мезоректума по Quirke (оценивает патоморфолог)', 'Mesorectal quality, Quirke (pathologist)', 'sel', { options: ['Полное (мезоректум цел)', 'Почти полное (дефекты до 5 мм)', 'Неполное (дефекты до мышечного слоя)'] }),
    f('pCRM', 'Циркулярный край (CRM)', 'Circumferential margin (CRM)', 'seg', { options: ['Отрицательный', 'Положительный'] }),
    f('dm', 'Дистальный край резекции в препарате', 'Distal resection margin in specimen', 'num', { unit: 'u.cm' }),
    f('llRem', 'Боковых лимфоузлов удалено', 'Lateral nodes removed', 'num', { show: function (d) { return d.llnd === 'Да'; } }),
    f('llPos', 'Из них поражено', 'Positive lateral nodes', 'num', { show: function (d) { return d.llnd === 'Да'; } })
  ]},
  { id: 'rectLate', sec: 'late', title: ['Функция после резекции прямой кишки', 'Function after rectal resection'], why: ['резекция прямой кишки с анастомозом', 'rectal resection with anastomosis'], when: function (d) { return inP(P_AR)(d) && d.anast === 'Да'; }, fields: [
    f('lars', 'Шкала LARS через 12 мес после закрытия стомы', 'LARS score 12 months after stoma closure', 'num', { unit: 'u.points' })
  ]}
];

var MEDIA = [f('phBefore', 'До лучевой', 'Before RT', 'files'), f('phAfterRt', 'После лучевой', 'After RT', 'files'), f('phMid', 'Середина консолидации', 'Mid consolidation', 'files'), f('phAfterCons', 'После консолидации', 'After consolidation', 'files'), f('phControl', 'Контроль', 'Follow-up', 'files')];
var FU = [['d30', 30, 'fu.d30'], ['d90', 90, 'fu.d90'], ['d365', 365, 'fu.y1']];
var CF_TYPES = [['num', 'cf.num'], ['text', 'cf.text'], ['yn', 'cf.yn'], ['sel', 'cf.sel'], ['date', 'cf.date']];

function secOn(s, d) { return !s.when || s.when(d) || secHasData(s, d); }
var FIELD = {};
SECTIONS.forEach(function (s) { s.fields.forEach(function (x) { FIELD[x.id] = x; }); });
MODULES.forEach(function (m) { m.fields.forEach(function (x) { FIELD[x.id] = x; }); });
MEDIA.forEach(function (x) { FIELD[x.id] = x; });
var RULE_FIELDS = [];
var RF_SEEN = {};
SECTIONS.forEach(function (s) { s.fields.forEach(function (x) { if (!RF_SEEN[x.id] && /^(sel|seg|num|multi)$/.test(x.type)) { RF_SEEN[x.id] = 1; RULE_FIELDS.push(x); } }); });
MODULES.forEach(function (m) { m.fields.forEach(function (x) { if (!RF_SEEN[x.id] && /^(sel|seg|multi)$/.test(x.type)) { RF_SEEN[x.id] = 1; RULE_FIELDS.push(x); } }); });

/* ======================= Collections schema ======================= */
var COLS = {
  planner: { icon: 'cal', title: ['Планировщик', 'Planner'], sub: ['Госпитализации и операции. Отдельно от регистра, ничего в нём не меняет.', 'Admissions and surgeries. Kept apart from the registry and never changes it.'],
    titleField: 'fio', subField: 'dx', dateField: 'date', statusField: 'status', views: ['cal', 'table', 'board'],
    colorBy: { 'Планируется': 'plan', 'В отделении': 'prog', 'Завершено': 'done', 'Отменено': 'cancel' },
    list: ['date', 'fio', 'dx', 'surgeryDate', 'surgeon', 'status', 'mdg'],
    fields: [
      f('fio', 'ФИО', 'Full name', 'text'), f('dx', 'Диагноз / операция', 'Diagnosis / procedure', 'text'),
      f('date', 'Дата поступления', 'Admission date', 'date'), f('surgeryDate', 'Дата операции', 'Surgery date', 'date'), f('postRoute', 'Перевод после операции', 'Transfer after surgery', 'seg', { options: ['Палата пробуждения', 'Реанимация (ОАРИТ)'] }), f('labsDone', 'Контрольные анализы взяты', 'Control labs taken', 'date'), f('discharge', 'Дата выписки', 'Discharge date', 'date'),
      f('surgeon', 'Хирург', 'Surgeon', 'sel', { options: SURGEONS }), f('resident', 'Резидент', 'Resident', 'sel', { options: RESIDENTS }),
      f('status', 'Статус', 'Status', 'sel', { options: ['Планируется', 'В отделении', 'Завершено', 'Отменено'] }),
      f('mdg', 'МДГ', 'MDT', 'sel', { options: ['Ожидается', 'Проведён'] }), f('referral', 'Направление', 'Referral', 'seg', { options: YN }),
      f('alert', 'Внимание', 'Alert', 'sel', { options: ['Критический'] }), f('alertComment', 'Комментарий к алерту', 'Alert comment', 'text'),
      f('notes', 'Заметки', 'Notes', 'long', { wide: true })
    ]},
  mdt: { icon: 'mdt', title: ['МДГ', 'MDT'], sub: ['Колоректальная мультидисциплинарная группа', 'Colorectal multidisciplinary team'],
    titleField: 'fio', subField: 'dx', dateField: 'date', statusField: 'status', views: ['table', 'board', 'cal'],
    colorBy: { 'Ожидает обсуждения': 'plan', 'Обсуждён': 'prog', 'Лечение начато': 'prog', 'Лечение завершено': 'done', 'Наблюдение': 'done' },
    list: ['date', 'fio', 'mrn', 'stage', 'plan', 'status', 'change'],
    fields: [
      f('fio', 'ФИО', 'Full name', 'text'), f('mrn', 'Номер МДГ', 'MDT no.', 'text'), f('date', 'Дата МДГ', 'MDT date', 'date'),
      f('status', 'Статус', 'Status', 'sel', { options: ['Ожидает обсуждения', 'Обсуждён', 'Лечение начато', 'Лечение завершено', 'Наблюдение'] }),
      f('stage', 'Стадия', 'Stage', 'sel', { options: ['I', 'II', 'III', 'IV', 'Неприменимо'] }),
      f('plan', 'План лечения', 'Treatment plan', 'multi', { options: ['Операция', 'Химиотерапия', 'Лучевая терапия', 'TNT', 'Watch & wait', 'Протонная терапия', 'Иммунотерапия', 'Термоаблация', 'Паллиативная помощь', 'Повторная оценка'] }),
      f('change', 'Решение изменено', 'Decision changed', 'seg', { options: YN }), f('lead', 'Ведущий врач', 'Lead clinician', 'sel', { options: SURGEONS }),
      f('dx', 'Диагноз', 'Diagnosis', 'long', { wide: true }), f('rec', 'Рекомендация МДГ', 'MDT recommendation', 'long', { wide: true })
    ]},
  mm: { icon: 'alert', title: ['M&M', 'M&M'], sub: ['Разборы осложнений и летальности', 'Morbidity and mortality reviews'],
    titleField: 'title', subField: 'reason', dateField: 'date', statusField: 'status', views: ['table', 'board', 'cal'],
    colorBy: { 'Запланирован': 'plan', 'Разобран': 'done' },
    list: ['date', 'title', 'reason', 'status', 'summary', 'files'],
    fields: [
      f('title', 'Пациент / тема', 'Patient / topic', 'text'), f('date', 'Дата', 'Date', 'date'), f('status', 'Статус', 'Status', 'sel', { options: ['Запланирован', 'Разобран'] }), f('reason', 'Причина разбора', 'Reason for review', 'text'), f('category', 'Тип случая', 'Case type', 'sel', { options: ['Осложнение', 'Летальный исход', 'Near miss', 'Нежелательное событие'] }), f('cdg', 'Clavien-Dindo', 'Clavien-Dindo', 'sel', { options: ['I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V'] }), f('preventable', 'Предотвратимость', 'Preventability', 'seg', { options: ['Да', 'Возможно', 'Нет'] }), f('factors', 'Факторы', 'Contributing factors', 'multi', { options: ['Пациент', 'Хирургическая техника', 'Решение и суждение', 'Коммуникация', 'Система и организация', 'Оборудование', 'Анестезия'] }),
      f('summary', 'Итоги разбора (инициативы)', 'Review outcome (initiatives)', 'long', { wide: true, rows: 5 }), f('files', 'Вложения', 'Attachments', 'files', { wide: true }), f('dx', 'Диагноз', 'Diagnosis', 'long', { wide: true })
    ]},
  redcap: { icon: 'flask', title: ['RedCap', 'RedCap'], sub: ['Пациенты, внесённые в RedCap: контакт через 30 дней после операции', 'Patients entered in RedCap: contact 30 days after surgery'],
    titleField: 'fio', subField: 'rid', dateField: 'contact', statusField: 'done', views: ['table', 'cal'],
    colorBy: { 'Ожидает': 'plan', 'Заполнено': 'done' },
    list: ['rid', 'fio', 'opDate', 'contact', 'done'],
    fields: [
      f('fio', 'ФИО', 'Full name', 'text'), f('rid', 'Record ID', 'Record ID', 'text'), f('opDate', 'Дата операции', 'Surgery date', 'date'),
      f('contact', 'Связаться и заполнить', 'Contact and complete by', 'date'), f('done', 'Статус', 'Status', 'sel', { options: ['Ожидает', 'Заполнено'] }),
      f('notes', 'Заметки', 'Notes', 'long', { wide: true })
    ]},
  goals: { icon: 'flag', title: ['Цели', 'Goals'], sub: ['Задачи сектора: исследования, статьи, проекты', 'Team goals: studies, papers, projects'],
    titleField: 'title', subField: 'owner', dateField: 'due', statusField: 'status', views: ['table', 'board'],
    colorBy: { 'Не начато': 'plan', 'В работе': 'prog', 'Готово': 'done' },
    list: ['title', 'gtype', 'owner', 'priority', 'status', 'due'],
    fields: [
      f('title', 'Цель', 'Goal', 'text'), f('gtype', 'Тип', 'Type', 'sel', { options: ['Исследование', 'Статья', 'Проект', 'Другое'] }), f('owner', 'Ответственный', 'Owner', 'text'),
      f('status', 'Статус', 'Status', 'sel', { options: ['Не начато', 'В работе', 'Готово'] }), f('priority', 'Приоритет', 'Priority', 'sel', { options: ['Высокий', 'Средний', 'Низкий'] }),
      f('due', 'Срок', 'Due date', 'date'), f('notes', 'Заметки', 'Notes', 'long', { wide: true })
    ]}
};
COLS.pubs = { icon: 'book', title: ['Публикации', 'Publications'], sub: ['Статьи и доклады сектора: DOI, авторы, журнал, связь с исследованием, отчёт за период', 'Papers and talks: DOI, authors, journal, linked study, report for a period'],
  titleField: 'title', subField: 'venue', dateField: 'date', statusField: 'status', views: ['table', 'board'],
  colorBy: { 'Подготовка': 'plan', 'Подана': 'prog', 'Принята': 'prog', 'Опубликована': 'done', 'Представлен': 'done' },
  list: ['date', 'kind', 'title', 'authors', 'venue', 'study', 'status'],
  fields: [
    f('kind', 'Тип', 'Type', 'seg', { options: ['Статья', 'Доклад'] }),
    f('status', 'Статус', 'Status', 'sel', { options: ['Подготовка', 'Подана', 'Принята', 'Опубликована', 'Представлен'] }),
    f('date', 'Дата', 'Date', 'date'),
    f('title', 'Название', 'Title', 'long', { wide: true, rows: 2 }),
    f('authors', 'Авторы', 'Authors', 'text', { wide: true }),
    f('venue', 'Журнал или конференция', 'Journal or meeting', 'text', { wide: true }),
    f('doi', 'DOI', 'DOI', 'text', { show: isArt, check: doiCheck, ph: '10.1016/j.ejso.2024.01.001' }),
    f('pmid', 'PMID', 'PMID', 'text', { show: isArt }),
    f('quart', 'Индексация', 'Indexing', 'sel', { options: ['Q1', 'Q2', 'Q3', 'Q4', 'Scopus', 'Web of Science', 'РИНЦ', 'Без индексации'], show: isArt }),
    f('volume', 'Том', 'Volume', 'text', { show: isArt }), f('issue', 'Номер', 'Issue', 'text', { show: isArt }), f('pages', 'Страницы', 'Pages', 'text', { show: isArt }),
    f('role', 'Роль', 'Role', 'seg', { options: ['Докладчик', 'Модератор', 'Соавтор'], show: isTalk }),
    f('format', 'Формат', 'Format', 'sel', { options: ['Устный доклад', 'Постер', 'Лекция', 'Мастер-класс'], show: isTalk }),
    f('city', 'Город', 'City', 'text', { show: isTalk }), f('section', 'Секция', 'Section', 'text', { show: isTalk }),
    f('study', 'Исследование', 'Study', 'sel', { optionsFn: function () { return studyNames(); }, options: [] }),
    f('files', 'Файлы: статья, презентация', 'Files: paper, slides', 'files', { wide: true }),
    f('notes', 'Заметки', 'Notes', 'long', { wide: true })
  ]};

Object.keys(COLS).forEach(function (k) { var c = COLS[k]; c.F = {}; c.fields.forEach(function (x) { c.F[x.id] = x; }); });

/* ======================= Storage ======================= */
var KEY_CLOUD = 'crr.cloud.v3', CLOUD_MODE = (function () { var c = window.FIREBASE_CONFIG || null; if (!c) { try { c = JSON.parse(localStorage.getItem('crr.fbconfig') || 'null'); } catch (e) {} } return !!(c && c.apiKey && c.projectId); })();
var KEY = CLOUD_MODE ? KEY_CLOUD : 'crr.v3', UIKEY = 'crr.ui';
var DB;
function defaultRegistries() {
  function A(id, key, rules, parent, kind) { var r = { id: id, nameKey: key, name: '', mode: 'auto', rules: rules, members: [], custom: [] }; if (parent) r.parent = parent; if (kind) r.kind = kind; return r; }
  function L1(id, key, locs) { return A(id, key, [{ f: 'loc', vals: locs }], 'g_surg'); }
  return [
    A('g_surg', 'reg.surg', [{ f: 'kind', not: ['Эндоскопическое'] }]),
    L1('rg_rect', 'reg.rectum', ['Прямая кишка']),
    A('rg_tnt', 'reg.tnt', [{ f: 'tactic', vals: ['Тотальная неоадъювантная терапия (TNT)'] }], 'rg_rect'),
    A('rg_ww', 'reg.ww', [{ f: 'tactic', vals: ['Watch & wait'] }], 'rg_rect'),
    A('rg_teo', 'reg.teo', [{ f: 'proc', vals: P_TEO.slice() }], 'rg_rect'),
    A('rg_llnd', 'reg.llnd', [{ f: 'llnd', vals: ['Да'] }], 'rg_rect'),
    A('rg_relapse', 'reg.relapse', [{ f: 'phase', vals: ['Локальный рецидив'] }], 'rg_rect'),
    L1('rg_rs', 'reg.rs', ['Ректосигмоидный отдел']),
    L1('rg_sig', 'reg.sig', ['Сигмовидная кишка']),
    L1('rg_left', 'reg.left', ['Нисходящая ободочная', 'Селезёночный изгиб']),
    L1('rg_trans', 'reg.trans', ['Поперечная ободочная']),
    L1('rg_right', 'reg.right', RIGHT.slice()),
    L1('rg_anal', 'reg.anal', ['Анальный канал']),
    A('g_endo', 'reg.endo', [{ f: 'kind', vals: ['Эндоскопическое'] }]),
    A('rg_esd', 'reg.esd', [{ f: 'endo', vals: ['ESD'] }], 'g_endo'),
    A('rg_emr', 'reg.emr', [{ f: 'endo', vals: ['EMR'] }], 'g_endo'),
    A('rg_poly', 'reg.poly', [{ f: 'endo', vals: ['Полипэктомия'] }], 'g_endo'),
    A('rg_stent', 'reg.stent', [{ f: 'endo', vals: ['Стентирование'] }], 'g_endo'),
    A('rg_dil', 'reg.dil', [{ f: 'endo', vals: ['Баллонная дилатация'] }], 'g_endo'),
    A('st_tnt', 'reg.resTnt', [{ f: 'research', vals: ['TNT'] }], null, 'study'),
    A('st_ww', 'reg.resWw', [{ f: 'research', vals: ['Opportunistic W&W'] }], null, 'study'),
    A('st_teo', 'reg.resTeo', [{ f: 'research', vals: ['ТЭО'] }], null, 'study')
  ];
}
function freshDB() {
  if (CLOUD_MODE || !window.NOTION_IMPORT) return emptyDB();
  return dbFromImport(window.NOTION_IMPORT);
}
function dbFromImport(I) {
  var cols = { planner: [], mdt: [], mm: [], redcap: [], goals: [], pubs: [] };
  ['planner', 'mdt', 'mm', 'redcap'].forEach(function (k) { (I[k] || []).forEach(function (r, i) { var x = clone(r); x.id = k + '_' + (i + 1); if (k === 'redcap' && !x.done) x.done = 'Ожидает'; cols[k].push(x); }); });
  return { v: 3, seq: (I.patients || []).length + 1, registries: defaultRegistries(), patients: clone(I.patients || []), cols: cols, importedAt: isoOf(new Date()) };
}
function emptyDB() { return { v: 3, seq: 1, registries: defaultRegistries(), patients: [], cols: { planner: [], mdt: [], mm: [], redcap: [], goals: [], pubs: [] }, importedAt: isoOf(new Date()) }; }
function plannerAuto(db) {
  var td = isoOf(new Date()), n = 0;
  (db.cols.planner || []).forEach(function (r) {
    if (r.status === 'В отделении' && r.discharge && r.discharge <= td) { r.status = 'Завершено'; n++; }
  });
  return n;
}
function migrate(db) {
  if (!db.mig) db.mig = {};
  if (!db.mig.p1) {
    var cut = isoOf(addDays(isoOf(new Date()), -14));
    db.cols.planner = (db.cols.planner || []).filter(function (r) { return !(r.notion && !r.date); });
    db.cols.planner.forEach(function (r) { if (r.notion && r.status === 'В отделении' && r.date && r.date < cut) r.status = 'Завершено'; });
    db.mig.p1 = 1;
  }
  if (!db.mig.p2) {
    var mine = (db.registries || []).filter(function (r) { return !r.nameKey; });
    db.registries = defaultRegistries().concat(mine);
    db.mig.p2 = 1;
  }
  if (!db.mig.p3) {
    var td3 = isoOf(new Date());
    (db.cols.mm || []).forEach(function (r) { if (!r.status) r.status = r.date && r.date <= td3 ? 'Разобран' : 'Запланирован'; });
    LINKED.forEach(function (k) { (db.cols[k] || []).forEach(function (r) { if (r.pid) return; var m = guessPatient(db.patients, recName(k, r), false); if (m) r.pid = m.id; }); });
    db.mig.p3 = 1;
  }
  if (!db.mig.p4) {
    var PM = { 'Брюшно-промежностная экстирпация': P_APR[0], 'Интерсфинктерная резекция': P_AR[2], 'Передняя резекция': P_AR[0], 'Низкая передняя резекция': P_AR[1], 'Резекция поперечной ободочной': P_TRANS[0], 'Операция Гартмана': P_HART[0] };
    var NM = { 'TNT': TACTICS[4], 'ХЛТ': TACTICS[3], 'Короткий курс ЛТ': TACTICS[2], 'ПХТ': TACTICS[1] };
    db.patients.forEach(function (p) {
      var d = p.d, tac = [];
      if (d.neo && NM[d.neo]) tac.push(NM[d.neo]);
      var a = d.approach || '';
      if (/TNT/.test(a) && tac.indexOf(TACTICS[4]) < 0) tac.push(TACTICS[4]);
      if (/W&W/.test(a) && !tac.length) tac.push(/ЛТ/.test(a) ? TACTICS[2] : TACTICS[1]);
      if (/Операция|ТЭО/.test(a)) tac.push('Операция');
      if (/W&W/.test(a) || d.ww === 'Да') tac.push('Watch & wait');
      if (tac.length) d.tactic = tac;
      if (a === 'ТЭО' && !d.proc) d.proc = P_TEO[0];
      if (d.proc && PM[d.proc]) d.proc = PM[d.proc];
      if (d.neo === 'ХЛТ') d.neo = 'ХЛТ (длинный курс)';
      if (d.neo === 'Нет') delete d.neo;
      if (d.access === 'Конверсия') { d.access = 'Лапароскопический'; d.conv = 'Да'; }
      if (d.access === 'Трансанальный') d.access = 'Трансанальный (TaTME)';
      if (d.convReason && ['Спаечный процесс', 'Местнораспространённая опухоль', 'Кровотечение', 'Ожирение, анатомия', 'Повреждение органа', 'Технические сложности', 'Другое'].indexOf(d.convReason) < 0) { d.cxNote = (d.cxNote ? d.cxNote + '\n' : '') + d.convReason; d.convReason = 'Другое'; }
      if (d.lig && !d.ligIC) d.ligIC = d.lig === 'У истоков' ? 'Центральная перевязка (у ВБВ)' : 'Стандартная перевязка';
      if (d.anType && !d.anForm) d.anForm = d.anType;
      delete d.approach; delete d.ww; delete d.lig; delete d.anType;
    });
    var mine4 = (db.registries || []).filter(function (r) { return !r.nameKey; });
    db.registries = defaultRegistries().concat(mine4);
    db.mig.p4 = 1;
  }
  if (!db.mig.p5) {
    db.patients.forEach(function (p) { var d = p.d; if (d.perf === 'Да') d.intraCx = (d.intraCx || []).concat(['Перфорация опухоли']); delete d.perf; delete d.llSide; if (d.specLen) { delete d.specLen; } });
    db.mig.p5 = 1;
  }
  if (!db.mig.p6) {
    var EXM = { 'Пфанненштиль': 'Поперечная минилапаротомия над лоном (Пфанненштиль)' };
    var TM = { 'Двойное прошивание (double stapling)': 'Аппаратный циркулярный', 'Одиночное прошивание (single stapling)': 'Аппаратный циркулярный', 'Ручной колоанальный': 'Ручной', 'Аппаратный линейный': 'Аппаратный линейный', 'Аппаратный циркулярный': 'Аппаратный циркулярный', 'Ручной': 'Ручной', 'Комбинированный': 'Комбинированный' };
    db.patients.forEach(function (p) {
      var d = p.d, an = [];
      if (d.extract && EXM[d.extract]) d.extract = EXM[d.extract];
      [d.anTechR, d.anTechC].forEach(function (v) { if (v && TM[v] && an.indexOf(TM[v]) < 0) an.push(TM[v]); });
      [d.anConfR, d.anConfC].forEach(function (v) { if (v) { var c = v.replace(/-/g, ' '); if (an.indexOf(c) < 0) an.push(c); } });
      if (d.anForm) an.push(d.anForm);
      if (an.length && !d.anDet) d.anDet = an;
      if (d.pelvDrain === 'Да') d.drain = (d.drain || []).concat(['Малый таз']);
      if (d.mrCRM && !/тельный$/.test(d.mrCRM)) delete d.mrCRM;
      if (d.pCRM) d.pCRM = /Положительн/.test(d.pCRM) ? 'Положительный' : /Отрицательн/.test(d.pCRM) ? 'Отрицательный' : undefined;
      if (d.emvi === 'Да') d.emvi = 'Положительный'; if (d.emvi === 'Нет') d.emvi = 'Отрицательный';
      if (d.tme && ['Полное', 'Почти полное', 'Неполное'].indexOf(d.tme) >= 0) d.tme = { 'Полное': 'Полное (мезоректум цел)', 'Почти полное': 'Почти полное (дефекты до 5 мм)', 'Неполное': 'Неполное (дефекты до мышечного слоя)' }[d.tme];
      if (d.llBefore || d.llAfter) d.mrLat = 'Да';
      ['anTechR', 'anTechC', 'anConfR', 'anConfC', 'anForm', 'donuts', 'pelvDrain', 'larsCat'].forEach(function (k) { delete d[k]; });
      Object.keys(d).forEach(function (k) { if (d[k] === undefined) delete d[k]; });
    });
    db.mig.p6 = 1;
  }
  if (!db.mig.p7) {
    db.templates = db.templates || []; db.qtpl = db.qtpl || []; db.cols.pubs = db.cols.pubs || []; db.studySeq = db.studySeq || 0;
    var yr = new Date().getFullYear(), BI = { st_tnt: ['TNT', 'Проспективное когортное'], st_ww: ['WW', 'Проспективное когортное'], st_teo: ['TEO', 'Проспективное когортное'] };
    db.registries.forEach(function (r) {
      if (r.kind !== 'study' || r.proto) return;
      var pr = newProto(); db.studySeq++; pr.no = 'КРС-' + yr + '-' + String(db.studySeq).padStart(3, '0');
      if (BI[r.id]) { pr.code = BI[r.id][0]; pr.status = 'Набор пациентов'; pr.syn = { design: BI[r.id][1] }; }
      r.proto = pr;
    });
    db.mig.p7 = 1;
  }
  if (!db.cols.pubs) db.cols.pubs = [];
  plannerAuto(db);
  return db;
}
var LINKED = ['planner', 'mdt', 'mm', 'redcap'];
function recName(k, r) { return k === 'mm' ? r.title : r.fio; }
function nameTokens(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-яәіңғүұқөһ\s-]/g, ' ').split(/[\s-]+/).filter(Boolean); }
function guessPatient(list, name, exact) {
  var rt = nameTokens(name); if (!rt.length) return null;
  var hits = list.filter(function (p) {
    var pt = nameTokens(p.d.fio); if (!pt.length) return false;
    if (exact) return pt.join(' ') === rt.join(' ');
    if (pt[0] !== rt[0]) return false;
    return rt.length < 2 || pt.length < 2 || pt[1][0] === rt[1][0];
  });
  return hits.length === 1 ? hits[0] : null;
}
function patOf(id) { return id ? DB.patients.filter(function (p) { return p.id === id; })[0] : null; }
function linkedRecs(pid) { var out = []; LINKED.forEach(function (k) { DB.cols[k].forEach(function (r) { if (r.pid === pid) out.push({ k: k, r: r }); }); }); return out; }
function recLine(k, r) {
  var c = COLS[k], bits = [];
  if (k === 'planner') bits = [r.dx, r.surgeryDate ? t('lk.op') + ' ' + fmtDate(r.surgeryDate) : '', r.surgeon ? ov(r.surgeon) : ''];
  if (k === 'mdt') bits = [(r.plan || []).map(ov).join(', '), r.rec, r.mrn ? '№ ' + r.mrn : ''];
  if (k === 'mm') bits = [r.reason, r.summary];
  if (k === 'redcap') bits = [r.rid, r.contact ? t('lk.contact') + ' ' + fmtDate(r.contact) : ''];
  var st = c.statusField && r[c.statusField] ? '<span class="st st-' + ((c.colorBy || {})[r[c.statusField]] || 'plan') + '">' + esc(ov(r[c.statusField])) + '</span>' : '';
  var txt = bits.filter(Boolean).join(' · ');
  return '<button type="button" class="lrow" data-act="openrec" data-k="' + k + '" data-id="' + r.id + '"><span class="ldate">' + (r[c.dateField] ? fmtDate(r[c.dateField]) : t('lk.nodate')) + '</span><span class="ltxt">' + esc(txt.length > 160 ? txt.slice(0, 160) + '…' : txt || recTitle(c, r)) + '</span>' + st + '</button>';
}
function linkedBlock(pid, canAdd, skip) {
  var recs = linkedRecs(pid), h = '';
  LINKED.forEach(function (k) {
    var mine = recs.filter(function (x) { return x.k === k && (!skip || x.r.id !== skip); }).map(function (x) { return x.r; });
    if (!mine.length && !canAdd) return;
    var c = COLS[k]; mine.sort(function (a, b) { return String(b[c.dateField] || '').localeCompare(String(a[c.dateField] || '')); });
    h += '<div class="lblock"><div class="lhead">' + ico(c.icon, 16) + '<b>' + esc(L(c.title)) + '</b><span class="cnt">' + mine.length + '</span>' + (canAdd ? '<button type="button" class="btn small" data-act="addlinked" data-k="' + k + '">' + ico('plus', 14) + t('lk.add.' + k) + '</button>' : '') + '</div>';
    h += mine.length ? mine.map(function (r) { return recLine(k, r); }).join('') : '<p class="muted small">' + t('lk.none') + '</p>';
    h += '</div>';
  });
  return h;
}
function load() {
  try { var s = localStorage.getItem(KEY); if (s) { var x = JSON.parse(s); if (x && x.v === 3) return migrate(x); } } catch (e) {}
  return migrate(freshDB());
}
function save() { if (typeof SESSION !== 'undefined' && isStudent()) return true; try { localStorage.setItem(KEY, JSON.stringify(DB)); if (typeof CLOUD !== 'undefined' && CLOUD.on) cloudPush(); return true; } catch (e) { toast(t('toast.saveFail')); return false; } }
DB = load();

var UI = { lang: 'ru', side: true, colView: {}, cal: {} };
try { var u = JSON.parse(localStorage.getItem(UIKEY) || '{}'); Object.keys(u).forEach(function (k) { UI[k] = u[k]; }); } catch (e) {}
LANG = UI.lang === 'en' ? 'en' : 'ru';
if (!UI.v9) { UI.view = 'home'; UI.v9 = 1; try { localStorage.setItem(UIKEY, JSON.stringify(UI)); } catch (e) {} }
function saveUI() { try { localStorage.setItem(UIKEY, JSON.stringify(UI)); } catch (e) {} }

/* ======================= Registry logic ======================= */
function ruleOk(p, r) {
  var x = FIELD[r.f]; if (!x) return true; var v = p.d[r.f];
  if (x.type === 'num') {
    var n = num(v); if (n === null) return !has(r.min) && !has(r.max);
    if (has(r.min) && n < num(r.min)) return false; if (has(r.max) && n > num(r.max)) return false; return true;
  }
  if (Array.isArray(v)) { if (r.not) return !v.some(function (z) { return r.not.indexOf(z) >= 0; }); if (!r.vals || !r.vals.length) return true; return v.some(function (z) { return r.vals.indexOf(z) >= 0; }); }
  if (r.not) return r.not.indexOf(v) < 0;
  if (!r.vals || !r.vals.length) return true;
  return r.vals.indexOf(v) >= 0;
}
function inReg(p, reg) {
  if (reg.parent) { var par = regOf(reg.parent); if (par && !inReg(p, par)) return false; }
  if (reg.kind === 'study' && p.enroll && p.enroll[reg.id]) return true;
  if (reg.mode === 'manual') return reg.members.indexOf(p.id) >= 0;
  return reg.rules.every(function (r) { return ruleOk(p, r); });
}
function kids(pid, study) { return DB.registries.filter(function (r) { return (r.parent || null) === (pid || null) && !!(r.kind === 'study') === !!study; }); }
function ancestors(reg) { var out = [], r = reg; while (r && r.parent) { r = regOf(r.parent); if (r) out.unshift(r); } return out; }
function tagsOf(match) {
  var ids = {}; match.forEach(function (r) { ids[r.id] = 1; });
  return match.filter(function (r) { return !match.some(function (o) { return o.parent === r.id; }); });
}
function regOf(id) { return DB.registries.filter(function (r) { return r.id === id; })[0]; }
function regName(r) { return r.nameKey ? t(r.nameKey) : r.name; }
function ruleText(reg) {
  if (reg.kind === 'study' && reg.desc) return reg.desc;
  if (reg.mode === 'manual') return t('rule.manual');
  var all = [];
  ancestors(reg).concat([reg]).forEach(function (x) { if (x.mode !== 'manual') all = all.concat(x.rules); });
  if (!all.length) return t('rule.all');
  return all.map(function (r) {
    var x = FIELD[r.f]; if (!x) return '';
    if (x.type === 'num') { var s = L(x.label); if (has(r.min)) s += ' ' + t('rule.from') + ' ' + r.min; if (has(r.max)) s += ' ' + t('rule.to') + ' ' + r.max; return s; }
    if (r.not) return L(x.label) + ': ' + t('rule.not') + ' ' + r.not.map(ov).join(', ').toLowerCase();
    return L(x.label) + ': ' + (r.vals && r.vals.length ? r.vals.map(ov).join(' ' + t('rule.or') + ' ') : t('rule.any'));
  }).join('; ');
}
function fuList(p) {
  if (!p.d.date) return [];
  var td = today();
  return FU.map(function (x) {
    var due = addDays(p.d.date, x[1]); var days = Math.round((due - td) / 86400000);
    var st = p.fu[x[0]] ? 'done' : days < 0 ? 'overdue' : days <= 14 ? 'soon' : 'plan';
    return { key: x[0], label: t(x[2]), due: isoOf(due), days: days, st: st };
  });
}
function fuDueAll() {
  var out = [];
  DB.patients.forEach(function (p) { fuList(p).forEach(function (x) { if (x.st === 'overdue' || x.st === 'soon') out.push({ p: p, f: x }); }); });
  return out.sort(function (a, b) { return a.f.days - b.f.days; });
}
function pName(p) { return p.d.fio || p.id; }

/* ======================= UI state ======================= */
var S = { view: UI.view || 'home', q: '', drawer: null, edit: null, rec: null, menu: null, inline: null, expand: null, sort: {} };
function setView(v) { S.view = v; S.q = ''; S.expand = null; S.inline = null; UI.view = v; saveUI(); S.sideMob = false; render(); var m = root.querySelector('.content'); if (m) m.scrollTop = 0; }

/* ======================= Render: shell ======================= */
var root = document.getElementById('root');
function navBtn(v, icon, label, cnt, badge) {
  return '<button type="button" class="nav' + (S.view === v ? ' on' : '') + '" data-act="view" data-v="' + v + '"' + (S.view === v ? ' aria-current="page"' : '') + '>' + ico(icon, 17) + '<span class="nl">' + esc(label) + '</span>' + (badge ? '<span class="badge">' + badge + '</span>' : cnt !== undefined ? '<span class="cnt">' + cnt + '</span>' : '') + '</button>';
}
function regCount(r) { return DB.patients.filter(function (p) { return inReg(p, r); }).length; }
function isOpen(id) {
  if (UI.open && UI.open[id] !== undefined) return UI.open[id];
  var cur = S.view.indexOf('reg:') === 0 ? regOf(S.view.slice(4)) : null;
  return !!cur && (cur.id === id || ancestors(cur).some(function (a) { return a.id === id; }));
}
function treeNode(r, depth) {
  var ch = kids(r.id, r.kind === 'study'), open = ch.length && isOpen(r.id);
  var h = '<div class="tn" style="--d:' + depth + '">';
  h += ch.length ? '<button type="button" class="tog' + (open ? ' open' : '') + '" data-act="tog" data-id="' + r.id + '" aria-expanded="' + !!open + '" aria-label="' + t(open ? 'a11y.collapse' : 'a11y.expand') + '">' + ico('right', 14) + '</button>' : '<span class="tog-sp"></span>';
  h += navBtn('reg:' + r.id, depth ? 'dot' : (r.id === 'g_endo' ? 'scope' : r.kind === 'study' ? 'flask' : r.id === 'g_surg' ? 'knife' : 'tag'), regName(r), regCount(r)) + '</div>';
  if (open) ch.forEach(function (c) { h += treeNode(c, depth + 1); });
  return h;
}
/* ======================= Registry list ======================= */
function listForReg() {
  var id = S.view.slice(4), reg = id === 'all' ? null : regOf(id);
  var list = DB.patients.slice();
  if (reg) list = list.filter(function (p) { return inReg(p, reg); });
  var fl = UI.flt || {};
  FILTERS.forEach(function (g) { var v = fl[g.id]; if (!v) return; var o = g.opts.filter(function (x) { return x[0] === v; })[0]; if (o) list = list.filter(function (p) { return o[2](p.d); }); });
  var q = S.q.trim().toLowerCase();
  if (q) list = list.filter(function (p) { return (p.id + ' ' + (p.d.fio || '') + ' ' + (p.d.dxText || '') + ' ' + (p.d.loc || '') + ' ' + (p.d.proc || '')).toLowerCase().indexOf(q) >= 0; });
  return { reg: reg, list: list };
}
var FILTERS = [
  { id: 'access', label: 'flt.access', opts: [['mis', 'flt.mis', function (d) { return MIS.indexOf(d.access) >= 0; }], ['open', 'flt.open', function (d) { return d.access === 'Открытый'; }], ['ta', 'flt.ta', function (d) { return /TaTME/.test(d.access || ''); }], ['conv', 'flt.conv', function (d) { return d.conv === 'Да'; }]] },
  { id: 'stoma', label: 'flt.stoma', opts: [['ileo', 'flt.ileo', function (d) { return /илеостома/.test(d.stoma || ''); }], ['colo', 'flt.colo', function (d) { return /колостома|сигмостома|трансверзостома/.test(d.stoma || ''); }], ['none', 'flt.noStoma', function (d) { return d.stoma === 'Нет'; }]] },
  { id: 'cx', label: 'flt.cx', opts: [['vte', 'flt.vte', function (d) { return d.vte === 'ТГВ' || d.vte === 'ТЭЛА'; }], ['leak', 'flt.leak', function (d) { return ['A', 'B', 'C'].indexOf(d.leak) >= 0; }], ['cd3', 'flt.cd3', function (d) { return ['IIIa', 'IIIb', 'IVa', 'IVb', 'V'].indexOf(d.cd) >= 0; }], ['ssi', 'flt.ssi', function (d) { return d.ssi && d.ssi !== 'Нет'; }], ['nocx', 'flt.nocx', function (d) { return d.cd === 'Нет'; }]] },
  { id: 'urg', label: 'flt.urg', opts: [['el', 'flt.elective', function (d) { return d.urg === 'Плановая'; }], ['em', 'flt.emergency', function (d) { return d.urg === 'Экстренная'; }]] }
];
function renderFilters() {
  var fl = UI.flt || {}, any = false;
  var h = '<div class="filters" role="group" aria-label="' + t('flt.title') + '"><span class="flabel">' + ico('filter', 15) + t('flt.title') + '</span>';
  FILTERS.forEach(function (g) {
    var v = fl[g.id] || ''; if (v) any = true;
    h += '<label class="fsel' + (v ? ' on' : '') + '"><span class="sr">' + t(g.label) + '</span><select data-act="flt" data-id="' + g.id + '"><option value="">' + t(g.label) + ': ' + t('flt.any') + '</option>' + g.opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === v ? ' selected' : '') + '>' + t(g.label) + ': ' + t(o[1]) + '</option>'; }).join('') + '</select></label>';
  });
  if (any) h += '<button type="button" class="btn small ghost" data-act="fltreset">' + t('flt.reset') + '</button>';
  return h + '</div>';
}
function tile(v, l) { return '<div class="tile"><b>' + esc(v) + '</b><span>' + esc(l) + '</span></div>'; }
function renderRegistry() {
  var id = S.view.slice(4);
  if (id !== 'all' && !regOf(id)) { S.view = 'reg:all'; id = 'all'; }
  var o = listForReg(), reg = o.reg, list = o.list;
  var s = S.sort['reg'] || { k: 'id', d: 1 };
  list.sort(function (a, b) {
    var av = s.k === 'id' ? a.id : (a.d[s.k] || ''), bv = s.k === 'id' ? b.id : (b.d[s.k] || '');
    var an = num(av), bn = num(bv);
    if (an !== null && bn !== null && s.k === 'age') return (an - bn) * s.d;
    return String(av).localeCompare(String(bv), locale()) * s.d;
  });
  if (reg && reg.kind === 'study' && (UI.stab || 'pts') !== 'pts') return studyHead(reg) + studyTabBody(reg);
  var crumbs = reg ? ancestors(reg).map(function (a) { return '<button type="button" class="crumb" data-act="view" data-v="reg:' + a.id + '">' + esc(regName(a)) + '</button>'; }).join('<span class="csep">/</span>') : '';
  if (reg && reg.kind === 'study') crumbs = '<span class="crumb">' + t('nav.studies') + '</span>';
  var isSt = reg && reg.kind === 'study', h;
  if (isSt) h = studyHead(reg);
  else {
    h = '<div class="head"><div>' + (crumbs ? '<div class="crumbs">' + crumbs + '</div>' : '<div class="kicker">' + LL('Регистр', 'Registry') + '</div>') + '<h1>' + esc(reg ? regName(reg) : t('nav.allPatients')) + '</h1><p class="sub">' + esc(reg ? ruleText(reg) : t('reg.allSub')) + '</p></div>';
    h += '<div class="actions"><input class="search" type="search" data-act="search" placeholder="' + t('reg.search') + '" aria-label="' + t('reg.search') + '" value="' + esc(S.q) + '">';
    if (reg) h += '<button type="button" class="btn" data-act="editreg" data-id="' + reg.id + '">' + t('reg.configure') + '</button>';
    h += '<div class="dd"><button type="button" class="btn" data-act="menu" data-id="xl">' + ico('sheet', 16) + 'Excel' + ico('down', 14) + '</button>' + (S.menu === 'xl' ? '<div class="pop right" role="menu"><button type="button" class="opt" data-act="csv">' + ico('download', 16) + LL('Экспорт в Excel', 'Export to Excel') + '</button><button type="button" class="opt" data-act="imp">' + ico('upload', 16) + LL('Импорт из Excel или CSV', 'Import from Excel or CSV') + '</button><div class="pop-note">' + LL('Экспорт с кодами и кодбуком, обезличенный вариант. Импорт обновляет карточки по ID или № ИБ.', 'Export with codes and codebook, anonymised option. Import updates records by ID or case no.') + '</div></div>' : '') + '</div>';
    h += '<button type="button" class="btn primary" data-act="newp">' + ico('plus', 16) + t('reg.addPatient') + '</button></div></div>';
  }
  var ages = list.map(function (p) { return num(p.d.age); }).filter(function (x) { return x !== null; });
  var avg = ages.length ? Math.round(ages.reduce(function (a, b) { return a + b; }, 0) / ages.length) : null;
  var ww = list.filter(function (p) { return p.d.phase === 'Watch & wait'; }).length;
  var op = list.filter(function (p) { return p.d.date; }).length;
  var rK = list.filter(function (p) { return has(p.d.r); }), r0 = rK.filter(function (p) { return p.d.r === 'R0'; }).length;
  h += '<div class="stats">' + tile(list.length, plural(list.length, 'pl.patient').replace(/^\d+ /, '')) + tile(avg === null ? t('st.nodata') : avg, t('st.avgAge')) + tile(ww, t('st.ww')) + tile(op, t('st.operated')) + tile(rK.length ? Math.round(r0 / rK.length * 100) + '%' : t('st.nodata'), t('st.r0')) + '</div>';
  h += renderFilters();
  h += '<div class="tablewrap">';
  if (!list.length) h += '<div class="empty">' + (reg && reg.mode === 'manual' ? t('reg.emptyManual') : t('reg.empty')) + '</div>';
  else {
    var cf = reg ? reg.custom : [];
    var cols = [['id', 'ID'], ['fio', t('col.fio')], ['age', t('col.sexAge')], ['loc', t('col.loc')], ['stage', t('col.stage')], ['tactic', t('col.approach')], ['phase', t('col.phase')], ['date', t('col.surgery')]];
    var spr = isSt ? stProto(reg) : null;
    h += '<table class="grid"><thead><tr>';
    cols.forEach(function (c) { h += thSort('reg', c[0], c[1]); });
    cf.forEach(function (c) { h += '<th>' + esc(c.label) + '</th>'; });
    if (isSt) h += '<th>' + LL('№ в исследовании', 'Study no.') + '</th><th>' + LL('Включён', 'Enrolled') + '</th>' + (spr.rand.on === 'Да' ? '<th>' + LL('Группа', 'Arm') + '</th>' : '');
    if (!isSt) h += '<th>' + t('col.tags') + '</th>';
    h += '</tr></thead><tbody>';
    list.forEach(function (p) {
      var d = p.d, tags = tagsOf(DB.registries.filter(function (r) { return inReg(p, r); }));
      var od = fuList(p).some(function (x) { return x.st === 'overdue'; });
      h += '<tr data-act="openp" data-id="' + p.id + '" tabindex="0"><td class="mono">' + p.id + '</td><td class="strong">' + esc(d.fio || '') + (od ? '<br><span class="tag due">' + t('fu.overdueShort') + '</span>' : '') + '</td>';
      h += '<td>' + esc([ov(d.sex), d.age].filter(Boolean).join(', ')) + '</td><td>' + esc(ov(d.loc)) + (d.rLevel ? '<br><span class="muted">' + esc(ov(d.rLevel)) + '</span>' : '') + '</td>';
      h += '<td>' + esc([d.cT, d.cN, d.cM].filter(Boolean).join(' ')) + (d.stage ? '<br><span class="muted">' + t('col.stageShort') + ' ' + esc(d.stage) + '</span>' : '') + '</td>';
      h += '<td>' + esc((d.tactic || []).map(function (v) { return ov(tacShort(v)); }).join(' → ')) + '</td><td>' + (d.phase ? '<span class="pill">' + esc(ov(d.phase)) + '</span>' : '') + '</td><td>' + fmtDate(d.date) + (d.proc ? '<br><span class="muted">' + esc(ov(d.proc)) + '</span>' : '') + '</td>';
      cf.forEach(function (c) { var v = (p.custom[reg.id] || {})[c.id]; h += '<td>' + esc(c.type === 'date' ? fmtDate(v) : c.type === 'yn' ? ov(v) : (v || '')) + '</td>'; });
      if (isSt) { var en = (p.enroll || {})[reg.id]; h += '<td class="mono">' + (en ? esc(en.no) : '<button type="button" class="btn small ghost" data-act="enroll" data-id="' + reg.id + '" data-pid="' + p.id + '">' + LL('Включить', 'Enrol') + '</button>') + '</td><td>' + (en ? fmtDate(en.date) : '') + '</td>'; if (spr.rand.on === 'Да') { var ai = (spr.rand.arms || []).map(function (a) { return a.name; }).indexOf(en && en.arm); h += '<td>' + (en && en.arm ? '<span class="armtag a' + (ai % 6) + '">' + esc(en.arm) + '</span>' : en ? '<button type="button" class="btn small" data-act="rand" data-sid="' + reg.id + '" data-pid="' + p.id + '">' + ico('shuffle', 14) + LL('Рандомизировать', 'Randomise') + '</button>' : '') + '</td>'; } }
      h += (isSt ? '' : '<td class="tags">' + tags.map(function (r) { return '<span class="tag">' + esc(regName(r)) + '</span>'; }).join('') + '</td>') + '</tr>';
    });
    h += '</tbody></table>';
  }
  return h + '</div>';
}
function thSort(scope, k, label) {
  var s = S.sort[scope] || {}; var on = s.k === k;
  return '<th class="s" aria-sort="' + (on ? (s.d > 0 ? 'ascending' : 'descending') : 'none') + '"><button type="button" class="th" data-act="sort" data-scope="' + scope + '" data-k="' + k + '">' + esc(label) + (on ? (s.d > 0 ? ' ↑' : ' ↓') : '') + '</button></th>';
}

function renderFu() {
  var items = fuDueAll();
  var h = '<div class="head"><div><h1>' + t('nav.followup') + '</h1><p class="sub">' + t('fu.sub') + '</p></div></div><div class="tablewrap">';
  if (!items.length) h += '<div class="empty">' + t('fu.empty') + '</div>';
  else {
    h += '<table class="grid"><thead><tr><th>ID</th><th>' + t('col.fio') + '</th><th>' + t('col.surgery') + '</th><th>' + t('fu.check') + '</th><th>' + t('fu.due') + '</th><th>' + t('col.status') + '</th><th></th></tr></thead><tbody>';
    items.forEach(function (x) {
      var st = x.f.st === 'overdue' ? '<span class="tag due">' + t('fu.overdueBy', { n: -x.f.days }) + '</span>' : '<span class="tag">' + (x.f.days === 0 ? t('fu.today') : t('fu.inDays', { n: x.f.days })) + '</span>';
      h += '<tr data-act="openp" data-id="' + x.p.id + '" tabindex="0"><td class="mono">' + x.p.id + '</td><td class="strong">' + esc(x.p.d.fio || '') + '</td><td>' + fmtDate(x.p.d.date) + '</td><td>' + x.f.label + '</td><td>' + fmtDate(x.f.due) + '</td><td>' + st + '</td>';
      h += '<td><button type="button" class="btn small" data-act="fudone" data-id="' + x.p.id + '" data-k="' + x.f.key + '">' + t('fu.markDone') + '</button></td></tr>';
    });
    h += '</tbody></table>';
  }
  return h + '</div>';
}

/* ======================= Field rendering ======================= */
function fieldHTML(x, val, path, d, attrs) {
  var out = fieldHTML0(x, val, path, d, attrs); if (!out) return out;
  var fl = has(val);
  out = out.replace('class="fld', 'class="fld f-' + x.type + (fl ? ' filled' : ''));
  if (x.type === 'sel' && !fl) out = out.replace('<select ', '<select class="empty" ');
  if (x.check && fl) { var er = x.check(val, d); if (er) { out = out.replace('class="fld', 'class="fld err'); out = out.replace(/<\/div>$/, '<p class="ferr">' + ico('alert', 13) + esc(er) + '</p></div>'); } }
  return out;
}
function fieldHTML0(x, val, path, d, attrs) {
  if (x.show && !x.show(d)) return '';
  var wide = x.wide || x.type === 'long' || x.type === 'files' ? ' wide' : '';
  var lab = L(x.label), idA = 'f_' + path.replace(/\./g, '_');
  if (x.type === 'sel' && x.groups) {
    var sid = 'ss:' + path, sopen = S.menu === sid;
    var sh = '<div class="fld' + wide + '"><span class="lbl" id="' + idA + '">' + esc(lab) + '</span><div class="dd"><button type="button" class="mbtn sbtn" data-act="menu" data-id="' + sid + '" aria-haspopup="listbox" aria-expanded="' + sopen + '" aria-labelledby="' + idA + '">' + (has(val) ? '<span class="sval">' + esc(ov(val)) + '</span>' : '<span class="muted">' + t('f.notSet') + '</span>') + ico('down', 16) + '</button>';
    if (sopen) {
      sh += '<div class="pop mpop spop" role="listbox"><button type="button" role="option" class="sopt clear" data-act="selset" data-path="' + path + '" data-val="">' + t('f.notSet') + '</button>';
      x.groups.forEach(function (g, gi) { sh += '<div class="sgrp sg' + gi + '">' + esc(L(g[0])) + '</div>' + g[1].map(function (v) { return '<button type="button" role="option" aria-selected="' + (v === val) + '" class="sopt sg' + gi + (v === val ? ' on' : '') + '" data-act="selset" data-path="' + path + '" data-val="' + esc(v) + '">' + esc(ov(v)) + '</button>'; }).join(''); });
      sh += '</div>';
    }
    return sh + '</div></div>';
  }
  if (x.type === 'sel') {
    if (x.optionsFn) x = Object.assign({}, x, { options: x.optionsFn(d) });
    var opt1 = function (v) { return '<option value="' + esc(v) + '"' + (v === val ? ' selected' : '') + '>' + esc(ov(v)) + '</option>'; };
    var o = '<option value="">' + t('f.notSet') + '</option>' + (x.groups ? x.groups.map(function (g) { return '<optgroup label="' + esc(L(g[0])) + '">' + g[1].map(opt1).join('') + '</optgroup>'; }).join('') : x.options.map(opt1).join(''));
    if (has(val) && x.options.indexOf(val) < 0) o += '<option value="' + esc(val) + '" selected>' + esc(ov(val)) + '</option>';
    return '<div class="fld' + wide + '"><label for="' + idA + '">' + esc(lab) + '</label><select id="' + idA + '" data-bind="' + path + '">' + o + '</select></div>';
  }
  if (x.type === 'seg') {
    return '<div class="fld' + wide + '"><span class="lbl" id="' + idA + '">' + esc(lab) + '</span><div class="seg" role="group" aria-labelledby="' + idA + '">' + x.options.map(function (v) {
      return '<button type="button" class="' + (v === val ? 'on' : '') + '" aria-pressed="' + (v === val) + '" data-act="segset" data-path="' + path + '" data-val="' + esc(v) + '">' + esc(ov(v)) + '</button>';
    }).join('') + '</div></div>';
  }
  if (x.type === 'nodes') {
    var sel = Array.isArray(val) ? val : [];
    var nh = '<div class="fld wide"><span class="lbl">' + esc(lab) + '</span><div class="ln"><figure class="ln-img"><img src="llnd-stations.jpg" alt="' + t('ln.alt') + '" loading="lazy"></figure><div class="ln-tab" role="table">';
    nh += '<div class="ln-row ln-hd" role="row"><span role="columnheader">' + t('ln.station') + '</span><span role="columnheader">' + t('ln.rt') + '</span><span role="columnheader">' + t('ln.lt') + '</span></div>';
    LN_ST.forEach(function (st) {
      nh += '<div class="ln-row" role="row"><span role="cell"><b>' + st[0] + '</b> ' + esc(LANG === 'en' ? st[2] : st[1]) + '</span>';
      (st[3] === 2 ? ['rt', 'lt'] : ['']).forEach(function (sd, i) {
        var code = st[0] + (sd ? ' ' + sd : ''), on = sel.indexOf(code) >= 0;
        nh += '<span role="cell"' + (st[3] === 1 ? ' class="span2"' : '') + '><button type="button" class="lnb' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="multiset" data-path="' + path + '" data-val="' + code + '">' + (sd ? st[0] + ' ' + sd : st[0]) + '</button></span>';
      });
      nh += '</div>';
    });
    return nh + '</div></div></div>';
  }
  if (x.type === 'multi' && x.dd) {
    var cv = Array.isArray(val) ? val : [], opts = x.optionsFn ? x.optionsFn(d) : x.options, mid = 'ms:' + path, open = S.menu === mid;
    cv.forEach(function (v) { if (opts.indexOf(v) < 0) opts = opts.concat([v]); });
    var summ = cv.length ? cv.map(function (v, i) { return '<span class="mchip">' + (x.ordered && cv.length > 1 ? (i + 1) + '. ' : '') + esc(ov(v)) + '</span>'; }).join('') : '<span class="muted">' + t(x.none || 'f.notSet') + '</span>';
    var mh = '<div class="fld wide"><span class="lbl" id="' + idA + '">' + esc(lab) + '</span><div class="dd"><button type="button" class="mbtn" data-act="menu" data-id="' + mid + '" aria-haspopup="true" aria-expanded="' + open + '" aria-labelledby="' + idA + '"><span class="mvals">' + summ + '</span>' + ico('down', 16) + '</button>';
    var mo = function (v) { var on = cv.indexOf(v) >= 0; return '<button type="button" role="option" aria-selected="' + on + '" class="mopt' + (on ? ' on' : '') + (x.groups ? ' radio' : '') + '" data-act="multiset" data-path="' + path + '" data-val="' + esc(v) + '"><span class="box">' + (on ? ico('check', 14) : '') + '</span>' + esc(ov(v)) + '</button>'; };
    if (open) mh += '<div class="pop mpop" role="listbox" aria-multiselectable="true">' + (x.groups ? x.groups.map(function (g) { var gv = g[1].filter(function (v) { return opts.indexOf(v) >= 0; }); return gv.length ? '<div class="mgrp">' + esc(L(g[0])) + '</div>' + gv.map(mo).join('') : ''; }).join('') : opts.map(mo).join('')) + (x.hint ? '<div class="pop-note">' + t(x.hint) + '</div>' : '') + '<div class="mfoot"><button type="button" class="btn small primary" data-act="menu" data-id="' + mid + '">' + t('f.done') + '</button></div></div>';
    return mh + '</div></div>';
  }
  if (x.type === 'multi') {
    var cur = Array.isArray(val) ? val : [];
    return '<div class="fld' + wide + ' wide"><span class="lbl">' + esc(lab) + '</span><div class="chips">' + x.options.map(function (v) {
      var on = cur.indexOf(v) >= 0;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="multiset" data-path="' + path + '" data-val="' + esc(v) + '">' + esc(ov(v)) + '</button>';
    }).join('') + '</div></div>';
  }
  if (x.type === 'long') return '<div class="fld wide"><label for="' + idA + '">' + esc(lab) + '</label><textarea id="' + idA + '" rows="' + (x.rows || 3) + '" data-bind="' + path + '"' + (x.ph ? ' placeholder="' + esc(t(x.ph)) + '"' : '') + '>' + esc(val || '') + '</textarea></div>';
  if (x.type === 'files') {
    var arr = Array.isArray(val) ? val : [];
    var h = '<div class="fld wide"><span class="lbl">' + esc(lab) + '</span><div class="files">';
    arr.forEach(function (fl, i) { h += '<span class="filechip">' + ico(fl.fid ? 'clip' : 'file', 15) + (fl.fid ? '<button type="button" class="flink" data-act="openfile" data-id="' + esc(fl.fid) + '" data-name="' + esc(fl.name) + '">' + esc(fl.name) + '</button>' + (fl.size ? '<em>' + fmtSize(fl.size) + '</em>' : '') : '<a href="' + esc(fl.href) + '" target="_blank" rel="noopener">' + esc(fl.name) + '</a>') + '<button type="button" class="x" aria-label="' + t('f.removeFile') + '" data-act="fileDel" data-path="' + path + '" data-i="' + i + '">' + ico('x', 14) + '</button></span>'; });
    h += '<button type="button" class="chip up" data-act="fileUp" data-path="' + path + '">' + ico('upload', 14) + ' ' + t('f.upload') + '</button><button type="button" class="chip" data-act="fileAdd" data-path="' + path + '">' + ico('plus', 14) + ' ' + t('f.addLink') + '</button></div></div>';
    return h;
  }
  var type = x.type === 'num' ? 'number' : x.type === 'date' ? 'date' : 'text';
  var locked = x.lock && path.indexOf('d.') === 0 && S.drawer && S.drawer.orig && has(S.drawer.orig.d[x.id]) && !(S.drawer.unl || {})[x.id];
  var inp = '<input id="' + idA + '" type="' + type + '"' + (type === 'number' ? ' step="any" inputmode="decimal"' : '') + ' data-bind="' + path + '" value="' + esc(val || '') + '"' + (x.ph ? ' placeholder="' + esc(t(x.ph)) + '"' : '') + (x.check ? ' data-check="1"' : '') + (locked ? ' readonly class="locked"' : '') + (attrs || '') + '>';
  if (x.lock && path.indexOf('d.') === 0 && S.drawer && S.drawer.orig && has(S.drawer.orig.d[x.id])) inp = '<div class="unit lockw">' + inp + (locked ? '<button type="button" class="lockbtn" data-act="unlockf" data-id="' + x.id + '" title="' + LL('Поле защищено от случайного изменения. Нажмите, чтобы исправить', 'Protected from accidental edits. Click to correct') + '">' + ico('lock', 15) + '</button>' : '<span class="lockbtn open">' + ico('lock', 15) + '</span>') + '</div>';
  if (x.unit) inp = '<div class="unit">' + inp + '<em>' + t(x.unit) + '</em></div>';
  return '<div class="fld' + wide + '"><label for="' + idA + '">' + esc(lab) + '</label>' + inp + '</div>';
}
function cfAsField(c) {
  if (c.type === 'yn') return { id: c.id, label: c.label, type: 'seg', options: YN };
  if (c.type === 'sel') return { id: c.id, label: c.label, type: 'sel', options: String(c.opts || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean) };
  return { id: c.id, label: c.label, type: c.type };
}

/* ======================= Local file storage (IndexedDB) ======================= */
var FDB = null;
function fdb(cb) {
  if (FDB) return cb(FDB);
  try { var rq = indexedDB.open('crr-files', 1); rq.onupgradeneeded = function (e) { e.target.result.createObjectStore('f'); }; rq.onsuccess = function (e) { FDB = e.target.result; cb(FDB); }; rq.onerror = function () { toast(t('f.storeFail')); }; } catch (e) { toast(t('f.storeFail')); }
}
function filePut(file, cb) { fdb(function (db) { var id = uid('f'), tx = db.transaction('f', 'readwrite'); tx.objectStore('f').put(file, id); tx.oncomplete = function () { cb(id); }; tx.onerror = function () { toast(t('f.storeFail')); }; }); }
function fileGet(id, cb) { fdb(function (db) { var rq = db.transaction('f').objectStore('f').get(id); rq.onsuccess = function () { cb(rq.result); }; }); }
function fileDelBlob(id) { fdb(function (db) { db.transaction('f', 'readwrite').objectStore('f').delete(id); }); }
function fmtSize(n) { n = +n || 0; return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

/* ======================= Operative report ======================= */
function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
function uc(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
function joinRu(a) { a = a.filter(Boolean); if (a.length < 2) return a.join(''); return a.slice(0, -1).join(', ') + ' и ' + a[a.length - 1]; }
var EXTRACT_PH = {
  'Поперечная минилапаротомия в левой подвздошной области': 'через поперечный минилапаротомный разрез в левой подвздошной области',
  'Поперечная минилапаротомия в правой подвздошной области': 'через поперечный минилапаротомный разрез в правой подвздошной области',
  'Поперечная минилапаротомия над лоном (Пфанненштиль)': 'через разрез по Пфанненштилю',
  'Срединная минилапаротомия': 'через срединный минилапаротомный разрез',
  'Через место стомы': 'через место выведения стомы',
  'Через троакарную рану': 'через расширенную троакарную рану',
  'Трансанально': 'трансанально',
  'Трансвагинально': 'трансвагинально',
  'Через промежностную рану': 'через промежностную рану'
};
var SITE_PH = { 'Правая подвздошная область': 'в правой подвздошной области', 'Левая подвздошная область': 'в левой подвздошной области', 'Справа от пупка': 'справа от пупка', 'Слева от пупка': 'слева от пупка', 'Эпигастральная область': 'в эпигастральной области' };
function anName(d) {
  var p = d.proc;
  if (P_RIGHT.indexOf(p) >= 0) return 'илеотрансверзоанастомоз';
  if (P_TRANS.indexOf(p) >= 0 || P_LEFT.indexOf(p) >= 0) return 'колоколоанастомоз';
  if (p === 'Интерсфинктерная резекция прямой кишки') return 'колоанальный анастомоз';
  if (P_SIG.concat(P_AR).indexOf(p) >= 0 || p === 'Восстановление непрерывности после операции Гартмана') return 'колоректальный анастомоз';
  if (P_COLECT.indexOf(p) >= 0) return d.colRec && d.colRec !== 'Концевая илеостома' ? lc(d.colRec.replace(' (IPAA)', '')) : 'анастомоз';
  if (P_STCLOSE.indexOf(p) >= 0) return /илеостома/.test(d.clType || '') ? 'энтероэнтероанастомоз' : 'колоколоанастомоз';
  return 'анастомоз';
}
function specimen(d) {
  var p = d.proc, tum = d.loc || d.dxText ? ' с опухолью' : '';
  if (p === 'Илеоцекальная резекция') return 'илеоцекальный угол с терминальным отделом подвздошной кишки' + tum;
  if (p === 'Правосторонняя гемиколэктомия') return 'правая половина ободочной кишки с терминальным отделом подвздошной кишки' + tum;
  if (p === 'Расширенная правосторонняя гемиколэктомия') return 'правая половина ободочной кишки с проксимальной частью поперечной ободочной кишки и терминальным отделом подвздошной кишки' + tum;
  if (P_TRANS.indexOf(p) >= 0) return 'поперечная ободочная кишка' + tum;
  if (p === 'Резекция селезёночного изгиба') return 'селезёночный изгиб ободочной кишки' + tum;
  if (p === 'Левосторонняя гемиколэктомия') return 'левая половина ободочной кишки' + tum;
  if (P_SIG.indexOf(p) >= 0) return 'сигмовидная кишка' + tum;
  if (P_AR.indexOf(p) >= 0) return 'прямая кишка с мезоректумом и дистальной частью сигмовидной кишки' + tum;
  if (P_APR.indexOf(p) >= 0) return 'прямая кишка с анальным каналом и мезоректумом' + tum;
  if (P_HART.indexOf(p) >= 0) return 'резецированный участок кишки' + tum;
  if (P_TEO.indexOf(p) >= 0) return 'полностенный фрагмент стенки прямой кишки с образованием';
  if (P_COLECT.indexOf(p) >= 0) return 'ободочная кишка' + tum;
  if (P_EVISC.indexOf(p) >= 0) return 'органокомплекс малого таза с прямой кишкой' + (d.evOrg && d.evOrg.length ? ' (' + d.evOrg.map(lc).join(', ') + ')' : '');
  if (P_STCLOSE.indexOf(p) >= 0) return 'стомонесущий участок кишки';
  if (P_CRS.indexOf(p) >= 0) return 'удалённые участки брюшины и органы';
  return '';
}
function llndText(d) {
  var st = d.llSt || []; if (!st.length) return '';
  var names = {}; LN_ST.forEach(function (x) { names[x[0]] = x[1]; });
  var sides = { rt: 0, lt: 0 };
  var parts = st.map(function (c) { var m = c.split(' '); if (m[1]) sides[m[1]] = 1; return m[0] + (m[1] ? ' ' + m[1] : '') + ' (' + lc(names[m[0]] || '') + (m[1] ? (m[1] === 'rt' ? ', справа' : ', слева') : '') + ')'; });
  var side = sides.rt && sides.lt ? 'с двух сторон' : sides.rt ? 'справа' : sides.lt ? 'слева' : '';
  return 'Выполнена боковая лимфодиссекция' + (side ? ' ' + side : '') + ': удалены группы лимфоузлов ' + parts.join(', ') + '.';
}
function anSentence(d) {
  var a = d.anDet || [], tech = '', conf = '', form = '', rows = '';
  AN_GROUPS[0][1].forEach(function (v) { if (a.indexOf(v) >= 0) tech = v; });
  AN_GROUPS[1][1].forEach(function (v) { if (a.indexOf(v) >= 0) conf = v; });
  AN_GROUPS[2][1].forEach(function (v) { if (a.indexOf(v) >= 0) form = v; });
  AN_GROUPS[3][1].forEach(function (v) { if (a.indexOf(v) >= 0) rows = v; });
  var adj = tech === 'Ручной' ? 'ручной' : tech === 'Комбинированный' ? 'комбинированный' : tech ? 'аппаратный' : '';
  var s = 'Сформирован ' + [lc(rows), adj, anName(d)].filter(Boolean).join(' ');
  if (conf) s += /резервуар/.test(conf) ? ' с формированием ' + (conf === 'J-резервуар' ? 'J-образного резервуара' : 'колопластического резервуара') : ' по типу «' + lc(conf) + '»';
  if (tech === 'Аппаратный циркулярный') s += ' циркулярным сшивающим аппаратом' + (d.circSize ? ' №' + d.circSize : '');
  if (tech === 'Аппаратный линейный') s += ' линейным сшивающим аппаратом';
  if (form) s += ', ' + (form === 'Интракорпоральный' ? 'интракорпорально' : form === 'Экстракорпоральный' ? 'экстракорпорально' : 'трансанально');
  if (d.anHeight) s += ', на высоте ' + d.anHeight + ' см от анального края';
  s += '.';
  if (d.icg === 'Да') s += ' Перфузия кишки оценена с ICG, кровоснабжение адекватное.';
  if (d.leakTest === 'Отрицательная') s += ' Проба на герметичность отрицательная.';
  if (d.leakTest === 'Положительная, дополнительные швы') s += ' Проба на герметичность положительная, наложены дополнительные швы, повторная проба отрицательная.';
  if (d.taDrain === 'Да') s += ' Установлен трансанальный дренаж.';
  return s;
}
function refreshProto() {
  var ta = root.querySelector('#protoText'); if (!ta || !S.drawer) return;
  var gen = buildProtocol(S.drawer.p); if (!(S.drawer.protoEdit && S.drawer.protoEdit.base === gen)) ta.value = gen;
}
function revisionText(d) {
  var dev = (d.revDev || []).slice(), free = String(d.revision || '').trim(), rest = free;
  var KW = [[/цирроз|цирротич/i, 'Цирротически изменённая печень'], [/гепатоз|стеатоз/i, 'Жировой гепатоз'], [/метастаз|очагов/i, 'Очаговые образования (метастазы) в печени'], [/асцит|выпот/i, 'Выпот (асцит)'], [/желчнокамен|жкб|конкремент/i, 'Желчнокаменная болезнь'], [/выраженн\S* спаечн/i, 'Выраженный спаечный процесс'], [/спаечн|спайк/i, 'Спаечный процесс'], [/долихосигм/i, 'Долихосигма'], [/раздут|расширен\S* петл/i, 'Раздутые петли тонкой кишки'], [/канцероматоз|диссеминац|имплант/i, 'Канцероматоз брюшины'], [/грыж/i, 'Пупочная грыжа'], [/постлучев|фиброз/i, 'Постлучевые изменения в малом тазу'], [/прораст|инвазия в/i, 'Прорастание опухоли в соседние органы']];
  if (/^(стандарт\S*|норма\S*|без особенностей|обычн\S*|типичн\S*)\.?$/i.test(free)) rest = '';
  else if (free) {
    var matched = false;
    KW.forEach(function (k) { if (k[0].test(free)) { matched = true; if (dev.indexOf(k[1]) < 0 && !(k[1] === 'Спаечный процесс' && dev.indexOf('Выраженный спаечный процесс') >= 0)) dev.push(k[1]); } });
    if (matched && free.split(/[,;.]/).filter(function (x) { return x.trim(); }).every(function (part) { return KW.some(function (k) { return k[0].test(part); }) || /^\s*(и\s*)?(отмечается|имеется|есть)?\s*$/i.test(part); })) rest = '';
  }
  var hv = function (x) { return dev.indexOf(x) >= 0; }, out = [];
  out.push(hv('Выпот (асцит)') ? 'Отмечается выпот в брюшной полости.' : 'Выпота нет.');
  var liver = [];
  if (hv('Цирротически изменённая печень')) liver.push('отмечается цирротическое изменение печени');
  if (hv('Жировой гепатоз')) liver.push('печень с признаками жирового гепатоза');
  if (hv('Очаговые образования (метастазы) в печени')) liver.push('в печени определяются очаговые образования');
  out.push(liver.length ? uc(liver.join(', ')) + '.' : 'Печень не увеличена, обычного цвета, без очаговых образований.');
  out.push('Желудок не расширен, без особенностей. Селезёнка обычных размеров и цвета.');
  out.push(hv('Желчнокаменная болезнь') ? 'Отмечается желчнокаменная болезнь.' : 'Желчный пузырь не напряжён.');
  var bowel = [];
  if (hv('Долихосигма')) bowel.push('Отмечается долихосигма.');
  if (hv('Раздутые петли тонкой кишки')) bowel.push('Петли тонкой кишки умеренно раздуты.');
  out.push(bowel.length ? bowel.join(' ') : 'Тонкая и толстая кишка без видимой патологии.');
  out.push(hv('Выраженный спаечный процесс') ? 'Отмечается выраженный спаечный процесс, выполнен адгезиолизис.' : hv('Спаечный процесс') ? 'Отмечается спаечный процесс, выполнен адгезиолизис.' : 'Спаечного процесса не выявлено.');
  out.push(hv('Канцероматоз брюшины') ? 'Отмечается канцероматоз брюшины.' : 'Опухолевой диссеминации по брюшине не выявлено.');
  if (hv('Пупочная грыжа')) out.push('Выявлена пупочная грыжа.');
  if (hv('Постлучевые изменения в малом тазу')) out.push('В малом тазу выраженные постлучевые изменения.');
  if (hv('Прорастание опухоли в соседние органы')) out.push('Отмечается прорастание опухоли в соседние органы.');
  if (rest) out.push(uc(rest.replace(/\.\s*$/, '')) + '.');
  return 'При ревизии органов брюшной полости: ' + lc(out.join(' '));
}
function opTitle(d) {
  var p = d.proc || '', fem = /ая$/.test(p.split(' ')[0]) || /^(Резекция|Гемиколэктомия|Колэктомия|Колпроктэктомия)/.test(p), nm = lc(p);
  var ad = { 'Лапароскопический': fem ? 'Лапароскопическая' : 'Лапароскопическое', 'Робот-ассистированный': fem ? 'Робот-ассистированная' : 'Робот-ассистированное', 'Трансанальный (TaTME)': fem ? 'Лапароскопическая' : 'Лапароскопическое', 'Гибридный (лапароскопия + TaTME)': fem ? 'Лапароскопическая' : 'Лапароскопическое' }[d.access];
  var s = ad && P_TEO.indexOf(p) < 0 ? ad + ' ' + nm : uc(nm);
  if (/TaTME/.test(d.access || '')) s += ' с трансанальным этапом (TaTME)';
  var extra = [];
  if (d.anast === 'Да' && P_STCLOSE.indexOf(p) < 0) extra.push('с формированием ' + (anName(d) + ' ').replace(/ый /g, 'ого ').replace(/ий /g, 'его ').trim().replace(/анастомоз$/, 'анастомоза'));
  if (d.stoma && d.stoma !== 'Нет') extra.push((d.anast === 'Да' && /Петлевая/.test(d.stoma) ? 'превентивной ' : '') + lc(d.stoma).replace(/ая /g, 'ой ').replace(/ая$/, 'ой').replace(/стома$/, 'стомы'));
  if (d.llnd === 'Да') extra.push('боковой лимфодиссекцией');
  if (d.conv === 'Да') extra.push('конверсией');
  return s + (extra.length ? ', ' + extra.join(', ') : '');
}
function buildProtocol(p) {
  var d = p.d, L1 = [], body = [];
  if (!hasProc(d)) return '';
  L1.push('ПРОТОКОЛ ОПЕРАЦИИ');
  var ag = num(d.age), agw = ag === null ? '' : (ag % 10 === 1 && ag % 100 !== 11 ? 'год' : (ag % 10 >= 2 && ag % 10 <= 4 && (ag % 100 < 12 || ag % 100 > 14)) ? 'года' : 'лет');
  L1.push('Пациент: ' + (d.fio || p.id) + (ag !== null ? ', ' + d.age + ' ' + agw : '') + '. ID в регистре: ' + p.id + '.');
  L1.push('Дата операции: ' + (d.date ? fmtDate(d.date) : '[дата]') + (d.urg ? ', ' + lc(d.urg) + ' операция' : '') + (d.opTime ? '. Длительность: ' + d.opTime + ' мин' : '') + '.');
  var dxs = d.dxText || (d.loc ? 'Злокачественное новообразование, локализация: ' + lc(d.loc) + ([d.cT, d.cN, d.cM].filter(Boolean).length ? ', ' + [d.cT, d.cN, d.cM].filter(Boolean).join(' ') : '') + (d.stage ? ', стадия ' + d.stage : '') : '');
  if (dxs) L1.push('Диагноз: ' + dxs + (hasTac(d, NEO_T) ? '. Состояние после неоадъювантной терапии (' + (d.tactic || []).filter(function (x) { return NEO_T.indexOf(x) >= 0; }).map(tacShort).join(', ') + ')' : '') + '.');
  if (d.kind === 'Эндоскопическое') {
    L1.push('Вмешательство: эндоскопическое, ' + lc(d.endo) + '.');
    if (d.surgeon) L1.push('Оператор: ' + d.surgeon + (d.assist && d.assist.length ? '. Ассистенты: ' + d.assist.join(', ') : '') + '.');
    var e = [];
    if (['ESD', 'EMR', 'Полипэктомия'].indexOf(d.endo) >= 0) {
      e.push('Выполнена ' + (d.endo === 'ESD' ? 'эндоскопическая подслизистая диссекция (ESD)' : d.endo === 'EMR' ? 'эндоскопическая резекция слизистой (EMR)' : 'полипэктомия') + ' образования' + (d.paris ? ' типа ' + d.paris + ' по Парижской классификации' : '') + (d.lesSize ? ' размером ' + d.lesSize + ' мм' : '') + (d.enbloc === 'Да' ? ', единым блоком' : d.enbloc === 'Нет' ? ', фрагментарно' : '') + '.');
      e.push(d.endoCx && d.endoCx !== 'Нет' ? 'Осложнение: ' + lc(d.endoCx) + '.' : 'Осложнений не было.');
    }
    if (d.endo === 'Стентирование') e.push('Установлен саморасширяющийся стент' + (d.stentLen ? ' длиной ' + d.stentLen + ' мм' : '') + (d.stentInd ? ', цель: ' + lc(d.stentInd) : '') + '.' + (d.techOk === 'Да' ? ' Технический успех достигнут.' : ''));
    if (d.endo === 'Баллонная дилатация') e.push('Выполнена баллонная дилатация' + (d.strCause ? ' ' + lc(d.strCause).replace(/ая$/, 'ой') + ' стриктуры' : ' стриктуры') + (d.balloon ? ' баллоном ' + d.balloon + ' мм' : '') + (d.sessions ? ', сеанс ' + d.sessions : '') + '.');
    return L1.join('\n') + '\n\nХод вмешательства: ' + e.join(' ');
  }
  L1.push('Название операции: ' + opTitle(d) + '.');
  if (d.surgeon) L1.push('Хирург: ' + d.surgeon + (d.assist && d.assist.length ? '. Ассистенты: ' + d.assist.join(', ') : '') + '.');
  var mis = MIS.indexOf(d.access) >= 0, open = d.access === 'Открытый', pr = d.proc;
  body.push('Тайм-аут. После трёхкратной обработки операционного поля раствором повидон-йода, в условиях тотальной внутривенной анестезии с ИВЛ');
  if (P_STCLOSE.indexOf(pr) >= 0 && !mis) body[0] += ' произведён окаймляющий разрез вокруг ' + (d.clType ? lc(d.clType).replace(/ая /g, 'ой ').replace(/стома$/, 'стомы') : 'стомы') + ', стомонесущий участок кишки выделен в рану.';
  else if (P_TEO.indexOf(pr) >= 0) body[0] += ' в положении для трансанального доступа установлена платформа ' + (d.teoPlat || 'для трансанальной эндоскопической хирургии') + ', наложен карбоксиректум.';
  else if (mis) body[0] += (d.access === 'Робот-ассистированный' ? ' наложен карбоксиперитонеум, установлены порты, выполнен докинг роботической системы.' : ' произведён разрез около 1 см у пупка, наложен карбоксиперитонеум, введены троакар 10 мм и видеокамера, в типичных точках установлены дополнительные троакары.');
  else body[0] += ' выполнена ' + (d.incision ? lc(d.incision) : 'срединная лапаротомия') + '.';
  if (P_TEO.indexOf(pr) < 0 && P_STCLOSE.indexOf(pr) < 0) body.push(revisionText(d));
  if (d.conv === 'Да') body.push('В связи с ' + (d.convReason ? { 'Спаечный процесс': 'выраженным спаечным процессом', 'Местнораспространённая опухоль': 'местнораспространённым характером опухоли', 'Кровотечение': 'кровотечением', 'Ожирение, анатомия': 'ожирением и анатомическими особенностями', 'Повреждение органа': 'повреждением органа', 'Технические сложности': 'техническими сложностями', 'Другое': 'интраоперационной ситуацией' }[d.convReason] : 'интраоперационной ситуацией') + ' выполнена конверсия, ' + (d.incision ? lc(d.incision) : 'срединная лапаротомия') + '.');
  if (P_RIGHT.indexOf(pr) >= 0 || P_TRANS.indexOf(pr) >= 0) {
    var r = 'Выполнена медиально-латеральная мобилизация ' + (P_TRANS.indexOf(pr) >= 0 ? 'поперечной ободочной кишки' : 'правой половины ободочной кишки') + (d.cme === 'Да' ? ' в слое полной мезоколонэктомии (CME)' : '') + '.';
    if (d.ligIC) r += ' Подвздошно-ободочные артерия и вена ' + (d.ligIC === 'Центральная перевязка (у ВБВ)' ? 'клипированы и пересечены у верхней брыжеечной вены' : 'клипированы и пересечены') + '.';
    if (d.ligRC && d.ligRC !== 'Отсутствуют') r += ' Правые ободочные сосуды ' + (d.ligRC === 'Центральная перевязка' ? 'пересечены у основания' : 'пересечены') + '.';
    if (d.ligMC) r += { 'Сохранены': ' Средние ободочные сосуды сохранены.', 'Пересечена правая ветвь': ' Правая ветвь средних ободочных сосудов клипирована и пересечена.', 'Перевязка у основания': ' Средние ободочные сосуды клипированы и пересечены у основания.', 'Пересечена левая ветвь': ' Левая ветвь средних ободочных сосудов клипирована и пересечена.' }[d.ligMC] || '';
    if (d.henle && d.henle !== 'Не выделялся') r += ' Гастроколический ствол Генле выделен, ' + lc(d.henle.replace('Выделен, ', '')) + '.';
    if (d.flex && d.flex.length) r += ' Мобилизованы ' + joinRu(d.flex.map(lc)) + '.';
    if (d.omentum === 'Да') r += ' Выполнена резекция большого сальника.';
    if (d.lnd) r += ' Лимфодиссекция ' + d.lnd + '.';
    body.push(r);
  }
  if (P_LEFT.indexOf(pr) >= 0) {
    var l = 'Выполнена медиально-латеральная мобилизация левых отделов ободочной кишки' + (d.cme === 'Да' ? ' в слое полной мезоколонэктомии (CME)' : '') + '.';
    if (d.ligLC) l += d.ligLC === 'Сохранена' ? ' Левая ободочная артерия сохранена.' : ' Левая ободочная артерия клипирована и пересечена у основания.';
    if (d.ligMCl) l += d.ligMCl === 'Сохранена' ? ' Левая ветвь средней ободочной артерии сохранена.' : ' Левая ветвь средней ободочной артерии клипирована и пересечена.';
    if (d.lnd) l += ' Лимфодиссекция ' + d.lnd + '.';
    body.push(l);
  }
  if (P_SIG.concat(P_AR, P_APR, P_HART).indexOf(pr) >= 0) {
    var s = 'Начата медиально-латеральная мобилизация сигмовидной и нисходящей ободочной кишки.';
    if (d.ima) s += { 'Высокая (у аорты)': ' Нижняя брыжеечная артерия клипирована и пересечена у основания.', 'Низкая (ниже отхождения левой ободочной)': ' Нижняя брыжеечная артерия пересечена ниже отхождения левой ободочной артерии, левая ободочная артерия сохранена.', 'Сохранена, пересечены сигмовидные ветви': ' Нижняя брыжеечная артерия сохранена, клипированы и пересечены сигмовидные артерии.' }[d.ima];
    if (d.imv) s += { 'У нижнего края поджелудочной железы': ' Нижняя брыжеечная вена клипирована и пересечена у нижнего края поджелудочной железы.', 'На уровне НБА': ' Нижняя брыжеечная вена клипирована и пересечена на уровне нижней брыжеечной артерии.', 'Сохранена': ' Нижняя брыжеечная вена сохранена.' }[d.imv];
    if (d.lnd) s += ' Лимфодиссекция ' + d.lnd + '.';
    if (d.sfm) s += d.sfm === 'Нет' ? ' Выполнена латеральная мобилизация по линии Тольда без мобилизации селезёночного изгиба.' : ' Выполнена латеральная мобилизация по линии Тольда с ' + (d.sfm === 'Полная' ? 'полной' : 'частичной') + ' мобилизацией селезёночного изгиба.';
    body.push(s);
  }
  if (P_AR.concat(P_APR, P_HART, P_EVISC).indexOf(pr) >= 0 && (d.mre || d.nerve)) {
    var rr = 'Прямая кишка мобилизована в плоскости мезоректальной фасции' + (d.mre === 'Тотальная (ТМЭ)' ? ', выполнена тотальная мезоректумэктомия до уровня мышц, поднимающих задний проход' : d.mre === 'Частичная (ПМЭ)' ? ', выполнена частичная мезоректумэктомия' : '') + '.';
    if (d.nerve) rr += { 'Полное': ' Вегетативные нервы таза сохранены.', 'Частичное': ' Вегетативные нервы таза сохранены частично.', 'Не сохранены': ' Вегетативные нервы таза сохранить не удалось.' }[d.nerve];
    if (d.isrType) rr += ' Трансанально выполнена ' + lc(d.isrType).replace(/ая$/, 'ая') + ' интерсфинктерная резекция.';
    body.push(rr);
  }
  if (d.llnd === 'Да') body.push(llndText(d) || 'Выполнена боковая лимфодиссекция.');
  if (P_EVISC.indexOf(pr) >= 0) body.push('Выполнена ' + (d.evType ? lc(d.evType) + ' ' : '') + 'тазовая эвисцерация' + (d.evOrg && d.evOrg.length ? ' с удалением: ' + d.evOrg.map(lc).join(', ') : '') + '.' + (d.urRec && d.urRec !== 'Нет' ? ' Реконструкция мочевых путей: ' + lc(d.urRec) + '.' : ''));
  if (P_COLECT.indexOf(pr) >= 0) body.push('Выполнена ' + lc(pr) + (d.colInd ? ' по поводу: ' + lc(d.colInd) : '') + '.');
  if (P_TEO.indexOf(pr) >= 0) body.push('На расстоянии' + (d.teoDist ? ' ' + d.teoDist + ' см' : '') + ' от анального края выполнено ' + (d.teoDepth === 'Подслизистое' ? 'подслизистое' : 'полностенное') + ' иссечение образования' + (d.lesSize ? ' размером ' + d.lesSize + ' мм' : '') + (d.enbloc === 'Да' ? ' единым блоком' : '') + '.' + (d.periEntry === 'Да' ? ' При иссечении вскрыта брюшная полость, дефект ушит.' : '') + (d.defClose === 'Да' ? ' Дефект стенки ушит.' : d.defClose === 'Нет' ? ' Дефект стенки оставлен открытым.' : ''));
  if (P_SIG.concat(P_AR).indexOf(pr) >= 0 && (d.dMargin || d.pMargin)) body.push((d.dMargin ? 'Дистально кишка прошита и пересечена сшивающим аппаратом на расстоянии ' + d.dMargin + ' см от нижнего края опухоли.' : '') + (d.pMargin ? ' Проксимально кишка пересечена на расстоянии ' + d.pMargin + ' см от опухоли.' : ''));
  else if ((d.pMargin || d.dMargin) && P_RIGHT.concat(P_TRANS, P_LEFT, P_HART).indexOf(pr) >= 0) body.push('Кишка пересечена' + (d.pMargin ? ' в ' + d.pMargin + ' см проксимальнее' : '') + (d.pMargin && d.dMargin ? ' и' : '') + (d.dMargin ? ' в ' + d.dMargin + ' см дистальнее' : '') + ' опухоли.');
  if (d.extract && mis) body.push('Препарат извлечён ' + (EXTRACT_PH[d.extract] || lc(d.extract)) + (d.extractLen ? ' длиной ' + d.extractLen + ' см' : '') + '.');
  if (P_APR.indexOf(pr) >= 0) body.push('Промежностный этап' + (d.aprPos === 'На животе (jack-knife)' ? ' в положении на животе (jack-knife)' : '') + ': окаймляющий разрез вокруг ануса, выполнена ' + (d.aprType && d.aprType !== 'Стандартная' ? lc(d.aprType) + ' ' : '') + 'экстирпация, препарат удалён через промежностную рану. Промежностная рана ' + (d.perClose && d.perClose !== 'Первичный шов' ? 'закрыта: ' + lc(d.perClose) : 'ушита послойно') + '.');
  if (P_HART.indexOf(pr) >= 0) body.push('Культя прямой кишки ушита' + (d.stumpLen ? ' на уровне ' + d.stumpLen + ' см от анального края' : '') + '.' + (d.hartInd ? ' Показание к операции Гартмана: ' + lc(d.hartInd) + '.' : ''));
  if (P_STFORM.indexOf(pr) >= 0 && d.stInd) body.push('Показание: ' + lc(d.stInd) + '.');
  if (d.anast === 'Да') body.push(anSentence(d));
  if (P_STCLOSE.indexOf(pr) >= 0 && d.clWeeks) body.push('Срок после формирования стомы: ' + d.clWeeks + ' нед.');
  if (P_CRS.indexOf(pr) >= 0) body.push('Перитонеальный индекс PCI ' + (d.pci || '[ ]') + '. Достигнута циторедукция ' + (d.cc || '[ ]') + '.' + (d.ipc && d.ipc !== 'Нет' ? ' Выполнена ' + d.ipc + (d.ipcDrug ? ' с препаратом ' + d.ipcDrug : '') + '.' : ''));
  if (d.stoma && d.stoma !== 'Нет') body.push('Сформирована ' + (d.anast === 'Да' && /Петлевая/.test(d.stoma) ? 'превентивная ' : '') + lc(d.stoma) + (d.stomaSite ? ' ' + SITE_PH[d.stomaSite] : '') + '.');
  var ic = d.intraCx || [];
  body.push(ic.length ? 'Интраоперационно: ' + ic.map(lc).join(', ') + '.' + (d.intraNote ? ' ' + d.intraNote.replace(/\.\s*$/, '') + '.' : '') : 'Интраоперационных осложнений не было.');
  body.push('Контроль гемостаза: сухо.');
  var dr = d.drain || [];
  if (dr.length) body.push(dr.indexOf('Не дренировалось') >= 0 ? 'Брюшная полость не дренировалась.' : 'Установлены дренажи: ' + dr.map(lc).join(', ') + '.');
  if (P_STCLOSE.indexOf(pr) >= 0) body.push('Рана ушита послойно' + (d.clMesh === 'Да' ? ' с установкой профилактической сетки' : '') + (d.skin ? ', кожа: ' + lc(d.skin) : '') + '. Асептическая повязка.');
  else if (P_TEO.indexOf(pr) >= 0) body.push('Платформа удалена.');
  else if (mis && d.conv !== 'Да') body.push('Троакары удалены под контролем видеокамеры' + (d.extract && /разрез|минилапаротом|Пфанненштил|троакар/i.test(d.extract) ? ', минилапаротомная рана ушита послойно' : '') + '. Швы на кожу. Асептические повязки.');
  else body.push('Лапаротомная рана ушита послойно. Швы на кожу. Асептическая повязка.');
  if (d.stoma && d.stoma !== 'Нет') body.push('Установлен калоприёмник.');
  var tail = [];
  tail.push('Объём кровопотери: ' + (d.ebl ? d.ebl + ' мл' : '[ ] мл') + '.');
  tail.push('Осложнения: ' + (ic.length ? ic.map(lc).join(', ') : 'без осложнений') + '.');
  var sp = specimen(d), sps = [];
  if (sp) sps.push('1. ' + uc(sp) + '.');
  if (d.llnd === 'Да' && (d.llSt || []).length) sps.push((sps.length + 1) + '. Лимфоузлы боковых групп: ' + d.llSt.join(', ') + '.');
  if (sps.length) tail.push('Макропрепарат: ' + sps.join(' ') + ' Направлен на гистологическое исследование.');
  return L1.join('\n') + '\n\nХод операции: ' + body.join(' ') + '\n\n' + tail.join('\n');
}

/* ======================= Patient card ======================= */
function draftIn(dr, reg) { if (reg.parent) { var par = regOf(reg.parent); if (par && !draftIn(dr, par)) return false; } return reg.mode === 'manual' ? !!dr.members[reg.id] : inReg({ id: dr.p.id, d: dr.p.d }, Object.assign({}, reg, { parent: null })); }
function renderPatient() {
  var dr = S.drawer, p = dr.p, d = p.d;
  var tags = tagsOf(DB.registries.filter(function (r) { return draftIn(dr, r); }));
  var h = '<div class="dim" data-act="close"></div><section class="drawer wide-drawer' + (dr.full ? ' full' : '') + '" role="dialog" aria-modal="true" aria-label="' + t('pc.title') + '">';
  h += '<div class="dhead"><span class="av xl">' + esc(d.fio ? initials(d.fio) : '+') + '</span><div class="dh-main"><div class="dh-kicker">' + (dr.isNew ? t('pc.new') : LL('Карточка пациента', 'Patient record')) + (d.ib ? ' · ИБ ' + esc(d.ib) : '') + '</div><div class="dh-title">' + esc(d.fio || (dr.isNew ? t('pc.new') : p.id)) + '</div>';
  h += '<div class="dh-sub"><span class="mono">' + p.id + '</span>' + [ [ov(d.sex), d.age ? d.age + ' ' + t('u.years') : ''].filter(Boolean).join(', '), ov(d.loc) ].filter(Boolean).map(function (s) { return ' · ' + esc(s); }).join('') + '</div>';
  h += '<div class="facts">' + [[t('col.stage'), d.stage], [t('col.approach'), (d.tactic || []).map(function (v) { return ov(tacShort(v)); }).join(' → ')], [t('col.proc'), ov(d.proc || d.endo)], [t('col.phase'), ov(d.phase)], [LL('Дата операции', 'Surgery date'), fmtDate(d.date)]].filter(function (x) { return x[1]; }).map(function (x) { return '<span class="fact"><em>' + esc(x[0]) + '</em>' + esc(x[1]) + '</span>'; }).join('') + '</div></div>';
  h += '<div class="dh-r">' + (p.notion ? '<a class="btn small" href="' + esc(p.notion) + '" target="_blank" rel="noopener">' + ico('ext', 15) + 'Notion</a>' : '') + '<button type="button" class="btn small ai' + (UI.aip ? ' on' : '') + '" data-act="aitoggle">' + ico('sparkle', 14) + LL('Ассистент', 'Assistant') + '</button>' + '<button type="button" class="iconbtn" aria-label="' + t(dr.full ? 'a11y.shrink' : 'a11y.expandCard') + '" title="' + t(dr.full ? 'a11y.shrink' : 'a11y.expandCard') + '" data-act="full">' + ico(dr.full ? 'shrink' : 'expand', 18) + '</button><button type="button" class="iconbtn" aria-label="' + t('a11y.close') + '" data-act="close">' + ico('x', 20) + '</button></div></div>';
  var nav = [['', [{ id: 'links', title: t('lk.title') }]]];
  PHASES.forEach(function (ph) {
    var ss = SECTIONS.filter(function (s) { return s.phase === ph[0] && secOn(s, d); }).map(function (s) { return { id: s.id, title: L(s.title) }; });
    if (ph[0] === 'post') ss.push({ id: 'fu', title: t('pc.followup') });
    nav.push([ph[0], ss]);
  });
  var protoOn = hasProc(d);
  nav[nav.length - 1][1].push({ id: 'q', title: LL('Анкеты', 'Questionnaires') });
  nav.push(['more', [{ id: 'media', title: t('pc.media') }, { id: 'tags', title: t('pc.tags') }].concat(protoOn ? [{ id: 'proto', title: t('pr.title') }] : []).concat([{ id: 'cmt', title: LL('Комментарии', 'Comments') }, { id: 'hist', title: LL('История изменений', 'Change history') }])]);
  h += '<div class="pbody"><nav class="pnav" aria-label="' + t('a11y.cardSections') + '">' + nav.map(function (g) {
    var ph = PHASES.filter(function (x) { return x[0] === g[0]; })[0];
    return (ph ? '<div class="pn-h ph-' + g[0] + '"><span class="pn-n">' + (PHASES.indexOf(ph) + 1) + '</span>' + t(ph[1]) + '</div>' : g[0] === 'more' ? '<div class="pn-h">' + t('ph.more') + '</div>' : '') + g[1].map(function (s) { return '<button type="button" data-act="jump" data-id="' + s.id + '">' + esc(s.title) + '</button>'; }).join('');
  }).join('') + '</nav><div class="dbody">';
  if (isStudent()) h += '<div class="lockbox">' + ico('lock', 15) + LL('Режим студента: данные обезличены, изменения не сохраняются.', 'Student mode: anonymised, changes are not saved.') + '</div>';
  if (dr.errs) h += '<div class="errbox"><b>' + ico('alert', 16) + LL('Карточку нельзя сохранить', 'Cannot save the record') + '</b><ul>' + dr.errs.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
  var enr = Object.keys(p.enroll || {}).map(function (sid) { var r = regOf(sid); return r ? { r: r, e: p.enroll[sid] } : null; }).filter(Boolean);
  if (enr.length) h += '<section class="card enrc"><h3>' + ico('flask', 18) + LL('Участие в исследованиях', 'Study participation') + '</h3>' + enr.map(function (x) { var pr = stProto(x.r), ai = (pr.rand.arms || []).map(function (a) { return a.name; }).indexOf(x.e.arm); return '<div class="enr-row"><div><b>' + esc(regName(x.r)) + '</b><span class="mono">' + esc(x.e.no) + '</span></div><span class="muted">' + LL('включён ', 'enrolled ') + fmtDate(x.e.date) + '</span>' + (x.e.arm ? '<span class="armtag a' + (ai % 6) + '">' + esc(x.e.arm) + '</span>' : pr.rand.on === 'Да' ? '<button type="button" class="btn small" data-act="rand" data-sid="' + x.r.id + '" data-pid="' + p.id + '">' + ico('shuffle', 14) + LL('Рандомизировать', 'Randomise') + '</button>' : '') + (x.e.arm ? '' : '<button type="button" class="btn small ghost" data-act="unenroll" data-sid="' + x.r.id + '" data-pid="' + p.id + '">' + LL('Исключить', 'Remove') + '</button>') + '</div>'; }).join('') + '</section>';
  h += '<section class="card" id="sec-links"><h3>' + t('lk.title') + '</h3>' + (dr.isNew ? '<p class="hint">' + t(dr.linkRec ? 'lk.willLink' : 'lk.saveFirst') + '</p>' : '<p class="hint">' + t('lk.hint') + '</p>' + linkedBlock(p.id, true)) + '</section>';
  var mods = MODULES.filter(function (m) { return !m.last; }).concat(MODULES.filter(function (m) { return m.last; }));
  PHASES.forEach(function (ph, pi) {
    var ss = SECTIONS.filter(function (s) { return s.phase === ph[0] && secOn(s, d); });
    if (!ss.length && ph[0] !== 'post') return;
    h += '<div class="phase ph-' + ph[0] + '"><span class="ph-n">' + (pi + 1) + '</span><div><b>' + t(ph[1]) + '</b><span>' + t(ph[2]) + '</span></div></div>';
    ss.forEach(function (s) {
      h += '<section class="card ph-' + ph[0] + '" id="sec-' + s.id + '"><h3>' + esc(L(s.title)) + '</h3><div class="fgrid">' + s.fields.map(function (x) { return fieldHTML(x, d[x.id], 'd.' + x.id, d); }).join('') + '</div>';
      mods.forEach(function (m) {
        if (m.sec !== s.id || !m.when(d)) return;
        h += '<div class="mod"><h4>' + esc(L(m.title)) + '<span class="why">' + t('pc.shownBecause') + ' ' + esc(L(m.why)) + '</span></h4><div class="fgrid">' + m.fields.map(function (x) { return fieldHTML(x, d[x.id], 'd.' + x.id, d); }).join('') + '</div></div>';
      });
      h += '</section>';
    });
    if (ph[0] === 'post') {
      var fl = fuList(p);
      h += '<section class="card ph-post" id="sec-fu"><h3>' + t('pc.followup') + '</h3>';
      if (!fl.length) h += '<p class="hint">' + t('pc.fuHint') + '</p>';
      fl.forEach(function (x) {
        var st = x.st === 'done' ? '<span class="tag ok">' + t('fu.done') + '</span>' : x.st === 'overdue' ? '<span class="tag due">' + t('fu.overdue') + '</span>' : x.st === 'soon' ? '<span class="tag">' + t('fu.soon') + '</span>' : '<span class="muted">' + t('fu.planned') + '</span>';
        h += '<div class="furow"><label class="chk"><input type="checkbox" data-bind="fu.' + x.key + '"' + (p.fu[x.key] ? ' checked' : '') + '>' + esc(x.label) + ', ' + t('fu.until') + ' ' + fmtDate(x.due) + '</label>' + st + '</div>';
      });
      h += '</section>';
      h += qCard(p, dr.isNew);
    }
  });
  h += '<div class="phase ph-more"><span class="ph-n">' + ico('folder', 15) + '</span><div><b>' + t('ph.more') + '</b><span>' + t('ph.moreSub') + '</span></div></div>';
  DB.registries.forEach(function (r) {
    if (!r.custom.length || !draftIn(dr, r)) return;
    var vals = p.custom[r.id] || {};
    h += '<section class="card"><h3>' + t('pc.regFields', { n: esc(regName(r)) }) + '</h3><div class="fgrid">' + r.custom.map(function (c) { return fieldHTML(cfAsField(c), vals[c.id], 'c.' + r.id + '.' + c.id, d); }).join('') + '</div></section>';
  });
  h += '<section class="card" id="sec-media"><h3>' + t('pc.media') + '</h3><div class="fgrid">' + MEDIA.map(function (x) { return fieldHTML(x, d[x.id], 'd.' + x.id, d); }).join('') + '</div>';
  h += '</section><section class="card" id="sec-tags"><h3>' + t('pc.tags') + '</h3><div class="tagline">' + (tags.length ? tags.map(function (r) { return '<span class="tag">' + esc(regName(r)) + '</span>'; }).join('') : '<span class="muted">' + t('pc.noTags') + '</span>') + '</div>';
  var manual = DB.registries.filter(function (r) { return r.mode === 'manual'; });
  if (manual.length) { h += '<p class="hint">' + t('pc.manualTags') + '</p>'; manual.forEach(function (r) { h += '<label class="chk"><input type="checkbox" data-bind="m.' + r.id + '"' + (dr.members[r.id] ? ' checked' : '') + '>' + esc(regName(r)) + '</label>'; }); }
  h += '</section>';
  if (protoOn) {
    var gen = buildProtocol(p), pe = dr.protoEdit && dr.protoEdit.base === gen ? dr.protoEdit.text : gen;
    h += '<section class="card proto" id="sec-proto"><h3>' + t('pr.title') + '<span class="h3-r"><button type="button" class="btn small ai" data-act="aiproto"' + (dr.protoAI ? ' disabled' : '') + '>' + ico('sparkle', 15) + (dr.protoAI ? LL('Пишу…', 'Writing…') : LL('Написать с ИИ', 'Write with AI')) + '</button><button type="button" class="btn small primary" data-act="copyproto">' + ico('file', 15) + t('pr.copy') + '</button></span></h3><p class="hint">' + LL('ИИ пишет протокол в стиле отделения по 29 образцам ваших протоколов и по данным операции; места, которые нужно уточнить, отмечает [уточнить]. Без ИИ текст собирается шаблоном. Текст можно править перед копированием.', 'AI writes the report in the unit style from 29 sample reports and the operation data, marking [уточнить] where details are needed. Without AI, a template assembles the text.') + '</p><textarea id="protoText" class="protoText" data-proto="1" spellcheck="false">' + esc(pe) + '</textarea></section>';
  }
  h += commentsCard(p.comments, 'p') + historyCard(p.log);
  h += '</div></div>';
  h += '<div class="dfoot"><div>' + (dr.isNew ? '' : '<button type="button" class="btn danger" data-act="delp">' + t('b.delete') + '</button>') + '</div><div class="actions"><button type="button" class="btn" data-act="close">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="savep">' + t('b.save') + '</button></div></div></section>';
  return h;
}

/* ======================= Collections ======================= */
function colView(k) { var c = COLS[k]; var v = UI.colView[k]; return c.views.indexOf(v) >= 0 ? v : c.views[0]; }
function recTitle(c, r) { return r[c.titleField] || t('rec.untitled'); }
function renderCol(k) {
  var c = COLS[k], v = colView(k);
  var h = '<div class="head"><div><div class="kicker">' + (['planner', 'mdt', 'mm'].indexOf(k) >= 0 ? t('side.work') : t('side.research')) + '</div><h1>' + esc(L(c.title)) + '</h1><p class="sub">' + esc(L(c.sub)) + '</p></div><div class="actions">';
  if (c.views.length > 1) h += '<div class="seg views" role="group" aria-label="' + t('a11y.view') + '">' + c.views.map(function (x) { return '<button type="button" class="' + (x === v ? 'on' : '') + '" aria-pressed="' + (x === v) + '" data-act="cview" data-k="' + k + '" data-v="' + x + '">' + t('view.' + x) + '</button>'; }).join('') + '</div>';
  h += '<input class="search" type="search" data-act="search" placeholder="' + t('col.search') + '" aria-label="' + t('col.search') + '" value="' + esc(S.q) + '">';
  if (k === 'goals' || k === 'redcap') h += '<button type="button" class="btn" data-act="newstudy">' + ico('flask', 16) + t('nav.newStudy') + '</button>';
  if (k === 'pubs') h += '<button type="button" class="btn" data-act="orcid">' + ico('user', 16) + LL('Из ORCID', 'From ORCID') + '</button>';
  h += '<button type="button" class="btn" data-act="cxopen" data-k="' + k + '">' + ico('download', 16) + (k === 'pubs' ? LL('Отчёт за период', 'Report for period') : 'Excel') + '</button>';
  h += '<button type="button" class="btn primary" data-act="newrec" data-k="' + k + '">' + ico('plus', 16) + t('b.add') + '</button></div></div>';
  var list = DB.cols[k].slice();
  var q = S.q.trim().toLowerCase();
  if (q) list = list.filter(function (r) { return c.fields.some(function (x) { var val = r[x.id]; return val && String(Array.isArray(val) ? val.join(' ') : val).toLowerCase().indexOf(q) >= 0; }); });
  if (v === 'cal') h += renderCal(k, list);
  else if (v === 'board') h += renderBoard(k, list);
  else h += renderTable(k, list);
  return h;
}
function cellVal(x, val) {
  if (!has(val)) return '';
  if (x.type === 'date') return fmtDate(val);
  if (x.type === 'multi') return val.map(function (v) { return '<span class="tag">' + esc(ov(v)) + '</span>'; }).join('');
  if (x.type === 'files') return '<span class="fcount">' + ico('clip', 14) + val.length + '</span>';
  if (x.type === 'sel' || x.type === 'seg') return esc(ov(val));
  var s = String(val); return esc(s.length > 90 ? s.slice(0, 90) + '…' : s);
}
function renderTable(k, list) {
  var c = COLS[k], s = S.sort[k] || { k: c.dateField || c.titleField, d: -1 };
  list.sort(function (a, b) { var av = a[s.k], bv = b[s.k]; if (!has(av)) return 1; if (!has(bv)) return -1; return String(av).localeCompare(String(bv), locale(), { numeric: true }) * s.d; });
  var h = '<div class="tablewrap">';
  if (!list.length) return h + '<div class="empty">' + t('col.empty') + '</div></div>';
  h += '<table class="grid"><thead><tr>' + c.list.map(function (id) { return thSort(k, id, L(c.F[id].label)); }).join('') + '</tr></thead><tbody>';
  var td = isoOf(new Date());
  list.forEach(function (r) {
    var cls = '';
    if (k === 'redcap' && r.done !== 'Заполнено' && r.contact) cls = r.contact < td ? ' row-due' : '';
    if (r.alert) cls = ' row-alert';
    h += '<tr class="' + cls + '" data-act="openrec" data-k="' + k + '" data-id="' + r.id + '" tabindex="0">' + c.list.map(function (id) {
      var x = c.F[id], val = r[id], out = cellVal(x, val);
      if (id === c.statusField && has(val)) out = '<span class="st st-' + ((c.colorBy || {})[val] || 'plan') + '">' + esc(ov(val)) + '</span>';
      return '<td' + (id === c.titleField ? ' class="strong"' : '') + '>' + out + '</td>';
    }).join('') + '</tr>';
  });
  return h + '</tbody></table></div>';
}
function renderBoard(k, list) {
  var c = COLS[k], opts = c.F[c.statusField].options.concat(['']);
  var h = '<div class="board">';
  opts.forEach(function (o) {
    var items = list.filter(function (r) { return (r[c.statusField] || '') === o; });
    if (k === 'planner' && o === 'В отделении') { var tdb = isoOf(new Date()); items = items.filter(function (r) { return !r.date || r.date <= tdb; }); }
    if (!o && !items.length) return;
    h += '<section class="bcol" data-drop="status" data-k="' + k + '" data-v="' + esc(o) + '"><h3><span class="st st-' + ((c.colorBy || {})[o] || 'plan') + '">' + esc(o ? ov(o) : t('board.none')) + '</span><span class="cnt">' + items.length + '</span></h3><div class="bcards">';
    items.slice(0, 200).forEach(function (r) {
      h += '<button type="button" class="bcard" draggable="true" data-drag="' + r.id + '" data-act="openrec" data-k="' + k + '" data-id="' + r.id + '"><b>' + esc(recTitle(c, r)) + '</b>' + (r[c.subField] ? '<span>' + esc(String(r[c.subField]).slice(0, 80)) + '</span>' : '') + (c.dateField && r[c.dateField] ? '<em>' + fmtDate(r[c.dateField]) + '</em>' : '') + '</button>';
    });
    if (items.length > 200) h += '<p class="muted">' + t('board.more', { n: items.length - 200 }) + '</p>';
    h += '</div></section>';
  });
  return h + '</div>';
}
function renderCal(k, list) {
  var c = COLS[k], cur = UI.cal[k] || isoOf(new Date()).slice(0, 7);
  var y = +cur.slice(0, 4), m = +cur.slice(5, 7) - 1;
  var first = new Date(y, m, 1), start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
  var byDate = {}; var undated = [];
  list.forEach(function (r) { var d = r[c.dateField]; if (d) (byDate[d.slice(0, 10)] = byDate[d.slice(0, 10)] || []).push(r); else undated.push(r); });
  var td = isoOf(new Date());
  var h = '<div class="cal"><div class="calbar"><button type="button" class="iconbtn" data-act="calnav" data-k="' + k + '" data-d="-1" aria-label="' + t('cal.prev') + '">' + ico('left') + '</button><h2>' + esc(monthName(y, m)) + '</h2><button type="button" class="iconbtn" data-act="calnav" data-k="' + k + '" data-d="1" aria-label="' + t('cal.next') + '">' + ico('right') + '</button><button type="button" class="btn small" data-act="caltoday" data-k="' + k + '">' + t('cal.today') + '</button><span class="hint">' + t('cal.hint') + '</span></div>';
  h += '<div class="calgrid" role="grid"><div class="calrow calhead" role="row">' + wdNames().map(function (w) { return '<div role="columnheader">' + esc(w) + '</div>'; }).join('') + '</div>';
  var d = new Date(start);
  for (var w = 0; w < 6; w++) {
    if (w === 5 && d.getMonth() !== m) break;
    h += '<div class="calrow" role="row">';
    for (var i = 0; i < 7; i++) {
      var iso = isoOf(d), items = byDate[iso] || [], other = d.getMonth() !== m, exp = S.expand === k + iso;
      h += '<div class="day' + (other ? ' other' : '') + (iso === td ? ' today' : '') + '" role="gridcell" data-drop="date" data-k="' + k + '" data-v="' + iso + '">';
      h += '<div class="dtop"><span class="dn">' + d.getDate() + '</span><button type="button" class="addday" data-act="inline" data-k="' + k + '" data-d="' + iso + '" aria-label="' + t('cal.addOn', { d: fmtDate(iso) }) + '">' + ico('plus', 14) + '</button></div>';
      var shown = exp ? items : items.slice(0, 4);
      shown.forEach(function (r) {
        var st = (c.colorBy || {})[r[c.statusField]] || 'plan';
        h += '<button type="button" class="ev ev-' + st + (r.alert ? ' ev-alert' : '') + '" draggable="true" data-drag="' + r.id + '" data-act="openrec" data-k="' + k + '" data-id="' + r.id + '" title="' + esc(recTitle(c, r) + (r[c.subField] ? ' · ' + r[c.subField] : '')) + '"><b>' + esc(recTitle(c, r)) + '</b>' + (r[c.subField] ? ' <span>' + esc(r[c.subField]) + '</span>' : '') + '</button>';
      });
      if (items.length > 4 && !exp) h += '<button type="button" class="moreev" data-act="expand" data-id="' + k + iso + '">' + t('cal.more', { n: items.length - 4 }) + '</button>';
      if (S.inline && S.inline.k === k && S.inline.d === iso) h += '<div class="inline"><input type="text" data-inline="1" data-autofocus placeholder="' + t('cal.inlinePh.' + k) + '" aria-label="' + t('cal.inlinePh.' + k) + '"><span>' + t('cal.inlineHint') + '</span></div>';
      h += '</div>';
      d.setDate(d.getDate() + 1);
    }
    h += '</div>';
  }
  h += '</div>';
  var uin = S.inline && S.inline.k === k && S.inline.d === '';
  h += '<div class="undated" data-drop="date" data-k="' + k + '" data-v=""><div class="uhead"><h3>' + t('cal.undated') + ' <span class="cnt">' + undated.length + '</span></h3><button type="button" class="btn small" data-act="inline" data-k="' + k + '" data-d="">' + ico('plus', 14) + t('cal.undatedAdd') + '</button></div><p class="hint">' + t('cal.undatedHint') + '</p><div class="uchips">' + undated.map(function (r) { return '<button type="button" class="ev ev-plan" draggable="true" data-drag="' + r.id + '" data-act="openrec" data-k="' + k + '" data-id="' + r.id + '"><b>' + esc(recTitle(c, r)) + '</b>' + (r[c.subField] ? ' <span>' + esc(r[c.subField]) + '</span>' : '') + '</button>'; }).join('') + '</div>' + (uin ? '<div class="inline"><input type="text" data-inline="1" data-autofocus placeholder="' + t('cal.inlinePh.' + k) + '" aria-label="' + t('cal.inlinePh.' + k) + '"><span>' + t('cal.inlineHint') + '</span></div>' : '') + '</div>';
  return h + '</div>';
}
function renderRecord() {
  var o = S.rec, c = COLS[o.k], r = o.r;
  var h = '<div class="dim" data-act="closerec"></div><section class="drawer full rec" role="dialog" aria-modal="true" aria-label="' + esc(L(c.title)) + '">';
  h += '<div class="dhead"><div class="dh-main"><div class="dh-kicker">' + esc(L(c.title)) + '</div><div class="dh-title">' + esc(o.isNew ? t('rec.new') : recTitle(c, r)) + '</div></div><div class="dh-r">' + (r.notion ? '<a class="btn small" href="' + esc(r.notion) + '" target="_blank" rel="noopener">' + ico('ext', 15) + 'Notion</a>' : '') + '<button type="button" class="btn small ai' + (UI.aip ? ' on' : '') + '" data-act="aitoggle">' + ico('sparkle', 14) + LL('Ассистент', 'Assistant') + '</button><button type="button" class="iconbtn" aria-label="' + t('a11y.close') + '" data-act="closerec">' + ico('x', 20) + '</button></div></div>';
  h += '<div class="dbody"><section class="card"><div class="fgrid">' + c.fields.map(function (x) { return fieldHTML(x, r[x.id], 'r.' + x.id, r); }).join('') + '</div></section>';
  if (o.k === 'mdt') h += mpCard(r);
  if (o.k === 'pubs') h += pubTools(r);
  if (LINKED.indexOf(o.k) >= 0) {
    var lp = patOf(r.pid);
    h += '<section class="card soft"><h3>' + t('lk.patient') + '</h3>';
    if (lp) {
      h += '<div class="lpat"><div><b>' + esc(pName(lp)) + '</b> <span class="mono muted">' + lp.id + '</span><div class="muted small">' + esc([ov(lp.d.loc), lp.d.stage ? t('col.stageShort') + ' ' + lp.d.stage : '', ov(lp.d.phase)].filter(Boolean).join(' · ')) + '</div></div><div class="actions"><button type="button" class="btn small" data-act="unlink">' + t('lk.unlink') + '</button><button type="button" class="btn small primary" data-act="gopat" data-id="' + lp.id + '">' + t('lk.openCard') + '</button></div></div>';
      var other = linkedBlock(lp.id, false, r.id);
      if (other) h += '<p class="hint">' + t('lk.other') + '</p>' + other;
    } else {
      var sug = guessPatient(DB.patients, recName(o.k, r), false);
      h += '<p class="hint">' + t('lk.noCard.' + (o.k === 'planner' ? 'planner' : 'other')) + '</p><div class="actions lk-act"><button type="button" class="btn primary" data-act="toreg">' + ico('plus', 15) + t('lk.create') + '</button>' + (sug ? '<button type="button" class="btn" data-act="linksug" data-id="' + sug.id + '">' + t('lk.suggest', { n: esc(pName(sug)) }) + '</button>' : '') + '</div>';
      if (S.linkPick) {
        var pats = DB.patients.slice().sort(function (a, b) { return pName(a).localeCompare(pName(b), locale()); });
        h += '<div class="fld wide lk-pick"><label for="lkpid">' + t('lk.pick') + '</label><select id="lkpid" data-bind="r.pid"><option value="">' + t('lk.pickNone') + '</option>' + pats.map(function (p) { return '<option value="' + p.id + '">' + esc(pName(p)) + ' (' + p.id + ')</option>'; }).join('') + '</select></div>';
      } else h += '<button type="button" class="linkbtn" data-act="linkpick">' + t('lk.already') + '</button>';
    }
    h += '</section>';
  }
  h += commentsCard(r.comments, 'r') + (o.isNew ? '' : historyCard(r.log, o.k, 'sec-rhist'));
  h += '</div><div class="dfoot"><div>' + (o.isNew ? '' : '<button type="button" class="btn danger" data-act="delrec">' + t('b.delete') + '</button>') + '</div><div class="actions"><button type="button" class="btn" data-act="closerec">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="saverec">' + t('b.save') + '</button></div></div></section>';
  return h;
}

/* ======================= Registry editor ======================= */
function presetFor(reg, d) {
  ancestors(reg).concat([reg]).forEach(function (a) {
    if (a.mode === 'manual') return;
    a.rules.forEach(function (r) {
      var x = FIELD[r.f]; if (!x || has(d[r.f])) return;
      if (r.not && r.f === 'kind') { d.kind = 'Хирургическое'; return; }
      if (r.vals && r.vals.length === 1) d[r.f] = x.type === 'multi' ? [r.vals[0]] : r.vals[0];
    });
  });
  return d;
}
function renderPick() {
  var h = '<div class="dim" data-act="pickclose"></div><section class="modal pick" role="dialog" aria-modal="true" aria-label="' + t('pk.title') + '">';
  h += '<div class="dhead"><div><div class="dh-title">' + t('pk.title') + '</div><div class="hint">' + t('pk.sub', { n: esc(S.pick.preset.fio || '') }) + '</div></div><button type="button" class="iconbtn" aria-label="' + t('a11y.close') + '" data-act="pickclose">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<button type="button" class="pk-row top" data-act="pickreg" data-id="all">' + ico('users', 18) + '<span><b>' + t('pk.general') + '</b><em>' + t('pk.generalHint') + '</em></span><span class="cnt">' + DB.patients.length + '</span></button>';
  (function walk(pid, dep) {
    kids(pid, false).forEach(function (r) {
      h += '<button type="button" class="pk-row" style="--d:' + dep + '" data-act="pickreg" data-id="' + r.id + '">' + ico(dep ? 'dot' : (r.id === 'g_endo' ? 'scope' : r.id === 'g_surg' ? 'knife' : 'tag'), dep ? 14 : 18) + '<span><b>' + esc(regName(r)) + '</b></span><span class="cnt">' + regCount(r) + '</span></button>';
      walk(r.id, dep + 1);
    });
  })(null, 0);
  var st = kids(null, true);
  if (st.length) {
    h += '<div class="pk-h">' + t('nav.studies') + '</div>';
    st.forEach(function (r) { h += '<button type="button" class="pk-row" data-act="pickreg" data-id="' + r.id + '">' + ico('flask', 18) + '<span><b>' + esc(regName(r)) + '</b></span><span class="cnt">' + regCount(r) + '</span></button>'; });
  }
  return h + '</div></section>';
}
/* ======================= Actions ======================= */
var toastT;
function toast(msg) { var o = document.querySelector('.toast'); if (o) o.remove(); var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg; document.body.appendChild(el); clearTimeout(toastT); toastT = setTimeout(function () { el.remove(); }, 2600); }
function setPath(obj, path, val) {
  var k = path.split('.'), o = obj;
  for (var i = 0; i < k.length - 1; i++) { var key = /^\d+$/.test(k[i]) ? +k[i] : k[i]; if (o[key] == null) o[key] = {}; o = o[key]; }
  var last = k[k.length - 1]; if (val === '' || val == null) delete o[last]; else o[last] = val;
}
function getPath(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
function target(path) {
  var head = path.split('.')[0], rest = path.slice(head.length + 1);
  if (head === 'd') return [S.drawer.p.d, rest];
  if (head === 'c') return [S.drawer.p.custom, rest];
  if (head === 'r') return [S.rec.r, rest];
  return null;
}
function bind(path, val) {
  var head = path.split('.')[0], rest = path.slice(head.length + 1);
  if (head === 'fu') { if (val) S.drawer.p.fu[rest] = true; else delete S.drawer.p.fu[rest]; return; }
  if (head === 'm') { S.drawer.members[rest] = !!val; return; }
  var tg = target(path); if (tg) setPath(tg[0], tg[1], val);
}
function openPatient(id, preset) {
  var p = id ? DB.patients.filter(function (x) { return x.id === id; })[0] : null, isNew = !p;
  if (isNew) {
    var d = preset || {};
    if (S.view.indexOf('reg:') === 0 && S.view !== 'reg:all') { var reg = regOf(S.view.slice(4)); if (reg && reg.mode === 'auto') reg.rules.forEach(function (r) { if (r.vals && r.vals.length === 1 && !d[r.f]) d[r.f] = r.vals[0]; }); }
    p = { id: 'CR-' + String(DB.seq).padStart(4, '0'), d: d, fu: {}, custom: {} };
  }
  var members = {};
  DB.registries.forEach(function (r) { if (r.mode === 'manual') members[r.id] = r.members.indexOf(p.id) >= 0 || (isNew && S.view === 'reg:' + r.id); });
  S.drawer = { p: clone(p), isNew: isNew, members: members, full: true, orig: isNew ? null : clone(p), unl: {} }; S.menu = null; S.cdraft = ''; S.histAll = false; S.qview = null;
  render(); var b = root.querySelector('.dbody'); if (b) b.scrollTop = 0;
}
function savePatient() {
  var dr = S.drawer, p = dr.p, d = p.d;
  if (has(d.ib)) d.ib = String(d.ib).trim();
  if (!validatePatient(dr)) return;
  var keep = {};
  MEDIA.forEach(function (x) { keep[x.id] = 1; });
  SECTIONS.forEach(function (s) { if (secOn(s, d)) s.fields.forEach(function (x) { if (!x.show || x.show(d)) keep[x.id] = 1; }); });
  MODULES.forEach(function (m) { var sc = SECTIONS.filter(function (z) { return z.id === m.sec; })[0]; if (m.when(d) && (!sc || secOn(sc, d))) m.fields.forEach(function (x) { if (!x.show || x.show(d)) keep[x.id] = 1; }); });
  Object.keys(FIELD).forEach(function (id) { if (!keep[id]) delete d[id]; });
  Object.keys(d).forEach(function (k) { if (!has(d[k])) delete d[k]; });
  DB.registries.forEach(function (r) { if (r.mode !== 'manual') return; var i = r.members.indexOf(p.id); if (dr.members[r.id] && i < 0) r.members.push(p.id); if (!dr.members[r.id] && i >= 0) r.members.splice(i, 1); });
  delete dr.errs; logPatient(dr);
  if (dr.isNew) { DB.patients.push(p); DB.seq++; } else DB.patients = DB.patients.map(function (x) { return x.id === p.id ? p : x; });
  if (dr.linkRec) { var lr = DB.cols[dr.linkRec.k].filter(function (x) { return x.id === dr.linkRec.id; })[0]; if (lr) lr.pid = p.id; }
  var tgt = dr.target && dr.target !== 'all' ? regOf(dr.target) : null;
  S.drawer = null; if (save()) toast(tgt ? t('toast.savedTo', { n: pName(p), r: regName(tgt) }) : t('toast.saved', { n: pName(p) })); render();
}
function openRec(k, id, preset) {
  S.linkPick = false;
  var r = id ? DB.cols[k].filter(function (x) { return x.id === id; })[0] : null;
  S.rec = { k: k, r: r ? clone(r) : (preset || {}), isNew: !r, orig: r ? clone(r) : null }; S.menu = null; S.inline = null; S.cdraft = ''; S.histAll = false; render();
}
function saveRec() {
  var o = S.rec, list = DB.cols[o.k];
  Object.keys(o.r).forEach(function (x) { if (!has(o.r[x])) delete o.r[x]; });
  if (LINKED.indexOf(o.k) >= 0 && !o.r.pid) { var ex = guessPatient(DB.patients, recName(o.k, o.r), true); if (ex) o.r.pid = ex.id; }
  if (o.k === 'pubs' && o.r.doi && doiCheck(o.r.doi)) { toast('DOI: ' + doiCheck(o.r.doi)); return; }
  var rch = diffObj(o.orig || {}, o.r).filter(function (c) { return c.f !== 'pid' || true; });
  if (o.isNew || rch.length) o.r.log = (o.r.log || []).concat([{ ts: nowIso(), by: me(), act: o.isNew ? 'create' : 'edit', ch: o.isNew ? [] : rch }]);
  if (o.isNew) { o.r.id = o.k + '_' + uid(''); list.push(o.r); } else DB.cols[o.k] = list.map(function (x) { return x.id === o.r.id ? o.r : x; });
  if (o.k === 'planner') plannerAuto(DB);
  S.rec = null; if (save()) toast(t('toast.recSaved')); render();
}
function quickAdd(k, date, text) {
  var c = COLS[k], r = { id: k + '_' + uid('') }; if (date) r[c.dateField] = date;
  var parts = text.split(','), a = parts.shift().trim(), b = parts.join(',').trim();
  r[c.titleField] = a; if (b && c.subField) r[c.subField] = b;
  if (k === 'planner') r.status = 'Планируется';
  if (k === 'mdt') r.status = 'Ожидает обсуждения';
  if (k === 'redcap') r.done = 'Ожидает';
  DB.cols[k].push(r); save(); toast(date ? t('toast.added', { n: a, d: fmtDate(date) }) : t('toast.addedNoDate', { n: a }));
}
function openEditor(id, kind, parent) {
  if (id) { S.edit = clone(regOf(id)); S.edit.isNew = false; if (S.edit.kind === 'study') { stProto(S.edit); S.edit._step = 0; } }
  else if (kind === 'study') S.edit = { id: uid('st_'), kind: 'study', name: '', desc: '', mode: 'manual', rules: [], members: [], custom: [], isNew: true, proto: newProto(), _step: 0 };
  else { S.edit = { id: uid('rg_'), name: '', mode: 'auto', rules: [{ f: 'loc', vals: [] }], members: [], custom: [], isNew: true }; var cur = S.view.indexOf('reg:') === 0 ? regOf(S.view.slice(4)) : null; if (parent) S.edit.parent = parent; else if (cur && cur.kind !== 'study') S.edit.parent = cur.id; }
  S.menu = null; render();
}
function saveEditor() {
  var e = S.edit;
  if (!(e.nameKey || e.name.trim())) { toast(t('toast.needName')); var n = root.querySelector('#regname'); if (n) n.focus(); return; }
  e.custom = e.custom.filter(function (c) { return c.label.trim(); });
  var isNew = e.isNew; delete e.isNew; delete e._step; delete e._tpl;
  if (e.kind === 'study') { if (!e.proto.no) e.proto.no = nextStudyNo(); var live = regOf(e.id); if (live && live.proto) { e.proto.log = live.proto.log; e.proto.blocks = live.proto.blocks; e.proto.seq = live.proto.seq; e.proto.blockNo = live.proto.blockNo; } }
  if (isNew) DB.registries.push(e); else DB.registries = DB.registries.map(function (r) { return r.id === e.id ? e : r; });
  S.edit = null; S.view = 'reg:' + e.id; UI.view = S.view; if (e.kind === 'study' && isNew) UI.stab = 'pts'; saveUI();
  if (save()) toast(e.kind === 'study' ? (isNew ? LL('Исследование создано: ', 'Study created: ') + e.proto.no : LL('Протокол сохранён', 'Protocol saved')) : isNew ? t('toast.regCreated') : t('toast.regSaved')); render();
}
function download(name, text, type) { var b = new Blob([text], { type: type }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function exportCsv() {
  var o = listForReg(), reg = o.reg, list = o.list;
  var cols = [['ID', function (p) { return p.id; }]];
  function add(x) { cols.push([L(x.label), function (p) { var v = p.d[x.id]; if (x.type === 'files') return (v || []).map(function (z) { return z.href; }).join(' '); return x.type === 'sel' || x.type === 'seg' ? ov(v) : v; }]); }
  SECTIONS.forEach(function (s) { s.fields.forEach(add); });
  MODULES.forEach(function (m) { if (list.some(function (p) { return m.when(p.d); })) m.fields.forEach(add); });
  if (reg) reg.custom.forEach(function (c) { cols.push([c.label, function (p) { return (p.custom[reg.id] || {})[c.id]; }]); });
  FU.forEach(function (x) { cols.push([t(x[2]), function (p) { return p.fu[x[0]] ? t('fu.done') : ''; }]); });
  function cell(v) { v = v == null ? '' : String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  var rows = [cols.map(function (c) { return cell(c[0]); }).join(';')];
  list.forEach(function (p) { rows.push(cols.map(function (c) { return cell(c[1](p)); }).join(';')); });
  download((reg ? regName(reg) : t('nav.allPatients')) + ' ' + isoOf(new Date()) + '.csv', '﻿' + rows.join('\r\n'), 'text/csv;charset=utf-8');
}

/* ======================= v9: shared helpers ======================= */
function LL(ru, en) { return LANG === 'en' ? en : ru; }
function me() { return UI.me || LL('Пользователь', 'User'); }
function initials(s) { var p = String(s || '').trim().split(/\s+/).filter(Boolean); return ((p[0] || '?').charAt(0) + (p[1] ? p[1].charAt(0) : '')).toUpperCase(); }
function nowIso() { return new Date().toISOString(); }
function fmtDT(ts) { if (!ts) return ''; var d = new Date(ts); return fmtDate(isoOf(d)) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function daysTo(iso) { if (!iso) return null; return Math.round((new Date(String(iso).slice(0, 10) + 'T00:00:00') - today()) / 86400000); }
function daysLabel(n) {
  if (n === null) return '';
  if (n === 0) return LL('сегодня', 'today');
  if (n > 0) return LL('через ', 'in ') + plural(n, 'pl.day');
  return LL('просрочено на ', 'overdue by ') + plural(-n, 'pl.day');
}
function pad3(n) { return String(n).padStart(3, '0'); }
function pct(a, b) { return b ? Math.round(a / b * 1000) / 10 : null; }
function median(a) { a = a.filter(function (x) { return x !== null; }).sort(function (x, y) { return x - y; }); if (!a.length) return null; var m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function studies() { return DB.registries.filter(function (r) { return r.kind === 'study'; }); }
function findPat(id) { return DB.patients.filter(function (p) { return p.id === id; })[0]; }
function withPat(pid, fn) {
  var p = findPat(pid); if (p) fn(p);
  if (S.drawer && S.drawer.p.id === pid) fn(S.drawer.p);
}
function shuffleCrypto(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var r = new Uint32Array(1); (window.crypto || window.msCrypto).getRandomValues(r);
    var j = r[0] % (i + 1), tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* ======================= Record protection ======================= */
function ibValid(v) { return /^\d{4}\/\d{1,7}$/.test(String(v || '').trim()); }
function ibCheck(v) {
  v = String(v || '').trim();
  if (!ibValid(v)) return LL('Формат: год/номер, например 2026/12345', 'Format: year/number, e.g. 2026/12345');
  var self = S.drawer ? S.drawer.p.id : null;
  var o = DB.patients.filter(function (p) { return p.id !== self && String(p.d.ib || '').trim() === v; })[0];
  if (o) return LL('Такой номер уже есть: ', 'Already used by: ') + pName(o) + ' (' + o.id + ')';
  return '';
}
function doiCheck(v) { return /^10\.\d{4,9}\/\S+$/i.test(String(v || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')) ? '' : LL('DOI должен начинаться с 10., например 10.1016/j.ejso.2024.01.001', 'DOI must start with 10., e.g. 10.1016/j.ejso.2024.01.001'); }
function validatePatient(dr) {
  var d = dr.p.d, errs = [];
  if (has(d.ib)) { var e = ibCheck(d.ib); if (e) errs.push(LL('№ ИБ: ', 'Case no.: ') + e); }
  DB.registries.forEach(function (r) {
    if (!r.custom.length || !draftIn(dr, r)) return;
    r.custom.forEach(function (c) {
      var v = (dr.p.custom[r.id] || {})[c.id];
      if (c.req && !has(v)) errs.push(regName(r) + ': ' + LL('обязательное поле «', 'required field "') + c.label + LL('» не заполнено', '" is empty'));
      if (c.uniq && has(v) && DB.patients.some(function (p) { return p.id !== dr.p.id && (p.custom[r.id] || {})[c.id] === v; })) errs.push(regName(r) + ': ' + LL('значение поля «', 'value of "') + c.label + LL('» уже используется', '" is already used'));
    });
  });
  dr.errs = errs.length ? errs : null;
  if (errs.length) { toast(errs[0]); render(); var b = root.querySelector('.dbody'); if (b) b.scrollTop = 0; return false; }
  return true;
}
function diffObj(a, b) {
  var keys = uniq(Object.keys(a || {}).concat(Object.keys(b || {}))), ch = [];
  keys.forEach(function (k) {
    if (k === 'log' || k === 'comments' || k === 'id') return;
    var x = a ? a[k] : undefined, y = b ? b[k] : undefined;
    if (!has(x) && !has(y)) return;
    if (JSON.stringify(has(x) ? x : null) !== JSON.stringify(has(y) ? y : null)) ch.push({ f: k, a: has(x) ? x : null, b: has(y) ? y : null });
  });
  return ch;
}
function logPatient(dr) {
  var p = dr.p, o = dr.orig || { d: {}, custom: {}, fu: {} }, ch = diffObj(o.d, p.d);
  Object.keys(uniq(Object.keys(o.custom || {}).concat(Object.keys(p.custom || {}))).reduce(function (m, k) { m[k] = 1; return m; }, {})).forEach(function (rid) {
    diffObj((o.custom || {})[rid], (p.custom || {})[rid]).forEach(function (c) { c.f = 'c:' + rid + ':' + c.f; ch.push(c); });
  });
  diffObj(o.fu, p.fu).forEach(function (c) { c.f = 'fu:' + c.f; ch.push(c); });
  if (!dr.isNew && !ch.length) return;
  p.log = (p.log || []).concat([{ ts: nowIso(), by: me(), act: dr.isNew ? 'create' : 'edit', ch: dr.isNew ? [] : ch }]);
}
function fieldLabel(f, k) {
  if (k && COLS[k] && COLS[k].F[f]) return L(COLS[k].F[f].label);
  if (FIELD[f]) return L(FIELD[f].label);
  var m = /^c:([^:]+):(.+)$/.exec(f);
  if (m) { var r = regOf(m[1]), c = r && r.custom.filter(function (z) { return z.id === m[2]; })[0]; return c ? regName(r) + ': ' + c.label : f; }
  m = /^fu:(.+)$/.exec(f);
  if (m) { var fx = FU.filter(function (z) { return z[0] === m[1]; })[0]; return fx ? t(fx[2]) : f; }
  if (f === 'pid') return LL('Связь с карточкой', 'Linked card');
  return f;
}
function valStr(f, v, k) {
  if (!has(v)) return LL('пусто', 'empty');
  var x = (k && COLS[k] && COLS[k].F[f]) || FIELD[f];
  if (Array.isArray(v)) return v.map(function (z) { return z && typeof z === 'object' ? (z.name || '') : ov(z); }).join(', ');
  if (v === true) return LL('да', 'yes');
  if (x && x.type === 'date') return fmtDate(v);
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 80);
  var s = ov(v); return s.length > 120 ? s.slice(0, 120) + '…' : s;
}
var ACT_LABEL = { create: ['Карточка создана', 'Record created'], edit: ['Изменения', 'Changes'], import: ['Импорт из файла', 'Imported from file'], enroll: ['Включение в исследование', 'Enrolled in study'], rand: ['Рандомизация', 'Randomised'], q: ['Анкета заполнена', 'Questionnaire completed'] };
function historyCard(log, k, id) {
  log = log || [];
  var h = '<section class="card" id="' + (id || 'sec-hist') + '"><h3>' + ico('history', 18) + LL('История изменений', 'Change history') + '<span class="h3-note">' + plural(log.length, 'pl.entry') + '</span></h3>';
  if (!log.length) return h + '<p class="hint">' + LL('Каждое сохранение будет записываться сюда: кто, когда и что именно изменил.', 'Every save is recorded here: who, when and what changed.') + '</p></section>';
  var list = log.slice().reverse(), lim = S.histAll ? list.length : 8;
  h += '<ol class="hist">' + list.slice(0, lim).map(function (e) {
    var ch = (e.ch || []).map(function (c) { return '<li><span class="hf">' + esc(fieldLabel(c.f, k)) + '</span><s>' + esc(valStr(c.f, c.a, k)) + '</s><span class="arr">→</span><b>' + esc(valStr(c.f, c.b, k)) + '</b></li>'; }).join('');
    return '<li class="hi hi-' + e.act + '"><div class="hmeta"><span class="av sm">' + esc(initials(e.by)) + '</span><b>' + esc(e.by || '') + '</b><span>' + fmtDT(e.ts) + '</span><span class="hact">' + esc(L(ACT_LABEL[e.act] || ['', ''])) + (e.note ? ': ' + esc(e.note) : '') + '</span></div>' + (ch ? '<ul class="hch">' + ch + '</ul>' : '') + '</li>';
  }).join('') + '</ol>';
  if (list.length > lim) h += '<button type="button" class="linkbtn" data-act="histall">' + LL('Показать всю историю', 'Show full history') + ' (' + list.length + ')</button>';
  return h + '</section>';
}
function commentsCard(list, scope) {
  list = list || [];
  var h = '<section class="card" id="sec-cmt"><h3>' + ico('chat', 18) + LL('Комментарии', 'Comments') + '<span class="h3-note">' + list.length + '</span></h3>';
  h += '<div class="cmts">' + list.map(function (c, i) {
    return '<div class="cmt"><span class="av">' + esc(initials(c.by)) + '</span><div class="cmt-b"><div class="cmt-h"><b>' + esc(c.by) + '</b><span>' + fmtDT(c.ts) + '</span><button type="button" class="x" aria-label="' + LL('Удалить комментарий', 'Delete comment') + '" data-act="cmtdel" data-scope="' + scope + '" data-i="' + i + '">' + ico('x', 13) + '</button></div><p>' + esc(c.text).replace(/\n/g, '<br>') + '</p></div></div>';
  }).join('') + '</div>';
  h += '<div class="cmt-new"><span class="av me">' + esc(initials(me())) + '</span><textarea rows="2" data-sb="cdraft" placeholder="' + LL('Написать комментарий: уточнение, вопрос коллеге, решение…', 'Write a comment: a note, a question for a colleague, a decision…') + '">' + esc(S.cdraft || '') + '</textarea><button type="button" class="btn primary small" data-act="cmtadd" data-scope="' + scope + '">' + LL('Отправить', 'Post') + '</button></div>';
  return h + '</section>';
}
function addComment(scope) {
  var txt = String(S.cdraft || '').trim(); if (!txt) { toast(LL('Комментарий пустой', 'Comment is empty')); return; }
  var c = { id: uid('c'), ts: nowIso(), by: me(), text: txt };
  if (scope === 'p' && S.drawer) {
    S.drawer.p.comments = (S.drawer.p.comments || []).concat([c]);
    var p = findPat(S.drawer.p.id); if (p && !S.drawer.isNew) { p.comments = (p.comments || []).concat([c]); save(); }
  }
  if (scope === 'r' && S.rec) {
    S.rec.r.comments = (S.rec.r.comments || []).concat([c]);
    var r = DB.cols[S.rec.k].filter(function (x) { return x.id === S.rec.r.id; })[0]; if (r && !S.rec.isNew) { r.comments = (r.comments || []).concat([c]); save(); }
  }
  S.cdraft = ''; render();
}
function delComment(scope, i) {
  if (!confirm(LL('Удалить комментарий?', 'Delete this comment?'))) return;
  if (scope === 'p' && S.drawer) { var cid = (S.drawer.p.comments || [])[i].id; S.drawer.p.comments.splice(i, 1); var p = findPat(S.drawer.p.id); if (p && p.comments) { p.comments = p.comments.filter(function (c) { return c.id !== cid; }); save(); } }
  if (scope === 'r' && S.rec) { var rid = (S.rec.r.comments || [])[i].id; S.rec.r.comments.splice(i, 1); var r = DB.cols[S.rec.k].filter(function (x) { return x.id === S.rec.r.id; })[0]; if (r && r.comments) { r.comments = r.comments.filter(function (c) { return c.id !== rid; }); save(); } }
  render();
}

/* ======================= XLSX: writer ======================= */
var CRC_T = (function () { var tb = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(files, mime) {
  var enc = new TextEncoder(), parts = [], central = [], off = 0;
  files.forEach(function (f) {
    var nm = enc.encode(f.name), dt = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(dt);
    var lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true); lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, dt.length, true); lh.setUint32(22, dt.length, true); lh.setUint16(26, nm.length, true); lh.setUint16(28, 0, true);
    parts.push(new Uint8Array(lh.buffer), nm, dt);
    var ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, dt.length, true); ch.setUint32(24, dt.length, true); ch.setUint16(28, nm.length, true);
    ch.setUint32(42, off, true);
    central.push(new Uint8Array(ch.buffer), nm);
    off += 30 + nm.length + dt.length;
  });
  var csize = central.reduce(function (a, b) { return a + b.length; }, 0);
  var end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, csize, true); end.setUint32(16, off, true);
  return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]), { type: mime || 'application/zip' });
}
function xesc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); }
function colL(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
function sheetXml(rows) {
  var ncol = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 1);
  var w = []; for (var c = 0; c < ncol; c++) { var mx = 8; rows.slice(0, 200).forEach(function (r) { var v = r[c]; if (has(v)) mx = Math.max(mx, Math.min(60, String(v).length + 2)); }); w.push(mx); }
  var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
  x += '<cols>' + w.map(function (v, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + v + '" customWidth="1"/>'; }).join('') + '</cols><sheetData>';
  rows.forEach(function (r, ri) {
    x += '<row r="' + (ri + 1) + '">';
    r.forEach(function (v, ci) {
      if (v === null || v === undefined || v === '') return;
      var ref = colL(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : '';
      if (typeof v === 'number' && isFinite(v)) x += '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>';
      else x += '<c r="' + ref + '" t="inlineStr"' + st + '><is><t xml:space="preserve">' + xesc(v) + '</t></is></c>';
    });
    x += '</row>';
  });
  return x + '</sheetData></worksheet>';
}
function buildXlsx(sheets) {
  var ns = 'http://schemas.openxmlformats.org/', files = [];
  var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="' + ns + 'package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
  sheets.forEach(function (s, i) { ct += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; });
  files.push({ name: '[Content_Types].xml', data: ct + '</Types>' });
  files.push({ name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + ns + 'package/2006/relationships"><Relationship Id="rId1" Type="' + ns + 'officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' });
  var used = {};
  files.push({ name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="' + ns + 'spreadsheetml/2006/main" xmlns:r="' + ns + 'officeDocument/2006/relationships"><sheets>' + sheets.map(function (s, i) { var n = String(s.name).replace(/[\[\]:*?\/\\]/g, ' ').slice(0, 31) || ('Sheet' + (i + 1)); while (used[n]) n = n.slice(0, 29) + i; used[n] = 1; return '<sheet name="' + xesc(n) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets></workbook>' });
  files.push({ name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + ns + 'package/2006/relationships">' + sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="' + ns + 'officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') + '<Relationship Id="rId' + (sheets.length + 1) + '" Type="' + ns + 'officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' });
  files.push({ name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="' + ns + 'spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2F84"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' });
  sheets.forEach(function (s, i) { files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s.rows) }); });
  return zipStore(files, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
function downloadBlob(name, blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }
function safeName(s) { return String(s).replace(/[\\\/:*?"<>|]+/g, ' ').trim(); }

/* ======================= XLSX: reader ======================= */
function inflateRaw(u8) {
  if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('nodecomp'));
  return new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer().then(function (b) { return new Uint8Array(b); });
}
function unzipEntries(buf, want) {
  var u8 = new Uint8Array(buf), dv = new DataView(buf), i = u8.length - 22, dec = new TextDecoder();
  for (; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) break;
  if (i < 0) return Promise.reject(new Error('zip'));
  var cnt = dv.getUint16(i + 10, true), p = dv.getUint32(i + 16, true), jobs = [], out = {};
  for (var n = 0; n < cnt; n++) {
    var method = dv.getUint16(p + 10, true), csz = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    var name = dec.decode(u8.subarray(p + 46, p + 46 + nl)); p += 46 + nl + el + cl;
    if (!want(name)) continue;
    var ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true), data = u8.subarray(ds, ds + csz);
    (function (nm, dt, m) { jobs.push((m === 8 ? inflateRaw(dt) : Promise.resolve(dt)).then(function (r) { out[nm] = dec.decode(r); })); })(name, data, method);
  }
  return Promise.all(jobs).then(function () { return out; });
}
function readXlsx(buf) {
  return unzipEntries(buf, function (n) { return /^xl\/(sharedStrings\.xml|workbook\.xml|_rels\/workbook\.xml\.rels|worksheets\/sheet\d+\.xml)$/.test(n); }).then(function (f) {
    var P = new DOMParser(), ss = [];
    if (f['xl/sharedStrings.xml']) { var sd = P.parseFromString(f['xl/sharedStrings.xml'], 'application/xml'); [].forEach.call(sd.getElementsByTagName('si'), function (si) { ss.push([].map.call(si.getElementsByTagName('t'), function (tt) { return tt.textContent; }).join('')); }); }
    var sheetName = Object.keys(f).filter(function (n) { return /worksheets\/sheet\d+\.xml$/.test(n); }).sort(function (a, b) { return (+a.match(/(\d+)\.xml$/)[1]) - (+b.match(/(\d+)\.xml$/)[1]); })[0];
    try {
      var wb = P.parseFromString(f['xl/workbook.xml'], 'application/xml'), sh = wb.getElementsByTagName('sheet')[0], rid = sh.getAttribute('r:id') || sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
      var rl = P.parseFromString(f['xl/_rels/workbook.xml.rels'], 'application/xml');
      [].forEach.call(rl.getElementsByTagName('Relationship'), function (r) { if (r.getAttribute('Id') === rid) { var tg = r.getAttribute('Target').replace(/^\/?xl\//, '').replace(/^\//, ''); if (f['xl/' + tg]) sheetName = 'xl/' + tg; } });
    } catch (e) {}
    if (!sheetName) throw new Error('nosheet');
    var doc = P.parseFromString(f[sheetName], 'application/xml'), rows = [];
    [].forEach.call(doc.getElementsByTagName('row'), function (row) {
      var r = [], ri = (+row.getAttribute('r') || rows.length + 1) - 1;
      [].forEach.call(row.getElementsByTagName('c'), function (c, k) {
        var ref = c.getAttribute('r'), ci = k;
        if (ref) { var m = /^([A-Z]+)/.exec(ref); ci = 0; for (var z = 0; z < m[1].length; z++) ci = ci * 26 + (m[1].charCodeAt(z) - 64); ci--; }
        var tp = c.getAttribute('t'), v = c.getElementsByTagName('v')[0], val = null;
        if (tp === 's' && v) val = ss[+v.textContent];
        else if (tp === 'inlineStr') val = [].map.call(c.getElementsByTagName('t'), function (tt) { return tt.textContent; }).join('');
        else if (tp === 'b' && v) val = v.textContent === '1';
        else if (v) { var nv = Number(v.textContent); val = tp === 'str' || isNaN(nv) ? v.textContent : nv; }
        r[ci] = val;
      });
      rows[ri] = r;
    });
    return rows.map(function (r) { return r || []; });
  });
}
function readCsv(text) {
  text = text.replace(/^﻿/, '');
  var first = text.split(/\r?\n/)[0] || '', dl = [';', '\t', ','].sort(function (a, b) { return first.split(b).length - first.split(a).length; })[0];
  var rows = [], row = [], cur = '', q = false;
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; continue; }
    if (ch === '"') q = true; else if (ch === dl) { row.push(cur); cur = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; } else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

/* ======================= Registry export ======================= */
var ANON = { fio: 1, ib: 1 };
function fieldOpts(x) { return x.options || (x.optionsFn ? x.optionsFn({}) : []) || []; }
function nodeCodes() { var o = []; LN_ST.forEach(function (st) { if (st[3] === 2) { o.push(st[0] + ' rt'); o.push(st[0] + ' lt'); } else o.push(st[0]); }); return o; }
function exportCols(list, reg, o) {
  var cols = [{ id: 'record_id', lab: 'ID', get: function (p) { return p.id; }, cb: ['record_id', 'ID', LL('идентификатор', 'identifier'), ''] }];
  var seen = {};
  function add(x) {
    if (seen[x.id] || (o.anon && ANON[x.id])) return; seen[x.id] = 1;
    if (x.type === 'files') { if (o.mode === 'labels') cols.push({ id: x.id, lab: L(x.label), get: function (p) { return (p.d[x.id] || []).map(function (z) { return z.name; }).join('; '); }, cb: [x.id, L(x.label), LL('файлы', 'files'), ''] }); return; }
    var opts = x.type === 'nodes' ? nodeCodes() : fieldOpts(x), lab = L(x.label);
    if (x.type === 'multi' || x.type === 'nodes') {
      if (o.mode === 'codes') opts.forEach(function (op, i) { var vid = x.id + '___' + (i + 1); cols.push({ id: vid, lab: lab + ': ' + ov(op), get: function (p) { return (p.d[x.id] || []).indexOf(op) >= 0 ? 1 : 0; }, cb: [vid, lab + ': ' + ov(op), 'checkbox', LL('0 = нет; 1 = да', '0 = no; 1 = yes')] }); });
      else cols.push({ id: x.id, lab: lab, get: function (p) { return (p.d[x.id] || []).map(ov).join('; '); }, cb: [x.id, lab, LL('несколько значений', 'multiple choice'), opts.map(ov).join('; ')] });
      return;
    }
    if (x.type === 'sel' || x.type === 'seg') {
      cols.push({ id: x.id, lab: lab, get: function (p) { var v = p.d[x.id]; if (!has(v)) return ''; if (o.mode === 'codes') { var i = opts.indexOf(v); return i >= 0 ? i + 1 : v; } return ov(v); }, cb: [x.id, lab, x.type === 'seg' ? 'radio' : 'dropdown', opts.map(function (z, i) { return (i + 1) + ' = ' + ov(z); }).join('; ')] });
      return;
    }
    cols.push({ id: x.id, lab: lab, get: function (p) { var v = p.d[x.id]; if (x.type === 'num') { var n = num(v); return n === null ? (v || '') : n; } if (x.type === 'date') return o.mode === 'codes' ? (v || '') : fmtDate(v); return v; }, cb: [x.id, lab, x.type === 'num' ? LL('число', 'number') : x.type === 'date' ? LL('дата (ГГГГ-ММ-ДД)', 'date (YYYY-MM-DD)') : LL('текст', 'text'), x.unit ? t(x.unit) : ''] });
  }
  SECTIONS.forEach(function (s) { s.fields.forEach(add); });
  MODULES.forEach(function (m) { if (list.some(function (p) { return m.when(p.d); })) m.fields.forEach(add); });
  if (reg) reg.custom.forEach(function (c) {
    var fx = cfAsField(c), vid = 'c_' + c.id, opts = fx.options || [];
    cols.push({ id: vid, lab: c.label, get: function (p) { var v = (p.custom[reg.id] || {})[c.id]; if (!has(v)) return ''; if (o.mode === 'codes' && opts.length) { var i = opts.indexOf(v); return i >= 0 ? i + 1 : v; } if (fx.type === 'num') { var n = num(v); return n === null ? v : n; } return fx.type === 'date' && o.mode !== 'codes' ? fmtDate(v) : ov(v); }, cb: [vid, c.label, fx.type, opts.map(function (z, i) { return (i + 1) + ' = ' + z; }).join('; ')] });
  });
  if (reg && reg.kind === 'study') {
    cols.push({ id: 'study_no', lab: LL('№ в исследовании', 'Study no.'), get: function (p) { return ((p.enroll || {})[reg.id] || {}).no || ''; }, cb: ['study_no', LL('№ в исследовании', 'Study no.'), LL('текст', 'text'), ''] });
    cols.push({ id: 'enroll_date', lab: LL('Дата включения', 'Enrolment date'), get: function (p) { var v = ((p.enroll || {})[reg.id] || {}).date; return o.mode === 'codes' ? (v || '') : fmtDate(v); }, cb: ['enroll_date', LL('Дата включения', 'Enrolment date'), LL('дата', 'date'), ''] });
    var arms = ((reg.proto || {}).arms || []).map(function (a) { return a.name; });
    cols.push({ id: 'arm', lab: LL('Группа', 'Arm'), get: function (p) { var v = ((p.enroll || {})[reg.id] || {}).arm; if (!v) return ''; if (o.mode === 'codes') { var i = arms.indexOf(v); return i >= 0 ? i + 1 : v; } return v; }, cb: ['arm', LL('Группа рандомизации', 'Randomisation arm'), 'dropdown', arms.map(function (z, i) { return (i + 1) + ' = ' + z; }).join('; ')] });
  }
  FU.forEach(function (x) { var vid = 'fu_' + x[0]; cols.push({ id: vid, lab: t(x[2]), get: function (p) { return p.fu[x[0]] ? (o.mode === 'codes' ? 1 : t('fu.done')) : (o.mode === 'codes' ? 0 : ''); }, cb: [vid, t(x[2]), 'checkbox', LL('0 = нет; 1 = выполнен', '0 = no; 1 = done')] }); });
  return cols;
}
function doExport(fmt) {
  var o = S.xport, lr = listForReg(), reg = lr.reg, list = lr.list;
  if (o.sel === 'all') { list = reg ? DB.patients.filter(function (p) { return inReg(p, reg); }) : DB.patients.slice(); }
  var cols = exportCols(list, reg, o);
  var head = cols.map(function (c) { return o.mode === 'codes' ? c.id : c.lab; });
  var rows = [head].concat(list.map(function (p) { return cols.map(function (c) { var v = c.get(p); return v === undefined ? '' : v; }); }));
  var base = safeName((reg ? regName(reg) : t('nav.allPatients')) + (o.anon ? LL(' обезличено', ' anonymised') : '') + ' ' + isoOf(new Date()));
  if (fmt === 'csv') {
    var cell = function (v) { v = v == null ? '' : String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    download(base + '.csv', '﻿' + rows.map(function (r) { return r.map(cell).join(';'); }).join('\r\n'), 'text/csv;charset=utf-8');
  } else {
    var sheets = [{ name: LL('Данные', 'Data'), rows: rows }];
    if (o.book) sheets.push({ name: LL('Кодбук', 'Codebook'), rows: [[LL('Переменная', 'Variable'), LL('Название', 'Label'), LL('Тип', 'Type'), LL('Коды и единицы', 'Codes and units')]].concat(cols.map(function (c) { return c.cb; })) });
    sheets.push({ name: LL('Сведения', 'About'), rows: [[LL('Параметр', 'Item'), LL('Значение', 'Value')], [LL('Регистр', 'Registry'), reg ? regName(reg) : t('nav.allPatients')], [LL('Записей', 'Records'), list.length], [LL('Формат значений', 'Value format'), o.mode === 'codes' ? LL('коды (см. лист «Кодбук»)', 'codes (see Codebook sheet)') : LL('текстовые метки', 'text labels')], [LL('Обезличено', 'Anonymised'), o.anon ? LL('да: ФИО и № ИБ удалены', 'yes: name and case no. removed') : LL('нет', 'no')], [LL('Выгружено', 'Exported'), fmtDT(nowIso()) + ', ' + me()], ['NROC', LL('Национальный научный онкологический центр, Астана', 'National Research Oncology Center, Astana')]] });
    downloadBlob(base + '.xlsx', buildXlsx(sheets));
  }
  S.xport = null; toast(LL('Файл сохранён в «Загрузки»', 'File saved to Downloads')); render();
}
function renderExport() {
  var o = S.xport, lr = listForReg(), reg = lr.reg, all = reg ? DB.patients.filter(function (p) { return inReg(p, reg); }).length : DB.patients.length;
  var h = '<div class="dim" data-act="xclose"></div><section class="modal xmodal" role="dialog" aria-modal="true" aria-label="' + LL('Экспорт', 'Export') + '">';
  h += '<div class="dhead"><div><div class="dh-kicker">' + LL('Экспорт данных', 'Data export') + '</div><div class="dh-title">' + esc(reg ? regName(reg) : t('nav.allPatients')) + '</div></div><button type="button" class="iconbtn" data-act="xclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  function opt(key, val, title, sub) { var on = o[key] === val; return '<button type="button" class="xopt' + (on ? ' on' : '') + '" data-act="xset" data-k="' + key + '" data-v="' + val + '"><span class="xr"></span><span><b>' + title + '</b><em>' + sub + '</em></span></button>'; }
  h += '<div class="xgrp"><div class="xlab">' + LL('Какие записи', 'Which records') + '</div>' + opt('sel', 'view', LL('Как на экране', 'As on screen'), LL('с учётом поиска и фильтров: ', 'with current search and filters: ') + plural(lr.list.length, 'pl.patient')) + opt('sel', 'all', LL('Все записи регистра', 'All registry records'), plural(all, 'pl.patient')) + '</div>';
  h += '<div class="xgrp"><div class="xlab">' + LL('Формат значений', 'Value format') + '</div>' + opt('mode', 'labels', LL('Текстовые метки', 'Text labels'), LL('удобно читать: «Лапароскопический», «Да»', 'easy to read: "Laparoscopic", "Yes"')) + opt('mode', 'codes', LL('Числовые коды для статистики', 'Numeric codes for statistics'), LL('1, 2, 3; флажки в отдельных столбцах 0/1; как в REDCap, SPSS, R', '1, 2, 3; checkboxes as separate 0/1 columns; like REDCap, SPSS, R')) + '</div>';
  h += '<div class="xgrp"><div class="xlab">' + LL('Параметры', 'Options') + '</div><label class="chk big"><input type="checkbox" data-sb="xport.anon"' + (o.anon ? ' checked' : '') + '><span><b>' + LL('Обезличить', 'Anonymise') + '</b><em>' + LL('убрать ФИО и № ИБ; ID записи сохраняется', 'remove name and case no.; record ID is kept') + '</em></span></label><label class="chk big"><input type="checkbox" data-sb="xport.book"' + (o.book ? ' checked' : '') + '><span><b>' + LL('Добавить кодбук', 'Include codebook') + '</b><em>' + LL('отдельный лист: переменная, название, тип, расшифровка кодов', 'separate sheet: variable, label, type, code meanings') + '</em></span></label></div>';
  h += '</div><div class="dfoot"><div><button type="button" class="btn ghost" data-act="xdo" data-f="csv">' + LL('Скачать CSV', 'Download CSV') + '</button></div><div class="actions"><button type="button" class="btn" data-act="xclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="xdo" data-f="xlsx">' + ico('download', 16) + LL('Скачать Excel', 'Download Excel') + '</button></div></div></section>';
  return h;
}

/* ======================= Registry import ======================= */
function matchHeader(h) {
  var s = String(h == null ? '' : h).trim(), lo = s.toLowerCase();
  if (!s) return null;
  if (lo === 'id' || lo === 'record_id') return { k: 'id' };
  var m = /^([A-Za-z0-9_]+)___(\d+)$/.exec(s); if (m && FIELD[m[1]]) return { k: 'one', f: m[1], i: +m[2] - 1 };
  if (FIELD[s]) return { k: 'f', f: s };
  var hit = Object.keys(FIELD).filter(function (id) { var x = FIELD[id]; return String(x.label[0]).toLowerCase() === lo || String(x.label[1]).toLowerCase() === lo; })[0];
  if (hit) return { k: 'f', f: hit };
  if (lo === '№ иб' || lo === 'иб' || lo === 'номер иб') return { k: 'f', f: 'ib' };
  return null;
}
function excelDate(n) { var d = new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000); return d.toISOString().slice(0, 10); }
function convVal(x, v) {
  if (v === null || v === undefined || v === '') return undefined;
  if (x.type === 'date') {
    if (typeof v === 'number') return excelDate(v);
    var s = String(v).trim(), m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s); if (m) return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
    return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s;
  }
  if (x.type === 'num') { var n = num(v); return n === null ? String(v) : String(n); }
  var opts = x.type === 'nodes' ? nodeCodes() : fieldOpts(x);
  function one(val) {
    val = String(val).trim(); if (!val) return null;
    if (opts.indexOf(val) >= 0) return val;
    var tr = opts.filter(function (o) { return ov(o).toLowerCase() === val.toLowerCase() || (OPT[o] || '').toLowerCase() === val.toLowerCase() || o.toLowerCase() === val.toLowerCase(); })[0]; if (tr) return tr;
    if (/^\d+$/.test(val) && +val >= 1 && +val <= opts.length) return opts[+val - 1];
    return val;
  }
  if (x.type === 'multi' || x.type === 'nodes') return String(v).split(/[;\n]/).map(one).filter(Boolean);
  if (x.type === 'sel' || x.type === 'seg') return one(v);
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет';
  return String(v);
}
function startImport(file) {
  var isX = /\.xlsx$/i.test(file.name), rd = new FileReader();
  rd.onload = function () {
    var pr = isX ? readXlsx(rd.result) : Promise.resolve(readCsv(rd.result));
    pr.then(function (rows) { prepImport(rows, file.name); }).catch(function () { toast(LL('Не удалось прочитать файл. Нужен .xlsx или .csv', 'Could not read the file. Use .xlsx or .csv')); });
  };
  if (isX) rd.readAsArrayBuffer(file); else rd.readAsText(file, 'utf-8');
}
function prepImport(rows, fname) {
  rows = rows.filter(function (r) { return r && r.some(function (v) { return v !== null && v !== undefined && String(v).trim() !== ''; }); });
  if (rows.length < 2) { toast(LL('В файле нет строк с данными', 'The file has no data rows')); return; }
  var head = rows[0], map = head.map(matchHeader), recs = [], warn = [], seenIb = {};
  rows.slice(1).forEach(function (r, ri) {
    var d = {}, id = null;
    map.forEach(function (m, ci) {
      if (!m) return; var v = r[ci];
      if (m.k === 'id') { if (has(v)) id = String(v).trim(); return; }
      var x = FIELD[m.f];
      if (m.k === 'one') { if (v === 1 || v === '1' || v === true || /^(да|yes|true)$/i.test(String(v))) { var op = (x.type === 'nodes' ? nodeCodes() : fieldOpts(x))[m.i]; if (op) d[m.f] = (d[m.f] || []).concat([op]); } return; }
      var cv = convVal(x, v); if (cv !== undefined && !(Array.isArray(cv) && !cv.length)) d[m.f] = cv;
    });
    if (!Object.keys(d).length && !id) return;
    var ex = id ? findPat(id) : null;
    if (!ex && d.ib) ex = DB.patients.filter(function (p) { return String(p.d.ib || '').trim() === String(d.ib).trim(); })[0];
    if (d.ib) { if (!ibValid(d.ib)) warn.push(LL('Строка ', 'Row ') + (ri + 2) + ': ' + LL('№ ИБ в неверном формате: ', 'invalid case no.: ') + d.ib); if (seenIb[d.ib]) warn.push(LL('Строка ', 'Row ') + (ri + 2) + ': ' + LL('№ ИБ повторяется в файле: ', 'case no. repeated in file: ') + d.ib); seenIb[d.ib] = 1; }
    recs.push({ d: d, ex: ex ? ex.id : null, row: ri + 2 });
  });
  S.imp = { fname: fname, recs: recs, head: head.map(function (h, i) { return { h: String(h == null ? '' : h), m: map[i] }; }), warn: warn };
  render();
}
function applyImport() {
  var im = S.imp, nNew = 0, nUpd = 0, ts = nowIso();
  im.recs.forEach(function (rc) {
    if (rc.ex) {
      var p = findPat(rc.ex), before = clone(p.d);
      Object.keys(rc.d).forEach(function (k) { p.d[k] = rc.d[k]; });
      var ch = diffObj(before, p.d); if (ch.length) { p.log = (p.log || []).concat([{ ts: ts, by: me(), act: 'import', note: im.fname, ch: ch }]); nUpd++; }
    } else {
      var np = { id: 'CR-' + String(DB.seq).padStart(4, '0'), d: rc.d, fu: {}, custom: {}, log: [{ ts: ts, by: me(), act: 'import', note: im.fname, ch: [] }] };
      DB.seq++; DB.patients.push(np); nNew++;
    }
  });
  S.imp = null; save(); toast(LL('Импорт завершён: новых ', 'Import done: new ') + nNew + LL(', обновлено ', ', updated ') + nUpd); render();
}
function renderImport() {
  var im = S.imp, nNew = im.recs.filter(function (r) { return !r.ex; }).length, nUpd = im.recs.length - nNew;
  var ok = im.head.filter(function (h) { return h.m; }), bad = im.head.filter(function (h) { return !h.m && h.h; });
  var h = '<div class="dim" data-act="impclose"></div><section class="modal xmodal wide" role="dialog" aria-modal="true" aria-label="' + LL('Импорт', 'Import') + '">';
  h += '<div class="dhead"><div><div class="dh-kicker">' + LL('Импорт из Excel', 'Import from Excel') + '</div><div class="dh-title">' + esc(im.fname) + '</div></div><button type="button" class="iconbtn" data-act="impclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<div class="kpis sm">' + kpi(im.recs.length, LL('строк с данными', 'data rows')) + kpi(nNew, LL('новых карточек', 'new records')) + kpi(nUpd, LL('обновится', 'to update')) + kpi(ok.length + ' / ' + im.head.length, LL('столбцов распознано', 'columns matched')) + '</div>';
  h += '<p class="hint">' + LL('Совпадение ищется по ID записи, затем по № ИБ. Совпавшие карточки обновятся только по заполненным ячейкам, остальные поля не тронутся. Все изменения попадут в историю карточки.', 'Records are matched by ID, then by case no. Matched records are updated only from non-empty cells. All changes go to each record history.') + '</p>';
  if (im.warn.length) h += '<div class="errbox"><b>' + LL('Проверьте', 'Please check') + '</b><ul>' + im.warn.slice(0, 12).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="imcols"><div><div class="xlab">' + LL('Распознаны', 'Matched') + '</div><div class="tagline">' + ok.map(function (c) { return '<span class="tag ok">' + esc(c.h) + '</span>'; }).join('') + '</div></div>';
  if (bad.length) h += '<div><div class="xlab">' + LL('Пропущены (нет такого поля)', 'Skipped (no such field)') + '</div><div class="tagline">' + bad.map(function (c) { return '<span class="tag due">' + esc(c.h) + '</span>'; }).join('') + '</div></div>';
  h += '</div></div><div class="dfoot"><div></div><div class="actions"><button type="button" class="btn" data-act="impclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="impgo"' + (im.recs.length ? '' : ' disabled') + '>' + LL('Импортировать', 'Import') + '</button></div></div></section>';
  return h;
}
function kpi(v, l, cls) { return '<div class="kpi' + (cls ? ' ' + cls : '') + '"><b>' + esc(v) + '</b><span>' + esc(l) + '</span></div>'; }

/* ======================= Collection export (any section, by period) ======================= */
function renderColExport() {
  var o = S.cx, c = COLS[o.k];
  var h = '<div class="dim" data-act="cxclose"></div><section class="modal xmodal" role="dialog" aria-modal="true"><div class="dhead"><div><div class="dh-kicker">' + LL('Экспорт в Excel', 'Export to Excel') + '</div><div class="dh-title">' + esc(L(c.title)) + '</div></div><button type="button" class="iconbtn" data-act="cxclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<div class="xgrp"><div class="xlab">' + LL('Период', 'Period') + (c.dateField ? ' (' + esc(L(c.F[c.dateField].label)).toLowerCase() + ')' : '') + '</div><div class="fgrid two"><div class="fld"><label>' + LL('С', 'From') + '</label><input type="date" data-sb="cx.from" value="' + esc(o.from || '') + '"></div><div class="fld"><label>' + LL('По', 'To') + '</label><input type="date" data-sb="cx.to" value="' + esc(o.to || '') + '"></div></div><div class="chips">';
  var y = new Date().getFullYear();
  [[y + '-01-01', y + '-12-31', String(y)], [(y - 1) + '-01-01', (y - 1) + '-12-31', String(y - 1)], ['', '', LL('Всё время', 'All time')]].forEach(function (p) { h += '<button type="button" class="chip' + ((o.from || '') === p[0] && (o.to || '') === p[1] ? ' on' : '') + '" data-act="cxper" data-f="' + p[0] + '" data-t="' + p[1] + '">' + p[2] + '</button>'; });
  h += '</div></div></div><div class="dfoot"><div></div><div class="actions"><button type="button" class="btn" data-act="cxclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="cxgo">' + ico('download', 16) + LL('Скачать Excel', 'Download Excel') + '</button></div></div></section>';
  return h;
}
function doColExport() {
  var o = S.cx, c = COLS[o.k], list = DB.cols[o.k].slice();
  if (c.dateField && (o.from || o.to)) list = list.filter(function (r) { var d = r[c.dateField]; return d && (!o.from || d >= o.from) && (!o.to || d <= o.to); });
  list.sort(function (a, b) { return String(a[c.dateField] || '').localeCompare(String(b[c.dateField] || '')); });
  var fs = c.fields.filter(function (x) { return x.type !== 'files' || o.k === 'pubs'; });
  var rows = [fs.map(function (x) { return L(x.label); })].concat(list.map(function (r) { return fs.map(function (x) { var v = r[x.id]; if (!has(v)) return ''; if (x.type === 'date') return fmtDate(v); if (x.type === 'files') return v.map(function (z) { return z.name; }).join('; '); if (Array.isArray(v)) return v.map(ov).join('; '); if (x.type === 'num') { var n = num(v); return n === null ? v : n; } return ov(v); }); }));
  downloadBlob(safeName(L(c.title) + ' ' + (o.from ? fmtDate(o.from) : '') + (o.to ? ' ' + fmtDate(o.to) : '') + ' ' + isoOf(new Date())) + '.xlsx', buildXlsx([{ name: L(c.title), rows: rows }]));
  S.cx = null; toast(LL('Файл сохранён в «Загрузки»', 'File saved to Downloads')); render();
}

/* ======================= Questionnaires (PROMs) ======================= */
function qo(ru, en, s) { return { t: [ru, en], s: s }; }
var FREQ3 = function (a, b, c) { return [qo('Нет, никогда', 'No, never', a), qo('Да, реже 1 раза в неделю', 'Yes, less than once per week', b), qo('Да, не реже 1 раза в неделю', 'Yes, at least once per week', c)]; };
var WX = [qo('Никогда', 'Never', 0), qo('Редко: реже 1 раза в месяц', 'Rarely: less than once a month', 1), qo('Иногда: реже 1 раза в неделю, но не реже 1 раза в месяц', 'Sometimes: less than once a week, at least once a month', 2), qo('Обычно: реже 1 раза в день, но не реже 1 раза в неделю', 'Usually: less than once a day, at least once a week', 3), qo('Всегда: 1 раз в день и чаще', 'Always: once a day or more', 4)];
var Q_BUILTIN = [
  { id: 'lars', builtin: true, name: ['LARS: синдром низкой передней резекции', 'LARS: low anterior resection syndrome'], short: 'LARS',
    desc: ['Оценка функции кишечника после резекции прямой кишки. 5 вопросов, 0 до 42 баллов.', 'Bowel function after rectal resection. 5 questions, 0 to 42 points.'],
    sub: ['Вспомните, как работал кишечник за последние 4 недели', 'Think about your bowel function over the last 4 weeks'],
    score: true, max: 42, bands: [{ min: 0, max: 20, t: ['Нет LARS', 'No LARS'], c: 'ok' }, { min: 21, max: 29, t: ['Малый LARS', 'Minor LARS'], c: 'warn' }, { min: 30, max: 42, t: ['Выраженный LARS', 'Major LARS'], c: 'due' }],
    items: [
      { id: 'q1', type: 'single', text: ['Бывает ли, что вы не можете удержать газы?', 'Do you ever have occasions when you cannot control your flatus (wind)?'], opts: FREQ3(0, 4, 7) },
      { id: 'q2', type: 'single', text: ['Бывает ли у вас случайное подтекание жидкого стула?', 'Do you ever have any accidental leakage of liquid stool?'], opts: FREQ3(0, 3, 3) },
      { id: 'q3', type: 'single', text: ['Как часто у вас бывает стул?', 'How often do you open your bowels?'], opts: [qo('Чаще 7 раз в день (24 часа)', 'More than 7 times per day (24 hours)', 4), qo('От 4 до 7 раз в день', '4 to 7 times per day', 2), qo('От 1 до 3 раз в день', '1 to 3 times per day', 0), qo('Реже 1 раза в день', 'Less than once per day', 5)] },
      { id: 'q4', type: 'single', text: ['Бывает ли, что нужно снова опорожнить кишечник в течение часа после предыдущего стула?', 'Do you ever have to open your bowels again within one hour of the last bowel opening?'], opts: FREQ3(0, 9, 11) },
      { id: 'q5', type: 'single', text: ['Бывают ли такие сильные позывы, что приходится срочно бежать в туалет?', 'Do you ever have such a strong urge to open your bowels that you have to rush to the toilet?'], opts: FREQ3(0, 11, 16) }
    ] },
  { id: 'wexner', builtin: true, name: ['Wexner: шкала недержания (CCIS)', 'Wexner: incontinence score (CCIS)'], short: 'Wexner',
    desc: ['Cleveland Clinic Incontinence Score. 5 вопросов, 0 до 20 баллов: 0 означает полное удержание, 20 полное недержание.', 'Cleveland Clinic Incontinence Score. 5 items, 0 to 20: 0 is perfect continence, 20 complete incontinence.'],
    sub: ['Как часто это было за последние 4 недели?', 'How often did this happen over the last 4 weeks?'],
    score: true, max: 20, bands: [{ min: 0, max: 0, t: ['Полное удержание', 'Perfect continence'], c: 'ok' }, { min: 1, max: 20, t: ['Есть нарушения удержания', 'Some incontinence'], c: 'warn' }],
    items: [
      { id: 'w1', type: 'single', text: ['Недержание твёрдого стула', 'Incontinence of solid stool'], opts: WX },
      { id: 'w2', type: 'single', text: ['Недержание жидкого стула', 'Incontinence of liquid stool'], opts: WX },
      { id: 'w3', type: 'single', text: ['Недержание газов', 'Incontinence of gas'], opts: WX },
      { id: 'w4', type: 'single', text: ['Приходится носить прокладку', 'Wears a pad'], opts: WX },
      { id: 'w5', type: 'single', text: ['Недержание меняет образ жизни', 'Lifestyle alteration'], opts: WX }
    ] }
];
function qTpls() { return Q_BUILTIN.concat(DB.qtpl || []); }
function qTpl(id) { return qTpls().filter(function (q) { return q.id === id; })[0]; }
function qName(q) { return q ? L(q.name) : '?'; }
function qShort(q) { return q ? (q.short || L(q.name)) : '?'; }
function qVisible(q, ans) {
  return q.items.filter(function (it) {
    if (!it.cond || !it.cond.q) return true;
    var a = ans[it.cond.q]; if (!has(a)) return false;
    return Array.isArray(a) ? a.indexOf(+it.cond.a) >= 0 : +a === +it.cond.a;
  });
}
function qScore(q, ans) {
  if (!q.score) return null;
  var s = 0;
  qVisible(q, ans).forEach(function (it) {
    var a = ans[it.id]; if (!has(a)) return;
    if (it.type === 'single') s += (it.opts[+a] || {}).s || 0;
    else if (it.type === 'multi') a.forEach(function (i) { s += (it.opts[+i] || {}).s || 0; });
    else if (it.type === 'num') s += num(a) || 0;
  });
  return s;
}
function qBand(q, s) { if (s === null || !q.bands) return null; return q.bands.filter(function (b) { return s >= b.min && s <= b.max; })[0] || null; }
function qEntries(p) { return (p.q || []).slice().sort(function (a, b) { return String(a.date || a.due || '').localeCompare(String(b.date || b.due || '')); }); }
function qStatus(e) { if (e.date) return 'done'; var n = daysTo(e.due); return n === null ? 'plan' : n < 0 ? 'overdue' : n <= 14 ? 'soon' : 'plan'; }
function qDueAll(days) {
  var out = [], lim = days === undefined ? 14 : days;
  DB.patients.forEach(function (p) { (p.q || []).forEach(function (e) { if (e.date) return; var n = daysTo(e.due); if (n !== null && n <= lim) out.push({ p: p, e: e, n: n }); }); });
  return out.sort(function (a, b) { return a.n - b.n; });
}
function qStatusTag(e) {
  var st = qStatus(e), q = qTpl(e.tid);
  if (st === 'done') { var b = qBand(q || {}, e.score); return '<span class="tag ok">' + LL('Заполнена ', 'Done ') + fmtDate(e.date) + '</span>' + (e.score !== null && e.score !== undefined ? '<span class="score' + (b ? ' sc-' + b.c : '') + '">' + e.score + (q && q.max ? '<i>/' + q.max + '</i>' : '') + (b ? ' · ' + esc(L(b.t)) : '') + '</span>' : ''); }
  if (st === 'overdue') return '<span class="tag due">' + LL('Просрочена: ', 'Overdue: ') + fmtDate(e.due) + '</span>';
  return '<span class="tag">' + LL('К ', 'Due ') + fmtDate(e.due) + ' · ' + daysLabel(daysTo(e.due)) + '</span>';
}
function qCard(p, isNew) {
  var list = qEntries(p);
  var h = '<section class="card ph-post" id="sec-q"><h3>' + ico('clipboard', 18) + LL('Анкеты пациента', 'Patient questionnaires') + '<span class="h3-note">LARS, Wexner</span></h3>';
  if (isNew) return h + '<p class="hint">' + LL('Сохраните карточку, чтобы назначать и заполнять анкеты.', 'Save the record to schedule and fill questionnaires.') + '</p></section>';
  if (!list.length) h += '<p class="hint">' + LL('Назначьте анкеты на контрольные сроки (например 3, 6 и 12 месяцев после закрытия стомы) или заполните прямо сейчас на планшете вместе с пациентом.', 'Schedule questionnaires at follow-up points (e.g. 3, 6 and 12 months after stoma closure) or fill one now on a tablet with the patient.') + '</p>';
  else h += '<div class="qlist">' + list.map(function (e) {
    var q = qTpl(e.tid), open = S.qview === e.id;
    var r = '<div class="qrow"><div class="qn"><b>' + esc(qShort(q)) + '</b>' + (e.label ? '<span>' + esc(e.label) + '</span>' : '') + '</div><div class="qs">' + qStatusTag(e) + '</div><div class="qa">';
    r += e.date ? '<button type="button" class="btn small ghost" data-act="qview" data-id="' + e.id + '">' + (open ? LL('Скрыть ответы', 'Hide answers') : LL('Ответы', 'Answers')) + '</button>' : '<button type="button" class="btn small primary" data-act="qfill" data-pid="' + p.id + '" data-id="' + e.id + '">' + ico('tablet', 15) + LL('Заполнить', 'Fill in') + '</button>';
    r += '<button type="button" class="iconbtn sm" aria-label="' + LL('Удалить', 'Delete') + '" data-act="qdel" data-pid="' + p.id + '" data-id="' + e.id + '">' + ico('x', 15) + '</button></div></div>';
    if (open && q) r += '<ol class="qans">' + qVisible(q, e.ans || {}).map(function (it) { var a = (e.ans || {})[it.id]; var txt = !has(a) ? '' : it.type === 'single' ? L(it.opts[+a].t) + (q.score ? ' (' + (it.opts[+a].s || 0) + ')' : '') : it.type === 'multi' ? a.map(function (i) { return L(it.opts[+i].t); }).join(', ') : String(a); return '<li><span>' + esc(L(it.text)) + '</span><b>' + esc(txt || LL('нет ответа', 'no answer')) + '</b></li>'; }).join('') + '</ol>';
    return r;
  }).join('') + '</div>';
  h += '<div class="actions qbtns"><button type="button" class="btn" data-act="qsched" data-pid="' + p.id + '">' + ico('cal', 16) + LL('Назначить анкеты', 'Schedule') + '</button><button type="button" class="btn" data-act="qnow" data-pid="' + p.id + '">' + ico('tablet', 16) + LL('Заполнить сейчас', 'Fill in now') + '</button></div>';
  return h + '</section>';
}
function renderQSched() {
  var o = S.qs, p = findPat(o.pid), d = p ? p.d : {};
  var anchors = [['date', LL('Дата операции', 'Surgery date'), d.date], ['closure', LL('Дата закрытия стомы', 'Stoma closure'), d.closure], ['today', LL('Сегодня', 'Today'), isoOf(new Date())]];
  var anc = (anchors.filter(function (a) { return a[0] === o.anchor; })[0] || anchors[2])[2];
  var h = '<div class="dim" data-act="qsclose"></div><section class="modal xmodal" role="dialog" aria-modal="true"><div class="dhead"><div><div class="dh-kicker">' + (o.now ? LL('Заполнить сейчас', 'Fill in now') : LL('Назначить анкеты', 'Schedule questionnaires')) + '</div><div class="dh-title">' + esc(p ? pName(p) : '') + '</div></div><button type="button" class="iconbtn" data-act="qsclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<div class="xgrp"><div class="xlab">' + LL('Анкета', 'Questionnaire') + '</div>' + qTpls().map(function (q) { var on = o.tid === q.id; return '<button type="button" class="xopt' + (on ? ' on' : '') + '" data-act="qsset" data-k="tid" data-v="' + q.id + '"><span class="xr"></span><span><b>' + esc(qName(q)) + '</b><em>' + esc(L(q.desc || ['', ''])) + '</em></span></button>'; }).join('') + '</div>';
  if (!o.now) {
    h += '<div class="xgrp"><div class="xlab">' + LL('От какой даты считать', 'Count from') + '</div><div class="chips">' + anchors.map(function (a) { return '<button type="button" class="chip' + (o.anchor === a[0] ? ' on' : '') + '"' + (a[2] ? '' : ' disabled') + ' data-act="qsset" data-k="anchor" data-v="' + a[0] + '">' + a[1] + (a[2] ? ': ' + fmtDate(a[2]) : LL(': не указана', ': not set')) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="xgrp"><div class="xlab">' + LL('Сроки', 'Time points') + '</div><div class="chips">' + [[30, LL('1 мес', '1 mo')], [90, LL('3 мес', '3 mo')], [180, LL('6 мес', '6 mo')], [365, LL('12 мес', '12 mo')], [730, LL('24 мес', '24 mo')]].map(function (x) { var on = o.offs.indexOf(x[0]) >= 0; return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="qsoff" data-v="' + x[0] + '">' + x[1] + (anc && on ? ': ' + fmtDate(isoOf(addDays(anc, x[0]))) : '') + '</button>'; }).join('') + '</div></div>';
  }
  h += '</div><div class="dfoot"><div></div><div class="actions"><button type="button" class="btn" data-act="qsclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="qsgo">' + (o.now ? LL('Открыть на весь экран', 'Open full screen') : LL('Назначить', 'Schedule')) + '</button></div></div></section>';
  return h;
}
function qSchedGo() {
  var o = S.qs, p = findPat(o.pid); if (!p || !o.tid) return;
  if (o.now) { var e = { id: uid('q'), tid: o.tid, due: isoOf(new Date()) }; withPat(p.id, function (x) { x.q = (x.q || []).concat([clone(e)]); }); save(); S.qs = null; openFill(p.id, e.id); return; }
  var anc = o.anchor === 'date' ? p.d.date : o.anchor === 'closure' ? p.d.closure : isoOf(new Date());
  if (!anc || !o.offs.length) { toast(LL('Выберите дату отсчёта и сроки', 'Choose a start date and time points')); return; }
  var add = o.offs.map(function (n) { return { id: uid('q'), tid: o.tid, due: isoOf(addDays(anc, n)), label: (n >= 365 ? n / 365 * 12 : Math.round(n / 30)) + LL(' мес', ' mo') }; });
  withPat(p.id, function (x) { x.q = (x.q || []).concat(clone(add)); });
  save(); S.qs = null; toast(LL('Назначено анкет: ', 'Scheduled: ') + add.length); render();
}
function openFill(pid, eid) {
  var p = findPat(pid), e = p && (p.q || []).filter(function (x) { return x.id === eid; })[0]; if (!e) return;
  S.fill = { pid: pid, eid: eid, i: 0, ans: clone(e.ans || {}), done: false }; S.menu = null; render();
}
function renderFill() {
  var f = S.fill, p = findPat(f.pid), e = (p.q || []).filter(function (x) { return x.id === f.eid; })[0], q = qTpl(e.tid);
  var vis = qVisible(q, f.ans), n = vis.length, it = vis[Math.min(f.i, n - 1)];
  var h = '<section class="fill" role="dialog" aria-modal="true" aria-label="' + esc(qName(q)) + '"><header class="fill-top"><img src="media/nroc-logo.png" alt="NROC"><div class="ft-t"><b>' + esc(qName(q)) + '</b><span>' + esc(pName(p)) + '</span></div><button type="button" class="iconbtn" data-act="fillclose" aria-label="' + t('a11y.close') + '">' + ico('x', 22) + '</button></header>';
  h += '<div class="fill-prog"><span style="width:' + (f.done ? 100 : Math.round(f.i / Math.max(1, n) * 100)) + '%"></span></div><div class="fill-body">';
  if (f.done) {
    var sc = qScore(q, f.ans), b = qBand(q, sc);
    h += '<div class="fill-done"><div class="fd-ic">' + ico('check', 40) + '</div><h2>' + LL('Спасибо! Анкета заполнена', 'Thank you! Questionnaire completed') + '</h2>';
    if (sc !== null) h += '<div class="fd-score' + (b ? ' sc-' + b.c : '') + '"><b>' + sc + '</b><span>' + LL('баллов', 'points') + (q.max ? LL(' из ', ' of ') + q.max : '') + '</span>' + (b ? '<em>' + esc(L(b.t)) + '</em>' : '') + '</div>';
    h += '<p class="muted">' + LL('Верните, пожалуйста, планшет врачу.', 'Please hand the tablet back to your doctor.') + '</p></div>';
  } else {
    h += '<div class="fill-q"><div class="fq-n">' + LL('Вопрос ', 'Question ') + (f.i + 1) + LL(' из ', ' of ') + n + '</div>' + (q.sub ? '<div class="fq-sub">' + esc(L(q.sub)) + '</div>' : '') + '<h2>' + esc(L(it.text)) + '</h2>';
    var a = f.ans[it.id];
    if (it.type === 'single' || it.type === 'multi') h += '<div class="fopts">' + it.opts.map(function (o, i) { var on = it.type === 'single' ? +a === i && has(a) : (a || []).indexOf(i) >= 0; return '<button type="button" class="fopt' + (on ? ' on' : '') + (it.type === 'multi' ? ' m' : '') + '" data-act="fans" data-q="' + it.id + '" data-i="' + i + '"><span class="fo-r"></span>' + esc(L(o.t)) + '</button>'; }).join('') + '</div>';
    else if (it.type === 'num') h += '<input class="fin" type="number" inputmode="decimal" data-sb="fill.ans.' + it.id + '" value="' + esc(a || '') + '" data-autofocus>';
    else h += '<textarea class="fin" rows="4" data-sb="fill.ans.' + it.id + '" data-autofocus>' + esc(a || '') + '</textarea>';
    h += '</div>';
  }
  h += '</div><footer class="fill-foot">';
  if (f.done) h += '<button type="button" class="btn big" data-act="fillback">' + LL('Изменить ответы', 'Change answers') + '</button><button type="button" class="btn big primary" data-act="fillsave">' + LL('Сохранить в карточку', 'Save to record') + '</button>';
  else h += '<button type="button" class="btn big" data-act="fillprev"' + (f.i ? '' : ' disabled') + '>' + ico('left', 20) + LL('Назад', 'Back') + '</button><button type="button" class="btn big primary" data-act="fillnext"' + (has(f.ans[it.id]) || it.type === 'text' ? '' : ' disabled') + '>' + (f.i >= n - 1 ? LL('Готово', 'Finish') : LL('Далее', 'Next')) + ico('right', 20) + '</button>';
  return h + '</footer></section>';
}
function fillSave() {
  var f = S.fill, q = null, sc = null, bd = null;
  withPat(f.pid, function (p) { var e = (p.q || []).filter(function (x) { return x.id === f.eid; })[0]; if (!e) return; q = qTpl(e.tid); sc = qScore(q, f.ans); bd = qBand(q, sc); e.ans = clone(f.ans); e.date = isoOf(new Date()); e.score = sc; e.band = bd ? L(bd.t) : null; e.by = me(); });
  var p = findPat(f.pid); if (p) p.log = (p.log || []).concat([{ ts: nowIso(), by: me(), act: 'q', note: qShort(q) + (sc !== null ? ', ' + sc + LL(' баллов', ' points') : ''), ch: [] }]);
  if (S.drawer && S.drawer.p.id === f.pid && p) S.drawer.p.log = clone(p.log);
  S.fill = null; save(); toast(LL('Анкета сохранена', 'Questionnaire saved')); render();
}

/* questionnaire builder */
function newQB(src) {
  if (src) { var c = clone(src); c.items.forEach(function (it) { it.optsText = (it.opts || []).map(function (o) { return L(o.t) + (c.score ? ' = ' + (o.s || 0) : ''); }).join('\n'); it.textS = L(it.text); }); c.nameS = L(c.name); c.descS = L(c.desc || ['', '']); c.bandsText = (c.bands || []).map(function (b) { return b.min + '..' + b.max + ' = ' + L(b.t); }).join('\n'); return c; }
  return { id: uid('qt'), nameS: '', descS: '', score: true, bandsText: '', items: [{ id: uid('i'), type: 'single', textS: '', optsText: LL('Нет = 0\nДа = 1', 'No = 0\nYes = 1'), cond: { q: '', a: '' } }], isNew: true };
}
function qbCompile(b) {
  var q = { id: b.id, name: [b.nameS, b.nameS], desc: [b.descS || '', b.descS || ''], score: !!b.score, items: [], bands: [] };
  b.items.forEach(function (it) {
    var x = { id: it.id, type: it.type, text: [it.textS || '', it.textS || ''] };
    if (it.type === 'single' || it.type === 'multi') x.opts = String(it.optsText || '').split('\n').map(function (l) { l = l.trim(); if (!l) return null; var m = /^(.*?)\s*=\s*(-?\d+(?:[.,]\d+)?)\s*$/.exec(l); return m ? { t: [m[1], m[1]], s: num(m[2]) } : { t: [l, l], s: 0 }; }).filter(Boolean);
    if (it.cond && it.cond.q) x.cond = { q: it.cond.q, a: it.cond.a };
    q.items.push(x);
  });
  String(b.bandsText || '').split('\n').forEach(function (l) { var m = /^\s*(-?\d+)\s*\.\.\s*(-?\d+)\s*=\s*(.+)$/.exec(l); if (m) q.bands.push({ min: +m[1], max: +m[2], t: [m[3].trim(), m[3].trim()], c: q.bands.length ? 'warn' : 'ok' }); });
  var mx = 0; q.items.forEach(function (it) { if (it.opts) mx += it.type === 'multi' ? it.opts.reduce(function (s, o) { return s + Math.max(0, o.s || 0); }, 0) : Math.max.apply(null, it.opts.map(function (o) { return o.s || 0; }).concat([0])); }); if (q.score && mx) q.max = mx;
  return q;
}
function renderQB() {
  var b = S.qb;
  var h = '<div class="dim" data-act="qbclose"></div><section class="drawer full qbd" role="dialog" aria-modal="true"><div class="dhead"><div class="dh-main"><div class="dh-kicker">' + LL('Конструктор анкеты', 'Questionnaire builder') + '</div><div class="dh-title">' + esc(b.nameS || LL('Новая анкета', 'New questionnaire')) + '</div></div><div class="dh-r"><button type="button" class="iconbtn" data-act="qbclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div></div><div class="dbody">';
  h += '<section class="card"><h3>' + LL('Основное', 'Basics') + '</h3><div class="fgrid"><div class="fld wide"><label>' + LL('Название', 'Name') + '</label><input type="text" data-sb="qb.nameS" value="' + esc(b.nameS) + '" placeholder="' + LL('Например: Качество жизни со стомой', 'E.g. Stoma quality of life') + '"></div><div class="fld wide"><label>' + LL('Описание для врача', 'Description for clinicians') + '</label><textarea rows="2" data-sb="qb.descS">' + esc(b.descS || '') + '</textarea></div>';
  h += '<div class="fld"><span class="lbl">' + LL('Считать сумму баллов', 'Sum up the score') + '</span><div class="seg"><button type="button" class="' + (b.score ? 'on' : '') + '" data-act="qbscore" data-v="1">' + LL('Да', 'Yes') + '</button><button type="button" class="' + (!b.score ? 'on' : '') + '" data-act="qbscore" data-v="0">' + LL('Нет', 'No') + '</button></div></div>';
  if (b.score) h += '<div class="fld wide"><label>' + LL('Интерпретация: диапазон = вывод, по строке', 'Interpretation: range = label, one per line') + '</label><textarea rows="3" data-sb="qb.bandsText" placeholder="0..10 = ' + LL('Норма', 'Normal') + '&#10;11..20 = ' + LL('Нарушение', 'Impaired') + '">' + esc(b.bandsText || '') + '</textarea></div>';
  h += '</div></section>';
  b.items.forEach(function (it, i) {
    var prev = b.items.slice(0, i).filter(function (z) { return z.type === 'single' || z.type === 'multi'; });
    h += '<section class="card qbi"><h3><span class="qbn">' + (i + 1) + '</span>' + LL('Вопрос', 'Question') + '<span class="h3-r"><button type="button" class="iconbtn sm" data-act="qbmove" data-i="' + i + '" data-d="-1" aria-label="up"' + (i ? '' : ' disabled') + '>' + ico('up', 16) + '</button><button type="button" class="iconbtn sm" data-act="qbmove" data-i="' + i + '" data-d="1" aria-label="down"' + (i < b.items.length - 1 ? '' : ' disabled') + '>' + ico('down', 16) + '</button><button type="button" class="iconbtn sm" data-act="qbdel" data-i="' + i + '" aria-label="' + LL('Удалить', 'Delete') + '">' + ico('x', 16) + '</button></span></h3><div class="fgrid">';
    h += '<div class="fld wide"><label>' + LL('Текст вопроса', 'Question text') + '</label><input type="text" data-sb="qb.items.' + i + '.textS" value="' + esc(it.textS || '') + '"></div>';
    h += '<div class="fld"><label>' + LL('Тип ответа', 'Answer type') + '</label><select data-sb="qb.items.' + i + '.type" data-rr="1">' + [['single', LL('Один вариант', 'Single choice')], ['multi', LL('Несколько вариантов', 'Multiple choice')], ['num', LL('Число', 'Number')], ['text', LL('Свободный текст', 'Free text')]].map(function (o) { return '<option value="' + o[0] + '"' + (it.type === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>';
    h += '<div class="fld"><label>' + LL('Показывать, только если вопрос…', 'Show only if question…') + '</label><select data-sb="qb.items.' + i + '.cond.q" data-rr="1"><option value="">' + LL('всегда показывать', 'always show') + '</option>' + prev.map(function (z) { return '<option value="' + z.id + '"' + (it.cond && it.cond.q === z.id ? ' selected' : '') + '>' + (b.items.indexOf(z) + 1) + '. ' + esc((z.textS || '').slice(0, 50)) + '</option>'; }).join('') + '</select></div>';
    if (it.cond && it.cond.q) { var cz = b.items.filter(function (z) { return z.id === it.cond.q; })[0]; var co = cz ? String(cz.optsText || '').split('\n').map(function (l) { return l.replace(/\s*=\s*-?[\d.,]+\s*$/, '').trim(); }).filter(Boolean) : []; h += '<div class="fld"><label>' + LL('…ответ равен', '…answer is') + '</label><select data-sb="qb.items.' + i + '.cond.a"><option value="">' + t('f.notSet') + '</option>' + co.map(function (o, oi) { return '<option value="' + oi + '"' + (String(it.cond.a) === String(oi) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></div>'; }
    if (it.type === 'single' || it.type === 'multi') h += '<div class="fld wide"><label>' + (b.score ? LL('Варианты ответа: по строке, «текст = балл»', 'Options: one per line, "text = points"') : LL('Варианты ответа: по строке', 'Options: one per line')) + '</label><textarea rows="4" data-sb="qb.items.' + i + '.optsText">' + esc(it.optsText || '') + '</textarea></div>';
    h += '</div></section>';
  });
  h += '<button type="button" class="btn addq" data-act="qbadd">' + ico('plus', 16) + LL('Добавить вопрос', 'Add question') + '</button>';
  h += '</div><div class="dfoot"><div>' + (!b.isNew ? '<button type="button" class="btn danger" data-act="qbremove">' + LL('Удалить анкету', 'Delete questionnaire') + '</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="qbclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="qbsave">' + t('b.save') + '</button></div></div></section>';
  return h;
}
function qbSave() {
  var b = S.qb; if (!String(b.nameS || '').trim()) { toast(LL('Укажите название анкеты', 'Enter a name')); return; }
  if (!b.items.some(function (it) { return String(it.textS || '').trim(); })) { toast(LL('Добавьте хотя бы один вопрос', 'Add at least one question')); return; }
  b.items = b.items.filter(function (it) { return String(it.textS || '').trim(); });
  var q = qbCompile(b); DB.qtpl = (DB.qtpl || []).filter(function (x) { return x.id !== q.id; }).concat([q]);
  S.qb = null; save(); toast(LL('Анкета сохранена', 'Questionnaire saved')); render();
}
function renderQPage() {
  var due = qDueAll(30), tab = UI.qtab || 'due';
  var h = '<div class="head"><div><div class="kicker">' + LL('Наука', 'Research') + '</div><h1>' + LL('Анкеты пациентов', 'Patient questionnaires') + '</h1><p class="sub">' + LL('Опросники исходов (PROMs): LARS, Wexner и свои анкеты. Назначение по срокам и заполнение на планшете.', 'Patient-reported outcomes: LARS, Wexner and your own. Scheduling by time point and tablet fill-in.') + '</p></div><div class="actions"><button type="button" class="btn primary" data-act="qbnew">' + ico('plus', 16) + LL('Новая анкета', 'New questionnaire') + '</button></div></div>';
  h += '<div class="tabs pad">' + [['due', LL('К заполнению', 'Due'), due.length], ['tpl', LL('Шаблоны анкет', 'Templates'), qTpls().length], ['res', LL('Результаты', 'Results'), null]].map(function (x) { return '<button type="button" class="tab' + (tab === x[0] ? ' on' : '') + '" data-act="qtab" data-v="' + x[0] + '">' + x[1] + (x[2] !== null ? '<span class="cnt">' + x[2] + '</span>' : '') + '</button>'; }).join('') + '</div>';
  if (tab === 'tpl') {
    h += '<div class="scards pad">' + qTpls().map(function (q) { return '<div class="scard qt"><span class="sc-ic">' + ico('clipboard', 20) + '</span><b>' + esc(qName(q)) + '</b><span class="muted">' + esc(L(q.desc || ['', ''])) + '</span><div class="sc-meta"><span>' + plural(q.items.length, 'pl.question') + '</span>' + (q.max ? '<span>0..' + q.max + LL(' баллов', ' points') + '</span>' : '') + (q.builtin ? '<span class="tag">' + LL('встроенная', 'built-in') + '</span>' : '') + '</div><div class="sc-act">' + (q.builtin ? '<button type="button" class="btn small" data-act="qbcopy" data-id="' + q.id + '">' + LL('Сделать копию', 'Duplicate') + '</button>' : '<button type="button" class="btn small" data-act="qbedit" data-id="' + q.id + '">' + LL('Изменить', 'Edit') + '</button>') + '</div></div>'; }).join('') + '<button type="button" class="scard new" data-act="qbnew"><span class="sc-ic">' + ico('plus', 20) + '</span><b>' + LL('Новая анкета', 'New questionnaire') + '</b><span class="muted">' + LL('Свои вопросы, баллы, интерпретация и ветвление: вопрос показывается только при нужном ответе.', 'Your own questions, scores, interpretation and branching.') + '</span></button></div>';
    return h;
  }
  if (tab === 'res') {
    var rows = []; DB.patients.forEach(function (p) { (p.q || []).forEach(function (e) { if (e.date) rows.push({ p: p, e: e }); }); });
    rows.sort(function (a, b) { return b.e.date.localeCompare(a.e.date); });
    h += '<div class="tablewrap">' + (rows.length ? '<table class="grid"><thead><tr><th>ID</th><th>' + t('col.fio') + '</th><th>' + LL('Анкета', 'Questionnaire') + '</th><th>' + LL('Срок', 'Time point') + '</th><th>' + LL('Дата', 'Date') + '</th><th>' + LL('Баллы', 'Score') + '</th><th>' + LL('Вывод', 'Result') + '</th></tr></thead><tbody>' + rows.map(function (x) { var q = qTpl(x.e.tid), b = qBand(q || {}, x.e.score); return '<tr data-act="openp" data-id="' + x.p.id + '" tabindex="0"><td class="mono">' + x.p.id + '</td><td class="strong">' + esc(pName(x.p)) + '</td><td>' + esc(qShort(q)) + '</td><td>' + esc(x.e.label || '') + '</td><td>' + fmtDate(x.e.date) + '</td><td class="num">' + (x.e.score !== null && x.e.score !== undefined ? x.e.score : '') + '</td><td>' + (b ? '<span class="st st-' + (b.c === 'ok' ? 'done' : b.c === 'due' ? 'cancel' : 'prog') + '">' + esc(L(b.t)) + '</span>' : '') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">' + LL('Пока нет заполненных анкет', 'No completed questionnaires yet') + '</div>') + '</div>';
    return h;
  }
  h += '<div class="tablewrap">' + (due.length ? '<table class="grid"><thead><tr><th>ID</th><th>' + t('col.fio') + '</th><th>' + LL('Анкета', 'Questionnaire') + '</th><th>' + LL('Срок', 'Time point') + '</th><th>' + LL('Заполнить до', 'Due') + '</th><th></th></tr></thead><tbody>' + due.map(function (x) { return '<tr data-act="openp" data-id="' + x.p.id + '" tabindex="0"><td class="mono">' + x.p.id + '</td><td class="strong">' + esc(pName(x.p)) + '</td><td>' + esc(qShort(qTpl(x.e.tid))) + '</td><td>' + esc(x.e.label || '') + '</td><td>' + (x.n < 0 ? '<span class="tag due">' + fmtDate(x.e.due) + ' · ' + daysLabel(x.n) + '</span>' : '<span class="tag">' + fmtDate(x.e.due) + ' · ' + daysLabel(x.n) + '</span>') + '</td><td><button type="button" class="btn small primary" data-act="qfill" data-pid="' + x.p.id + '" data-id="' + x.e.id + '">' + ico('tablet', 15) + LL('Заполнить', 'Fill in') + '</button></td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">' + LL('На ближайшие 30 дней анкет нет. Назначить анкету можно в карточке пациента, раздел «После операции».', 'Nothing due in the next 30 days. Schedule questionnaires in the patient card, After surgery section.') + '</div>') + '</div>';
  return h;
}

/* ======================= Studies: protocol, enrolment, randomisation ======================= */
var ST_TYPES = ['Диссертационное исследование', 'Инициативное исследование', 'НИР', 'Грантовое исследование', 'Контрактное исследование', 'Клиническое исследование лекарственного средства', 'Клиническая апробация', 'Внутренний грант'];
var ST_STATUS = ['Черновик', 'На согласовании', 'Одобрено ЛЭК', 'Набор пациентов', 'Набор завершён', 'Анализ данных', 'Завершено', 'Приостановлено'];
var ST_ST_CLS = { 'Черновик': 'plan', 'На согласовании': 'plan', 'Одобрено ЛЭК': 'prog', 'Набор пациентов': 'live', 'Набор завершён': 'prog', 'Анализ данных': 'prog', 'Завершено': 'done', 'Приостановлено': 'cancel' };
var ST_DESIGN = ['Рандомизированное контролируемое', 'Проспективное когортное', 'Ретроспективное когортное', 'Случай-контроль', 'Одномоментное (поперечное)', 'Регистровое наблюдательное', 'Серия случаев'];
var ST_ROLES = ['Руководитель', 'Автор протокола', 'Исполнитель', 'Монитор', 'Статистик', 'Координатор'];
var ST_AGE = ['Взрослые (18+)', 'Дети (до 18)', 'Все возрасты'];
var ST_DEG = ['PhD', 'Магистр', 'Резидент', 'Кандидат наук', 'Доктор наук'];
function newProto() {
  return { no: '', code: '', status: 'Черновик', type: 'Инициативное исследование', icd: 'C18, C19, C20', age: 'Взрослые (18+)', multi: 'Нет', centers: '', start: '', deadline: '', target: '', diss: {}, syn: {}, cps: [], team: [], incl: '', excl: '', rand: { on: 'Нет', arms: [{ name: 'A', limit: '' }, { name: 'B', limit: '' }], total: '', strat: [], mult: '1' }, blocks: {}, log: [], seq: 0 };
}
function nextStudyNo() { DB.studySeq = (DB.studySeq || 0) + 1; return 'КРС-' + new Date().getFullYear() + '-' + pad3(DB.studySeq); }
function stProto(r) { if (!r.proto) r.proto = newProto(); return r.proto; }
function enrolled(r) { return DB.patients.filter(function (p) { return p.enroll && p.enroll[r.id]; }); }
function stCount(r) { return regCount(r); }
function stLead(pr) { var l = (pr.team || []).filter(function (m) { return m.role === 'Руководитель'; })[0] || (pr.team || [])[0]; return l ? l.name : ''; }
function stTarget(pr) { var n = num(pr.target); return n && n > 0 ? n : null; }
function stNextCp(pr) { return (pr.cps || []).filter(function (c) { return !c.done && c.date; }).sort(function (a, b) { return a.date.localeCompare(b.date); })[0] || null; }
function lines(s) { return String(s || '').split('\n').map(function (l) { return l.replace(/^\s*[-•*\d.)]+\s*/, '').trim(); }).filter(Boolean); }
function stStatusPill(pr) { return '<span class="st st-' + (ST_ST_CLS[pr.status] || 'plan') + '">' + esc(ov(pr.status)) + '</span>'; }
function progressBar(n, of, cls) { var w = of ? Math.min(100, Math.round(n / of * 100)) : 0; return '<div class="pbar' + (cls ? ' ' + cls : '') + '"><span style="width:' + w + '%"></span></div>'; }

/* protocol editor (5 steps) */
var ST_STEPS = [['Параметры', 'Parameters'], ['Синопсис', 'Synopsis'], ['Контрольные точки', 'Checkpoints'], ['Участники', 'Team'], ['Набор и рандомизация', 'Enrolment and randomisation']];
function edF(lab, path, type, o) {
  o = o || {}; var v = getPath(S.edit, path), id = 'e_' + path.replace(/\./g, '_'), wide = o.wide ? ' wide' : '', fl = has(v) ? ' filled' : '';
  var lb = '<label for="' + id + '">' + esc(lab) + (o.req ? ' <i class="req">*</i>' : '') + '</label>';
  if (type === 'sel') return '<div class="fld f-sel' + wide + fl + '">' + lb + '<select id="' + id + '" data-ebind="' + path + '"' + (o.dis ? ' disabled' : '') + '><option value="">' + t('f.notSet') + '</option>' + o.opts.map(function (x) { return '<option value="' + esc(x) + '"' + (x === v ? ' selected' : '') + '>' + esc(ov(x)) + '</option>'; }).join('') + '</select>' + (o.hint ? '<p class="fhint">' + o.hint + '</p>' : '') + '</div>';
  if (type === 'seg') return '<div class="fld f-seg' + wide + fl + '"><span class="lbl">' + esc(lab) + '</span><div class="seg">' + o.opts.map(function (x) { return '<button type="button" class="' + (x === v ? 'on' : '') + '" data-act="eset" data-path="' + path + '" data-val="' + esc(x) + '"' + (o.dis ? ' disabled' : '') + '>' + esc(ov(x)) + '</button>'; }).join('') + '</div></div>';
  if (type === 'long') return '<div class="fld f-long wide' + fl + '">' + lb + '<textarea id="' + id + '" rows="' + (o.rows || 3) + '" data-ebind="' + path + '" placeholder="' + esc(o.ph || '') + '">' + esc(v || '') + '</textarea>' + (o.hint ? '<p class="fhint">' + o.hint + '</p>' : '') + '</div>';
  return '<div class="fld f-' + type + wide + fl + '">' + lb + '<input id="' + id + '" type="' + (type === 'num' ? 'number' : type) + '" data-ebind="' + path + '" value="' + esc(v || '') + '" placeholder="' + esc(o.ph || '') + '"' + (o.ro ? ' readonly' : '') + (o.dis ? ' disabled' : '') + '>' + (o.hint ? '<p class="fhint">' + o.hint + '</p>' : '') + '</div>';
}
function edWarnings(e) {
  var w = [], pr = e.proto;
  if (e.custom.length && !e.custom.some(function (c) { return c.uniq; })) w.push(LL('Среди своих полей нет уникального. Отметьте «уникальное» у поля, которое однозначно определяет запись (например номер образца), чтобы не было дублей.', 'No custom field is marked unique. Mark one that identifies a record (e.g. sample number) to prevent duplicates.'));
  var nreq = e.custom.filter(function (c) { return c.req; }).length;
  if (nreq > 5) w.push(LL('Обязательных полей ' + nreq + '. Больше 5 обязательных полей замедляет заполнение и приводит к пропускам; оставьте обязательными только ключевые.', nreq + ' required fields. More than 5 slows data entry; keep only key ones required.'));
  if (pr && pr.rand && pr.rand.on === 'Да') {
    var ns = (pr.rand.strat || []).length, na = (pr.rand.arms || []).filter(function (a) { return String(a.name || '').trim(); }).length;
    if (na < 2) w.push(LL('Для рандомизации нужны минимум 2 группы.', 'Randomisation needs at least 2 arms.'));
    if (ns > 3) w.push(LL('Факторов стратификации ' + ns + '. Больше 3 факторов дробит выборку на слишком мелкие страты и ломает баланс групп.', ns + ' stratification factors. More than 3 splits the sample into tiny strata.'));
    else if (ns === 3) w.push(LL('3 фактора стратификации: допустимо при большой выборке, обычно достаточно 2.', '3 stratification factors: acceptable for large samples, 2 is usually enough.'));
  }
  if (pr && !pr.deadline && e.kind === 'study') w.push(LL('Не указан дедлайн исследования: счётчик дней и напоминания работать не будут.', 'No study deadline: the day counter and reminders will not work.'));
  return w;
}
function tplPicker(e) {
  var tpls = (DB.templates || []).filter(function (x) { return (x.kind || 'reg') === (e.kind === 'study' ? 'study' : 'reg'); });
  if (!e.isNew || !tpls.length) return '';
  return '<section class="card tplcard"><h3>' + ico('copy', 18) + LL('Начать с шаблона', 'Start from a template') + '</h3><div class="tpls">' + tpls.map(function (x) { return '<div class="tplchip' + (e._tpl === x.id ? ' on' : '') + '"><button type="button" data-act="tpluse" data-id="' + x.id + '"><b>' + esc(x.name) + '</b><em>' + (x.custom || []).length + LL(' своих полей', ' custom fields') + '</em></button><button type="button" class="x" data-act="tpldel" data-id="' + x.id + '" aria-label="' + LL('Удалить шаблон', 'Delete template') + '">' + ico('x', 13) + '</button></div>'; }).join('') + '</div></section>';
}
function edWho(e) {
  var h = '<section class="card"><h3>' + t('ed.who') + '</h3><div class="modes">';
  [['auto', 'ed.auto', 'ed.autoHint'], ['manual', 'ed.manual', 'ed.manualHint']].forEach(function (m) { h += '<label class="modeopt' + (e.mode === m[0] ? ' on' : '') + '"><input type="radio" name="mode" data-ebind="mode" value="' + m[0] + '"' + (e.mode === m[0] ? ' checked' : '') + '><span><b>' + t(m[1]) + '</b><br><span class="hint">' + t(m[2]) + '</span></span></label>'; });
  h += '</div>';
  if (e.kind === 'study') h += '<p class="hint">' + LL('Кроме этого, в исследование всегда входят пациенты, включённые кнопкой «Включить пациента» с проверкой критериев.', 'Patients enrolled with the "Enrol patient" checklist are always included as well.') + '</p>';
  if (e.mode === 'auto') {
    h += '<div class="rules">';
    if (!e.rules.length) h += '<p class="hint">' + t('ed.noRules') + '</p>';
    e.rules.forEach(function (r, i) {
      var x = FIELD[r.f];
      h += '<div class="rule"><div class="ruletop"><span class="and">' + (i ? t('ed.and') : '') + '</span><select data-ebind="rules.' + i + '.f" aria-label="' + t('ed.field') + '">';
      RULE_FIELDS.forEach(function (z) { h += '<option value="' + z.id + '"' + (z.id === r.f ? ' selected' : '') + '>' + esc(L(z.label)) + '</option>'; });
      h += '</select><button type="button" class="iconbtn" aria-label="' + t('ed.delRule') + '" data-act="rdel" data-i="' + i + '">' + ico('x', 18) + '</button></div>';
      if (x.type === 'num') h += '<div class="ruletop"><span class="and"></span><div class="fld"><label>' + t('rule.from') + '</label><input type="number" step="any" data-ebind="rules.' + i + '.min" value="' + esc(r.min || '') + '"></div><div class="fld"><label>' + t('rule.to') + '</label><input type="number" step="any" data-ebind="rules.' + i + '.max" value="' + esc(r.max || '') + '"></div></div>';
      else h += '<div class="chips pad">' + x.options.map(function (o) { var on = (r.vals || []).indexOf(o) >= 0; return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="rval" data-i="' + i + '" data-val="' + esc(o) + '">' + esc(ov(o)) + '</button>'; }).join('') + '</div><p class="hint pad">' + t('ed.multi') + '</p>';
      h += '</div>';
    });
    h += '<button type="button" class="btn small" data-act="radd">' + ico('plus', 15) + t('ed.addRule') + '</button></div>';
  }
  var preview = DB.patients.filter(function (p) { return inReg(p, e); }).length;
  return h + '<p class="hint">' + t('ed.matches') + ' <b>' + plural(preview, 'pl.patient') + '</b></p></section>';
}
function edCustom(e) {
  var h = '<section class="card"><h3>' + t('ed.custom') + '</h3><p class="hint">' + t('ed.customHint') + '</p><div class="cfs">';
  e.custom.forEach(function (c, i) {
    h += '<div class="cfrow"><input type="text" placeholder="' + t('ed.cfName') + '" aria-label="' + t('ed.cfName') + '" data-ebind="custom.' + i + '.label" value="' + esc(c.label) + '"><select aria-label="' + t('ed.cfType') + '" data-ebind="custom.' + i + '.type">' + CF_TYPES.map(function (z) { return '<option value="' + z[0] + '"' + (z[0] === c.type ? ' selected' : '') + '>' + t(z[1]) + '</option>'; }).join('') + '</select>';
    h += c.type === 'sel' ? '<input type="text" placeholder="' + t('ed.cfOpts') + '" aria-label="' + t('ed.cfOpts') + '" data-ebind="custom.' + i + '.opts" value="' + esc(c.opts || '') + '">' : '<span></span>';
    h += '<div class="cfflags"><button type="button" class="flag' + (c.req ? ' on' : '') + '" data-act="cflag" data-i="' + i + '" data-k="req" title="' + LL('Без него карточку нельзя сохранить', 'Record cannot be saved without it') + '">' + LL('обязательное', 'required') + '</button><button type="button" class="flag' + (c.uniq ? ' on' : '') + '" data-act="cflag" data-i="' + i + '" data-k="uniq" title="' + LL('Значение не может повторяться у двух пациентов', 'Value cannot repeat across patients') + '">' + LL('уникальное', 'unique') + '</button></div>';
    h += '<button type="button" class="iconbtn" aria-label="' + t('ed.cfDel') + '" data-act="cdel" data-i="' + i + '">' + ico('x', 18) + '</button></div>';
  });
  return h + '<button type="button" class="btn small" data-act="cadd">' + ico('plus', 15) + t('ed.cfAdd') + '</button></div></section>';
}
function warnBox(w) { return w.length ? '<div class="warnbox"><b>' + ico('alert', 16) + LL('Проверка структуры', 'Structure check') + '</b><ul>' + w.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : ''; }
function renderEditor() {
  var e = S.edit;
  if (e.kind === 'study') return renderStudyEditor();
  var ttl = e.isNew ? t('ed.new') : t('ed.title');
  var h = '<div class="dim" data-act="eclose"></div><section class="modal" role="dialog" aria-modal="true" aria-label="' + esc(ttl) + '">';
  h += '<div class="dhead"><div><div class="dh-kicker">' + LL('Регистр', 'Registry') + '</div><div class="dh-title">' + ttl + '</div></div><button type="button" class="iconbtn" aria-label="' + t('a11y.close') + '" data-act="eclose">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += tplPicker(e);
  h += '<section class="card"><div class="fld wide"><label for="regname">' + t('ed.name') + '</label><input id="regname" type="text" data-ebind="name" value="' + esc(e.nameKey ? t(e.nameKey) : e.name) + '" placeholder="' + t('ed.namePh') + '"></div>';
  var opts = [['', t('ed.top')]];
  (function walk(pid, dep) { kids(pid, false).forEach(function (r) { if (r.id === e.id) return; opts.push([r.id, new Array(dep + 1).join('   ') + regName(r)]); walk(r.id, dep + 1); }); })(null, 0);
  h += '<div class="fld wide"><label for="regpar">' + t('ed.parent') + '</label><select id="regpar" data-ebind="parent">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + ((e.parent || '') === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select><p class="hint">' + t('ed.parentHint') + '</p></div></section>';
  h += edWho(e) + edCustom(e) + warnBox(edWarnings(e));
  h += '</div><div class="dfoot"><div class="actions">' + (e.isNew ? '' : '<button type="button" class="btn danger" data-act="edelete">' + t('ed.delete') + '</button>') + '<button type="button" class="btn ghost" data-act="tplsave">' + ico('copy', 15) + LL('Сохранить как шаблон', 'Save as template') + '</button></div><div class="actions"><button type="button" class="btn" data-act="eclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="esave">' + (e.isNew ? t('b.create') : t('b.save')) + '</button></div></div></section>';
  return h;
}
function renderStudyEditor() {
  var e = S.edit, pr = e.proto, step = e._step || 0, randLocked = (pr.log || []).length > 0;
  var h = '<div class="dim" data-act="eclose"></div><section class="drawer full sted" role="dialog" aria-modal="true">';
  h += '<div class="dhead"><div class="dh-main"><div class="dh-kicker">' + LL('Протокол исследования', 'Study protocol') + (pr.no ? ' · <span class="mono">' + esc(pr.no) + '</span>' : '') + '</div><div class="dh-title">' + esc((e.nameKey ? t(e.nameKey) : e.name) || LL('Новое исследование', 'New study')) + '</div></div><div class="dh-r">' + stStatusPill(pr) + '<button type="button" class="iconbtn" aria-label="' + t('a11y.close') + '" data-act="eclose">' + ico('x', 20) + '</button></div></div>';
  h += '<div class="stepper">' + ST_STEPS.map(function (s, i) { return '<button type="button" class="step' + (i === step ? ' on' : '') + (i < step ? ' past' : '') + '" data-act="estep" data-v="' + i + '"><span class="sn">' + (i < step ? ico('check', 14) : i + 1) + '</span><span class="sl">' + L(s) + '</span></button>'; }).join('') + '</div><div class="dbody">';
  if (step === 0) {
    h += tplPicker(e);
    h += '<section class="card"><h3>' + LL('Паспорт исследования', 'Study details') + '</h3><div class="fgrid">';
    h += '<div class="fld wide filled"><label for="regname">' + t('ed.studyName') + ' <i class="req">*</i></label><input id="regname" type="text" data-ebind="name" value="' + esc(e.nameKey ? t(e.nameKey) : e.name) + '" placeholder="' + t('ed.studyPh') + '"></div>';
    h += edF(LL('Регистрационный номер', 'Registration no.'), 'proto.no', 'text', { ro: true, ph: LL('присвоится при сохранении', 'assigned on save'), hint: LL('Уникальный, не меняется', 'Unique, never changes') });
    h += edF(LL('Краткий код для номеров пациентов', 'Short code for patient numbers'), 'proto.code', 'text', { ph: 'TNT', hint: LL('Номер пациента будет вида ', 'Patient numbers look like ') + esc((pr.code || 'CODE') + '-001') });
    h += edF(LL('Статус', 'Status'), 'proto.status', 'sel', { opts: ST_STATUS });
    h += edF(LL('Тип исследования', 'Study type'), 'proto.type', 'sel', { opts: ST_TYPES, wide: false });
    h += edF(LL('Коды МКБ-10', 'ICD-10 codes'), 'proto.icd', 'text', { ph: 'C18, C19, C20' });
    h += edF(LL('Возрастная группа', 'Age group'), 'proto.age', 'sel', { opts: ST_AGE });
    h += edF(LL('Многоцентровое', 'Multicentre'), 'proto.multi', 'seg', { opts: YN });
    if (pr.multi === 'Да') h += edF(LL('Центры-участники', 'Participating centres'), 'proto.centers', 'text', { wide: true });
    h += edF(LL('Дата начала', 'Start date'), 'proto.start', 'date');
    h += edF(LL('Дедлайн', 'Deadline'), 'proto.deadline', 'date', { hint: pr.deadline ? daysLabel(daysTo(pr.deadline)) : '' });
    h += edF(LL('Планируемый объём выборки', 'Target sample size'), 'proto.target', 'num', { ph: '120' });
    h += '<div class="fld wide"><label for="regdesc">' + t('ed.desc') + '</label><textarea id="regdesc" rows="2" data-ebind="desc" placeholder="' + t('ed.descPh') + '">' + esc(e.desc || '') + '</textarea></div></div></section>';
    var diss = pr.type === 'Диссертационное исследование';
    h += '<section class="card' + (diss ? '' : ' soft') + '"><h3>' + ico('cap', 18) + LL('Соискатель и диссертация', 'Applicant and dissertation') + '<span class="h3-note">' + (diss ? LL('заполните для диссертационной работы', 'fill for dissertation work') : LL('необязательно', 'optional')) + '</span></h3>';
    if (diss || S.edShowDiss) h += '<div class="fgrid">' + edF(LL('Соискатель', 'Applicant'), 'proto.diss.applicant', 'text') + edF(LL('Научный руководитель', 'Supervisor'), 'proto.diss.supervisor', 'text') + edF(LL('Степень', 'Degree'), 'proto.diss.degree', 'sel', { opts: ST_DEG }) + edF(LL('Шифр специальности', 'Specialty code'), 'proto.diss.spec', 'text', { ph: '14.01.12' }) + edF(LL('Тема диссертации', 'Dissertation title'), 'proto.diss.title', 'text', { wide: true }) + edF(LL('Планируемая защита', 'Planned defence'), 'proto.diss.defense', 'date') + '</div>';
    else h += '<button type="button" class="linkbtn" data-act="edshowdiss">' + LL('Добавить сведения о соискателе', 'Add applicant details') + '</button>';
    h += '</section>';
  }
  if (step === 1) {
    h += '<section class="card"><h3>' + LL('Синопсис', 'Synopsis') + '</h3><div class="fgrid">';
    h += edF(LL('Актуальность', 'Background'), 'proto.syn.act', 'long', { rows: 4 });
    h += edF(LL('Цель', 'Aim'), 'proto.syn.aim', 'long', { rows: 2 });
    h += edF(LL('Задачи', 'Objectives'), 'proto.syn.tasks', 'long', { rows: 4, ph: LL('По одной задаче в строке', 'One objective per line') });
    h += edF(LL('Дизайн', 'Design'), 'proto.syn.design', 'sel', { opts: ST_DESIGN });
    h += edF(LL('Группы сравнения', 'Comparison groups'), 'proto.syn.groups', 'text', { wide: true });
    h += edF(LL('Первичная конечная точка', 'Primary endpoint'), 'proto.syn.endpoint', 'text', { wide: true });
    h += edF(LL('Статистическая гипотеза и расчёт выборки', 'Statistical hypothesis and sample size'), 'proto.syn.hyp', 'long', { rows: 3 });
    h += edF(LL('Методология', 'Methods'), 'proto.syn.meth', 'long', { rows: 4 });
    h += edF(LL('Ожидаемые результаты', 'Expected results'), 'proto.syn.exp', 'long', { rows: 3 });
    h += '</div></section>';
  }
  if (step === 2) {
    h += '<section class="card"><h3>' + LL('Контрольные точки', 'Checkpoints') + '<span class="h3-note">' + (pr.deadline ? LL('дедлайн ', 'deadline ') + fmtDate(pr.deadline) + ', ' + daysLabel(daysTo(pr.deadline)) : LL('дедлайн не указан', 'no deadline')) + '</span></h3><p class="hint">' + LL('Промежуточные отчёты, этапы набора, подача статьи. Приближающиеся и просроченные точки появятся в уведомлениях.', 'Interim reports, recruitment milestones, manuscript submission. Upcoming and overdue points appear in notifications.') + '</p><div class="elist">';
    (pr.cps || []).forEach(function (c, i) { var dn = daysTo(c.date); h += '<div class="erow cp"><input type="text" data-ebind="proto.cps.' + i + '.title" value="' + esc(c.title || '') + '" placeholder="' + LL('Например: промежуточный отчёт в ЛЭК', 'E.g. interim report to ethics committee') + '"><input type="date" data-ebind="proto.cps.' + i + '.date" value="' + esc(c.date || '') + '"><button type="button" class="flag' + (c.done ? ' on' : '') + '" data-act="eset" data-path="proto.cps.' + i + '.done" data-val="' + (c.done ? '' : '1') + '">' + (c.done ? LL('выполнено', 'done') : LL('отметить', 'mark done')) + '</button><span class="dn ' + (c.done ? 'ok' : dn !== null && dn < 0 ? 'due' : '') + '">' + (c.done ? '' : daysLabel(dn)) + '</span><button type="button" class="iconbtn sm" data-act="elistdel" data-list="proto.cps" data-i="' + i + '" aria-label="' + LL('Удалить', 'Delete') + '">' + ico('x', 16) + '</button></div>'; });
    h += '</div><button type="button" class="btn small" data-act="elistadd" data-list="proto.cps" data-tpl=\'{"title":"","date":""}\'>' + ico('plus', 15) + LL('Добавить точку', 'Add checkpoint') + '</button></section>';
  }
  if (step === 3) {
    h += '<section class="card"><h3>' + LL('Команда исследования', 'Study team') + '</h3><p class="hint">' + LL('Роли информационные. Разграничение прав по ролям появится вместе с сервером и учётными записями.', 'Roles are informational. Role-based permissions will come with the server and user accounts.') + '</p><div class="elist">';
    (pr.team || []).forEach(function (m, i) { h += '<div class="erow tm"><span class="av">' + esc(initials(m.name)) + '</span><input type="text" data-ebind="proto.team.' + i + '.name" value="' + esc(m.name || '') + '" placeholder="' + LL('ФИО', 'Full name') + '"><select data-ebind="proto.team.' + i + '.role">' + ST_ROLES.map(function (r) { return '<option' + (r === m.role ? ' selected' : '') + ' value="' + esc(r) + '">' + esc(ov(r)) + '</option>'; }).join('') + '</select><input type="text" data-ebind="proto.team.' + i + '.contact" value="' + esc(m.contact || '') + '" placeholder="' + LL('Телефон или почта', 'Phone or email') + '"><button type="button" class="iconbtn sm" data-act="elistdel" data-list="proto.team" data-i="' + i + '" aria-label="' + LL('Удалить', 'Delete') + '">' + ico('x', 16) + '</button></div>'; });
    h += '</div><button type="button" class="btn small" data-act="elistadd" data-list="proto.team" data-tpl=\'{"name":"","role":"Исполнитель","contact":""}\'>' + ico('plus', 15) + LL('Добавить участника', 'Add member') + '</button></section>';
  }
  if (step === 4) {
    h += '<section class="card"><h3>' + LL('Критерии отбора', 'Eligibility criteria') + '</h3><p class="hint">' + LL('По одному критерию в строке. При включении пациента врач пройдёт по ним чек-листом: все критерии включения должны выполняться, критерии невключения должны отсутствовать.', 'One criterion per line. On enrolment the clinician goes through them as a checklist.') + '</p><div class="fgrid">' + edF(LL('Критерии включения', 'Inclusion criteria'), 'proto.incl', 'long', { rows: 5, ph: LL('Аденокарцинома прямой кишки\ncT3-4 и/или cN+\nECOG 0-1', 'Rectal adenocarcinoma\ncT3-4 and/or cN+\nECOG 0-1') }) + edF(LL('Критерии невключения', 'Exclusion criteria'), 'proto.excl', 'long', { rows: 4, ph: LL('Отдалённые метастазы\nБеременность', 'Distant metastases\nPregnancy') }) + '</div></section>';
    h += '<section class="card"><h3>' + ico('shuffle', 18) + LL('Рандомизация', 'Randomisation') + '</h3>';
    if (randLocked) h += '<div class="lockbox">' + ico('lock', 16) + LL('Рандомизация уже начата (' + pr.log.length + '). Параметры заблокированы, чтобы не нарушить последовательность распределения.', 'Randomisation has started (' + pr.log.length + '). Settings are locked to protect the allocation sequence.') + '</div>';
    h += '<div class="fgrid">' + edF(LL('Использовать рандомизацию', 'Use randomisation'), 'proto.rand.on', 'seg', { opts: YN, dis: randLocked });
    if (pr.rand.on === 'Да') {
      var nA = pr.rand.arms.length;
      h += edF(LL('Общий лимит пациентов', 'Total limit'), 'proto.rand.total', 'num', { ph: LL('без лимита', 'no limit'), dis: randLocked });
      h += edF(LL('Размер блока', 'Block size'), 'proto.rand.mult', 'sel', { opts: ['1', '2', '3', 'mix'], dis: randLocked, hint: LL('1 = блок из ' + nA + ', 2 = из ' + nA * 2 + ', 3 = из ' + nA * 3 + '; mix = случайно ' + nA * 2 + ' или ' + nA * 3, '1 = block of ' + nA + ', 2 = of ' + nA * 2 + ', 3 = of ' + nA * 3 + '; mix = random ' + nA * 2 + ' or ' + nA * 3) });
      h += '</div><div class="xlab">' + LL('Группы (плечи)', 'Arms') + '</div><div class="elist">';
      pr.rand.arms.forEach(function (a, i) { h += '<div class="erow arm"><span class="armdot a' + (i % 6) + '">' + String.fromCharCode(65 + i) + '</span><input type="text" data-ebind="proto.rand.arms.' + i + '.name" value="' + esc(a.name || '') + '" placeholder="' + LL('Название группы', 'Arm name') + '"' + (randLocked ? ' disabled' : '') + '><input type="number" data-ebind="proto.rand.arms.' + i + '.limit" value="' + esc(a.limit || '') + '" placeholder="' + LL('лимит', 'limit') + '"' + (randLocked ? ' disabled' : '') + '>' + (randLocked || nA <= 2 ? '<span></span>' : '<button type="button" class="iconbtn sm" data-act="elistdel" data-list="proto.rand.arms" data-i="' + i + '" aria-label="' + LL('Удалить', 'Delete') + '">' + ico('x', 16) + '</button>') + '</div>'; });
      h += '</div>' + (randLocked ? '' : '<button type="button" class="btn small" data-act="elistadd" data-list="proto.rand.arms" data-tpl=\'{"name":"","limit":""}\'>' + ico('plus', 15) + LL('Добавить группу', 'Add arm') + '</button>');
      h += '<div class="xlab">' + LL('Стратификация: факторы', 'Stratification factors') + '</div><div class="chips">' + RULE_FIELDS.filter(function (x) { return x.type === 'sel' || x.type === 'seg'; }).map(function (x) { var on = (pr.rand.strat || []).indexOf(x.id) >= 0; return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="estrat" data-f="' + x.id + '"' + (randLocked ? ' disabled' : '') + '>' + esc(L(x.label)) + '</button>'; }).join('') + '</div><p class="hint">' + LL('Стратифицированная блоковая рандомизация: внутри каждой комбинации факторов группы уравновешиваются блоками, порядок в блоке перемешивается криптографическим генератором.', 'Stratified block randomisation: arms are balanced by blocks within each stratum, block order is shuffled with a cryptographic generator.') + '</p>';
    } else h += '</div>';
    h += '</section>' + edWho(e) + edCustom(e);
  }
  h += warnBox(step === 4 ? edWarnings(e) : []);
  h += '</div><div class="dfoot"><div class="actions">' + (e.isNew ? '' : '<button type="button" class="btn danger" data-act="edelete">' + t('ed.delete') + '</button>') + '<button type="button" class="btn ghost" data-act="tplsave">' + ico('copy', 15) + LL('Сохранить как шаблон', 'Save as template') + '</button></div><div class="actions">' + (step ? '<button type="button" class="btn" data-act="estep" data-v="' + (step - 1) + '">' + ico('left', 16) + LL('Назад', 'Back') + '</button>' : '') + (step < 4 ? '<button type="button" class="btn" data-act="estep" data-v="' + (step + 1) + '">' + LL('Далее', 'Next') + ico('right', 16) + '</button>' : '') + '<button type="button" class="btn primary" data-act="esave">' + (e.isNew ? LL('Создать исследование', 'Create study') : t('b.save')) + '</button></div></div></section>';
  return h;
}
function applyTemplate(id) {
  var tp = (DB.templates || []).filter(function (x) { return x.id === id; })[0], e = S.edit; if (!tp) return;
  e.mode = tp.mode; e.rules = clone(tp.rules || []); e.custom = clone(tp.custom || []).map(function (c) { c.id = uid('c'); return c; });
  if (!e.name) e.name = tp.name;
  if (tp.desc) e.desc = tp.desc;
  if (e.kind === 'study' && tp.proto) { var keep = e.proto; e.proto = clone(tp.proto); e.proto.no = keep.no; e.proto.status = 'Черновик'; e.proto.log = []; e.proto.blocks = {}; e.proto.seq = 0; e.proto.cps = (e.proto.cps || []).map(function (c) { return { title: c.title, date: '', done: '' }; }); }
  e._tpl = id; toast(LL('Шаблон применён: ', 'Template applied: ') + tp.name); render();
}
function saveTemplate() {
  var e = S.edit, nm = prompt(LL('Название шаблона', 'Template name'), (e.nameKey ? t(e.nameKey) : e.name) || ''); if (!nm) return;
  var tp = { id: uid('tp'), name: nm, kind: e.kind === 'study' ? 'study' : 'reg', mode: e.mode, rules: clone(e.rules), custom: clone(e.custom).filter(function (c) { return String(c.label || '').trim(); }), desc: e.desc || '' };
  if (e.kind === 'study') { tp.proto = clone(e.proto); tp.proto.no = ''; tp.proto.log = []; tp.proto.blocks = {}; tp.proto.seq = 0; tp.proto.team = []; }
  DB.templates = (DB.templates || []).concat([tp]); save(); toast(LL('Шаблон сохранён: ', 'Template saved: ') + nm);
}

/* enrolment */
function openEnroll(sid, pid) { var r = regOf(sid); if (!r) return; S.enr = { sid: sid, pid: pid || '', inc: {}, exc: {}, date: isoOf(new Date()), rand: stProto(r).rand.on === 'Да' }; S.menu = null; render(); }
function nextPatNo(r) { var pr = stProto(r), code = String(pr.code || '').trim() || (pr.no ? pr.no.replace(/^КРС-\d{4}-/, 'S') : 'S'), used = {}; enrolled(r).forEach(function (p) { used[p.enroll[r.id].no] = 1; }); var n = (pr.seq || 0) + 1; while (used[code + '-' + pad3(n)]) n++; return { no: code + '-' + pad3(n), n: n }; }
function renderEnroll() {
  var o = S.enr, r = regOf(o.sid), pr = stProto(r), inc = lines(pr.incl), exc = lines(pr.excl);
  var cand = DB.patients.filter(function (p) { return !(p.enroll && p.enroll[r.id]); }).sort(function (a, b) { return pName(a).localeCompare(pName(b), locale()); });
  var allInc = inc.every(function (x, i) { return o.inc[i]; }), allExc = exc.every(function (x, i) { return o.exc[i]; }), ok = o.pid && allInc && allExc && o.date;
  var nx = nextPatNo(r);
  var h = '<div class="dim" data-act="enrclose"></div><section class="modal xmodal wide" role="dialog" aria-modal="true"><div class="dhead"><div><div class="dh-kicker">' + LL('Включение в исследование', 'Enrolment') + ' · <span class="mono">' + esc(pr.no || '') + '</span></div><div class="dh-title">' + esc(regName(r)) + '</div></div><button type="button" class="iconbtn" data-act="enrclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<div class="fgrid"><div class="fld wide' + (o.pid ? ' filled' : '') + '"><label>' + LL('Пациент', 'Patient') + '</label><select data-sb="enr.pid" data-rr="1"><option value="">' + LL('Выберите пациента', 'Choose a patient') + '</option>' + cand.map(function (p) { return '<option value="' + p.id + '"' + (o.pid === p.id ? ' selected' : '') + '>' + esc(pName(p)) + ' · ' + p.id + (p.d.ib ? ' · ИБ ' + esc(p.d.ib) : '') + '</option>'; }).join('') + '</select></div>';
  h += '<div class="fld filled"><label>' + LL('Дата включения', 'Enrolment date') + '</label><input type="date" data-sb="enr.date" value="' + esc(o.date) + '"></div><div class="fld filled"><label>' + LL('Номер в исследовании', 'Study number') + '</label><input type="text" value="' + esc(nx.no) + '" readonly class="mono"></div></div>';
  h += '<div class="crit"><div class="xlab">' + ico('check', 15) + LL('Критерии включения: отметьте, что пациент соответствует', 'Inclusion: confirm the patient meets each') + '</div>' + (inc.length ? inc.map(function (x, i) { return '<label class="chk crit-i' + (o.inc[i] ? ' on' : '') + '"><input type="checkbox" data-sb="enr.inc.' + i + '"' + (o.inc[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label>'; }).join('') : '<p class="hint">' + LL('В протоколе не указаны. Их можно добавить на шаге «Набор и рандомизация».', 'None in the protocol. Add them on the Enrolment step.') + '</p>') + '</div>';
  h += '<div class="crit exc"><div class="xlab">' + ico('x', 15) + LL('Критерии невключения: подтвердите, что их нет', 'Exclusion: confirm none apply') + '</div>' + (exc.length ? exc.map(function (x, i) { return '<label class="chk crit-i' + (o.exc[i] ? ' on' : '') + '"><input type="checkbox" data-sb="enr.exc.' + i + '"' + (o.exc[i] ? ' checked' : '') + '><span>' + LL('Нет: ', 'Absent: ') + esc(x) + '</span></label>'; }).join('') : '<p class="hint">' + LL('Не указаны.', 'None specified.') + '</p>') + '</div>';
  if (pr.rand.on === 'Да') h += '<label class="chk big randchk"><input type="checkbox" data-sb="enr.rand"' + (o.rand ? ' checked' : '') + '><span><b>' + ico('shuffle', 16) + LL('Сразу рандомизировать', 'Randomise now') + '</b><em>' + LL('группа назначится автоматически и запишется в неизменяемый журнал', 'the arm is assigned automatically and written to the immutable log') + '</em></span></label>';
  h += '</div><div class="dfoot"><div class="hint">' + (ok ? '' : LL('Кнопка станет активной, когда выбран пациент и отмечены все пункты.', 'The button activates when a patient is chosen and all items are ticked.')) + '</div><div class="actions"><button type="button" class="btn" data-act="enrclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="enrgo"' + (ok ? '' : ' disabled') + '>' + LL('Включить', 'Enrol') + '</button></div></div></section>';
  return h;
}
function doEnroll() {
  var o = S.enr, r = regOf(o.sid), pr = stProto(r), nx = nextPatNo(r), p = findPat(o.pid); if (!p) return;
  var ent = { date: o.date, no: nx.no, by: me(), at: nowIso(), inc: lines(pr.incl), exc: lines(pr.excl) };
  pr.seq = nx.n;
  withPat(p.id, function (x) { x.enroll = x.enroll || {}; x.enroll[r.id] = clone(ent); x.log = (x.log || []).concat([{ ts: nowIso(), by: me(), act: 'enroll', note: regName(r) + ', ' + nx.no, ch: [] }]); });
  var rnd = o.rand && pr.rand.on === 'Да';
  S.enr = null; save();
  if (rnd) randomize(r.id, p.id); else { toast(LL('Пациент включён: ', 'Enrolled: ') + nx.no); render(); }
}
function unenroll(sid, pid) {
  var r = regOf(sid), p = findPat(pid); if (!r || !p || !p.enroll || !p.enroll[sid]) return;
  if (p.enroll[sid].arm) { toast(LL('Пациент уже рандомизирован: исключить нельзя, запись журнала неизменяема. Отметьте выбывание в комментарии.', 'Already randomised: cannot be removed, the log is immutable. Note the withdrawal in a comment.')); return; }
  if (!confirm(LL('Исключить пациента из исследования?', 'Remove this patient from the study?'))) return;
  withPat(pid, function (x) { delete x.enroll[sid]; x.log = (x.log || []).concat([{ ts: nowIso(), by: me(), act: 'edit', note: LL('исключён из исследования ', 'removed from study ') + regName(r), ch: [] }]); });
  save(); render();
}

/* stratified permuted-block randomisation */
function stratKey(pr, p) { return (pr.rand.strat || []).map(function (f) { return has(p.d[f]) ? String(p.d[f]) : '∅'; }).join(' | ') || LL('все', 'all'); }
function stratText(pr, p) { return (pr.rand.strat || []).map(function (f) { return L(FIELD[f].label) + ': ' + (has(p.d[f]) ? ov(p.d[f]) : LL('не указано', 'n/a')); }).join('; ') || LL('без стратификации', 'no stratification'); }
function armCounts(pr) { var c = {}; (pr.log || []).forEach(function (e) { c[e.arm] = (c[e.arm] || 0) + 1; }); return c; }
function randomize(sid, pid) {
  var r = regOf(sid), pr = stProto(r), p = findPat(pid);
  if (!p || !p.enroll || !p.enroll[sid]) { toast(LL('Сначала включите пациента в исследование', 'Enrol the patient first')); return; }
  if (p.enroll[sid].arm) { toast(LL('Пациент уже рандомизирован', 'Already randomised')); return; }
  var arms = (pr.rand.arms || []).filter(function (a) { return String(a.name || '').trim(); });
  if (pr.rand.on !== 'Да' || arms.length < 2) { toast(LL('Рандомизация не настроена: нужно минимум 2 группы', 'Randomisation not set up: at least 2 arms needed')); return; }
  var cnt = armCounts(pr), tot = (pr.log || []).length, lim = num(pr.rand.total);
  if (lim && tot >= lim) { toast(LL('Достигнут общий лимит рандомизации', 'Total randomisation limit reached')); return; }
  var open = arms.filter(function (a) { var l = num(a.limit); return !l || (cnt[a.name] || 0) < l; });
  if (!open.length) { toast(LL('Все группы заполнены', 'All arms are full')); return; }
  var key = stratKey(pr, p); pr.blocks = pr.blocks || {};
  var q = (pr.blocks[key] || []).filter(function (n) { return open.some(function (a) { return a.name === n; }); }), bn = null;
  if (!q.length) {
    var m = pr.rand.mult === 'mix' ? (Math.random() < 0.5 ? 2 : 3) : (+pr.rand.mult || 1), blk = [];
    for (var i = 0; i < m; i++) arms.forEach(function (a) { blk.push(a.name); });
    q = shuffleCrypto(blk).filter(function (n) { return open.some(function (a) { return a.name === n; }); });
    pr.blockNo = (pr.blockNo || 0) + 1; bn = pr.blockNo;
  }
  var arm = q.shift(); pr.blocks[key] = q;
  var ent = { n: tot + 1, ts: nowIso(), pid: p.id, no: p.enroll[sid].no, stratum: stratText(pr, p), arm: arm, by: me(), block: bn || pr.blockNo || 1, size: null };
  pr.log = (pr.log || []).concat([Object.freeze(ent)]);
  withPat(p.id, function (x) { x.enroll[sid].arm = arm; x.enroll[sid].randAt = ent.ts; x.log = (x.log || []).concat([{ ts: ent.ts, by: me(), act: 'rand', note: regName(r) + ': ' + arm, ch: [] }]); });
  save(); S.randShow = { sid: sid, arm: arm, no: ent.no, name: pName(p), n: ent.n }; render();
}
function renderRandShow() {
  var o = S.randShow, r = regOf(o.sid), pr = stProto(r), ai = (pr.rand.arms || []).map(function (a) { return a.name; }).indexOf(o.arm);
  return '<div class="dim" data-act="rsclose"></div><section class="modal rshow" role="dialog" aria-modal="true"><div class="rs-in"><div class="rs-k">' + LL('Результат рандомизации', 'Randomisation result') + ' #' + o.n + '</div><div class="rs-arm a' + (ai % 6) + '">' + esc(o.arm) + '</div><div class="rs-p"><b>' + esc(o.name) + '</b><span class="mono">' + esc(o.no) + '</span></div><p class="hint">' + LL('Запись внесена в журнал рандомизации. Изменить или удалить её нельзя.', 'The entry is written to the randomisation log and cannot be changed or deleted.') + '</p><button type="button" class="btn primary" data-act="rsclose">' + LL('Понятно', 'OK') + '</button></div></section>';
}

/* study page */
function studyHead(r) {
  var pr = stProto(r), n = stCount(r), tg = stTarget(pr), dl = daysTo(pr.deadline), cp = stNextCp(pr), lead = stLead(pr);
  var h = '<div class="shead"><div class="sh-l"><div class="crumbs"><button type="button" class="crumb" data-act="view" data-v="studies">' + t('nav.studies') + '</button><span class="csep">/</span><span class="mono">' + esc(pr.no || '') + '</span></div><h1>' + esc(regName(r)) + '</h1><div class="sh-tags">' + stStatusPill(pr) + '<span class="pill">' + esc(ov(pr.type || '')) + '</span>' + (pr.syn && pr.syn.design ? '<span class="pill">' + esc(ov(pr.syn.design)) + '</span>' : '') + (pr.rand.on === 'Да' ? '<span class="pill">' + ico('shuffle', 13) + LL('рандомизация', 'randomised') + '</span>' : '') + '</div>' + ((pr.syn && pr.syn.aim) || r.desc ? '<p class="sub">' + esc((pr.syn && pr.syn.aim) || r.desc) + '</p>' : '') + '</div>';
  h += '<div class="actions"><button type="button" class="btn" data-act="editreg" data-id="' + r.id + '">' + ico('doc', 16) + LL('Протокол', 'Protocol') + '</button><button type="button" class="btn" data-act="csv">' + ico('download', 16) + LL('Экспорт', 'Export') + '</button><button type="button" class="btn primary" data-act="enroll" data-id="' + r.id + '">' + ico('plus', 16) + LL('Включить пациента', 'Enrol patient') + '</button></div></div>';
  h += '<div class="smeta"><div class="smi"><span>' + LL('Набор', 'Recruitment') + '</span><b>' + n + (tg ? '<i> / ' + tg + '</i>' : '') + '</b>' + (tg ? progressBar(n, tg) : '') + '</div><div class="smi"><span>' + LL('Дедлайн', 'Deadline') + '</span><b>' + (pr.deadline ? fmtDate(pr.deadline) : LL('не указан', 'not set')) + '</b><em class="' + (dl !== null && dl < 0 ? 'due' : '') + '">' + daysLabel(dl) + '</em></div><div class="smi"><span>' + LL('Ближайшая точка', 'Next checkpoint') + '</span><b>' + (cp ? esc(cp.title) : LL('нет', 'none')) + '</b><em>' + (cp ? fmtDate(cp.date) + ', ' + daysLabel(daysTo(cp.date)) : '') + '</em></div><div class="smi"><span>' + LL('Руководитель', 'Lead') + '</span><b>' + esc(lead || LL('не указан', 'not set')) + '</b><em>' + (pr.start ? LL('с ', 'since ') + fmtDate(pr.start) + ', ' + plural(Math.max(0, -daysTo(pr.start)), 'pl.day') : '') + '</em></div></div>';
  var tab = UI.stab || 'pts';
  h += '<div class="tabs pad">' + [['pts', LL('Пациенты', 'Patients'), n], ['proto', LL('Протокол', 'Protocol'), null], ['rand', LL('Рандомизация', 'Randomisation'), pr.rand.on === 'Да' ? (pr.log || []).length : null], ['cps', LL('Контрольные точки', 'Checkpoints'), (pr.cps || []).length]].filter(function (x) { return x[0] !== 'rand' || pr.rand.on === 'Да'; }).map(function (x) { return '<button type="button" class="tab' + (tab === x[0] ? ' on' : '') + '" data-act="stab" data-v="' + x[0] + '">' + x[1] + (x[2] !== null ? '<span class="cnt">' + x[2] + '</span>' : '') + '</button>'; }).join('') + (tab === 'pts' ? '<span class="tabs-r"><input class="search" type="search" data-act="search" placeholder="' + t('reg.search') + '" aria-label="' + t('reg.search') + '" value="' + esc(S.q) + '"></span>' : '') + '</div>';
  return h;
}
function dl2(k, v) { return has(v) ? '<div class="dl"><dt>' + esc(k) + '</dt><dd>' + esc(v).replace(/\n/g, '<br>') + '</dd></div>' : ''; }
function studyTabBody(r) {
  var pr = stProto(r), tab = UI.stab || 'pts', s = pr.syn || {};
  if (tab === 'proto') {
    var h = '<div class="pview"><section class="card"><h3>' + LL('Паспорт', 'Details') + '</h3><dl class="dls">' + dl2(LL('Номер', 'Number'), pr.no) + dl2(LL('Тип', 'Type'), ov(pr.type)) + dl2(LL('Статус', 'Status'), ov(pr.status)) + dl2(LL('МКБ-10', 'ICD-10'), pr.icd) + dl2(LL('Возраст', 'Age'), ov(pr.age)) + dl2(LL('Многоцентровое', 'Multicentre'), ov(pr.multi) + (pr.centers ? ': ' + pr.centers : '')) + dl2(LL('Начало', 'Start'), fmtDate(pr.start)) + dl2(LL('Дедлайн', 'Deadline'), fmtDate(pr.deadline)) + dl2(LL('Объём выборки', 'Sample size'), pr.target) + '</dl></section>';
    var d = pr.diss || {}; if (d.applicant || d.title) h += '<section class="card"><h3>' + LL('Диссертация', 'Dissertation') + '</h3><dl class="dls">' + dl2(LL('Соискатель', 'Applicant'), d.applicant) + dl2(LL('Руководитель', 'Supervisor'), d.supervisor) + dl2(LL('Степень', 'Degree'), d.degree) + dl2(LL('Шифр', 'Code'), d.spec) + dl2(LL('Тема', 'Title'), d.title) + dl2(LL('Защита', 'Defence'), fmtDate(d.defense)) + '</dl></section>';
    h += '<section class="card"><h3>' + LL('Синопсис', 'Synopsis') + '</h3>' + ([s.act, s.aim, s.tasks, s.design, s.hyp, s.meth, s.exp].some(has) ? '<dl class="dls wide">' + dl2(LL('Актуальность', 'Background'), s.act) + dl2(LL('Цель', 'Aim'), s.aim) + dl2(LL('Задачи', 'Objectives'), s.tasks) + dl2(LL('Дизайн', 'Design'), ov(s.design)) + dl2(LL('Группы', 'Groups'), s.groups) + dl2(LL('Первичная конечная точка', 'Primary endpoint'), s.endpoint) + dl2(LL('Гипотеза', 'Hypothesis'), s.hyp) + dl2(LL('Методология', 'Methods'), s.meth) + dl2(LL('Ожидаемые результаты', 'Expected results'), s.exp) + '</dl>' : '<p class="hint">' + LL('Синопсис не заполнен. Откройте «Протокол», шаг 2.', 'Synopsis is empty. Open Protocol, step 2.') + '</p>') + '</section>';
    h += '<section class="card"><h3>' + LL('Критерии', 'Criteria') + '</h3><div class="crit2"><div><div class="xlab">' + LL('Включения', 'Inclusion') + '</div><ul class="cl ok">' + lines(pr.incl).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div><div><div class="xlab">' + LL('Невключения', 'Exclusion') + '</div><ul class="cl no">' + lines(pr.excl).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div></section>';
    h += '<section class="card"><h3>' + LL('Команда', 'Team') + '</h3>' + ((pr.team || []).length ? '<div class="team">' + pr.team.map(function (m) { return '<div class="tmc"><span class="av">' + esc(initials(m.name)) + '</span><div><b>' + esc(m.name) + '</b><span>' + esc(ov(m.role)) + (m.contact ? ' · ' + esc(m.contact) : '') + '</span></div></div>'; }).join('') + '</div>' : '<p class="hint">' + LL('Участники не указаны.', 'No members yet.') + '</p>') + '</section></div>';
    return h;
  }
  if (tab === 'rand') {
    var cnt = armCounts(pr), arms = pr.rand.arms || [], tot = (pr.log || []).length;
    var h2 = '<div class="pview"><section class="card full"><h3>' + ico('shuffle', 18) + LL('Группы', 'Arms') + '<span class="h3-note">' + LL('всего ', 'total ') + tot + (num(pr.rand.total) ? ' / ' + pr.rand.total : '') + '</span></h3><div class="arms">' + arms.map(function (a, i) { var c = cnt[a.name] || 0, l = num(a.limit); return '<div class="armc"><span class="armdot a' + (i % 6) + '">' + String.fromCharCode(65 + i) + '</span><div><b>' + esc(a.name) + '</b><span>' + c + (l ? ' / ' + l : '') + '</span>' + progressBar(c, l || Math.max(1, tot), 'a' + (i % 6)) + '</div></div>'; }).join('') + '</div><p class="hint">' + LL('Стратификация: ', 'Stratification: ') + esc((pr.rand.strat || []).map(function (f) { return L(FIELD[f].label); }).join(', ') || LL('нет', 'none')) + LL('. Блок: ', '. Block: ') + esc(pr.rand.mult === 'mix' ? LL('смешанный', 'mixed') : String((+pr.rand.mult || 1) * arms.length)) + '.</p></section>';
    h2 += '<section class="card full"><h3>' + ico('lock', 18) + LL('Журнал рандомизации', 'Randomisation log') + '<span class="h3-note">' + LL('только добавление, без правок и удаления', 'append only, no edits or deletions') + '</span></h3>' + (tot ? '<div class="tablewrap flush"><table class="grid"><thead><tr><th>#</th><th>' + LL('Дата и время', 'Date and time') + '</th><th>' + LL('№ в исследовании', 'Study no.') + '</th><th>' + t('col.fio') + '</th><th>' + LL('Страта', 'Stratum') + '</th><th>' + LL('Группа', 'Arm') + '</th><th>' + LL('Кто', 'By') + '</th></tr></thead><tbody>' + pr.log.slice().reverse().map(function (e) { var p = findPat(e.pid), ai = arms.map(function (a) { return a.name; }).indexOf(e.arm); return '<tr data-act="openp" data-id="' + e.pid + '" tabindex="0"><td class="mono">' + e.n + '</td><td>' + fmtDT(e.ts) + '</td><td class="mono">' + esc(e.no) + '</td><td class="strong">' + esc(p ? pName(p) : e.pid) + '</td><td class="muted small">' + esc(e.stratum) + '</td><td><span class="armtag a' + (ai % 6) + '">' + esc(e.arm) + '</span></td><td>' + esc(e.by) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="hint">' + LL('Пока никто не рандомизирован. Включите пациента с отметкой «Сразу рандомизировать» или нажмите «Рандомизировать» в строке пациента.', 'Nobody randomised yet.') + '</p>') + '</section></div>';
    return h2;
  }
  if (tab === 'cps') {
    var cps = (pr.cps || []).slice().sort(function (a, b) { return String(a.date || '9').localeCompare(String(b.date || '9')); });
    var h3 = '<div class="pview"><section class="card full"><h3>' + LL('Контрольные точки', 'Checkpoints') + '</h3>' + (cps.length || pr.deadline ? '<ol class="tl">' + cps.map(function (c) { var dn = daysTo(c.date); return '<li class="' + (c.done ? 'done' : dn !== null && dn < 0 ? 'late' : '') + '"><span class="tl-d">' + (c.date ? fmtDate(c.date) : LL('без даты', 'no date')) + '</span><b>' + esc(c.title || '') + '</b><em>' + (c.done ? LL('выполнено', 'done') : daysLabel(dn)) + '</em></li>'; }).join('') + (pr.deadline ? '<li class="dl-end"><span class="tl-d">' + fmtDate(pr.deadline) + '</span><b>' + LL('Дедлайн исследования', 'Study deadline') + '</b><em>' + daysLabel(daysTo(pr.deadline)) + '</em></li>' : '') + '</ol>' : '<p class="hint">' + LL('Точки не заданы. Откройте «Протокол», шаг 3.', 'No checkpoints. Open Protocol, step 3.') + '</p>') + '</section></div>';
    return h3;
  }
  return '';
}

/* studies catalogue */
function renderStudies() {
  var list = studies(), fs = UI.sflt || '', fq = String(S.q || '').toLowerCase();
  var h = '<div class="head"><div><div class="kicker">' + LL('Наука', 'Research') + '</div><h1>' + t('nav.studies') + '</h1><p class="sub">' + LL('Каталог исследований сектора: статус, набор, дедлайны и контрольные точки.', 'Studies catalogue: status, recruitment, deadlines and checkpoints.') + '</p></div><div class="actions"><input class="search" type="search" data-act="search" placeholder="' + LL('Название или номер', 'Title or number') + '" value="' + esc(S.q) + '"><button type="button" class="btn primary" data-act="newstudy">' + ico('plus', 16) + t('nav.newStudy') + '</button></div></div>';
  var groups = [['', LL('Все', 'All')], ['active', LL('Активные', 'Active')], ['prep', LL('Подготовка', 'Preparation')], ['done', LL('Завершённые', 'Completed')]];
  function grp(pr) { return /Набор пациентов|Набор завершён|Анализ данных|Одобрено/.test(pr.status) ? 'active' : /Завершено/.test(pr.status) ? 'done' : 'prep'; }
  h += '<div class="tabs pad">' + groups.map(function (g) { var c = g[0] ? list.filter(function (r) { return grp(stProto(r)) === g[0]; }).length : list.length; return '<button type="button" class="tab' + (fs === g[0] ? ' on' : '') + '" data-act="sflt" data-v="' + g[0] + '">' + g[1] + '<span class="cnt">' + c + '</span></button>'; }).join('') + '</div>';
  var shown = list.filter(function (r) { var pr = stProto(r); return (!fs || grp(pr) === fs) && (!fq || (regName(r) + ' ' + pr.no + ' ' + pr.type).toLowerCase().indexOf(fq) >= 0); });
  h += '<div class="scards pad">';
  shown.forEach(function (r) {
    var pr = stProto(r), n = stCount(r), tg = stTarget(pr), dl = daysTo(pr.deadline), cp = stNextCp(pr);
    h += '<button type="button" class="scard st-card s-' + (ST_ST_CLS[pr.status] || 'plan') + '" data-act="view" data-v="reg:' + r.id + '"><div class="sc-top"><span class="mono">' + esc(pr.no) + '</span>' + stStatusPill(pr) + '</div><b>' + esc(regName(r)) + '</b><span class="muted">' + esc(ov(pr.type)) + (pr.syn && pr.syn.design ? ' · ' + esc(ov(pr.syn.design)) : '') + '</span>';
    h += '<div class="sc-prog"><div class="sc-pl"><span>' + LL('Набор', 'Recruitment') + '</span><b>' + n + (tg ? ' / ' + tg : '') + '</b></div>' + progressBar(n, tg || Math.max(n, 1)) + '</div>';
    h += '<div class="sc-meta">' + (pr.deadline ? '<span class="' + (dl < 0 ? 'due' : dl <= 30 ? 'warn' : '') + '">' + ico('clock', 13) + daysLabel(dl) + '</span>' : '') + (cp ? '<span>' + ico('flag', 13) + esc(cp.title) + '</span>' : '') + (stLead(pr) ? '<span>' + ico('user', 13) + esc(stLead(pr)) + '</span>' : '') + '</div></button>';
  });
  h += '<button type="button" class="scard new" data-act="newstudy"><span class="sc-ic">' + ico('plus', 20) + '</span><b>' + t('nav.newStudy') + '</b><span class="muted">' + LL('Протокол в 5 шагов: параметры, синопсис, контрольные точки, команда, набор и рандомизация.', 'A 5-step protocol: parameters, synopsis, checkpoints, team, enrolment and randomisation.') + '</span></button></div>';
  return h;
}

/* ======================= Publications ======================= */
function isArt(d) { return d.kind !== 'Доклад'; }
function isTalk(d) { return d.kind === 'Доклад'; }
function studyNames() { return studies().map(function (r) { return regName(r); }); }
function pubTools(r) {
  if (!isArt(r)) return '';
  return '<section class="card soft"><h3>' + ico('sparkle', 18) + LL('Заполнить автоматически', 'Fill automatically') + '</h3><p class="hint">' + LL('Введите DOI или PMID в полях выше и нажмите кнопку: название, авторы, журнал, том, страницы и дата подтянутся из Crossref или PubMed. Нужен интернет.', 'Enter a DOI or PMID above and press a button: title, authors, journal, volume, pages and date are fetched from Crossref or PubMed. Needs internet.') + '</p><div class="actions"><button type="button" class="btn" data-act="pubdoi">' + LL('По DOI (Crossref)', 'By DOI (Crossref)') + '</button><button type="button" class="btn" data-act="pubpmid">' + LL('По PMID (PubMed)', 'By PMID (PubMed)') + '</button></div></section>';
}
function fillFromCrossref(r, done) {
  var doi = String(r.doi || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  if (doiCheck(doi)) { toast(LL('Сначала введите корректный DOI', 'Enter a valid DOI first')); return; }
  toast(LL('Запрашиваю Crossref…', 'Querying Crossref…'));
  fetch('https://api.crossref.org/works/' + encodeURIComponent(doi)).then(function (x) { if (!x.ok) throw 0; return x.json(); }).then(function (j) {
    var m = j.message || {};
    r.doi = doi; r.kind = 'Статья';
    if (m.title && m.title[0]) r.title = m.title[0];
    if (m.author) r.authors = m.author.map(function (a) { return [a.family, a.given ? a.given.split(/[\s-]+/).map(function (z) { return z.charAt(0) + '.'; }).join('') : ''].filter(Boolean).join(' '); }).join(', ');
    if (m['container-title'] && m['container-title'][0]) r.venue = m['container-title'][0];
    if (m.volume) r.volume = m.volume; if (m.issue) r.issue = m.issue; if (m.page) r.pages = m.page;
    var dp = (m.published || m['published-print'] || m['published-online'] || m.issued || {})['date-parts']; if (dp && dp[0]) r.date = dp[0][0] + '-' + String(dp[0][1] || 1).padStart(2, '0') + '-' + String(dp[0][2] || 1).padStart(2, '0');
    if (!r.status || r.status === 'Подготовка') r.status = 'Опубликована';
    done(true);
  }).catch(function () { done(false); });
}
function fillFromPubmed(r, done) {
  var id = String(r.pmid || '').replace(/\D/g, ''); if (!id) { toast(LL('Сначала введите PMID', 'Enter a PMID first')); return; }
  toast(LL('Запрашиваю PubMed…', 'Querying PubMed…'));
  fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=' + id).then(function (x) { if (!x.ok) throw 0; return x.json(); }).then(function (j) {
    var m = j.result && j.result[id]; if (!m || m.error) throw 0;
    r.pmid = id; r.kind = 'Статья';
    if (m.title) r.title = m.title.replace(/\.$/, '');
    if (m.authors) r.authors = m.authors.map(function (a) { return a.name; }).join(', ');
    r.venue = m.fulljournalname || m.source || r.venue;
    if (m.volume) r.volume = m.volume; if (m.issue) r.issue = m.issue; if (m.pages) r.pages = m.pages;
    var doi = (m.articleids || []).filter(function (a) { return a.idtype === 'doi'; })[0]; if (doi) r.doi = doi.value;
    var dm = /^(\d{4})(?:\s+(\w{3}))?(?:\s+(\d{1,2}))?/.exec(m.sortpubdate || m.pubdate || ''); if (dm) { var mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(dm[2] || 'Jan') / 3 + 1; r.date = dm[1] + '-' + String(mo || 1).padStart(2, '0') + '-' + String(dm[3] || 1).padStart(2, '0'); }
    if (/^\d{4}\/\d{2}\/\d{2}/.test(m.sortpubdate || '')) r.date = m.sortpubdate.slice(0, 10).replace(/\//g, '-');
    if (!r.status || r.status === 'Подготовка') r.status = 'Опубликована';
    done(true);
  }).catch(function () { done(false); });
}
function importOrcid() {
  var id = prompt(LL('ORCID автора, например 0000-0002-1825-0097', 'Author ORCID, e.g. 0000-0002-1825-0097'), UI.orcid || ''); if (!id) return;
  id = id.trim().replace(/^https?:\/\/orcid\.org\//, '');
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id)) { toast(LL('Неверный формат ORCID', 'Invalid ORCID format')); return; }
  UI.orcid = id; saveUI(); toast(LL('Загружаю работы из ORCID…', 'Loading works from ORCID…'));
  fetch('https://pub.orcid.org/v3.0/' + id + '/works', { headers: { Accept: 'application/json' } }).then(function (x) { if (!x.ok) throw 0; return x.json(); }).then(function (j) {
    var have = {}; DB.cols.pubs.forEach(function (r) { if (r.doi) have[String(r.doi).toLowerCase()] = 1; if (r.title) have['t:' + String(r.title).toLowerCase()] = 1; });
    var n = 0;
    (j.group || []).forEach(function (g) {
      var w = (g['work-summary'] || [])[0]; if (!w) return;
      var title = w.title && w.title.title ? w.title.title.value : '', ids = ((w['external-ids'] || {})['external-id'] || []), doi = ids.filter(function (e) { return e['external-id-type'] === 'doi'; })[0], pm = ids.filter(function (e) { return e['external-id-type'] === 'pmid'; })[0];
      var dv = doi ? String(doi['external-id-value']).toLowerCase() : '';
      if ((dv && have[dv]) || have['t:' + title.toLowerCase()]) return;
      var pd = w['publication-date'] || {}, y = pd.year ? pd.year.value : '', mo = pd.month ? pd.month.value : '01', dd = pd.day ? pd.day.value : '01';
      var talk = /conference|lecture|presentation/i.test(w.type || '');
      DB.cols.pubs.push({ id: 'pubs_' + uid(''), kind: talk ? 'Доклад' : 'Статья', title: title, venue: w['journal-title'] ? w['journal-title'].value : '', date: y ? y + '-' + mo + '-' + dd : '', doi: doi ? doi['external-id-value'] : '', pmid: pm ? pm['external-id-value'] : '', status: talk ? 'Представлен' : 'Опубликована', notes: 'ORCID ' + id, log: [{ ts: nowIso(), by: me(), act: 'import', note: 'ORCID ' + id, ch: [] }] });
      n++;
    });
    save(); toast(LL('Добавлено работ из ORCID: ', 'Works added from ORCID: ') + n); render();
  }).catch(function () { toast(LL('ORCID недоступен: проверьте номер и интернет', 'ORCID unavailable: check the number and internet')); });
}

/* ======================= Notifications ======================= */
function notifs() {
  var out = [], td = isoOf(new Date()), tm = isoOf(addDays(td, 1));
  fuDueAll().forEach(function (x) { if (x.f.st === 'overdue') out.push({ id: 'fu:' + x.p.id + ':' + x.f.key, ic: 'clock', lvl: 'due', t: LL('Просрочен контроль: ', 'Follow-up overdue: ') + x.f.label, s: pName(x.p) + ' · ' + daysLabel(x.f.days), go: ['p', x.p.id] }); });
  qDueAll(3).forEach(function (x) { out.push({ id: 'q:' + x.p.id + ':' + x.e.id, ic: 'clipboard', lvl: x.n < 0 ? 'due' : 'soon', t: LL('Анкета ', 'Questionnaire ') + qShort(qTpl(x.e.tid)) + (x.n < 0 ? LL(' просрочена', ' overdue') : LL(' к заполнению', ' due')), s: pName(x.p) + ' · ' + daysLabel(x.n), go: ['p', x.p.id] }); });
  (DB.cols.redcap || []).forEach(function (r) { if (r.done !== 'Заполнено' && r.contact && r.contact <= td) out.push({ id: 'rc:' + r.id, ic: 'flask', lvl: r.contact < td ? 'due' : 'soon', t: LL('RedCap: связаться с пациентом', 'RedCap: contact the patient'), s: (r.fio || '') + ' · ' + fmtDate(r.contact), go: ['r', 'redcap', r.id] }); });
  (DB.cols.planner || []).forEach(function (r) { if ((r.surgeryDate === tm || r.surgeryDate === td) && r.status !== 'Отменено' && r.status !== 'Завершено') out.push({ id: 'op:' + r.id + ':' + r.surgeryDate, ic: 'knife', lvl: 'info', t: (r.surgeryDate === td ? LL('Операция сегодня: ', 'Surgery today: ') : LL('Операция завтра: ', 'Surgery tomorrow: ')) + (r.fio || ''), s: [r.dx, r.surgeon ? ov(r.surgeon) : ''].filter(Boolean).join(' · '), go: ['r', 'planner', r.id] }); });
  (DB.cols.mdt || []).forEach(function (r) { if (r.date === td && r.status === 'Ожидает обсуждения') out.push({ id: 'mdt:' + r.id, ic: 'mdt', lvl: 'info', t: LL('Сегодня на МДГ: ', 'At MDT today: ') + (r.fio || ''), s: r.dx || '', go: ['r', 'mdt', r.id] }); });
  studies().forEach(function (r) {
    var pr = stProto(r);
    (pr.cps || []).forEach(function (c, i) { if (c.done || !c.date) return; var n = daysTo(c.date); if (n <= 14) out.push({ id: 'cp:' + r.id + ':' + i + ':' + c.date, ic: 'flag', lvl: n < 0 ? 'due' : 'soon', t: c.title || LL('Контрольная точка', 'Checkpoint'), s: regName(r) + ' · ' + daysLabel(n), go: ['s', r.id, 'cps'] }); });
    var dl = daysTo(pr.deadline); if (pr.deadline && dl <= 30 && pr.status !== 'Завершено') out.push({ id: 'dl:' + r.id + ':' + pr.deadline, ic: 'clock', lvl: dl < 0 ? 'due' : 'soon', t: LL('Дедлайн исследования', 'Study deadline'), s: regName(r) + ' · ' + daysLabel(dl), go: ['s', r.id, 'pts'] });
  });
  var rank = { due: 0, soon: 1, info: 2 };
  return out.sort(function (a, b) { return rank[a.lvl] - rank[b.lvl]; });
}
function unseenCount(list) { var s = UI.seen || {}; return list.filter(function (n) { return !s[n.id]; }).length; }
function renderBell() {
  var list = notifs(), un = unseenCount(list), open = S.menu === 'bell', seen = UI.seen || {};
  var h = '<div class="dd"><button type="button" class="iconbtn bell' + (un ? ' has' : '') + '" data-act="menu" data-id="bell" aria-label="' + LL('Уведомления', 'Notifications') + '" aria-expanded="' + open + '">' + ico('bell', 20) + (un ? '<span class="bdg">' + (un > 99 ? '99+' : un) + '</span>' : '') + '</button>';
  if (open) {
    h += '<div class="pop right npop" role="menu"><div class="np-h"><b>' + LL('Уведомления', 'Notifications') + '</b>' + (un ? '<button type="button" class="linkbtn" data-act="nseen">' + LL('Отметить все прочитанными', 'Mark all as read') + '</button>' : '') + '</div>';
    h += list.length ? '<div class="np-l">' + list.slice(0, 40).map(function (n, i) { return '<button type="button" class="nitem n-' + n.lvl + (seen[n.id] ? ' seen' : '') + '" data-act="ngo" data-i="' + i + '"><span class="ni-ic">' + ico(n.ic, 16) + '</span><span class="ni-t"><b>' + esc(n.t) + '</b><em>' + esc(n.s) + '</em></span></button>'; }).join('') + '</div>' : '<div class="np-empty">' + ico('check', 22) + LL('Всё сделано: срочных задач нет', 'All clear: nothing urgent') + '</div>';
    h += '<div class="pop-note">' + LL('Уведомления собираются из сроков контроля, анкет, RedCap, планировщика, МДГ и исследований.', 'Built from follow-ups, questionnaires, RedCap, planner, MDT and studies.') + '</div></div>';
  }
  return h + '</div>';
}
function goNotif(i) {
  var n = notifs()[+i]; if (!n) return;
  UI.seen = UI.seen || {}; UI.seen[n.id] = 1; saveUI(); S.menu = null;
  if (n.go[0] === 'p') openPatient(n.go[1]);
  else if (n.go[0] === 'r') openRec(n.go[1], n.go[2]);
  else if (n.go[0] === 's') { UI.stab = n.go[2]; setView('reg:' + n.go[1]); }
}

/* ======================= Home dashboard ======================= */
function weekStart() { var d = today(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }
function qiCalc(list) {
  var ops = list.filter(function (p) { return hasProc(p.d) && p.d.date; });
  var surg = ops.filter(function (p) { return hasSurg(p.d); });
  var cdK = ops.filter(function (p) { return has(p.d.cd); }), cd3 = cdK.filter(function (p) { return ['IIIa', 'IIIb', 'IVa', 'IVb', 'V'].indexOf(p.d.cd) >= 0; });
  var anK = surg.filter(function (p) { return p.d.anast === 'Да' && has(p.d.leak); }), lk = anK.filter(function (p) { return ['A', 'B', 'C'].indexOf(p.d.leak) >= 0; });
  var mis = surg.filter(function (p) { return MIS.indexOf(p.d.access) >= 0; }), cv = mis.filter(function (p) { return p.d.conv === 'Да'; });
  var rK = ops.filter(function (p) { return has(p.d.r); }), r0 = rK.filter(function (p) { return p.d.r === 'R0'; });
  var lnK = surg.filter(function (p) { return num(p.d.lnT) !== null && P_COLON.concat(P_RECTAL).indexOf(p.d.proc) >= 0; }), ln12 = lnK.filter(function (p) { return num(p.d.lnT) >= 12; });
  var tmK = surg.filter(function (p) { return has(p.d.tme); }), tmG = tmK.filter(function (p) { return /^Полное/.test(p.d.tme); });
  return { n: ops.length, surg: surg.length, cd3: [cd3.length, cdK.length], leak: [lk.length, anK.length], conv: [cv.length, mis.length], mis: [mis.length, surg.length], r0: [r0.length, rK.length], ln: [ln12.length, lnK.length], tme: [tmG.length, tmK.length], los: median(ops.map(function (p) { return num(p.d.los); })) };
}
/* ======================= v10: accounts, roles, cloud (Firebase prototype) ======================= */
var ROLES = { doctor: ['Врач', 'Doctor'], resident: ['Резидент', 'Resident'], student: ['Студент', 'Student'] };
var SESSION = null;
var CLOUD = { cfg: null, on: false, ready: false, err: '', fb: null, db: null, cache: {}, timer: null, users: [] };
(function () {
  var c = window.FIREBASE_CONFIG || null;
  if (!c) { try { c = JSON.parse(localStorage.getItem('crr.fbconfig') || 'null'); } catch (e) { c = null; } }
  if (c && c.apiKey && c.projectId) { CLOUD.cfg = c; CLOUD.on = true; }
})();
function roleName(r) { return L(ROLES[r] || ['', '']); }
function isAdmin() { return !!(SESSION && SESSION.admin); }
var PERM = { edit: ['doctor', 'resident'], comment: ['doctor', 'resident', 'student'], delete: ['doctor'], rand: ['doctor'], unlock: ['doctor'], admin: [] };
function can(what) { if (!SESSION) return false; if (SESSION.admin) return true; return (PERM[what] || []).indexOf(SESSION.role) >= 0; }
function isStudent() { return SESSION && SESSION.role === 'student' && !SESSION.admin; }
function sha256(s) { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) { return [].map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }); }
function localUsers() { try { return JSON.parse(localStorage.getItem('crr.users') || '[]'); } catch (e) { return []; } }
function saveLocalUsers(u) { try { localStorage.setItem('crr.users', JSON.stringify(u)); } catch (e) {} }
function setSession(s) { SESSION = s; if (s) { UI.me = s.name; saveUI(); if (s.role === 'student' && !s.admin) maskForStudent(); } try { if (!CLOUD.on) { if (s) localStorage.setItem('crr.session', JSON.stringify(s)); else localStorage.removeItem('crr.session'); } } catch (e) {} }
if (!CLOUD.on) { try { SESSION = JSON.parse(localStorage.getItem('crr.session') || 'null'); if (SESSION) { var lu = localUsers().filter(function (u) { return u.id === SESSION.id; })[0]; if (!lu || lu.status !== 'active') SESSION = null; else { SESSION.role = lu.role; SESSION.admin = lu.admin; SESSION.name = lu.name; } } } catch (e) { SESSION = null; } }
function authErr(code) {
  var m = { 'auth/email-already-in-use': LL('Эта почта уже зарегистрирована', 'This email is already registered'), 'auth/invalid-email': LL('Неверный формат почты', 'Invalid email'), 'auth/weak-password': LL('Пароль слишком короткий: минимум 6 символов', 'Password too short: at least 6 characters'), 'auth/invalid-credential': LL('Неверная почта или пароль', 'Wrong email or password'), 'auth/wrong-password': LL('Неверная почта или пароль', 'Wrong email or password'), 'auth/user-not-found': LL('Неверная почта или пароль', 'Wrong email or password'), 'auth/too-many-requests': LL('Слишком много попыток, подождите минуту', 'Too many attempts, wait a minute'), 'auth/network-request-failed': LL('Нет связи с сервером', 'No connection to the server') };
  return m[code] || code || LL('Ошибка входа', 'Sign-in error');
}
function doRegister() {
  var a = S.auth, email = String(a.email || '').trim().toLowerCase(), name = String(a.name || '').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || String(a.pass || '').length < 6 || !a.role) { a.err = LL('Заполните ФИО, почту, пароль (от 6 символов) и выберите роль', 'Fill in name, email, password (6+ characters) and choose a role'); render(); return; }
  if (a.pass !== a.pass2) { a.err = LL('Пароли не совпадают', 'Passwords do not match'); render(); return; }
  a.busy = true; a.err = ''; render();
  if (CLOUD.on) { cloudRegister(email, a.pass, name, a.role); return; }
  var users = localUsers();
  if (users.some(function (u) { return u.email === email; })) { a.busy = false; a.err = authErr('auth/email-already-in-use'); render(); return; }
  var salt = uid('s');
  sha256(salt + a.pass).then(function (h) {
    var first = !users.length, u = { id: uid('u'), email: email, name: name, role: a.role, status: first ? 'active' : 'pending', admin: first, salt: salt, hash: h, created: nowIso() };
    users.push(u); saveLocalUsers(users); a.busy = false;
    if (first) { setSession({ id: u.id, email: email, name: name, role: u.role, admin: true }); S.auth = null; UI.view = 'home'; S.view = 'home'; saveUI(); toast(LL('Вы администратор этой платформы', 'You are the administrator of this platform')); render(); }
    else { a.mode = 'wait'; a.pass = a.pass2 = ''; render(); }
  });
}
function doLogin() {
  var a = S.auth, email = String(a.email || '').trim().toLowerCase();
  if (!email || !a.pass) { a.err = LL('Введите почту и пароль', 'Enter email and password'); render(); return; }
  a.busy = true; a.err = ''; render();
  if (CLOUD.on) { cloudLogin(email, a.pass); return; }
  var u = localUsers().filter(function (x) { return x.email === email; })[0];
  if (!u) { a.busy = false; a.err = authErr('auth/invalid-credential'); render(); return; }
  sha256(u.salt + a.pass).then(function (h) {
    a.busy = false;
    if (h !== u.hash) { a.err = authErr('auth/invalid-credential'); render(); return; }
    if (u.status !== 'active') { a.mode = 'wait'; render(); return; }
    setSession({ id: u.id, email: u.email, name: u.name, role: u.role, admin: u.admin }); S.auth = null; S.view = 'home'; UI.view = 'home'; saveUI(); render();
  });
}
function doLogout() {
  if (!confirm(LL('Выйти из аккаунта?', 'Sign out?'))) return;
  if (CLOUD.on && CLOUD.fb) CLOUD.fb.auth().signOut();
  setSession(null); S.drawer = S.rec = S.edit = null; S.menu = null; render();
}

/* Firebase (compat SDK, loaded on demand) */
function loadScript(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
function cloudInit() {
  if (!CLOUD.on) return;
  var v = '10.12.2', base = 'https://www.gstatic.com/firebasejs/' + v + '/';
  loadScript(base + 'firebase-app-compat.js').then(function () { return Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]); }).then(function () {
    CLOUD.fb = window.firebase; CLOUD.fb.initializeApp(CLOUD.cfg); CLOUD.db = CLOUD.fb.firestore(); CLOUD.ready = true;
    CLOUD.fb.auth().onAuthStateChanged(function (u) {
      if (!u) { SESSION = null; render(); return; }
      CLOUD.db.collection('users').doc(u.uid).get().then(function (d) {
        var p = d.exists ? d.data() : null;
        if (!p) { CLOUD.fb.auth().signOut(); return; }
        if (p.status !== 'active') { S.auth = S.auth || { mode: 'login' }; S.auth.mode = 'wait'; S.auth.busy = false; CLOUD.fb.auth().signOut(); render(); return; }
        setSession({ id: u.uid, email: u.email, name: p.name, role: p.role, admin: !!p.admin }); S.auth = null; if (S.view === 'portal') S.view = 'home';
        cloudListen(); render();
      });
    });
    render();
  }).catch(function () { CLOUD.err = LL('Не удалось загрузить Firebase: проверьте интернет', 'Could not load Firebase: check internet'); render(); });
}
function cfgAdmins() { return (CLOUD.cfg && CLOUD.cfg.admins || []).map(function (x) { return String(x).toLowerCase(); }); }
function cloudRegister(email, pass, name, role) {
  if (!CLOUD.ready) { S.auth.busy = false; S.auth.err = LL('Облако ещё подключается, попробуйте через секунду', 'Cloud is still connecting, try again'); render(); return; }
  var adm = cfgAdmins().indexOf(email) >= 0;
  CLOUD.fb.auth().createUserWithEmailAndPassword(email, pass).then(function (cr) {
    return CLOUD.db.collection('users').doc(cr.user.uid).set({ name: name, email: email, role: role, status: adm ? 'active' : 'pending', admin: adm, created: nowIso() });
  }).then(function () { if (!adm) { S.auth.mode = 'wait'; S.auth.busy = false; CLOUD.fb.auth().signOut(); render(); } }).catch(function (e) { S.auth.busy = false; S.auth.err = authErr(e.code); render(); });
}
function cloudLogin(email, pass) {
  if (!CLOUD.ready) { S.auth.busy = false; S.auth.err = LL('Облако ещё подключается, попробуйте через секунду', 'Cloud is still connecting, try again'); render(); return; }
  CLOUD.fb.auth().signInWithEmailAndPassword(email, pass).catch(function (e) { S.auth.busy = false; S.auth.err = authErr(e.code); render(); });
}
function cloudDocs() {
  var m = {};
  DB.patients.forEach(function (p) { m['p_' + p.id] = p; });
  Object.keys(DB.cols).forEach(function (k) { DB.cols[k].forEach(function (r) { m['c_' + k + '__' + r.id] = r; }); });
  DB.registries.forEach(function (r) { m['g_' + r.id] = r; });
  m.meta = { v: DB.v, seq: DB.seq, mig: DB.mig, templates: DB.templates, qtpl: DB.qtpl, studySeq: DB.studySeq, importedAt: DB.importedAt };
  var out = {}; Object.keys(m).forEach(function (k) { out[k.replace(/\//g, '_')] = JSON.stringify(m[k]); }); return out;
}
function cloudPush() {
  if (!CLOUD.on || !CLOUD.db || !SESSION || !can('edit')) return;
  clearTimeout(CLOUD.timer);
  CLOUD.timer = setTimeout(function () {
    var cur = cloudDocs(), ops = [];
    Object.keys(cur).forEach(function (k) { if (CLOUD.cache[k] !== cur[k]) ops.push(['set', k, cur[k]]); });
    Object.keys(CLOUD.cache).forEach(function (k) { if (!(k in cur)) ops.push(['del', k]); });
    if (!ops.length) return;
    for (var i = 0; i < ops.length; i += 400) {
      var b = CLOUD.db.batch();
      ops.slice(i, i + 400).forEach(function (o) { var ref = CLOUD.db.collection('data').doc(o[1]); if (o[0] === 'set') b.set(ref, { v: o[2], by: me(), at: nowIso() }); else b.delete(ref); });
      b.commit().catch(function (e) { toast(LL('Облако: не удалось сохранить (', 'Cloud: save failed (') + (e.code || e.message) + ')'); });
    }
    ops.forEach(function (o) { if (o[0] === 'set') CLOUD.cache[o[1]] = o[2]; else delete CLOUD.cache[o[1]]; });
  }, 400);
}
function dbFromDocs(map) {
  var db = { v: 3, seq: 1, registries: [], patients: [], cols: { planner: [], mdt: [], mm: [], redcap: [], goals: [], pubs: [] }, mig: {} };
  Object.keys(map).forEach(function (k) {
    var v; try { v = JSON.parse(map[k]); } catch (e) { return; }
    if (k === 'meta') { Object.keys(v).forEach(function (x) { db[x] = v[x]; }); return; }
    if (k.indexOf('p_') === 0) db.patients.push(v);
    else if (k.indexOf('g_') === 0) db.registries.push(v);
    else if (k.indexOf('c_') === 0) { var ck = k.slice(2).split('__')[0]; (db.cols[ck] = db.cols[ck] || []).push(v); }
  });
  db.patients.sort(function (a, b) { return a.id.localeCompare(b.id); });
  return db;
}
function cloudListen() {
  if (CLOUD.unsub) return;
  CLOUD.unsub = CLOUD.db.collection('data').onSnapshot(function (snap) {
    if (snap.metadata.hasPendingWrites) return;
    var map = {}; snap.forEach(function (d) { map[d.id] = d.data().v; });
    if (!Object.keys(map).length) {
      if (DB.demo) { DB = migrate(emptyDB()); try { localStorage.setItem(KEY_CLOUD, JSON.stringify(DB)); } catch (e) {} render(); }
      CLOUD.empty = true; render();
      return;
    }
    CLOUD.cache = map; CLOUD.empty = false;
    var busy = S.drawer || S.rec || S.edit || S.enr || S.fill;
    DB = migrate(dbFromDocs(map));
    try { localStorage.setItem(KEY_CLOUD, JSON.stringify(DB)); } catch (e) {}
    if (!busy) render(); else CLOUD.stale = true;
  }, function (e) { CLOUD.err = e.code || e.message; render(); });
}
function cloudUsers(cb) {
  if (!CLOUD.on) { cb(localUsers()); return; }
  CLOUD.db.collection('users').get().then(function (s) { var a = []; s.forEach(function (d) { var x = d.data(); x.id = d.id; a.push(x); }); cb(a); }).catch(function (e) { toast(e.code || e.message); cb([]); });
}
function setUser(id, patch) {
  if (!CLOUD.on) { var us = localUsers(); us.forEach(function (u) { if (u.id === id) Object.keys(patch).forEach(function (k) { u[k] = patch[k]; }); }); saveLocalUsers(us); S.users = us; render(); return; }
  CLOUD.db.collection('users').doc(id).update(patch).then(function () { cloudUsers(function (a) { S.users = a; render(); }); });
}
function renderUsers() {
  if (!isAdmin()) return '<div class="page"><div class="empty">' + LL('Раздел доступен только администратору', 'Administrators only') + '</div></div>';
  if (!S.users) { cloudUsers(function (a) { S.users = a; render(); }); return '<div class="page"><div class="empty">' + LL('Загрузка…', 'Loading…') + '</div></div>'; }
  var h = pageHead(LL('Администрирование', 'Administration'), LL('Пользователи и роли', 'Users and roles'), LL('Новые регистрации ждут подтверждения. Роль определяет права: студент только просматривает обезличенные данные, резидент вносит и правит, врач также удаляет, рандомизирует и разблокирует защищённые поля.', 'New sign-ups wait for approval. Students view anonymised data, residents edit, doctors also delete, randomise and unlock protected fields.'), '');
  var list = S.users.slice().sort(function (a, b) { return (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1); });
  h += '<div class="tablewrap"><table class="grid"><thead><tr><th>' + LL('Пользователь', 'User') + '</th><th>' + LL('Почта', 'Email') + '</th><th>' + LL('Роль', 'Role') + '</th><th>' + LL('Статус', 'Status') + '</th><th></th></tr></thead><tbody>';
  list.forEach(function (u) {
    var st = u.status === 'active' ? '<span class="st st-done">' + LL('Активен', 'Active') + '</span>' : u.status === 'pending' ? '<span class="st st-prog">' + LL('Ждёт подтверждения', 'Pending') + '</span>' : '<span class="st st-cancel">' + LL('Отклонён', 'Rejected') + '</span>';
    h += '<tr><td class="strong"><span class="av sm">' + esc(initials(u.name)) + '</span> ' + esc(u.name) + (u.admin ? ' <span class="tag">admin</span>' : '') + '</td><td>' + esc(u.email) + '</td><td><select class="sel-sm" data-urole="' + u.id + '"' + (u.admin ? ' disabled' : '') + '>' + Object.keys(ROLES).map(function (r) { return '<option value="' + r + '"' + (u.role === r ? ' selected' : '') + '>' + roleName(r) + '</option>'; }).join('') + '</select></td><td>' + st + '</td><td class="ra">' + (u.admin ? '' : (u.status !== 'active' ? '<button type="button" class="btn small primary" data-act="uok" data-id="' + u.id + '">' + LL('Подтвердить', 'Approve') + '</button>' : '') + (u.status !== 'rejected' ? '<button type="button" class="btn small ghost" data-act="uno" data-id="' + u.id + '">' + LL('Отключить', 'Disable') + '</button>' : '')) + '</td></tr>';
  });
  h += '</tbody></table></div>';
  h += '<div class="page-sec"><div class="panel"><div class="ph"><h2>' + LL('Режим хранения', 'Storage mode') + '</h2></div><p class="muted">' + (CLOUD.on ? LL('Общая облачная база Firebase: проект ', 'Shared Firebase database: project ') + '<b>' + esc(CLOUD.cfg.projectId) + '</b>. ' + LL('Все подтверждённые пользователи видят одни и те же данные, изменения синхронизируются сразу.', 'All approved users see the same data; changes sync instantly.') : LL('Локальный режим: данные и учётные записи хранятся в этом браузере.', 'Local mode: data and accounts live in this browser.')) + '</p><div class="actions" style="margin-top:12px"><button type="button" class="btn" data-act="cloudsetup">' + ico('cloud', 16) + LL('Настроить облако', 'Cloud setup') + '</button>' + (CLOUD.on ? '<button type="button" class="btn" data-act="restore">' + ico('upload', 16) + LL('Загрузить данные в облако (файл резервной копии)', 'Upload data to cloud (backup file)') + '</button>' : '<button type="button" class="btn" data-act="backup">' + ico('download', 16) + LL('Скачать резервную копию для облака', 'Download backup for cloud') + '</button>') + '</div></div></div>';
  return h;
}

/* portal (public page) and auth forms */
function renderPortal() {
  var a = S.auth || (S.auth = { mode: 'login', role: 'resident' });
  var h = '<div class="portal"><section class="pt-media"><div class="pt-img" style="background-image:url(media/nroc-hero-hd.webp)"></div><div class="pt-over"><div class="pt-top"><img src="media/nroc-logo-white.png" alt="NROC"><span>' + LL('Национальный научный онкологический центр', 'National Research Oncology Center') + '</span></div><div class="pt-copy"><div class="pt-kick">' + LL('Колоректальный сектор', 'Colorectal unit') + '</div><h1>' + LL('Клинический регистр и исследовательская платформа', 'Clinical registry and research platform') + '</h1><p>' + LL('Пациенты, операции, МДГ и M&M, исследования и публикации сектора в одном рабочем пространстве с ИИ-ассистентом.', 'Patients, operations, MDT and M&M, studies and publications in one workspace with an AI assistant.') + '</p></div><ul class="pt-feat"><li>' + ico('users', 16) + LL('Единая карточка: до, во время и после операции', 'One record: before, during and after surgery') + '</li><li>' + ico('flask', 16) + LL('Протоколы исследований, рандомизация, анкеты', 'Study protocols, randomisation, PROMs') + '</li><li>' + ico('sparkle', 16) + LL('ИИ-ассистент: анализ, доказательства, черновики', 'AI assistant: analysis, evidence, drafts') + '</li></ul><div class="pt-foot">Astana · ' + new Date().getFullYear() + '</div></div></section>';
  h += '<section class="pt-form"><div class="pt-lang">' + langSeg() + '</div><div class="pt-card">';
  if (a.mode === 'wait') {
    h += '<div class="pt-icon">' + ico('clock', 26) + '</div><h2>' + LL('Заявка отправлена', 'Request sent') + '</h2><p class="muted">' + LL('Администратор сектора подтвердит учётную запись и роль. После этого войдите с той же почтой и паролем.', 'The unit administrator will approve your account and role. Then sign in with the same email and password.') + '</p><button type="button" class="btn primary wide" data-act="amode" data-v="login">' + LL('Ко входу', 'Back to sign-in') + '</button>';
  } else {
    var reg = a.mode === 'reg';
    h += '<h2>' + (reg ? LL('Регистрация', 'Create account') : LL('Вход', 'Sign in')) + '</h2><p class="muted">' + (reg ? LL('Доступ к данным откроется после подтверждения администратором.', 'Access opens after administrator approval.') : LL('Рабочее пространство колоректального сектора.', 'Colorectal unit workspace.')) + '</p>';
    h += '<div class="seg full"><button type="button" class="' + (!reg ? 'on' : '') + '" data-act="amode" data-v="login">' + LL('Вход', 'Sign in') + '</button><button type="button" class="' + (reg ? 'on' : '') + '" data-act="amode" data-v="reg">' + LL('Регистрация', 'Sign up') + '</button></div>';
    if (reg) h += '<label class="af"><span>' + LL('Фамилия и имя', 'Full name') + '</span><input type="text" data-sb="auth.name" value="' + esc(a.name || '') + '" autocomplete="name" placeholder="' + LL('Иванов Иван', 'John Smith') + '"></label>';
    h += '<label class="af"><span>' + LL('Рабочая почта', 'Work email') + '</span><input type="email" data-sb="auth.email" value="' + esc(a.email || '') + '" autocomplete="username" placeholder="name@cancercenter.kz"></label>';
    h += '<label class="af"><span>' + LL('Пароль', 'Password') + '</span><input type="password" data-sb="auth.pass" data-enter="' + (reg ? 'reg' : 'login') + '" autocomplete="' + (reg ? 'new-password' : 'current-password') + '"></label>';
    if (reg) {
      h += '<label class="af"><span>' + LL('Повторите пароль', 'Repeat password') + '</span><input type="password" data-sb="auth.pass2" data-enter="reg" autocomplete="new-password"></label>';
      h += '<div class="af"><span>' + LL('Роль', 'Role') + '</span><div class="roles">' + [['doctor', 'stethoscope', LL('Врач', 'Doctor'), LL('ввод, правка, рандомизация', 'entry, edit, randomise')], ['resident', 'users', LL('Резидент', 'Resident'), LL('ввод и правка данных', 'data entry and edit')], ['student', 'cap', LL('Студент', 'Student'), LL('просмотр обезличенных данных', 'view anonymised data')]].map(function (r) { return '<button type="button" class="role' + (a.role === r[0] ? ' on' : '') + '" data-act="arole" data-v="' + r[0] + '">' + ico(r[1], 18) + '<b>' + r[2] + '</b><em>' + r[3] + '</em></button>'; }).join('') + '</div></div>';
    }
    if (a.err) h += '<div class="aerr">' + ico('alert', 15) + esc(a.err) + '</div>';
    h += '<button type="button" class="btn primary wide" data-act="' + (reg ? 'aregister' : 'alogin') + '"' + (a.busy ? ' disabled' : '') + '>' + (a.busy ? LL('Подождите…', 'Please wait…') : reg ? LL('Отправить заявку', 'Request access') : LL('Войти', 'Sign in')) + '</button>';
    if (!CLOUD.on && !localUsers().length) h += '<p class="pt-note">' + LL('Первый зарегистрированный пользователь становится администратором.', 'The first registered user becomes the administrator.') + '</p>';
  }
  h += '</div><div class="pt-mode">' + (CLOUD.on ? '<span class="dot ok"></span>' + LL('Общая база · ', 'Shared database · ') + esc(CLOUD.cfg.projectId) + (CLOUD.err ? ' · <span class="due">' + esc(CLOUD.err) + '</span>' : !CLOUD.ready ? LL(' · подключение…', ' · connecting…') : '') : '<span class="dot"></span>' + LL('Локальный режим: данные в этом браузере', 'Local mode: data in this browser')) + ' · <button type="button" class="linkbtn" data-act="cloudsetup">' + LL('Облако', 'Cloud') + '</button></div></section></div>';
  return h;
}
function langSeg() { return '<div class="seg lang" role="group" aria-label="' + t('a11y.lang') + '"><button type="button" class="' + (LANG === 'ru' ? 'on' : '') + '" data-act="lang" data-v="ru">RU</button><button type="button" class="' + (LANG === 'en' ? 'on' : '') + '" data-act="lang" data-v="en">EN</button></div>'; }
function fbRules() {
  var adm = (S.cs && S.cs.admins ? S.cs.admins.split(/[\s,;]+/) : cfgAdmins()).filter(Boolean).map(function (x) { return "'" + x.toLowerCase() + "'"; }).join(', ') || "'you@example.com'";
  return "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function signedIn() { return request.auth != null; }\n    function prof() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data; }\n    function active() { return signedIn() && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && prof().status == 'active'; }\n    function admin() { return active() && prof().admin == true; }\n    match /users/{uid} {\n      allow read: if signedIn() && (request.auth.uid == uid || admin());\n      allow create: if signedIn() && request.auth.uid == uid && (\n        (request.resource.data.status == 'pending' && request.resource.data.admin == false) ||\n        (request.auth.token.email in [" + adm + "]));\n      allow update, delete: if admin();\n    }\n    match /data/{doc} {\n      allow read: if active();\n      allow write: if active() && (prof().admin == true || prof().role in ['doctor', 'resident']);\n    }\n  }\n}";
}
function renderCloudSetup() {
  var c = S.cs;
  var h = '<div class="dim" data-act="csclose"></div><section class="modal xmodal wide" role="dialog" aria-modal="true"><div class="dhead"><div><div class="dh-kicker">Firebase</div><div class="dh-title">' + LL('Общая облачная база', 'Shared cloud database') + '</div></div><button type="button" class="iconbtn" data-act="csclose" aria-label="' + t('a11y.close') + '">' + ico('x', 20) + '</button></div><div class="dbody">';
  h += '<div class="warnbox"><b>' + ico('alert', 15) + LL('Реальные данные пациентов', 'Real patient data') + '</b><ul><li>' + LL('Облако становится общей базой сектора: доступ только у подтверждённых администратором сотрудников, студенты видят обезличенные данные.', 'The cloud becomes the shared unit database: approved staff only, students see de-identified data.') + '</li><li>' + LL('Серверы Firebase находятся за пределами Казахстана (выберите регион europe-west). Закон РК о персональных данных требует хранить персональные данные в РК: согласуйте использование с руководством центра.', 'Firebase servers are outside Kazakhstan (choose europe-west). Kazakhstan law requires personal data to be stored in-country: clear this with the centre management.') + '</li><li>' + LL('После подключения администратор загружает данные: в локальной версии Меню → Резервная копия, затем здесь Администрирование → Загрузить данные в облако.', 'After connecting, the admin uploads data: local version Menu → Backup, then here Administration → Upload data to cloud.') + '</li></ul></div>';
  h += '<ol class="steps"><li>' + LL('Откройте <b>console.firebase.google.com</b>, создайте проект (Google Analytics можно выключить).', 'Open <b>console.firebase.google.com</b> and create a project.') + '</li><li>' + LL('Build → Authentication → Get started → включите <b>Email/Password</b>.', 'Build → Authentication → enable <b>Email/Password</b>.') + '</li><li>' + LL('Build → Firestore Database → Create database (регион europe-west), затем вкладка Rules: вставьте правила ниже и нажмите Publish.', 'Build → Firestore → Create database, then Rules: paste the rules below and Publish.') + '</li><li>' + LL('Project settings → Your apps → Web (&lt;/&gt;) → зарегистрируйте приложение и скопируйте объект <b>firebaseConfig</b> сюда.', 'Project settings → Your apps → Web → copy the <b>firebaseConfig</b> object here.') + '</li><li>' + LL('Для сайта по ссылке: Authentication → Settings → Authorized domains → добавьте ваш домен GitHub Pages.', 'For the shared link: Authentication → Settings → Authorized domains → add your GitHub Pages domain.') + '</li></ol>';
  h += '<div class="fld wide"><label>firebaseConfig</label><textarea rows="7" class="mono-ta" data-sb="cs.cfg" placeholder="{ apiKey: &quot;…&quot;, authDomain: &quot;…&quot;, projectId: &quot;…&quot;, appId: &quot;…&quot; }">' + esc(c.cfg || '') + '</textarea></div>';
  h += '<div class="fld wide"><label>' + LL('Почта администратора (можно несколько через запятую)', 'Admin email(s), comma separated') + '</label><input type="text" data-sb="cs.admins" data-rr="1" value="' + esc(c.admins || '') + '"></div>';
  h += '<div class="fld wide"><label>' + LL('Правила Firestore (скопируйте в консоль)', 'Firestore rules (copy to console)') + '</label><textarea rows="10" class="mono-ta" readonly id="fbrules">' + esc(fbRules()) + '</textarea><div class="actions"><button type="button" class="btn small" data-act="copyrules">' + ico('copy', 14) + LL('Копировать правила', 'Copy rules') + '</button></div></div>';
  if (c.err) h += '<div class="aerr">' + esc(c.err) + '</div>';
  h += '</div><div class="dfoot"><div>' + (CLOUD.on ? '<button type="button" class="btn danger" data-act="csoff">' + LL('Выключить облако', 'Disable cloud') + '</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="csclose">' + t('b.cancel') + '</button><button type="button" class="btn primary" data-act="cssave">' + LL('Подключить', 'Connect') + '</button></div></div></section>';
  return h;
}
function parseCfg(txt) {
  var s = String(txt || '').trim(); if (!s) return null;
  var m = s.match(/\{[\s\S]*\}/); if (!m) return null; s = m[0];
  try { return JSON.parse(s); } catch (e) {}
  try { return JSON.parse(s.replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":').replace(/'/g, '"').replace(/,\s*}/g, '}')); } catch (e) { return null; }
}

/* synthetic test data for the cloud prototype */
function demoDB() {
  var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; } function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  var FN = ['Айдаров', 'Бекова', 'Сериков', 'Жумабаева', 'Омаров', 'Касымова', 'Тулегенов', 'Нуртаева', 'Иванов', 'Смирнова', 'Абдрахманов', 'Есенова', 'Мукашев', 'Садыкова', 'Ким', 'Ахметов', 'Байжанова', 'Калиев', 'Петрова', 'Жаксылыков', 'Утепова', 'Рахимов', 'Сейтказина', 'Орлов'];
  var NM = ['Тест', 'Демо', 'Пример'];
  var td = isoOf(new Date()), db = { v: 3, seq: 1, registries: defaultRegistries(), patients: [], cols: { planner: [], mdt: [], mm: [], redcap: [], goals: [], pubs: [] }, importedAt: td, demo: true };
  for (var i = 0; i < 28; i++) {
    var male = i % 2 === 0, fio = FN[i % FN.length] + (male ? '' : '') + ' ' + pick(NM) + ' ' + (i + 1), loc = pick(['Прямая кишка', 'Прямая кишка', 'Сигмовидная кишка', 'Ректосигмоидный отдел', 'Восходящая ободочная', 'Поперечная ободочная']);
    var opd = rnd() < 0.7 ? isoOf(addDays(td, -Math.floor(rnd() * 400) - 3)) : null;
    var d = { fio: fio, ib: '2026/' + (10000 + i * 37), sex: male ? 'М' : 'Ж', age: String(45 + Math.floor(rnd() * 35)), bmi: String(20 + Math.floor(rnd() * 14)), asa: pick(['I', 'II', 'II', 'III']), ecog: pick(['0', '1', '1', '2']), loc: loc, cT: pick(['cT2', 'cT3', 'cT3', 'cT4a']), cN: pick(['cN0', 'cN1', 'cN2']), cM: 'cM0', stage: pick(['II', 'III', 'III']), hist: 'Аденокарцинома', grade: pick(['G1', 'G2', 'G2', 'G3']), dxText: 'Рак ' + loc.toLowerCase() + ' (тестовые данные)', kind: 'Хирургическое' };
    if (loc === 'Прямая кишка') { d.rLevel = pick(['Нижнеампулярный', 'Среднеампулярный', 'Верхнеампулярный']); d.tactic = rnd() < 0.5 ? ['Тотальная неоадъювантная терапия (TNT)', 'Операция'] : ['Операция']; }
    else d.tactic = ['Операция'];
    if (opd) {
      d.date = opd; d.urg = 'Плановая';
      d.proc = loc === 'Прямая кишка' ? pick(P_AR.concat(P_APR)) : loc === 'Сигмовидная кишка' || loc === 'Ректосигмоидный отдел' ? P_SIG[0] : P_RIGHT[1];
      d.access = pick(['Лапароскопический', 'Лапароскопический', 'Робот-ассистированный', 'Открытый']); d.conv = d.access !== 'Открытый' && rnd() < 0.08 ? 'Да' : 'Нет';
      d.opTime = String(150 + Math.floor(rnd() * 150)); d.ebl = String(50 + Math.floor(rnd() * 250)); d.anast = P_APR.indexOf(d.proc) >= 0 ? undefined : 'Да';
      d.cd = pick(['Нет', 'Нет', 'Нет', 'I', 'II', 'IIIa', 'IIIb']); if (d.anast === 'Да') d.leak = rnd() < 0.08 ? pick(['A', 'B', 'C']) : 'Нет';
      d.los = String(6 + Math.floor(rnd() * 8)); d.pT = pick(['pT1', 'pT2', 'pT3', 'pT3', 'pT4a']); d.pN = pick(['pN0', 'pN0', 'pN1a', 'pN1b', 'pN2a']); d.lnT = String(10 + Math.floor(rnd() * 20)); d.lnP = d.pN === 'pN0' ? '0' : String(1 + Math.floor(rnd() * 4)); d.r = rnd() < 0.93 ? 'R0' : 'R1';
      d.postRoute = rnd() < 0.8 ? 'Палата пробуждения' : 'Реанимация (ОАРИТ)'; d.phase = 'Наблюдение';
    } else d.phase = pick(['Подготовка к лечению', 'Химиотерапия', 'Лучевая терапия', 'Watch & wait']);
    Object.keys(d).forEach(function (k) { if (d[k] === undefined) delete d[k]; });
    db.patients.push({ id: 'CR-' + String(db.seq).padStart(4, '0'), d: d, fu: {}, custom: {} }); db.seq++;
  }
  var SURG = SURGEONS.slice(0, 4);
  for (var j = 0; j < 14; j++) {
    var p = db.patients[j], off = j - 6, sd = isoOf(addDays(td, off)), adm = isoOf(addDays(td, off - 1));
    db.cols.planner.push({ id: 'planner_d' + j, fio: p.d.fio, dx: (p.d.proc || 'Операция') , date: adm, surgeryDate: sd, surgeon: pick(SURG), status: off < -5 ? 'Завершено' : off <= 0 ? 'В отделении' : 'Планируется', postRoute: off <= 0 ? (j % 3 === 0 ? 'Реанимация (ОАРИТ)' : 'Палата пробуждения') : undefined, pid: p.id, mdg: 'Проведён' });
  }
  db.cols.planner.forEach(function (r) { Object.keys(r).forEach(function (k) { if (r[k] === undefined) delete r[k]; }); });
  for (var k = 14; k < 22; k++) { var q = db.patients[k]; db.cols.mdt.push({ id: 'mdt_d' + k, fio: q.d.fio, mrn: String(900 + k), date: isoOf(addDays(td, (k % 5) - 2)), status: k % 3 ? 'Ожидает обсуждения' : 'Обсуждён', stage: q.d.stage, dx: q.d.dxText, pid: q.id }); }
  db.cols.mm.push({ id: 'mm_d1', title: db.patients[3].d.fio, date: isoOf(addDays(td, -20)), status: 'Разобран', reason: 'Несостоятельность анастомоза, релапаротомия', category: 'Осложнение', cdg: 'IIIb', factors: ['Пациент', 'Хирургическая техника'], preventable: 'Возможно', summary: 'Внедрить ICG-ангиографию при НПР; контроль CRP на 3 сутки', pid: db.patients[3].id });
  db.cols.mm.push({ id: 'mm_d2', title: db.patients[6].d.fio, date: isoOf(addDays(td, 5)), status: 'Запланирован', reason: 'Кровотечение из пресакрального сплетения', category: 'Осложнение', pid: db.patients[6].id });
  db.cols.redcap.push({ id: 'redcap_d1', fio: db.patients[1].d.fio, rid: 'RC-101', opDate: db.patients[1].d.date, contact: td, done: 'Ожидает' });
  db.cols.goals.push({ id: 'goals_d1', title: 'Статья по результатам TNT', gtype: 'Статья', owner: 'Сектор', status: 'В работе', priority: 'Высокий' });
  return db;
}

/* ======================= v10: AI assistant (Gemini) ======================= */
var AI = { key: '', model: 'gemini-2.5-flash', st: 'off', err: '', deid: true, threads: {}, busy: false };
try { AI.key = sessionStorage.getItem('crr.aikey') || ''; AI.model = localStorage.getItem('crr.aimodel') || AI.model; AI.deid = localStorage.getItem('crr.aideid') !== '0'; } catch (e) {}
var AI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
var AI_MODELS = [['gemini-2.5-flash', 'Gemini 2.5 Flash', LL('быстрая, по умолчанию', 'fast, default')], ['gemini-2.5-pro', 'Gemini 2.5 Pro', LL('глубже, медленнее', 'deeper, slower')], ['gemini-2.5-flash-lite', 'Gemini 2.5 Flash-Lite', LL('самая быстрая', 'fastest')]];
function aiReady() { return AI.st === 'ok' && !!AI.key; }
function aiSetKey(k) { AI.key = String(k || '').trim(); try { if (AI.key) sessionStorage.setItem('crr.aikey', AI.key); else sessionStorage.removeItem('crr.aikey'); } catch (e) {} aiCheck(); }
function aiVer(n) { var m = /gemini-(\d+(?:\.\d+)?)/.exec(n); return m ? parseFloat(m[1]) : 0; }
function aiCheck() {
  if (!AI.key) { AI.st = 'off'; AI.err = ''; render(); return; }
  AI.st = 'check'; AI.err = ''; render();
  fetch(AI_BASE + '/models?pageSize=200&key=' + encodeURIComponent(AI.key)).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
    .then(function (j) {
      var av = (j.models || []).filter(function (m) { return /gemini/.test(m.name) && (m.supportedGenerationMethods || []).indexOf('generateContent') >= 0 && !/embedding|tts|image|audio|live|vision/.test(m.name); }).map(function (m) { return { id: m.name.replace(/^models\//, ''), name: m.displayName || m.name }; });
      AI.avail = av;
      if (av.length && !av.some(function (m) { return m.id === AI.model; })) {
        var pick = function (re) { return av.filter(function (m) { return re.test(m.id) && !/preview|exp|lite/.test(m.id); }).sort(function (a, b) { return aiVer(b.id) - aiVer(a.id); })[0]; };
        var best = pick(/flash/) || pick(/pro/) || av[0]; AI.model = best.id;
      }
      AI.st = 'ok'; render(); aiMaybeGreet();
    })
    .catch(function (e) { AI.st = 'err'; AI.err = (e && e.error && e.error.message) || LL('Нет связи с Google AI', 'Cannot reach Google AI'); render(); });
}
function aiStream(o) {
  var body = { contents: o.contents, generationConfig: { temperature: o.temp === undefined ? 0.4 : o.temp, maxOutputTokens: 8192 } };
  if (o.system) body.systemInstruction = { parts: [{ text: o.system }] };
  if (o.search) body.tools = [{ google_search: {} }];
  var text = '', src = [], ctrl = new AbortController(); AI.ctrl = ctrl;
  fetch(AI_BASE + '/models/' + AI.model + ':streamGenerateContent?alt=sse&key=' + encodeURIComponent(AI.key), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal })
    .then(function (r) {
      if (!r.ok) return r.json().then(function (j) { throw j; });
      var rd = r.body.getReader(), dec = new TextDecoder(), buf = '';
      function pump() {
        return rd.read().then(function (x) {
          if (x.done) { o.done(text, src); return; }
          buf += dec.decode(x.value, { stream: true });
          var parts = buf.split(/\r?\n\r?\n/); buf = parts.pop();
          parts.forEach(function (ev) {
            ev.split(/\r?\n/).forEach(function (line) {
              if (line.indexOf('data:') !== 0) return;
              try {
                var j = JSON.parse(line.slice(5)), c = (j.candidates || [])[0] || {};
                ((c.content || {}).parts || []).forEach(function (p) { if (p.text && !p.thought) text += p.text; });
                var gm = c.groundingMetadata; if (gm && gm.groundingChunks) gm.groundingChunks.forEach(function (g) { if (g.web && !src.some(function (s) { return s.uri === g.web.uri; })) src.push({ uri: g.web.uri, title: g.web.title || g.web.uri }); });
              } catch (e) {}
            });
          });
          o.chunk(text);
          return pump();
        });
      }
      return pump();
    })
    .catch(function (e) { if (e && e.name === 'AbortError') { o.done(text + (text ? '\n\n' : '') + LL('_(остановлено)_', '_(stopped)_'), src); return; } o.fail((e && e.error && e.error.message) || (e && e.message) || LL('Ошибка запроса к Gemini', 'Gemini request failed')); });
}

/* minimal markdown */
function mdInline(s) {
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s)<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  s = s.replace(/\bPMID:?\s?(\d{6,9})\b/g, '<a href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID $1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}
function md(src) {
  var L2 = String(src || '').replace(/\r/g, '').split('\n'), out = '', list = null, tbl = null;
  function close() { if (list) { out += '</' + list + '>'; list = null; } if (tbl) { out += '</tbody></table></div>'; tbl = null; } }
  L2.forEach(function (l) {
    var m;
    if (/^\s*\|.*\|\s*$/.test(l)) {
      var cells = l.trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); });
      if (cells.every(function (c) { return /^:?-{2,}:?$/.test(c); })) return;
      if (!tbl) { close(); out += '<div class="mdt"><table><thead><tr>' + cells.map(function (c) { return '<th>' + mdInline(c) + '</th>'; }).join('') + '</tr></thead><tbody>'; tbl = 1; return; }
      out += '<tr>' + cells.map(function (c) { return '<td>' + mdInline(c) + '</td>'; }).join('') + '</tr>'; return;
    }
    if ((m = /^\s*#{1,4}\s+(.*)$/.exec(l))) { close(); out += '<h4>' + mdInline(m[1]) + '</h4>'; return; }
    if ((m = /^\s*[-*•]\s+(.*)$/.exec(l))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += '<li>' + mdInline(m[1]) + '</li>'; return; }
    if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(l))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += '<li>' + mdInline(m[1]) + '</li>'; return; }
    if (!l.trim()) { close(); return; }
    close(); out += '<p>' + mdInline(l) + '</p>';
  });
  close(); return out;
}

/* context builders: what the assistant sees on each screen */
var AI_SYS = 'Ты клинический и научный ИИ-ассистент колоректального сектора Национального научного онкологического центра (ННОЦ, NROC), Астана, Казахстан. Пользователи: врачи-хирурги, резиденты, студенты.\n' +
  'Правила:\n- Ты ничего не меняешь в данных платформы: только читаешь, анализируешь, считаешь, советуешь и готовишь черновики, которые врач переносит сам.\n' +
  '- Опирайся на данные из блока КОНТЕКСТ. Числа бери только оттуда или вычисляй из них, явно показывая расчёт. Если данных нет, так и скажи и перечисли, чего не хватает.\n' +
  '- Клинические рекомендации: NCCN, ESMO, ASCRS, ESCP, JSCCR, клинические протоколы МЗ РК, AJCC/UICC 8. Указывай источник и год. Ссылки давай с PMID или DOI, только реально существующие; если не уверен в ссылке, не выдумывай, а предложи поисковый запрос для PubMed.\n' +
  '- Это поддержка решений, а не замена врачу и МДГ. Отмечай уровень доказательности и неопределённость.\n' +
  '- Отвечай на языке пользователя (по умолчанию русский), кратко и структурно: короткие заголовки, списки, таблицы при сравнении. Не используй длинные тире, используй двоеточие или дефис.\n' +
  '- Данные могут быть обезличены: пациент обозначен ID вида CR-0001.';
function lab(x) { return L(x.label); }
function fmtVal(x, v) { if (!has(v)) return ''; if (Array.isArray(v)) return v.map(function (z) { return z && typeof z === 'object' ? (z.name || '') : ov(z); }).join('; '); if (x && x.type === 'date') return fmtDate(v); return ov(v); }
function patText(p, full) {
  var d = p.d, out = ['ID: ' + p.id];
  if (!AI.deid && d.fio) out.push('ФИО: ' + d.fio);
  PHASES.forEach(function (ph) {
    SECTIONS.filter(function (s) { return s.phase === ph[0] && secOn(s, d); }).forEach(function (s) {
      var rows = s.fields.filter(function (x) { return x.id !== 'fio' && x.id !== 'ib' && has(d[x.id]) && (!x.show || x.show(d)); }).map(function (x) { return '  ' + lab(x) + ': ' + fmtVal(x, d[x.id]); });
      MODULES.forEach(function (m) { if (m.sec === s.id && m.when(d)) m.fields.forEach(function (x) { if (has(d[x.id]) && (!x.show || x.show(d))) rows.push('  ' + lab(x) + ': ' + fmtVal(x, d[x.id])); }); });
      if (rows.length) out.push('[' + L(s.title) + ']\n' + rows.join('\n'));
    });
  });
  var fl = fuList(p); if (fl.length) out.push('[Контроли] ' + fl.map(function (x) { return x.label + ' до ' + fmtDate(x.due) + ': ' + (x.st === 'done' ? 'выполнен' : x.st === 'overdue' ? 'ПРОСРОЧЕН' : 'запланирован'); }).join('; '));
  (p.q || []).forEach(function (e) { var q = qTpl(e.tid); out.push('[Анкета ' + qShort(q) + '] срок ' + fmtDate(e.due) + (e.date ? ', заполнена ' + fmtDate(e.date) + ', баллы ' + e.score + (e.band ? ' (' + e.band + ')' : '') : ', не заполнена')); });
  Object.keys(p.enroll || {}).forEach(function (sid) { var r = regOf(sid); if (r) out.push('[Исследование] ' + regName(r) + ', № ' + p.enroll[sid].no + (p.enroll[sid].arm ? ', группа ' + p.enroll[sid].arm : '')); });
  if (full) {
    linkedRecs(p.id).forEach(function (x) { out.push('[' + L(COLS[x.k].title) + '] ' + recText(x.k, x.r, true)); });
    (p.comments || []).slice(-10).forEach(function (c) { out.push('[Комментарий ' + fmtDate(c.ts.slice(0, 10)) + '] ' + c.text); });
  }
  return out.join('\n');
}
function recText(k, r, short) {
  var c = COLS[k], rows = [];
  c.fields.forEach(function (x) { if (x.type === 'files') { if (has(r[x.id])) rows.push(lab(x) + ': ' + r[x.id].length + ' файл(ов)'); return; } if ((x.id === 'fio' || x.id === 'title') && AI.deid) return; if (has(r[x.id])) rows.push(lab(x) + ': ' + fmtVal(x, r[x.id])); });
  if (k === 'mdt' && r.mp) rows.push('Протокол МДГ:\n' + mdtProtoText(r, AI.deid));
  return short ? rows.join('; ') : rows.join('\n');
}
function listStats(list) {
  var n = list.length, cnt = function (f) { var m = {}; list.forEach(function (p) { var v = p.d[f]; if (!has(v)) return; (Array.isArray(v) ? v : [v]).forEach(function (z) { m[z] = (m[z] || 0) + 1; }); }); return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).map(function (k) { return k + ' ' + m[k]; }).join(', '); };
  return 'Всего пациентов: ' + n + '\nЛокализация: ' + cnt('loc') + '\nСтадия: ' + cnt('stage') + '\nТактика: ' + cnt('tactic') + '\nОперации: ' + cnt('proc') + '\nДоступ: ' + cnt('access') + '\nClavien-Dindo: ' + cnt('cd') + '\nНесостоятельность: ' + cnt('leak') + '\nR: ' + cnt('r') + '\nЭтап: ' + cnt('phase');
}
function listCsv(list) {
  var F = ['sex', 'age', 'bmi', 'asa', 'loc', 'rLevel', 'cT', 'cN', 'cM', 'stage', 'tactic', 'date', 'proc', 'access', 'conv', 'opTime', 'ebl', 'anast', 'stoma', 'cd', 'leak', 'ssi', 'los', 'pT', 'pN', 'lnT', 'lnP', 'r', 'tme', 'pCRM', 'recur', 'vital'];
  return 'id;' + F.join(';') + '\n' + list.slice(0, 600).map(function (p) { return p.id + ';' + F.map(function (f) { var v = p.d[f]; return has(v) ? String(Array.isArray(v) ? v.map(tacShort).join('+') : v).replace(/;/g, ',') : ''; }).join(';'); }).join('\n');
}
function briefText() {
  var b = briefing(true), out = ['Дата: ' + fmtDate(isoOf(new Date()))];
  if (b.labs.length) out.push('Контрольные анализы после операции:\n' + b.labs.map(function (x) { return '- ' + x.who + ': ' + x.pod + '-е сутки после «' + x.op + '», путь: ' + x.route + ', окно ' + x.win[0] + '-' + x.win[1] + ' сутки, статус: ' + x.stTxt; }).join('\n'));
  if (b.ops.length) out.push('Операции сегодня и завтра:\n' + b.ops.map(function (x) { return '- ' + x.when + ': ' + x.who + ', ' + x.what; }).join('\n'));
  if (b.mdt.length) out.push('МДГ сегодня:\n' + b.mdt.map(function (x) { return '- ' + x; }).join('\n'));
  if (b.due.length) out.push('Просрочено:\n' + b.due.map(function (x) { return '- ' + x; }).join('\n'));
  if (b.cps.length) out.push('Исследования:\n' + b.cps.map(function (x) { return '- ' + x; }).join('\n'));
  var inDept = DB.cols.planner.filter(function (r) { return r.status === 'В отделении'; });
  out.push('В отделении сейчас: ' + inDept.length + (inDept.length ? ' (' + inDept.map(function (r) { return pubName(r.fio, r.pid) + (r.surgeryDate ? ', операция ' + fmtDate(r.surgeryDate) : '') ; }).join('; ') + ')' : ''));
  var q = qiCalc(DB.patients.filter(function (p) { return p.d.date && p.d.date >= isoOf(addDays(isoOf(new Date()), -365)); }));
  out.push('Показатели качества за 12 мес: операций ' + q.n + '; CD III+ ' + q.cd3[0] + '/' + q.cd3[1] + '; несостоятельность ' + q.leak[0] + '/' + q.leak[1] + '; конверсия ' + q.conv[0] + '/' + q.conv[1] + '; R0 ' + q.r0[0] + '/' + q.r0[1] + '; 12+ л/у ' + q.ln[0] + '/' + q.ln[1]);
  return out.join('\n\n');
}
function pubName(fio, pid) { return AI.deid ? (pid || LL('пациент', 'patient')) : (fio || pid || ''); }
function aiCtx() {
  var ctx;
  if (S.rec) {
    var o = S.rec, c = COLS[o.k], lp = patOf(o.r.pid);
    ctx = { key: 'r:' + o.k + ':' + (o.r.id || 'new'), title: L(c.title) + ': ' + (AI.deid ? (o.r.pid || LL('запись', 'record')) : recTitle(c, o.r)), data: 'Раздел: ' + L(c.title) + '\nЗапись:\n' + recText(o.k, o.r) + (lp ? '\n\nКарточка связанного пациента:\n' + patText(lp, false) : '') };
    if (o.k === 'mdt') { ctx.greet = 'Коротко: суть случая для МДГ в 3-4 строках, затем чего не хватает в обследовании для решения МДГ (по стандарту стадирования колоректального рака), затем 2-3 ключевых вопроса к обсуждению. Если протокол МДГ почти пуст, скажи, какие разделы заполнить в первую очередь.'; ctx.chips = [[LL('Недостающие обследования', 'Missing work-up'), 'Сверь проведённые обследования с минимальным стандартом стадирования для этой локализации (NCCN/ESMO/протоколы МЗ РК): что не выполнено и почему это важно для решения.'], [LL('Варианты лечения', 'Treatment options'), 'Перечисли доступные варианты дальнейшего лечения с доводами за и против, уровнем доказательности и ссылками на рекомендации и ключевые исследования.'], [LL('Подходящие исследования', 'Eligible trials'), 'Подходит ли пациент под исследования сектора (см. КОНТЕКСТ) или известные международные исследования? Проверь по критериям.'], [LL('Черновик заключения', 'Draft conclusion'), 'Составь черновик раздела «Заключение МДГ» в официальном стиле на основе данных. Отметь места, требующие решения комиссии, квадратными скобками.']]; }
    else if (o.k === 'mm') { ctx.greet = 'Разбери случай M&M по структуре: что произошло (хронология), тяжесть (Clavien-Dindo), факторы пациента, хирургии, решений и системы, был ли случай предотвратим. Затем 3 конкретные инициативы с опорой на доказательства.'; ctx.chips = [[LL('Корневые причины', 'Root causes'), 'Проведи анализ корневых причин (fishbone или 5 почему) по этому случаю.'], [LL('Доказательства', 'Evidence'), 'Какие доказательные меры снижают риск такого осложнения? Дай ссылки (PMID/DOI).'], [LL('Слайды для разбора', 'Review slides'), 'Составь план презентации для M&M конференции: 6-8 слайдов с тезисами.']]; }
    else if (o.k === 'pubs') { ctx.greet = 'Кратко оцени публикацию: тема, тип, статус, чего не хватает в карточке (DOI, индексация, связь с исследованием). Предложи следующий шаг.'; ctx.chips = [[LL('Подобрать журналы', 'Suggest journals'), 'Подбери 5 подходящих журналов с импакт-фактором/квартилем и сроками рецензирования.'], [LL('Чек-лист', 'Checklist'), 'Какой чек-лист отчётности нужен (STROBE, CONSORT, STROCSS и т.д.) и на что обратить внимание?']]; }
    else if (o.k === 'planner') { ctx.greet = 'Кратко: что по этой госпитализации важно сегодня (сутки после операции, контрольные анализы по окну, что проверить, риски), без лишних слов.'; ctx.chips = [[LL('Чек-лист выписки', 'Discharge checklist'), 'Составь чек-лист готовности к выписке по ERAS для этого пациента.']]; }
    else ctx.greet = 'Кратко опиши запись и что в ней стоит проверить или дополнить.';
    return ctx;
  }
  if (S.drawer) {
    var p = S.drawer.p;
    return { key: 'p:' + p.id, title: LL('Пациент ', 'Patient ') + (AI.deid ? p.id : pName(p)), data: 'Карточка пациента:\n' + patText(p, true), greet: 'Дай сводку случая в 4-5 строках (диагноз, стадия, тактика, что сделано, текущий этап). Затем раздел «Проверить»: пропущенные важные поля и логические несостыковки в данных. Затем раздел «На что обратить внимание» с опорой на рекомендации. Кратко.', chips: [[LL('Соответствие рекомендациям', 'Guideline check'), 'Сверь тактику лечения этого пациента с NCCN, ESMO и JSCCR: соответствует ли, какие альтернативы, со ссылками.'], [LL('Проверить данные', 'Check data'), 'Найди все пропуски и противоречия в данных карточки, списком по приоритету.'], [LL('Резюме для МДГ', 'MDT summary'), 'Составь краткое резюме случая для представления на МДГ.'], [LL('Выписной эпикриз', 'Discharge summary'), 'Составь черновик выписного эпикриза по данным карточки. Недостающее отметь квадратными скобками.'], [LL('Прогноз и наблюдение', 'Prognosis and follow-up'), 'Какой график наблюдения рекомендован этому пациенту и каков ориентировочный прогноз по стадии? Со ссылками.']] };
  }
  var v = S.view;
  if (v === 'home') return { key: 'v:home:' + isoOf(new Date()), title: LL('Утренний брифинг', 'Morning briefing'), data: briefText(), greet: 'Сделай утренний брифинг сектора: сначала что срочно сегодня (кому взять контрольные анализы, кто просрочен), затем операции и МДГ, затем наука. Коротко, по пунктам, с конкретными пациентами.', chips: [[LL('Приоритеты дня', 'Priorities'), 'Расставь задачи на сегодня по приоритету и предложи, кому из команды что поручить.'], [LL('Показатели качества', 'Quality'), 'Проанализируй показатели качества сектора относительно международных ориентиров (ESCP, ACS NSQIP, Dutch ColoRectal Audit) со ссылками.']] };
  if (v === 'col:mm') { var mm = DB.cols.mm.slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); }); return { key: 'v:mm', title: 'M&M', data: 'Все разборы M&M (' + mm.length + '):\n' + mm.map(function (r, i) { return (i + 1) + '. ' + recText('mm', r, true); }).join('\n'), greet: 'Сделай общее саммари работы M&M: сколько разборов проведено и запланировано, какие типы случаев и осложнений, повторяющиеся паттерны, какие инициативы приняты. Затем 3-4 совета, что ещё внедрить, со ссылками на доказательства.', chips: [[LL('Повторяющиеся проблемы', 'Recurring issues'), 'Найди повторяющиеся проблемы и системные факторы во всех разборах.'], [LL('Отчёт за год', 'Annual report'), 'Составь годовой отчёт M&M сектора.']] }; }
  if (v === 'col:mdt') { var md2 = DB.cols.mdt.filter(function (r) { return r.status === 'Ожидает обсуждения' || (r.date && daysTo(r.date) >= -7); }); return { key: 'v:mdt', title: LL('МДГ', 'MDT'), data: 'Ближайшие и ожидающие случаи МДГ (' + md2.length + '):\n' + md2.map(function (r, i) { return (i + 1) + '. ' + recText('mdt', r, true); }).join('\n'), greet: 'Кратко: сколько случаев ждёт МДГ, по каждому одной строкой, что нужно подготовить к заседанию.', chips: [[LL('Повестка', 'Agenda'), 'Составь повестку ближайшего заседания МДГ по приоритету.']] }; }
  if (v.indexOf('reg:') === 0 || v === 'fu') {
    var lr = v === 'fu' ? { reg: null, list: DB.patients } : listForReg(), rg = lr.reg;
    var sd = rg && rg.kind === 'study' ? '\nПротокол исследования: ' + JSON.stringify({ no: stProto(rg).no, type: stProto(rg).type, status: stProto(rg).status, target: stProto(rg).target, deadline: stProto(rg).deadline, synopsis: stProto(rg).syn, incl: stProto(rg).incl, excl: stProto(rg).excl, rand: stProto(rg).rand.on }) : '';
    return { key: 'v:' + v + ':' + lr.list.length, title: rg ? regName(rg) : t('nav.allPatients'), data: 'Раздел: ' + (rg ? regName(rg) + '. ' + ruleText(rg) : 'все пациенты') + sd + '\n\nСводка:\n' + listStats(lr.list) + '\n\nДанные (CSV, разделитель ;):\n' + listCsv(lr.list), greet: rg && rg.kind === 'study' ? 'Кратко оцени исследование: статус набора относительно цели и дедлайна, полноту данных по ключевым переменным, риски для исследования. Затем 2-3 совета.' : 'Дай краткую аналитическую сводку по этой выборке: объём, структура, ключевые исходы с процентами (посчитай из данных), полнота заполнения. Отметь, что выглядит необычно.', chips: [[LL('Полнота данных', 'Data completeness'), 'Посчитай полноту заполнения ключевых переменных и перечисли пациентов с наибольшими пропусками.'], [LL('Сравнить группы', 'Compare groups'), 'Сравни исходы по доступу (лапароскопия/робот/открытый): таблица, проценты, с оговоркой о размере выборки.'], [LL('Идея для статьи', 'Paper idea'), 'Какие публикабельные вопросы можно исследовать на этих данных? Для каждого: дизайн, конечная точка, нужный объём.']] };
  }
  if (v === 'studies') return { key: 'v:studies', title: t('nav.studies'), data: studies().map(function (r) { var pr = stProto(r); return regName(r) + ': ' + JSON.stringify({ no: pr.no, status: pr.status, type: pr.type, n: stCount(r), target: pr.target, deadline: pr.deadline, aim: pr.syn && pr.syn.aim, design: pr.syn && pr.syn.design }); }).join('\n'), greet: 'Кратко по портфелю исследований: какие идут по плану, какие отстают по набору или срокам, что сделать в первую очередь.', chips: [[LL('Новая идея', 'New idea'), 'Предложи 3 идеи исследований для колоректального сектора онкоцентра с учётом текущего портфеля.']] };
  if (v === 'col:pubs') return { key: 'v:pubs', title: L(COLS.pubs.title), data: DB.cols.pubs.map(function (r) { return recText('pubs', r, true); }).join('\n'), greet: 'Кратко: публикационная активность сектора, что в работе, что предложить.' };
  if (v === 'q') return { key: 'v:q', title: LL('Анкеты', 'Questionnaires'), data: DB.patients.filter(function (p) { return (p.q || []).length; }).map(function (p) { return p.id + ': ' + (p.q || []).map(function (e) { return qShort(qTpl(e.tid)) + ' ' + (e.date ? e.score : 'не заполнена, срок ' + fmtDate(e.due)); }).join(', '); }).join('\n'), greet: 'Кратко: результаты анкет (LARS, Wexner и др.), динамика, кто требует внимания.' };
  if (v.indexOf('col:') === 0) { var k2 = v.slice(4), c2 = COLS[k2]; return { key: 'v:' + v, title: L(c2.title), data: DB.cols[k2].slice(-150).map(function (r) { return recText(k2, r, true); }).join('\n'), greet: 'Кратко опиши содержимое раздела и что требует внимания.' }; }
  return { key: 'v:' + v, title: viewTitle(), data: '', greet: 'Кратко расскажи, чем ты можешь помочь в этом разделе.' };
}
function aiThread(key) { return AI.threads[key] || (AI.threads[key] = { msgs: [], greeted: false }); }
function aiRun(ctx, hiddenPrompt, visibleText, sendText) {
  var th = aiThread(ctx.key);
  if (visibleText) th.msgs.push({ role: 'user', text: visibleText, send: sendText || visibleText });
  var hist = [];
  th.msgs.forEach(function (m) { if (m.err || m.pending) return; if (m.hq) hist.push({ role: 'user', parts: [{ text: m.hq }] }); hist.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.role === 'user' ? (m.send || m.text) : m.text }] }); });
  while (hist.length && hist[0].role !== 'user') hist.shift();
  if (hiddenPrompt) hist.push({ role: 'user', parts: [{ text: hiddenPrompt }] });
  var msg = { role: 'model', text: '', pending: true, greet: !visibleText, hq: hiddenPrompt || null };
  th.msgs.push(msg); AI.busy = true; render();
  aiStream({
    system: AI_SYS + '\nСегодня: ' + fmtDate(isoOf(new Date())) + '. Пользователь: ' + (SESSION ? roleName(SESSION.role) : '') + '.\n\n=== КОНТЕКСТ (' + ctx.title + ') ===\n' + ctx.data,
    contents: hist, search: true,
    chunk: function (txt) { msg.text = txt; var el = document.getElementById('ai-live'); if (el) { el.innerHTML = md(txt) + '<span class="cursor"></span>'; var b = el.closest('.aip-body'); if (b && b.scrollHeight - b.scrollTop - b.clientHeight < 140) b.scrollTop = b.scrollHeight; } },
    done: function (txt, src) { msg.text = txt || LL('Пустой ответ. Попробуйте переформулировать.', 'Empty answer. Try rephrasing.'); msg.src = src; msg.pending = false; AI.busy = false; render(); var b = root.querySelector('.aip-body'); if (b) b.scrollTop = b.scrollHeight; },
    fail: function (e) { msg.text = e; msg.err = true; msg.pending = false; AI.busy = false; if (/API key|PERMISSION|403|401/i.test(e)) AI.st = 'err', AI.err = e; render(); }
  });
}
function aiMaybeGreet() {
  if (!UI.aip || !aiReady() || AI.busy || !SESSION) return;
  var ctx = aiCtx(), th = aiThread(ctx.key);
  if (th.greeted) return;
  th.greeted = true; aiRun(ctx, ctx.greet);
}
function aiSendInput() {
  var ta = root.querySelector('#ai-in'), txt = ta ? ta.value.trim() : ''; if (!txt || AI.busy) return;
  if (ta) ta.value = ''; S.aidraft = ''; aiRun(aiCtx(), null, txt);
}
function renderAIPill() {
  var st = AI.st, open = S.menu === 'aikey';
  var lbl = { off: LL('ИИ выкл.', 'AI off'), check: LL('Проверка…', 'Checking…'), ok: 'Gemini', err: LL('Ошибка ключа', 'Key error') }[st];
  var h = '<div class="dd"><button type="button" class="aipill s-' + st + '" data-act="menu" data-id="aikey" aria-expanded="' + open + '" title="' + LL('Ключ API Gemini и статус подключения', 'Gemini API key and status') + '"><span class="tgl"><i></i></span><span>' + lbl + '</span></button>';
  if (open) {
    h += '<div class="pop right aipop"><div class="np-h"><b>' + ico('sparkle', 16) + LL('Подключение ИИ', 'AI connection') + '</b></div><div class="aipop-b">';
    h += '<label class="af"><span>' + LL('Ваш ключ Gemini API', 'Your Gemini API key') + '</span><input type="password" id="aikey-in" value="' + esc(AI.key) + '" placeholder="AIza…" autocomplete="off" data-enter="aikey"></label>';
    h += '<p class="fhint">' + LL('Ключ хранится только до закрытия вкладки и нигде не сохраняется. Получить бесплатно: aistudio.google.com → Get API key.', 'Stored only until the tab closes. Get one free at aistudio.google.com → Get API key.') + '</p>';
    h += '<label class="af"><span>' + LL('Модель', 'Model') + '</span><select id="aimodel">' + (AI.avail && AI.avail.length ? AI.avail.map(function (m) { return [m.id, m.name, m.id]; }) : AI_MODELS).map(function (m) { return '<option value="' + m[0] + '"' + (AI.model === m[0] ? ' selected' : '') + '>' + esc(m[1]) + ' · ' + esc(m[2]) + '</option>'; }).join('') + '</select></label>';
    h += '<label class="chk"><input type="checkbox" id="aideid"' + (AI.deid ? ' checked' : '') + '><span>' + LL('Обезличивать данные перед отправкой (ФИО, ИИН, ИБ, адрес)', 'De-identify data before sending (name, ID, case no., address)') + '</span></label>';
    h += '<div class="aistat s-' + st + '"><span class="dot"></span>' + ({ off: LL('Ключ не введён', 'No key'), check: LL('Проверяю ключ…', 'Checking key…'), ok: LL('Подключено: ключ принят, всё работает', 'Connected: key accepted, all good'), err: esc(AI.err) }[st]) + '</div>';
    h += '<div class="actions"><button type="button" class="btn primary small" data-act="aikeysave">' + LL('Сохранить и проверить', 'Save and test') + '</button>' + (AI.key ? '<button type="button" class="btn small ghost" data-act="aikeyclear">' + LL('Отключить', 'Disconnect') + '</button>' : '') + '</div></div></div>';
  }
  return h + '</div>';
}
function renderAIPanel() {
  var ctx = aiCtx(), th = aiThread(ctx.key);
  var h = '<aside class="aip" aria-label="' + LL('ИИ-ассистент', 'AI assistant') + '"><div class="aip-h"><span class="aip-ic">' + ico('sparkle', 16) + '</span><div class="aip-t"><b>' + LL('Ассистент', 'Assistant') + '</b><span>' + esc(ctx.title) + '</span></div>';
  h += '<button type="button" class="iconbtn sm" data-act="airegreet" title="' + LL('Обновить анализ', 'Refresh analysis') + '"' + (aiReady() ? '' : ' disabled') + '>' + ico('refresh', 16) + '</button><button type="button" class="iconbtn sm" data-act="aitoggle" aria-label="' + t('a11y.close') + '">' + ico('x', 16) + '</button></div>';
  h += '<div class="aip-body">';
  if (!aiReady()) {
    h += '<div class="ai-empty"><div class="ai-orb">' + ico('sparkle', 26) + '</div><b>' + (AI.st === 'check' ? LL('Проверяю ключ…', 'Checking key…') : LL('Подключите Gemini', 'Connect Gemini')) + '</b><p>' + LL('Ассистент читает открытый экран, делает сводку, находит пропуски, сверяет с рекомендациями и даёт ссылки на статьи. Он ничего не меняет в данных.', 'The assistant reads the open screen, summarises, finds gaps, checks guidelines and cites papers. It never changes data.') + '</p>' + (AI.st === 'err' ? '<div class="aerr">' + esc(AI.err) + '</div>' : '') + '<button type="button" class="btn primary" data-act="menu" data-id="aikey">' + LL('Ввести ключ API', 'Enter API key') + '</button></div>';
  } else {
    if (!th.msgs.length) h += '<div class="ai-empty sm"><p>' + LL('Готовлю анализ…', 'Preparing analysis…') + '</p></div>';
    th.msgs.forEach(function (m, i) {
      var last = i === th.msgs.length - 1;
      if (m.role === 'user') { h += '<div class="am u"><div class="ab">' + esc(m.text).replace(/\n/g, '<br>') + '</div></div>'; return; }
      h += '<div class="am m' + (m.err ? ' err' : '') + (m.greet ? ' greet' : '') + '">' + (m.greet ? '<div class="am-k">' + ico('sparkle', 12) + LL('Анализ экрана', 'Screen analysis') + '</div>' : '') + '<div class="ab"' + (m.pending && last ? ' id="ai-live"' : '') + '>' + (m.pending && !m.text ? '<span class="typing"><i></i><i></i><i></i></span>' : md(m.text)) + '</div>';
      if (m.src && m.src.length) h += '<div class="asrc"><span>' + LL('Источники', 'Sources') + '</span>' + m.src.slice(0, 8).map(function (s, j) { return '<a href="' + esc(s.uri) + '" target="_blank" rel="noopener">' + (j + 1) + '. ' + esc(s.title) + '</a>'; }).join('') + '</div>';
      if (!m.pending && !m.err) h += '<div class="aact"><button type="button" class="linkbtn" data-act="aicopy" data-i="' + i + '">' + ico('copy', 12) + LL('Копировать', 'Copy') + '</button></div>';
      h += '</div>';
    });
  }
  h += '</div>';
  if (aiReady()) {
    if (ctx.chips && ctx.chips.length) h += '<div class="aip-chips">' + ctx.chips.map(function (c, i) { return '<button type="button" class="aichip" data-act="aichip" data-i="' + i + '"' + (AI.busy ? ' disabled' : '') + '>' + esc(c[0]) + '</button>'; }).join('') + '</div>';
    h += '<div class="aip-in"><textarea id="ai-in" rows="2" data-sb="aidraft" placeholder="' + LL('Спросите о том, что на экране…', 'Ask about what is on screen…') + '">' + esc(S.aidraft || '') + '</textarea>' + (AI.busy ? '<button type="button" class="send stop" data-act="aistop" aria-label="stop">' + ico('stop', 16) + '</button>' : '<button type="button" class="send" data-act="aisend" aria-label="' + LL('Отправить', 'Send') + '">' + ico('send', 16) + '</button>') + '</div><div class="aip-note">' + ico('lock', 11) + (AI.deid ? LL('Данные обезличены. ', 'Data de-identified. ') : '') + LL('ИИ только советует, решения принимает врач.', 'AI only advises; clinicians decide.') + '</div>';
  }
  return h + '</aside>';
}

/* AI operative report (NROC style) */
function corpusPick(d, n) {
  var name = (opTitle ? opTitle(d) : d.proc || '').toLowerCase() + ' ' + String(d.access || '').toLowerCase(), words = name.split(/[^а-яёa-z]+/).filter(function (w) { return w.length > 4; });
  var list = (window.OP_CORPUS || []).map(function (e) { var s = (e.op.join(' ') + ' ' + e.text.slice(0, 400)).toLowerCase(); var sc = words.reduce(function (a, w) { return a + (s.indexOf(w.slice(0, 6)) >= 0 ? 1 : 0); }, 0); return { e: e, sc: sc + (e.text.length > 1200 ? 0.5 : 0) }; });
  return list.sort(function (a, b) { return b.sc - a.sc; }).slice(0, n || 3).map(function (x) { return x.e; });
}
function aiProtocol() {
  if (!aiReady()) { UI.aip = true; saveUI(); render(); toast(LL('Сначала подключите ключ Gemini', 'Connect a Gemini key first')); return; }
  var dr = S.drawer, p = dr.p, d = p.d, ex = corpusPick(d, 3), ta = root.querySelector('#protoText');
  var facts = patText(p, false), skeleton = buildProtocol(p);
  var sys = 'Ты пишешь протоколы операций колоректального сектора ННОЦ (Астана) в точности в стиле отделения. Ниже реальные обезличенные протоколы отделения: копируй их лексику, порядок изложения, формулировки (Тайм-аут, обработка операционного поля, ТВВА+ИВЛ, карбоксиперитонеум, троакары, ревизия, мобилизация, пересечение сосудов, ТМЭ, анастомоз, проверка герметичности, дренирование, ушивание, асептическая повязка).\n' +
    'Принципы:\n1. Пиши только то, что следует из данных операции. Стандартные этапы, которые обязательно выполняются при такой операции и таком доступе, описывай стандартными фразами отделения.\n2. Нестандартные находки и детали бери только из данных. Не выдумывай размеры, находки, осложнения, количество и названия нитей и кассет, если их нет в данных: там, где врач обязан уточнить, ставь [уточнить].\n3. Ревизию описывай по полям «Находки при ревизии»: если отличий нет, стандартное описание нормы как в образцах.\n4. Формат ответа строго такой (без markdown, без заголовков кроме этих):\nНазвание операции: ...\nПротокол операции: <сплошной связный текст одним абзацем или несколькими абзацами>\nОбъем кровопотери: ...\nОсложнения: ...\nМакропрепарат: ...\nДренажи: ...\n5. Не используй длинные тире.\n\n=== ОБРАЗЦЫ ПРОТОКОЛОВ ОТДЕЛЕНИЯ ===\n' + ex.map(function (e, i) { return '--- Образец ' + (i + 1) + ' ---\nНазвание операции: ' + e.op.join('; ') + '\nПротокол операции: ' + e.text + '\nМакропрепарат: ' + e.spec + '\nОсложнения: ' + e.cx; }).join('\n\n');
  var prompt = 'Данные операции и пациента (структурированные поля карточки):\n' + facts + '\n\nЧерновик, собранный шаблоном (используй только как список фактов, стиль не копируй):\n' + skeleton + '\n\nНапиши протокол операции.';
  if (ta) { ta.value = ''; ta.classList.add('gen'); }
  dr.protoAI = true; var out = '';
  var btn = root.querySelector('[data-act=aiproto]'); if (btn) { btn.disabled = true; btn.innerHTML = ico('sparkle', 15) + LL('Пишу…', 'Writing…'); }
  aiStream({ system: sys, contents: [{ role: 'user', parts: [{ text: prompt }] }], search: false, temp: 0.3,
    chunk: function (txt) { out = txt; var t2 = root.querySelector('#protoText'); if (t2) { t2.value = txt; t2.scrollTop = t2.scrollHeight; } },
    done: function (txt) { out = txt; dr.protoEdit = { base: buildProtocol(dr.p), text: txt }; dr.protoAI = false; render(); toast(LL('Протокол написан ИИ: проверьте места [уточнить]', 'AI draft ready: check the [уточнить] spots')); },
    fail: function (e) { dr.protoAI = false; render(); toast(e); }
  });
}

/* ======================= v10: morning briefing ======================= */
var ROUTE_WIN = { 'Палата пробуждения': [2, 4], 'Реанимация (ОАРИТ)': [3, 5] };
function briefing(forAI) {
  var nm = function (fio, pid) { return forAI ? pubName(fio, pid) : (fio || pid || ''); };
  var td = isoOf(new Date()), tm = isoOf(addDays(td, 1)), out = { labs: [], ops: [], mdt: [], due: [], cps: [] };
  DB.cols.planner.forEach(function (r) {
    if (!r.surgeryDate || r.status === 'Отменено' || r.status === 'Завершено' || r.labsDone) return;
    var pod = -daysTo(r.surgeryDate); if (pod < 1 || pod > 10) return;
    var lp = patOf(r.pid), route = r.postRoute || (lp && lp.d.postRoute) || '', win = ROUTE_WIN[route] || [2, 5];
    if (pod < win[0] - 1) return;
    var st = pod < win[0] ? 'soon' : pod <= win[1] ? 'now' : 'late';
    out.labs.push({ rid: r.id, pid: r.pid, who: pubName(r.fio, r.pid), name: r.fio || '', pod: pod, op: r.dx || '', route: route ? (route === 'Палата пробуждения' ? LL('через палату пробуждения', 'via recovery room') : LL('через реанимацию', 'via ICU')) : LL('путь не указан', 'route not set'), noRoute: !route, win: win, st: st, stTxt: st === 'soon' ? LL('окно открывается завтра', 'window opens tomorrow') : st === 'now' ? LL('в окне: назначить и взять', 'in window: order and take') : LL('окно прошло, анализы не отмечены', 'window passed, not marked') });
  });
  var rk = { late: 0, now: 1, soon: 2 }; out.labs.sort(function (a, b) { return rk[a.st] - rk[b.st] || b.pod - a.pod; });
  DB.cols.planner.forEach(function (r) { if ((r.surgeryDate === td || r.surgeryDate === tm) && r.status !== 'Отменено') out.ops.push({ rid: r.id, when: r.surgeryDate === td ? LL('Сегодня', 'Today') : LL('Завтра', 'Tomorrow'), who: pubName(r.fio, r.pid), name: r.fio || '', what: [r.dx, r.surgeon ? ov(r.surgeon) : ''].filter(Boolean).join(' · ') }); });
  DB.cols.mdt.forEach(function (r) { if (r.date === td) out.mdt.push(nm(r.fio, r.pid) + (r.status ? ' (' + ov(r.status) + ')' : '')); });
  fuDueAll().forEach(function (x) { if (x.f.st === 'overdue') out.due.push(LL('Контроль ', 'Follow-up ') + x.f.label + ': ' + nm(pName(x.p), x.p.id) + ', ' + daysLabel(x.f.days)); });
  qDueAll(0).forEach(function (x) { out.due.push(LL('Анкета ', 'Questionnaire ') + qShort(qTpl(x.e.tid)) + ': ' + nm(pName(x.p), x.p.id) + ', ' + daysLabel(x.n)); });
  DB.cols.redcap.forEach(function (r) { if (r.done !== 'Заполнено' && r.contact && r.contact <= td) out.due.push('RedCap: ' + nm(r.fio, r.pid) + ', ' + fmtDate(r.contact)); });
  studies().forEach(function (r) { (stProto(r).cps || []).forEach(function (c) { if (!c.done && c.date && daysTo(c.date) <= 7) out.cps.push(regName(r) + ': ' + (c.title || '') + ', ' + daysLabel(daysTo(c.date))); }); });
  return out;
}
function markLabs(rid) {
  var r = DB.cols.planner.filter(function (x) { return x.id === rid; })[0]; if (!r) return;
  r.labsDone = isoOf(new Date()); r.log = (r.log || []).concat([{ ts: nowIso(), by: me(), act: 'edit', ch: [{ f: 'labsDone', a: null, b: r.labsDone }] }]);
  save(); toast(LL('Отмечено: контрольные анализы взяты', 'Marked: control labs taken')); render();
}

/* ======================= v10: MDT protocol ======================= */
var MP = [
  ['pass', ['Паспортные данные', 'Patient details'], [f('fam', 'Фамилия', 'Surname', 'text'), f('nam', 'Имя', 'Name', 'text'), f('otc', 'Отчество', 'Patronymic', 'text'), f('iin', 'ИИН', 'IIN', 'text'), f('dob', 'Дата рождения', 'Date of birth', 'date'), f('age', 'Возраст', 'Age', 'num', { unit: 'u.years' }), f('sex', 'Пол', 'Sex', 'seg', { options: ['М', 'Ж'] }), f('addr', 'Адрес постоянного местожительства', 'Permanent address', 'text', { wide: true })]],
  ['dx', ['Диагноз', 'Diagnosis'], [f('main', 'Основной диагноз', 'Main diagnosis', 'long', { rows: 2 }), f('loc', 'Локализация', 'Location', 'text'), f('morph', 'Морфологический диагноз', 'Morphology', 'text', { wide: true }), f('T', 'T', 'T', 'text'), f('N', 'N', 'N', 'text'), f('M', 'M', 'M', 'text'), f('stage', 'Стадия', 'Stage', 'text'), f('mets', 'Метастазы', 'Metastases', 'seg', { options: ['Да', 'Нет'] }), f('metsLoc', 'Локализация метастазов', 'Metastatic sites', 'text', { show: function (d) { return d.mets === 'Да'; } }), f('ecog', 'ECOG', 'ECOG', 'sel', { options: ['0', '1', '2', '3', '4'] }), f('cg', 'Клиническая группа', 'Clinical group', 'sel', { options: ['Ia', 'Ib', 'II', 'III', 'IV'] }), f('icd', 'Код диагноза по МКБ-10', 'ICD-10 code', 'text')]],
  ['ref', ['Диагноз при направлении на МДГ', 'Diagnosis at referral'], [f('refDx', 'Диагноз при направлении на МДГ', 'Diagnosis at referral', 'long', { rows: 2 })]],
  ['anam', ['Анамнез заболевания', 'History of present illness'], [f('anam', 'Анамнез заболевания', 'History', 'long', { rows: 4 })]],
  ['labs', ['Лабораторные исследования', 'Laboratory tests'], [f('labs', 'Лабораторные исследования', 'Laboratory tests', 'long', { rows: 3, ph: 'Hb, лейкоциты, тромбоциты, креатинин, альбумин, РЭА, СА 19-9…' })]],
  ['instr', ['Инструментальные исследования', 'Imaging and endoscopy'], [f('instr', 'Инструментальные исследования', 'Imaging and endoscopy', 'long', { rows: 4, ph: 'Колоноскопия с биопсией, МРТ малого таза, КТ ОГК и ОБП с контрастом, ПЭТ-КТ…' })]],
  ['cons', ['Консультации специалистов', 'Specialist consultations'], [f('cons', 'Консультации специалистов', 'Consultations', 'long', { rows: 3 })]],
  ['tx', ['Проведенное лечение', 'Treatment given'], [f('tx', 'Проведенное лечение', 'Treatment given', 'long', { rows: 3 })]],
  ['state', ['Общее состояние', 'General condition'], [f('state', 'Общее состояние', 'General condition', 'long', { rows: 2 })]],
  ['why', ['Причина вынесения на МДГ', 'Reason for MDT'], [f('why', 'Причина вынесения на МДГ', 'Reason for MDT', 'long', { rows: 2 })]],
  ['notes', ['Дополнительные замечания', 'Additional notes'], [f('notes', 'Дополнительные замечания', 'Additional notes', 'long', { rows: 2 })]],
  ['concl', ['Заключение МДГ', 'MDT conclusion'], [f('concl', 'Заключение МДГ', 'MDT conclusion', 'long', { rows: 5 })]]
];
var ICD_LOC = { 'Слепая кишка': 'C18.0', 'Восходящая ободочная': 'C18.2', 'Печёночный изгиб': 'C18.3', 'Поперечная ободочная': 'C18.4', 'Селезёночный изгиб': 'C18.5', 'Нисходящая ободочная': 'C18.6', 'Сигмовидная кишка': 'C18.7', 'Ректосигмоидный отдел': 'C19', 'Прямая кишка': 'C20', 'Анальный канал': 'C21.1' };
function mpFill() {
  var r = S.rec.r, p = patOf(r.pid), mp = r.mp = r.mp || {}, n = 0;
  function put(k, v) { if (has(v) && !has(mp[k])) { mp[k] = v; n++; } }
  var fio = String(r.fio || (p && p.d.fio) || '').trim().split(/\s+/);
  put('fam', fio[0]); put('nam', fio[1]); put('otc', fio.slice(2).join(' '));
  put('refDx', r.dx);
  if (p) {
    var d = p.d;
    put('age', d.age); put('sex', d.sex); put('main', d.dxText); put('loc', [ov(d.loc), d.rLevel ? ov(d.rLevel).toLowerCase() + ' отдел' : ''].filter(Boolean).join(', '));
    put('morph', [d.hist, d.grade].filter(Boolean).join(', ')); put('T', d.cT); put('N', d.cN); put('M', d.cM); put('stage', d.stage || r.stage);
    if (d.cM) put('mets', d.cM === 'cM1' ? 'Да' : 'Нет'); put('ecog', d.ecog); put('icd', ICD_LOC[d.loc]);
    var tx = []; if (d.tactic) tx.push((d.tactic || []).map(tacShort).join(' → ')); if (d.neo) tx.push(ov(d.neo)); if (d.proc && d.date) tx.push(ov(d.proc) + ' от ' + fmtDate(d.date) + (d.access ? ', ' + ov(d.access).toLowerCase() + ' доступ' : ''));
    if (d.pT) tx.push('Патоморфология: ' + [d.y === 'Да' ? 'y' : '', d.pT, d.pN, d.r, d.pTRG ? 'TRG ' + d.pTRG : ''].filter(Boolean).join(' '));
    put('tx', tx.join('. '));
    var ins = []; if (d.mrT) ins.push('МРТ малого таза: ' + [d.mrT, d.mrCRM ? 'CRM ' + ov(d.mrCRM).toLowerCase() : '', d.emvi ? 'EMVI ' + ov(d.emvi).toLowerCase() : '', d.rHeight ? 'высота ' + d.rHeight + ' см' : ''].filter(Boolean).join(', ')); put('instr', ins.join('. '));
    if (d.ecog) put('state', 'ECOG ' + d.ecog + (d.asa ? ', ASA ' + d.asa : '') + (d.bmi ? ', ИМТ ' + d.bmi : ''));
  } else if (r.stage) put('stage', r.stage);
  S.mpShow = true; toast(n ? LL('Заполнено полей: ', 'Fields filled: ') + n : LL('Новых данных в карточке нет', 'No new data in the record')); render();
}
function mdtProtoText(r, deid) {
  var mp = r.mp || {}, out = ['ПРОТОКОЛ МУЛЬТИДИСЦИПЛИНАРНОЙ ГРУППЫ', 'Дата МДГ: ' + (r.date ? fmtDate(r.date) : '[__.__.____]') + (r.mrn ? '   № МДГ: ' + r.mrn : '')];
  MP.forEach(function (sec) {
    if (deid && sec[0] === 'pass') { out.push('\n' + L(sec[1]).toUpperCase() + ': обезличено, возраст ' + (mp.age || '?') + ', пол ' + (mp.sex || '?')); return; }
    var rows = sec[2].filter(function (x) { return !x.show || x.show(mp); }).map(function (x) { var v = mp[x.id]; return (sec[2].length > 1 ? L(x.label) + ': ' : '') + (has(v) ? fmtVal(x, v) + (x.unit ? ' ' + t(x.unit) : '') : '[________________]'); });
    out.push('\n' + L(sec[1]).toUpperCase() + (sec[2].length > 1 ? '\n' + rows.join('\n') : ':\n' + rows[0]));
  });
  return out.join('\n');
}
function mpCard(r) {
  var mp = r.mp || {}, filled = Object.keys(mp).filter(function (k) { return has(mp[k]); }).length, open = S.mpShow || filled > 0;
  var h = '<section class="card mpcard" id="sec-mp"><h3>' + ico('doc', 18) + LL('Протокол МДГ', 'MDT protocol') + '<span class="h3-note">' + (filled ? LL('заполнено полей: ', 'fields filled: ') + filled : LL('по шаблону центра', 'centre template')) + '</span></h3>';
  if (!open) return h + '<button type="button" class="mp-open" data-act="mpshow">' + ico('plus', 18) + '<span><b>' + LL('Открыть шаблон протокола МДГ', 'Open MDT protocol template') + '</b><em>' + LL('Паспортные данные, диагноз, анамнез, обследования, лечение, причина вынесения, заключение', 'Details, diagnosis, history, work-up, treatment, reason, conclusion') + '</em></span></button></section>';
  h += '<div class="mp-bar"><button type="button" class="btn small" data-act="mpfill"' + (r.pid ? '' : ' disabled title="' + LL('Сначала свяжите запись с карточкой пациента', 'Link a patient record first') + '"') + '>' + ico('users', 14) + LL('Заполнить из карточки пациента', 'Fill from patient record') + '</button><button type="button" class="btn small" data-act="mpcopy">' + ico('copy', 14) + LL('Копировать протокол', 'Copy protocol') + '</button><button type="button" class="btn small ai" data-act="mpai">' + ico('sparkle', 14) + LL('Разбор ИИ', 'AI review') + '</button></div>';
  MP.forEach(function (sec, i) {
    var cnt = sec[2].filter(function (x) { return has(mp[x.id]); }).length, closed = (S.mpClosed || {})[sec[0]];
    h += '<div class="mps' + (closed ? ' closed' : '') + '"><button type="button" class="mps-h" data-act="mptog" data-id="' + sec[0] + '"><span class="mps-n">' + (i + 1) + '</span><b>' + esc(L(sec[1])) + '</b><span class="mps-c' + (cnt ? ' ok' : '') + '">' + cnt + '/' + sec[2].length + '</span>' + ico('down', 16) + '</button>';
    if (!closed) h += '<div class="mps-b"><div class="fgrid">' + sec[2].map(function (x) { var y = sec[2].length === 1 ? Object.assign({}, x, { label: ['', ''] }) : x; return fieldHTML(y, mp[x.id], 'r.mp.' + x.id, mp); }).join('') + '</div></div>';
    h += '</div>';
  });
  return h + '</section>';
}

/* ======================= v10: home workspace ======================= */
function pageHead(kick, title, sub, actions) { return '<div class="head"><div>' + (kick ? '<div class="kicker">' + kick + '</div>' : '') + '<h1>' + esc(title) + '</h1>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + '</div><div class="actions">' + (actions || '') + '</div></div>'; }
function qiRow(label, pair, good, note) {
  var v = pair[1] ? pct(pair[0], pair[1]) : null, cls = v === null ? 'na' : good === 'low' ? (v <= note[0] ? 'ok' : v <= note[1] ? 'warn' : 'due') : (v >= note[0] ? 'ok' : v >= note[1] ? 'warn' : 'due');
  return '<div class="qr ' + cls + '"><span class="qr-l">' + esc(label) + '</span><span class="qr-bar"><i style="width:' + (v === null ? 0 : Math.min(100, v)) + '%"></i></span><b>' + (v === null ? LL('н/д', 'n/a') : v + '%') + '</b><em>' + (pair[1] ? pair[0] + '/' + pair[1] : '') + '</em></div>';
}
function qiTile9(label, pair, good, note) {
  var v = pair[1] ? pct(pair[0], pair[1]) : null, cls = v === null ? '' : good === 'low' ? (v <= note[0] ? 'ok' : v <= note[1] ? 'warn' : 'due') : (v >= note[0] ? 'ok' : v >= note[1] ? 'warn' : 'due');
  return '<div class="qi ' + cls + '"><span class="qi-l">' + esc(label) + '</span><b' + (v === null ? ' class="nd"' : '') + '>' + (v === null ? LL('нет данных', 'no data') : v + '%') + '</b><em>' + (pair[1] ? pair[0] + LL(' из ', ' of ') + pair[1] : '') + '</em>' + (v !== null ? '<div class="qi-bar"><span style="width:' + Math.min(100, v) + '%"></span></div>' : '') + '</div>';
}
var GOAL_PRI = { 'Высокий': 'due', 'Средний': 'warn', 'Низкий': 'ok' };
function renderHome() {
  var td = isoOf(new Date()), ws = weekStart(), we = new Date(ws); we.setDate(we.getDate() + 6);
  var wsI = isoOf(ws), weI = isoOf(we), hr = new Date().getHours(), b = briefing();
  var greet = hr < 5 ? LL('Доброй ночи', 'Good night') : hr < 12 ? LL('Доброе утро', 'Good morning') : hr < 18 ? LL('Добрый день', 'Good afternoon') : LL('Добрый вечер', 'Good evening');
  var inDept = DB.cols.planner.filter(function (r) { return r.status === 'В отделении' && (!r.date || r.date <= td); }).length;
  var opsWeek = DB.cols.planner.filter(function (r) { return r.surgeryDate >= wsI && r.surgeryDate <= weI && r.status !== 'Отменено'; });
  var mdtWait = DB.cols.mdt.filter(function (r) { return r.status === 'Ожидает обсуждения'; }).length;
  var dateStr = new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var first = String(me() || '').split(' ');
  var h = '<div class="h9"><section class="hero"><div class="hero-bg" style="background-image:url(media/nroc-hero-hd.webp)"></div><div class="hero-in"><div class="hero-k"><img src="media/nroc-logo-white.png" alt="NROC"><span>' + LL('Национальный научный онкологический центр · Астана', 'National Research Oncology Center · Astana') + '</span></div><h1>' + greet + (SESSION ? ', ' + esc(first[1] || first[0]) : '') + '</h1><p>' + LL('Колоректальная хирургия: регистр, операции и наука в одном месте.', 'Colorectal surgery: registry, operations and research in one place.') + '</p><div class="hero-date">' + esc(dateStr.charAt(0).toUpperCase() + dateStr.slice(1)) + '</div><div class="hero-act">' + (can('edit') ? '<button type="button" class="btn light" data-act="newp">' + ico('plus', 16) + LL('Новый пациент', 'New patient') + '</button>' : '') + '<button type="button" class="btn glass" data-act="aiopen">' + ico('sparkle', 16) + LL('Брифинг ИИ', 'AI briefing') + '</button><button type="button" class="btn glass" data-act="view" data-v="col:planner">' + ico('cal', 16) + LL('Планировщик', 'Planner') + '</button><button type="button" class="btn glass" data-act="view" data-v="studies">' + ico('flask', 16) + LL('Исследования', 'Studies') + '</button></div></div></section>';
  h += '<div class="kpis home">' + [
    [DB.patients.length, LL('пациентов в регистре', 'patients in registry'), 'users', 'reg:all'],
    [inDept, LL('сейчас в отделении', 'in the ward now'), 'bed', 'col:planner'],
    [opsWeek.length, LL('операций на этой неделе', 'operations this week'), 'knife', 'col:planner'],
    [b.labs.filter(function (x) { return x.st !== 'soon'; }).length, LL('контрольных анализов сегодня', 'control labs due'), 'flask', 'home'],
    [mdtWait, LL('ждут обсуждения на МДГ', 'awaiting MDT'), 'mdt', 'col:mdt'],
    [fuDueAll().filter(function (x) { return x.f.st === 'overdue'; }).length, LL('контролей просрочено', 'follow-ups overdue'), 'clock', 'fu']
  ].map(function (k) { return '<button type="button" class="kpi" data-act="view" data-v="' + k[3] + '"><span class="kpi-ic">' + ico(k[2], 18) + '</span><b>' + k[0] + '</b><span>' + k[1] + '</span></button>'; }).join('') + '</div>';
  h += '<div class="dash">';
  // briefing
  function sec(title, icon, body, n) { return '<div class="bs"><div class="bs-h">' + ico(icon, 15) + '<b>' + title + '</b><span class="cnt">' + n + '</span></div>' + body + '</div>'; }
  var labsBody = b.labs.length ? b.labs.map(function (x) { return '<div class="bi bi-' + x.st + '"><span class="pod">' + x.pod + '<i>' + LL('сут', 'POD') + '</i></span><div class="bi-t"><b>' + esc(x.name || x.who) + '</b><span>' + esc(x.op) + ' · ' + x.route + ' · ' + LL('окно ', 'window ') + x.win[0] + '-' + x.win[1] + LL(' сут', ' d') + (x.noRoute ? ' · <button type="button" class="linkbtn" data-act="openrec" data-k="planner" data-id="' + x.rid + '">' + LL('указать путь', 'set route') + '</button>' : '') + '</span></div><span class="bi-s">' + x.stTxt + '</span>' + (can('edit') ? '<button type="button" class="btn small" data-act="labsdone" data-id="' + x.rid + '">' + ico('check', 14) + LL('Взяты', 'Taken') + '</button>' : '') + '</div>'; }).join('') : '<p class="bnone">' + LL('Сегодня контрольные анализы никому не положены. Правило: 2-4 сутки после палаты пробуждения, 3-5 сутки после реанимации; путь указывается в планировщике или в карточке.', 'No control labs due today. Rule: POD 2-4 after recovery room, POD 3-5 after ICU.') + '</p>';
  h += '<section class="panel brief wide"><div class="ph"><h2>' + LL('Брифинг на сегодня', 'Today\'s briefing') + '</h2><button type="button" class="btn small ai" data-act="aiopen">' + ico('sparkle', 14) + LL('Разбор ИИ', 'AI review') + '</button></div><div class="bgrid"><div>';
  h += sec(LL('Контрольные анализы после операции', 'Post-op control labs'), 'flask', labsBody, b.labs.length) + '</div><div>';
  h += sec(LL('Операции сегодня и завтра', 'Surgery today and tomorrow'), 'knife', b.ops.length ? b.ops.map(function (x) { return '<button type="button" class="bi link" data-act="openrec" data-k="planner" data-id="' + x.rid + '"><span class="pod op">' + ico('knife', 15) + '</span><div class="bi-t"><b>' + esc(x.name || x.who) + '</b><span>' + esc(x.when) + (x.what ? ' · ' + esc(x.what) : '') + '</span></div></button>'; }).join('') : '<p class="bnone">' + LL('Не запланировано', 'Nothing scheduled') + '</p>', b.ops.length);
  if (b.mdt.length) h += sec(LL('МДГ сегодня', 'MDT today'), 'mdt', '<ul class="bl">' + b.mdt.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>', b.mdt.length);
  if (b.due.length) h += sec(LL('Просрочено', 'Overdue'), 'clock', '<ul class="bl due">' + b.due.slice(0, 6).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + (b.due.length > 6 ? '<li class="muted">+' + (b.due.length - 6) + '</li>' : '') + '</ul>', b.due.length);
  if (b.cps.length) h += sec(LL('Исследования', 'Studies'), 'flag', '<ul class="bl">' + b.cps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>', b.cps.length);
  h += '</div></div></section>';
  // week with clickable legend filters
  var days = []; for (var i = 0; i < 7; i++) { var dd = new Date(ws); dd.setDate(ws.getDate() + i); days.push(isoOf(dd)); }
  var off = UI.wkOff || {}, ev = {}; days.forEach(function (d) { ev[d] = []; });
  DB.cols.planner.forEach(function (r) { if (ev[r.surgeryDate] && r.status !== 'Отменено') ev[r.surgeryDate].push({ c: 'op', t: r.fio, s: r.dx, a: ['r', 'planner', r.id] }); });
  DB.cols.mdt.forEach(function (r) { if (ev[r.date]) ev[r.date].push({ c: 'mdt', t: LL('МДГ: ', 'MDT: ') + (r.fio || ''), s: r.mrn ? '№ ' + r.mrn : '', a: ['r', 'mdt', r.id] }); });
  DB.cols.mm.forEach(function (r) { if (ev[r.date]) ev[r.date].push({ c: 'mm', t: 'M&M: ' + (r.title || ''), s: r.reason, a: ['r', 'mm', r.id] }); });
  studies().forEach(function (r) { (stProto(r).cps || []).forEach(function (c) { if (!c.done && ev[c.date]) ev[c.date].push({ c: 'st', t: c.title, s: regName(r), a: ['s', r.id] }); }); });
  var cats = [['op', LL('операции', 'surgery')], ['mdt', LL('МДГ', 'MDT')], ['mm', 'M&M'], ['st', LL('наука', 'research')]];
  h += '<section class="panel week wide"><div class="ph"><h2>' + LL('Эта неделя', 'This week') + '</h2><span class="muted">' + fmtDate(wsI) + ' · ' + fmtDate(weI) + '</span><div class="legend" role="group" aria-label="' + LL('Фильтр календаря', 'Calendar filter') + '">' + cats.map(function (c) { var n = days.reduce(function (a, d) { return a + ev[d].filter(function (e) { return e.c === c[0]; }).length; }, 0); return '<button type="button" class="lgb we-' + c[0] + (off[c[0]] ? ' off' : '') + '" data-act="wkf" data-v="' + c[0] + '" aria-pressed="' + !off[c[0]] + '" title="' + LL('Показать или скрыть', 'Show or hide') + '"><i></i>' + c[1] + '<span>' + n + '</span></button>'; }).join('') + '</div></div><div class="wk">';
  var wd = wdNames();
  days.forEach(function (d, i) {
    var l = ev[d].filter(function (e) { return !off[e.c]; });
    h += '<div class="wd' + (d === td ? ' today' : '') + (d < td ? ' past' : '') + '"><div class="wd-h"><span>' + esc(wd[i]) + '</span><b>' + +d.slice(8) + '</b></div><div class="wd-l">' + (l.length ? l.slice(0, 6).map(function (e) { return '<button type="button" class="we we-' + e.c + '" data-act="wgo" data-a=\'' + esc(JSON.stringify(e.a)) + '\'><b>' + esc(e.t || '') + '</b>' + (e.s ? '<span>' + esc(String(e.s).slice(0, 60)) + '</span>' : '') + '</button>'; }).join('') + (l.length > 6 ? '<span class="more">+' + (l.length - 6) + '</span>' : '') : '<span class="none">·</span>') + '</div></div>';
  });
  h += '</div></section>';
  // quality
  var per = UI.qiPer || 'all', from = per === 'year' ? new Date().getFullYear() + '-01-01' : per === '12m' ? isoOf(addDays(td, -365)) : '0000';
  var q = qiCalc(DB.patients.filter(function (p) { return p.d.date && p.d.date >= from; }));
  var months = [], cy = new Date().getFullYear(), byYear = per === 'all';
  if (byYear) { var ys = DB.patients.filter(function (p) { return hasProc(p.d) && p.d.date; }).map(function (p) { return +p.d.date.slice(0, 4); }), y0 = Math.max(cy - 11, Math.min.apply(null, ys.concat([cy - 4]))); for (var yy = y0; yy <= cy; yy++) months.push(String(yy)); }
  else if (per === 'year') { for (var mi = 1; mi <= 12; mi++) months.push(cy + '-' + String(mi).padStart(2, '0')); }
  else for (var m = 11; m >= 0; m--) { var md = new Date(); md.setDate(1); md.setMonth(md.getMonth() - m); months.push(isoOf(md).slice(0, 7)); }
  var mc = months.map(function (mm) { return DB.patients.filter(function (p) { return hasProc(p.d) && String(p.d.date || '').slice(0, mm.length) === mm; }).length; }), mx = Math.max.apply(null, mc.concat([1]));
  h += '<section class="panel qip wide"><div class="ph"><h2>' + LL('Показатели качества', 'Quality indicators') + '</h2><div class="seg sm">' + [['12m', LL('12 мес', '12 mo')], ['year', String(cy)], ['all', LL('всё время', 'all time')]].map(function (x) { return '<button type="button" class="' + (per === x[0] ? 'on' : '') + '" data-act="qiper" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="qi-top"><div class="qi-big"><b>' + q.n + '</b><span>' + LL('вмешательств за период', 'procedures in period') + '</span><em>' + LL('медиана койко-дня: ', 'median LOS: ') + (q.los === null ? LL('нет данных', 'no data') : q.los + LL(' дн.', ' d')) + '</em></div><div class="bars" style="grid-template-columns:repeat(' + months.length + ',minmax(0,1fr))">' + months.map(function (mm, i) { return '<div class="bar"><span class="bv" style="height:' + Math.round(mc[i] / mx * 100) + '%"><i>' + (mc[i] || '') + '</i></span><em>' + (byYear ? mm : new Date(+mm.slice(0, 4), +mm.slice(5) - 1, 1).toLocaleDateString(locale(), { month: 'short' }).replace('.', '')) + '</em></div>'; }).join('') + '</div></div>';
  h += '<div class="qis">' + qiTile9(LL('Осложнения Clavien-Dindo III и выше', 'Clavien-Dindo III or higher'), q.cd3, 'low', [15, 25]) + qiTile9(LL('Несостоятельность анастомоза', 'Anastomotic leak'), q.leak, 'low', [8, 12]) + qiTile9(LL('Конверсия при малоинвазивном доступе', 'Conversion in MIS'), q.conv, 'low', [10, 15]) + qiTile9(LL('Малоинвазивный доступ', 'Minimally invasive access'), q.mis, 'high', [70, 50]) + qiTile9(LL('Резекция R0', 'R0 resection'), q.r0, 'high', [95, 90]) + qiTile9(LL('Удалено 12 и более лимфоузлов', '12 or more lymph nodes'), q.ln, 'high', [90, 80]) + qiTile9(LL('Качество ТМЭ: полная', 'Complete TME'), q.tme, 'high', [80, 70]) + '</div><p class="qnote">' + LL('Зелёный: соответствует целевым значениям, жёлтый: требует внимания, красный: хуже ожидаемого. Считается по пациентам с датой вмешательства в выбранном периоде.', 'Green meets targets, amber needs attention, red is worse than expected.') + '</p></section>';
  // research
  var act = studies().filter(function (r) { return !/Завершено|Приостановлено/.test(stProto(r).status); });
  h += '<section class="panel res"><div class="ph"><h2>' + LL('Наука', 'Research') + '</h2><button type="button" class="linkbtn" data-act="view" data-v="studies">' + LL('Все исследования', 'All studies') + '</button></div>';
  h += act.length ? act.slice(0, 5).map(function (r) { var pr = stProto(r), n = stCount(r), tg = stTarget(pr); return '<button type="button" class="rs" data-act="view" data-v="reg:' + r.id + '"><div><b>' + esc(regName(r)) + '</b><span class="mono">' + esc(pr.no) + '</span></div><div class="rs-p"><span>' + n + (tg ? ' / ' + tg : '') + '</span>' + progressBar(n, tg || Math.max(n, 1)) + '</div></button>'; }).join('') : '<p class="bnone">' + LL('Нет активных исследований.', 'No active studies.') + '</p>';
  h += '</section>';
  // publications
  var y = String(cy), pubs = DB.cols.pubs.slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); }), py = pubs.filter(function (r) { return String(r.date || '').slice(0, 4) === y; });
  h += '<section class="panel pubsp"><div class="ph"><h2>' + LL('Публикации', 'Publications') + '</h2><button type="button" class="linkbtn" data-act="view" data-v="col:pubs">' + LL('Все', 'All') + '</button></div>';
  h += '<div class="mini-k"><div><b>' + py.filter(isArt).length + '</b><span>' + LL('статей в ', 'papers in ') + y + '</span></div><div><b>' + py.filter(isTalk).length + '</b><span>' + LL('докладов в ', 'talks in ') + y + '</span></div><div><b>' + pubs.length + '</b><span>' + LL('всего', 'total') + '</span></div></div>';
  h += pubs.length ? '<div class="plist">' + pubs.slice(0, 4).map(function (r) { return '<button type="button" class="pli" data-act="openrec" data-k="pubs" data-id="' + r.id + '"><span class="pk ' + (isTalk(r) ? 'talk' : 'art') + '">' + ico(isTalk(r) ? 'mdt' : 'book', 14) + '</span><div><b>' + esc(r.title || LL('Без названия', 'Untitled')) + '</b><span>' + esc([r.venue, r.date ? fmtDate(r.date) : ''].filter(Boolean).join(' · ')) + '</span></div>' + (r.status ? '<span class="st st-' + ((COLS.pubs.colorBy || {})[r.status] || 'plan') + '">' + esc(ov(r.status)) + '</span>' : '') + '</button>'; }).join('') + '</div>' : '<p class="bnone">' + LL('Публикаций пока нет. Добавьте статью или доклад, или загрузите список из ORCID.', 'No publications yet. Add a paper or talk, or import from ORCID.') + '</p>';
  if (can('edit')) h += '<div class="pact"><button type="button" class="btn small" data-act="newrec" data-k="pubs">' + ico('plus', 14) + LL('Добавить', 'Add') + '</button><button type="button" class="btn small ghost" data-act="orcid">' + LL('Из ORCID', 'From ORCID') + '</button></div>';
  h += '</section>';
  // goals
  var goals = DB.cols.goals.slice(), gd = goals.filter(function (g) { return g.status === 'Готово'; }).length, open = goals.filter(function (g) { return g.status !== 'Готово'; }).sort(function (a, b) { var pr = { 'Высокий': 0, 'Средний': 1, 'Низкий': 2 }; return (pr[a.priority] === undefined ? 3 : pr[a.priority]) - (pr[b.priority] === undefined ? 3 : pr[b.priority]) || String(a.due || '9').localeCompare(String(b.due || '9')); });
  h += '<section class="panel goalsp"><div class="ph"><h2>' + LL('Цели команды', 'Team goals') + '</h2><button type="button" class="linkbtn" data-act="view" data-v="col:goals">' + LL('Все', 'All') + '</button></div>';
  h += '<div class="gprog"><div><b>' + gd + '</b><span>' + LL(' из ', ' of ') + goals.length + LL(' выполнено', ' done') + '</span></div>' + progressBar(gd, Math.max(goals.length, 1)) + '</div>';
  h += open.length ? '<div class="plist">' + open.slice(0, 5).map(function (g) { var dn = daysTo(g.due); return '<button type="button" class="pli" data-act="openrec" data-k="goals" data-id="' + g.id + '"><span class="gdot ' + (GOAL_PRI[g.priority] || '') + '"></span><div><b>' + esc(g.title || LL('Без названия', 'Untitled')) + '</b><span>' + esc([g.gtype ? ov(g.gtype) : '', g.owner, g.due ? fmtDate(g.due) + (dn !== null && dn < 0 ? ' · ' + daysLabel(dn) : '') : ''].filter(Boolean).join(' · ')) + '</span></div><span class="st st-' + ((COLS.goals.colorBy || {})[g.status] || 'plan') + '">' + esc(ov(g.status || 'Не начато')) + '</span></button>'; }).join('') + '</div>' : '<p class="bnone">' + (goals.length ? LL('Все цели выполнены.', 'All goals done.') : LL('Целей пока нет. Добавьте цели сектора: исследования, статьи, проекты.', 'No goals yet. Add team goals: studies, papers, projects.')) + '</p>';
  if (can('edit')) h += '<div class="pact"><button type="button" class="btn small" data-act="newrec" data-k="goals">' + ico('plus', 14) + LL('Добавить цель', 'Add goal') + '</button></div>';
  h += '</section></div></div>';
  return h;
}

/* ======================= v10: shell ======================= */
function viewTitle() {
  var v = S.view;
  if (v === 'home') return LL('Главная', 'Home');
  if (v === 'users') return LL('Пользователи', 'Users');
  if (v === 'fu') return t('nav.followup');
  if (v === 'studies') return t('nav.studies');
  if (v === 'q') return LL('Анкеты', 'Questionnaires');
  if (v.indexOf('col:') === 0 && COLS[v.slice(4)]) return L(COLS[v.slice(4)].title);
  if (v.indexOf('reg:') === 0) { var r = regOf(v.slice(4)); return r ? regName(r) : t('nav.allPatients'); }
  return '';
}
function crumbGroup() {
  var v = S.view;
  if (v === 'home') return '';
  if (/^col:(planner|mdt|mm)$/.test(v)) return t('side.work');
  if (v === 'studies' || v === 'q' || /^col:(pubs|redcap|goals)$/.test(v)) return t('side.research');
  if (v.indexOf('reg:') === 0) { var r = regOf(v.slice(4)); if (r && r.kind === 'study') return t('side.research'); }
  if (v === 'users') return LL('Администрирование', 'Admin');
  return t('side.registry');
}
function render() {
  document.documentElement.lang = LANG;
  document.title = (SESSION ? viewTitle() + ' · ' : '') + 'NROC ' + LL('Колоректальный сектор', 'Colorectal');
  var keep = {};
  ['.dbody', '.content', '.tablewrap', '.side-in', '.fill-body', '.aip-body', '.cmd-l'].forEach(function (s) { keep[s] = [].map.call(root.querySelectorAll(s), function (el) { return el.scrollTop; }); });
  var fa = document.activeElement, faId = fa && fa.id && (fa.id === 'ai-in' || fa.id === 'cmd-in') ? fa.id : null, faPos = faId ? fa.selectionStart : 0;
  document.body.classList.toggle('ai-open', !!(SESSION && UI.aip));
  var h;
  if (!SESSION) { h = renderPortal(); if (S.cs) h += renderCloudSetup(); root.innerHTML = h; return; }
  var sideOn = window.innerWidth < 900 ? !!S.sideMob : UI.side;
  h = '<div class="app' + (sideOn ? '' : ' side-closed') + (UI.aip ? ' aip-open' : '') + '">' + renderSide() + '<div class="main">' + renderTop() + '<main class="content" id="main">' + renderMain() + '<footer class="foot"><img src="media/nroc-logo.png" alt="NROC"><span>' + LL('Колоректальный сектор · ННОЦ, Астана', 'Colorectal unit · NROC, Astana') + '</span><span class="muted">' + (CLOUD.on ? LL('Облачный прототип: тестовые данные', 'Cloud prototype: test data') : t('side.note')) + '</span></footer></main></div>' + renderTabbar() + '</div>';
  if (sideOn) h += '<div class="side-dim" data-act="side"></div>';
  if (S.drawer) h += renderPatient();
  if (S.rec) h += renderRecord();
  if (S.edit) h += renderEditor();
  if (S.pick) h += renderPick();
  if (S.xport) h += renderExport();
  if (S.imp) h += renderImport();
  if (S.cx) h += renderColExport();
  if (S.qs) h += renderQSched();
  if (S.qb) h += renderQB();
  if (S.enr) h += renderEnroll();
  if (S.randShow) h += renderRandShow();
  if (S.fill) h += renderFill();
  if (S.cs) h += renderCloudSetup();
  if (UI.aip) h += renderAIPanel();
  if (S.cmd) h += renderCmd();
  root.innerHTML = h;
  Object.keys(keep).forEach(function (s) { var els = root.querySelectorAll(s); keep[s].forEach(function (v, i) { if (els[i]) els[i].scrollTop = v; }); });
  if (faId) { var ne = document.getElementById(faId); if (ne) { ne.focus(); try { ne.setSelectionRange(faPos, faPos); } catch (e) {} } }
  else { var fi = root.querySelector('[data-autofocus]'); if (fi) { fi.focus(); if (fi.setSelectionRange && fi.type !== 'number') { try { fi.setSelectionRange(fi.value.length, fi.value.length); } catch (e) {} } } }
  var ab = root.querySelector('.aip-body'); if (ab && AI.scrollEnd) { ab.scrollTop = ab.scrollHeight; AI.scrollEnd = false; }
  if (UI.aip && aiReady()) setTimeout(aiMaybeGreet, 0);
}
function renderTop() {
  var grp = crumbGroup();
  var h = '<header class="top"><button type="button" class="iconbtn" data-act="side" aria-label="' + t('a11y.menu') + '">' + ico(UI.side ? 'panel' : 'menu', 19) + '</button>';
  h += '<div class="top-t">' + (grp ? '<span class="tc">' + esc(grp) + '</span><span class="tsep">/</span>' : '') + '<b>' + esc(viewTitle()) + '</b></div>';
  h += '<button type="button" class="cmdk" data-act="cmd">' + ico('search', 15) + '<span>' + LL('Поиск и команды', 'Search and commands') + '</span><kbd>Ctrl K</kbd></button><div class="top-r">';
  h += renderAIPill();
  h += '<button type="button" class="aibtn' + (UI.aip ? ' on' : '') + '" data-act="aitoggle" title="' + LL('ИИ-ассистент по открытому экрану', 'AI assistant for this screen') + '">' + ico('sparkle', 16) + '<span>' + LL('Ассистент', 'Assistant') + '</span></button>';
  h += renderBell();
  h += langSeg();
  h += '<div class="dd"><button type="button" class="user" data-act="menu" data-id="top" aria-expanded="' + (S.menu === 'top') + '"><span class="av">' + esc(initials(me())) + '</span><span class="un"><b>' + esc(me()) + '</b><em>' + (SESSION.admin ? LL('Администратор', 'Admin') : roleName(SESSION.role)) + '</em></span>' + ico('down', 14) + '</button>';
  if (S.menu === 'top') {
    h += '<div class="pop right" role="menu"><div class="pop-user"><span class="av">' + esc(initials(me())) + '</span><div><b>' + esc(me()) + '</b><em>' + esc(SESSION.email) + '</em><span class="tag">' + (SESSION.admin ? LL('Администратор', 'Admin') + ' · ' : '') + roleName(SESSION.role) + '</span></div></div>';
    if (isAdmin()) h += '<button type="button" class="opt" data-act="view" data-v="users">' + ico('users', 16) + LL('Пользователи и роли', 'Users and roles') + '</button><button type="button" class="opt" data-act="cloudsetup">' + ico('cloud', 16) + LL('Облако (Firebase)', 'Cloud (Firebase)') + '</button>';
    h += '<button type="button" class="opt" data-act="backup">' + ico('download', 16) + t('menu.backup') + '</button>';
    if (isAdmin()) h += '<button type="button" class="opt" data-act="restore">' + ico('upload', 16) + t('menu.restore') + '</button><button type="button" class="opt danger" data-act="reset">' + ico('alert', 16) + t('menu.reset') + '</button>';
    h += '<button type="button" class="opt" data-act="logout">' + ico('logout', 16) + LL('Выйти', 'Sign out') + '</button></div>';
  }
  return h + '</div></div></header>';
}
function renderSide() {
  var h = '<nav class="side" aria-label="' + t('a11y.sections') + '"><div class="side-in">';
  h += '<button type="button" class="side-brand" data-act="view" data-v="home"><img src="media/nroc-logo.png" alt="NROC"><span><b>' + LL('Колоректальный сектор', 'Colorectal Unit') + '</b><em>' + LL('Регистр и наука', 'Registry and research') + '</em></span></button>';
  h += navBtn('home', 'home', LL('Главная', 'Home'));
  h += '<div class="side-h">' + t('side.work') + '</div>';
  ['planner', 'mdt', 'mm'].forEach(function (k) { h += navBtn('col:' + k, COLS[k].icon, L(COLS[k].title), DB.cols[k].length); });
  h += '<div class="side-h">' + t('side.registry') + '</div>';
  h += navBtn('reg:all', 'users', t('nav.allPatients'), DB.patients.length);
  var due = fuDueAll().length;
  h += navBtn('fu', 'clock', t('nav.followup'), undefined, due || null);
  kids(null, false).forEach(function (r) { h += treeNode(r, 0); });
  if (can('edit')) h += '<button type="button" class="nav add" data-act="newreg">' + ico('plus', 16) + '<span class="nl">' + t('nav.newRegistry') + '</span></button>';
  h += '<div class="side-h">' + t('side.research') + '</div>';
  var so = !(UI.open && UI.open.studies === false);
  h += '<div class="tn" style="--d:0"><button type="button" class="tog' + (so ? ' open' : '') + '" data-act="tog" data-id="studies" aria-expanded="' + !!so + '" aria-label="' + t(so ? 'a11y.collapse' : 'a11y.expand') + '">' + ico('right', 13) + '</button><button type="button" class="nav' + (S.view === 'studies' ? ' on' : '') + '" data-act="view" data-v="studies">' + ico('flask', 16) + '<span class="nl">' + t('nav.studies') + '</span><span class="cnt">' + studies().length + '</span></button></div>';
  if (so) kids(null, true).forEach(function (r) { h += treeNode(r, 1); });
  if (can('edit')) h += '<button type="button" class="nav add" data-act="newstudy">' + ico('plus', 16) + '<span class="nl">' + t('nav.newStudy') + '</span></button>';
  var qd = qDueAll(0).length;
  h += navBtn('q', 'clipboard', LL('Анкеты', 'Questionnaires'), undefined, qd || null);
  ['pubs', 'redcap', 'goals'].forEach(function (k) { h += navBtn('col:' + k, COLS[k].icon, L(COLS[k].title), DB.cols[k].length); });
  if (isAdmin()) { h += '<div class="side-h">' + LL('Администрирование', 'Admin') + '</div>' + navBtn('users', 'shield', LL('Пользователи', 'Users')); }
  h += '<div class="side-foot"><span class="dot-live' + (CLOUD.on ? ' cloud' : '') + '"></span>' + (CLOUD.on ? LL('Облако · общая база', 'Cloud · shared database') : LL('Локально в этом браузере', 'Local, this browser')) + '</div></div></nav>';
  return h;
}
function renderTabbar() {
  var items = [['home', 'home', LL('Главная', 'Home')], ['col:planner', 'cal', LL('План', 'Planner')], ['reg:all', 'users', LL('Пациенты', 'Patients')], ['studies', 'flask', LL('Наука', 'Research')]];
  return '<nav class="tabbar">' + items.map(function (x) { return '<button type="button" class="' + (S.view === x[0] ? 'on' : '') + '" data-act="view" data-v="' + x[0] + '">' + ico(x[1], 20) + '<span>' + x[2] + '</span></button>'; }).join('') + '<button type="button" data-act="aitoggle" class="' + (UI.aip ? 'on' : '') + '">' + ico('sparkle', 20) + '<span>' + LL('ИИ', 'AI') + '</span></button><button type="button" data-act="side">' + ico('menu', 20) + '<span>' + LL('Меню', 'Menu') + '</span></button></nav>';
}
function renderMain() {
  var v = S.view;
  if (CLOUD.on && CLOUD.empty && SESSION) return '<div class="page"><div class="panel" style="max-width:640px;margin:40px auto;text-align:center;padding:32px"><div class="pt-icon">' + ico('upload', 26) + '</div><h2>' + LL('Общая база пока пустая', 'The shared database is empty') + '</h2>' + (isAdmin() ? '<p class="muted">' + LL('Нажмите кнопку и выберите файл <b>data.js</b> в папке <b>Документы → colorectal-registry</b>. Все пациенты, планировщик, МДГ, M&M и RedCap загрузятся в облако и станут видны всем подтверждённым сотрудникам.', 'Click the button and pick <b>data.js</b> in <b>Documents → colorectal-registry</b>.') + '</p><button type="button" class="btn primary" data-act="restore">' + ico('upload', 16) + LL('Загрузить данные', 'Upload data') + '</button>' : '<p class="muted">' + LL('Администратор ещё не загрузил данные.', 'The administrator has not uploaded data yet.') + '</p>') + '</div></div>';
  if (v === 'home') return renderHome();
  if (v === 'users') return renderUsers();
  if (v === 'fu') return renderFu();
  if (v === 'studies') return renderStudies();
  if (v === 'q') return renderQPage();
  if (v.indexOf('col:') === 0) { var k = v.slice(4); if (COLS[k]) return renderCol(k); }
  if (v.indexOf('reg:') === 0) return renderRegistry();
  S.view = 'home'; return renderHome();
}

/* ======================= v10: command palette ======================= */
function cmdItems() {
  var q = String(S.cmd.q || '').trim().toLowerCase(), out = [];
  var nav = [['home', 'home', LL('Главная', 'Home')], ['col:planner', 'cal', L(COLS.planner.title)], ['col:mdt', 'mdt', L(COLS.mdt.title)], ['col:mm', 'alert', 'M&M'], ['reg:all', 'users', t('nav.allPatients')], ['fu', 'clock', t('nav.followup')], ['studies', 'flask', t('nav.studies')], ['q', 'clipboard', LL('Анкеты', 'Questionnaires')], ['col:pubs', 'book', L(COLS.pubs.title)], ['col:redcap', 'flask', 'RedCap'], ['col:goals', 'flag', L(COLS.goals.title)]];
  DB.registries.forEach(function (r) { nav.push(['reg:' + r.id, r.kind === 'study' ? 'flask' : 'tag', regName(r)]); });
  var acts = [];
  if (can('edit')) acts = [['newp', 'plus', LL('Новый пациент', 'New patient')], ['newstudy', 'flask', LL('Новое исследование', 'New study')], ['newreg', 'plus', LL('Новый регистр', 'New registry')]];
  acts.push(['aiopen', 'sparkle', LL('Открыть ИИ-ассистента', 'Open AI assistant')]);
  acts.forEach(function (a) { if (!q || a[2].toLowerCase().indexOf(q) >= 0) out.push({ g: LL('Действия', 'Actions'), ic: a[1], t: a[2], act: a[0] }); });
  nav.forEach(function (n) { if (!q || n[2].toLowerCase().indexOf(q) >= 0) out.push({ g: LL('Разделы', 'Sections'), ic: n[1], t: n[2], view: n[0] }); });
  if (q) {
    DB.patients.forEach(function (p) { var s = (p.id + ' ' + (p.d.fio || '') + ' ' + (p.d.ib || '') + ' ' + (p.d.dxText || '')).toLowerCase(); if (s.indexOf(q) >= 0) out.push({ g: LL('Пациенты', 'Patients'), ic: 'user', t: pName(p), s: p.id + (p.d.ib ? ' · ИБ ' + p.d.ib : '') + (p.d.loc ? ' · ' + ov(p.d.loc) : ''), pid: p.id }); });
    ['planner', 'mdt', 'mm'].forEach(function (k) { DB.cols[k].forEach(function (r) { var tt = recTitle(COLS[k], r); if (String(tt).toLowerCase().indexOf(q) >= 0) out.push({ g: L(COLS[k].title), ic: COLS[k].icon, t: tt, s: r[COLS[k].dateField] ? fmtDate(r[COLS[k].dateField]) : '', rk: k, rid: r.id }); }); });
  }
  return out.slice(0, 60);
}
function renderCmd() {
  var items = cmdItems(), i = Math.min(S.cmd.i || 0, Math.max(0, items.length - 1)); S.cmd.i = i;
  var h = '<div class="dim cmd-dim" data-act="cmdclose"></div><section class="cmd" role="dialog" aria-modal="true"><div class="cmd-in">' + ico('search', 18) + '<input id="cmd-in" type="text" data-cmd="1" value="' + esc(S.cmd.q || '') + '" placeholder="' + LL('Пациент, раздел или действие…', 'Patient, section or action…') + '" autocomplete="off" data-autofocus><kbd>Esc</kbd></div><div class="cmd-l">';
  var lastG = '';
  items.forEach(function (x, k) { if (x.g !== lastG) { h += '<div class="cmd-g">' + esc(x.g) + '</div>'; lastG = x.g; } h += '<button type="button" class="cmd-i' + (k === i ? ' on' : '') + '" data-act="cmdgo" data-i="' + k + '">' + ico(x.ic, 16) + '<span><b>' + esc(x.t) + '</b>' + (x.s ? '<em>' + esc(x.s) + '</em>' : '') + '</span></button>'; });
  if (!items.length) h += '<div class="cmd-none">' + LL('Ничего не найдено', 'Nothing found') + '</div>';
  return h + '</div><div class="cmd-f"><span><kbd>↑</kbd><kbd>↓</kbd> ' + LL('выбор', 'select') + '</span><span><kbd>Enter</kbd> ' + LL('открыть', 'open') + '</span></div></section>';
}
function cmdGo(k) {
  var x = cmdItems()[k]; if (!x) return; S.cmd = null;
  if (x.pid) openPatient(x.pid);
  else if (x.rid) openRec(x.rk, x.rid);
  else if (x.view) setView(x.view);
  else if (x.act === 'aiopen') { UI.aip = true; saveUI(); render(); }
  else if (x.act === 'newp') openPatient(null);
  else if (x.act === 'newstudy') openEditor(null, 'study');
  else if (x.act === 'newreg') openEditor(null);
}
/* students see anonymised data only */
function maskForStudent() {
  function m(s, id) { return id ? LL('Пациент ', 'Patient ') + id : LL('Пациент', 'Patient'); }
  DB.patients.forEach(function (p) { p.d.fio = m(p.d.fio, p.id); delete p.d.ib; });
  Object.keys(DB.cols).forEach(function (k) { DB.cols[k].forEach(function (r) { if (r.fio) r.fio = m(r.fio, r.pid); if (k === 'mm' && r.title) r.title = m(r.title, r.pid); if (r.mp) { ['fam', 'nam', 'otc', 'iin', 'dob', 'addr'].forEach(function (x) { delete r.mp[x]; }); } }); });
}

/* ======================= Events ======================= */
document.addEventListener('click', function (ev) {
  var tg = ev.target.closest('[data-act]');
  if (S.menu && !ev.target.closest('.dd')) { S.menu = null; if (!tg) { render(); return; } }
  if (!tg) { if (S.inline && !ev.target.closest('.inline')) { S.inline = null; render(); } return; }
  var a = tg.getAttribute('data-act');
  if (a === 'search' || (tg.tagName === 'INPUT' && a !== 'segset')) return;
  var g = function (x) { return tg.getAttribute('data-' + x); };
  var NEED = { savep: 'edit', saverec: 'edit', delp: 'delete', delrec: 'delete', esave: 'edit', edelete: 'delete', enrgo: 'edit', enroll: 'edit', rand: 'rand', unlockf: 'unlock', impgo: 'edit', imp: 'edit', newp: 'edit', newrec: 'edit', newreg: 'edit', newstudy: 'edit', qbsave: 'edit', qbnew: 'edit', fillsave: 'edit', cmtadd: 'edit', labsdone: 'edit', reset: 'admin', restore: 'admin', tplsave: 'edit', qsched: 'edit', qnow: 'edit', toreg: 'edit', addlinked: 'edit' };
  if (NEED[a] && !can(NEED[a])) { toast(LL('Недостаточно прав для роли «', 'Not allowed for role "') + (SESSION ? roleName(SESSION.role) : '') + LL('»', '"')); return; }
  switch (a) {
    case 'side': if (window.innerWidth < 900) S.sideMob = !S.sideMob; else { UI.side = !UI.side; saveUI(); } render(); break;
    case 'lang': LANG = g('v'); UI.lang = LANG; saveUI(); render(); break;
    case 'menu': S.menu = S.menu === g('id') ? null : g('id'); render(); break;
    case 'view': { S.cmd = null; if (g('v') === 'users') S.users = null; var vv = g('v'), rg = vv.indexOf('reg:') === 0 ? regOf(vv.slice(4)) : null; if (rg) { UI.open = UI.open || {}; ancestors(rg).concat([rg]).forEach(function (a) { if (kids(a.id, a.kind === 'study').length) UI.open[a.id] = true; }); if (rg.kind === 'study') UI.open.studies = true; } setView(vv); break; }
    case 'openp': if (ev.target.closest('button') && ev.target.closest('button') !== tg) return; openPatient(g('id')); break;
    case 'newp': openPatient(null); break;
    case 'close': S.drawer = null; render(); break;
    case 'jump': { var el = root.querySelector('#sec-' + g('id')); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'segset': { var tp = target(g('path')); var cur = getPath(tp[0], tp[1]); bind(g('path'), cur === g('val') ? '' : g('val')); render(); break; }
    case 'multiset': {
      var tm = target(g('path')), mv = g('val'), arr = (getPath(tm[0], tm[1]) || []).slice(), i = arr.indexOf(mv), fx = FIELD[g('path').split('.').pop()];
      if (i >= 0) arr.splice(i, 1);
      else {
        if (fx && fx.groups) fx.groups.forEach(function (gr) { if (gr[2] && gr[1].indexOf(mv) >= 0) arr = arr.filter(function (z) { return gr[1].indexOf(z) < 0; }); });
        if (fx && fx.id === 'drain') arr = mv === 'Не дренировалось' ? [] : arr.filter(function (z) { return z !== 'Не дренировалось'; });
        if (fx && fx.id === 'intraCx') arr = arr.filter(function (z) { return z !== 'Не было'; });
        arr.push(mv);
      }
      bind(g('path'), arr.length ? arr : ''); render(); break;
    }
    case 'selset': S.menu = null; bind(g('path'), g('val')); render(); break;
    case 'copyproto': {
      var ta = root.querySelector('#protoText'); if (!ta) break;
      var txt = ta.value, done = function () { toast(t('pr.copied')); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { ta.select(); document.execCommand('copy'); done(); });
      else { ta.select(); document.execCommand('copy'); done(); }
      break;
    }
    case 'fileAdd': {
      var url = prompt(t('f.linkPrompt')); if (!url) return;
      var nm = prompt(t('f.namePrompt'), '') || url;
      var tf = target(g('path')); var fa = (getPath(tf[0], tf[1]) || []).slice(); fa.push({ name: nm, href: url }); bind(g('path'), fa); render(); break;
    }
    case 'fileUp': {
      var upPath = g('path'), inp = document.createElement('input'); inp.type = 'file'; inp.multiple = true;
      inp.onchange = function () {
        var fs = [].slice.call(inp.files), left = fs.length, added = [];
        fs.forEach(function (fl) { filePut(fl, function (id) { added.push({ name: fl.name, fid: id, size: fl.size, type: fl.type }); if (--left === 0) { var tu = target(upPath); if (!tu) return; bind(upPath, (getPath(tu[0], tu[1]) || []).concat(added)); render(); toast(t('f.uploaded', { n: added.length })); } }); });
      };
      inp.click(); break;
    }
    case 'openfile': {
      var fnm = g('name');
      fileGet(g('id'), function (blob) {
        if (!blob) { toast(t('f.missing')); return; }
        var u = URL.createObjectURL(blob);
        if (/^(image\/|application\/pdf|text\/|video\/)/.test(blob.type)) window.open(u, '_blank');
        else { var a = document.createElement('a'); a.href = u; a.download = fnm; document.body.appendChild(a); a.click(); a.remove(); }
        setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
      });
      break;
    }
    case 'fileDel': { var td2 = target(g('path')); var fd = (getPath(td2[0], td2[1]) || []).slice(); if (fd[+g('i')] && fd[+g('i')].fid) fileDelBlob(fd[+g('i')].fid); fd.splice(+g('i'), 1); bind(g('path'), fd.length ? fd : ''); render(); break; }
    case 'savep': savePatient(); break;
    case 'delp':
      if (confirm(t('confirm.delPatient', { n: pName(S.drawer.p) }))) {
        var pid = S.drawer.p.id; DB.patients = DB.patients.filter(function (x) { return x.id !== pid; });
        LINKED.forEach(function (k) { DB.cols[k].forEach(function (r) { if (r.pid === pid) delete r.pid; }); });
        DB.registries.forEach(function (r) { r.members = r.members.filter(function (m) { return m !== pid; }); });
        S.drawer = null; save(); toast(t('toast.deleted')); render();
      }
      break;
    case 'fudone': { ev.stopPropagation(); var p = DB.patients.filter(function (x) { return x.id === g('id'); })[0]; if (p) { p.fu[g('k')] = true; save(); toast(t('toast.fuDone')); render(); } break; }
    case 'sort': { var sc = g('scope'), sk = g('k'), s = S.sort[sc]; S.sort[sc] = { k: sk, d: s && s.k === sk ? -s.d : 1 }; render(); break; }
    case 'csv': S.menu = null; S.xport = { mode: 'labels', anon: false, book: true, sel: 'view' }; render(); break;
    case 'cview': UI.colView[g('k')] = g('v'); saveUI(); S.inline = null; render(); break;
    case 'newrec': { var k = g('k'), pre = {}; if (COLS[k].statusField) pre[COLS[k].statusField] = COLS[k].F[COLS[k].statusField].options[0]; openRec(k, null, pre); break; }
    case 'openrec': if (tg.classList.contains('dragging')) return; openRec(g('k'), g('id')); break;
    case 'closerec': S.rec = null; render(); break;
    case 'addlinked': {
      var ak = g('k'), ac = COLS[ak], pp = S.drawer.p, pre2 = { pid: pp.id };
      if (ac.statusField) pre2[ac.statusField] = ac.F[ac.statusField].options[0];
      if (ak === 'mm') pre2.title = pp.d.fio || ''; else pre2.fio = pp.d.fio || '';
      if ((ak === 'planner' || ak === 'mdt') && pp.d.dxText) pre2.dx = pp.d.dxText;
      if (ak === 'mdt' && pp.d.stage) pre2.stage = pp.d.stage;
      if (ak === 'redcap' && pp.d.date) { pre2.opDate = pp.d.date; pre2.contact = isoOf(addDays(pp.d.date, 30)); }
      openRec(ak, null, pre2); break;
    }
    case 'unlink': delete S.rec.r.pid; render(); break;
    case 'linkpick': S.linkPick = true; render(); break;
    case 'linksug': S.rec.r.pid = g('id'); render(); break;
    case 'gopat': { var gp = g('id'); if (S.rec) saveRec(); S.rec = null; if (!(S.drawer && S.drawer.p.id === gp)) openPatient(gp); else render(); break; }
    case 'saverec': saveRec(); break;
    case 'delrec':
      if (confirm(t('confirm.delRec'))) { var o = S.rec; DB.cols[o.k] = DB.cols[o.k].filter(function (x) { return x.id !== o.r.id; }); S.rec = null; save(); toast(t('toast.deleted')); render(); }
      break;
    case 'toreg': {
      var o2 = S.rec, r = o2.r, preset = { fio: recName(o2.k, r) || '' };
      if (r.dx) preset.dxText = r.dx; if (r.surgeryDate) preset.date = r.surgeryDate; if (r.opDate) preset.date = r.opDate;
      if (o2.isNew) { r.id = o2.k + '_' + uid(''); DB.cols[o2.k].push(r); } else DB.cols[o2.k] = DB.cols[o2.k].map(function (x) { return x.id === r.id ? r : x; });
      save(); S.rec = null; S.pick = { preset: preset, link: { k: o2.k, id: r.id } }; render(); break;
    }
    case 'pickreg': {
      var pk = S.pick, rid = g('id'), rg2 = rid === 'all' ? null : regOf(rid), pre3 = clone(pk.preset);
      if (rg2) presetFor(rg2, pre3);
      S.pick = null; openPatient(null, pre3); S.drawer.linkRec = pk.link; S.drawer.full = true; S.drawer.target = rid;
      if (rg2) ancestors(rg2).concat([rg2]).forEach(function (a) { if (a.mode === 'manual') S.drawer.members[a.id] = true; });
      render(); break;
    }
    case 'pickclose': S.pick = null; render(); break;
    case 'full': S.drawer.full = !S.drawer.full; render(); break;
    case 'calnav': { var ck = g('k'), cur2 = UI.cal[ck] || isoOf(new Date()).slice(0, 7); var dd = new Date(+cur2.slice(0, 4), +cur2.slice(5, 7) - 1 + (+g('d')), 1); UI.cal[ck] = isoOf(dd).slice(0, 7); saveUI(); S.inline = null; render(); break; }
    case 'caltoday': UI.cal[g('k')] = isoOf(new Date()).slice(0, 7); saveUI(); render(); break;
    case 'inline': S.inline = { k: g('k'), d: g('d') }; render(); break;
    case 'expand': S.expand = S.expand === g('id') ? null : g('id'); render(); break;
    case 'newreg': openEditor(null); break;
    case 'newstudy': openEditor(null, 'study'); break;
    case 'tog': UI.open = UI.open || {}; UI.open[g('id')] = !(g('id') === 'studies' ? UI.open.studies !== false : isOpen(g('id'))); saveUI(); render(); break;
    case 'fltreset': UI.flt = {}; saveUI(); render(); break;
    case 'editreg': openEditor(g('id')); break;
    case 'eclose': S.edit = null; render(); break;
    case 'esave': saveEditor(); break;
    case 'edelete':
      if (confirm(t('confirm.delReg', { n: regName(S.edit) }))) { var rid = S.edit.id; DB.registries.forEach(function (r) { if (r.parent === rid) r.parent = S.edit.parent; }); DB.registries = DB.registries.filter(function (r) { return r.id !== rid; }); DB.patients.forEach(function (p) { delete p.custom[rid]; }); S.edit = null; setView('reg:all'); save(); toast(t('toast.regDeleted')); }
      break;
    case 'radd': S.edit.rules.push({ f: 'loc', vals: [] }); render(); break;
    case 'rdel': S.edit.rules.splice(+g('i'), 1); render(); break;
    case 'rval': { var rr = S.edit.rules[+g('i')]; rr.vals = rr.vals || []; var vi = rr.vals.indexOf(g('val')); if (vi >= 0) rr.vals.splice(vi, 1); else rr.vals.push(g('val')); render(); break; }
    case 'cadd': S.edit.custom.push({ id: uid('c'), label: '', type: 'num', opts: '' }); render(); var ins = root.querySelectorAll('.cfrow input[type=text]'); if (ins.length) ins[ins.length - 1].focus(); break;
    case 'cdel': S.edit.custom.splice(+g('i'), 1); render(); break;
    case 'setme': { S.menu = null; var nm = prompt(LL('Ваше имя и фамилия: будут видны в комментариях и истории изменений', 'Your name: shown in comments and change history'), UI.me || ''); if (nm !== null) { UI.me = nm.trim(); saveUI(); } render(); break; }
    case 'histall': S.histAll = !S.histAll; render(); break;
    case 'cmtadd': addComment(g('scope')); break;
    case 'cmtdel': delComment(g('scope'), +g('i')); break;
    case 'unlockf': if (confirm(LL('Разблокировать поле для исправления? Старое и новое значения будут записаны в историю изменений.', 'Unlock this field? Old and new values will be written to the change history.'))) { S.drawer.unl = S.drawer.unl || {}; S.drawer.unl[g('id')] = true; render(); var ui = root.querySelector('#f_d_' + g('id')); if (ui) ui.focus(); } break;
    case 'xset': S.xport[g('k')] = g('v'); render(); break;
    case 'xdo': doExport(g('f')); break;
    case 'xclose': S.xport = null; render(); break;
    case 'imp': { var fi2 = document.createElement('input'); fi2.type = 'file'; fi2.accept = '.xlsx,.csv'; fi2.onchange = function () { if (fi2.files[0]) startImport(fi2.files[0]); }; fi2.click(); break; }
    case 'impgo': applyImport(); break;
    case 'impclose': S.imp = null; render(); break;
    case 'cxopen': { var y0 = new Date().getFullYear(); S.cx = { k: g('k'), from: '', to: '' }; if (g('k') === 'pubs') { S.cx.from = y0 + '-01-01'; S.cx.to = y0 + '-12-31'; } render(); break; }
    case 'cxper': S.cx.from = g('f'); S.cx.to = g('t'); render(); break;
    case 'cxgo': doColExport(); break;
    case 'cxclose': S.cx = null; render(); break;
    case 'orcid': importOrcid(); break;
    case 'pubdoi': fillFromCrossref(S.rec.r, function (ok) { toast(ok ? LL('Данные получены из Crossref', 'Filled from Crossref') : LL('Crossref не ответил: проверьте DOI и интернет', 'Crossref did not respond: check the DOI and internet')); render(); }); break;
    case 'pubpmid': fillFromPubmed(S.rec.r, function (ok) { toast(ok ? LL('Данные получены из PubMed', 'Filled from PubMed') : LL('PubMed не ответил: проверьте PMID и интернет', 'PubMed did not respond: check the PMID and internet')); render(); }); break;
    case 'qsched': S.qs = { pid: g('pid'), tid: 'lars', anchor: findPat(g('pid')) && findPat(g('pid')).d.closure ? 'closure' : findPat(g('pid')) && findPat(g('pid')).d.date ? 'date' : 'today', offs: [90, 180, 365] }; render(); break;
    case 'qnow': S.qs = { pid: g('pid'), tid: 'lars', now: true, offs: [] }; render(); break;
    case 'qsset': S.qs[g('k')] = g('v'); render(); break;
    case 'qsoff': { var ov2 = +g('v'), oi = S.qs.offs.indexOf(ov2); if (oi >= 0) S.qs.offs.splice(oi, 1); else S.qs.offs.push(ov2); S.qs.offs.sort(function (a, b) { return a - b; }); render(); break; }
    case 'qsgo': qSchedGo(); break;
    case 'qsclose': S.qs = null; render(); break;
    case 'qfill': openFill(g('pid'), g('id')); break;
    case 'qview': S.qview = S.qview === g('id') ? null : g('id'); render(); break;
    case 'qdel': if (confirm(LL('Удалить анкету из карточки?', 'Remove this questionnaire?'))) { var qid = g('id'); withPat(g('pid'), function (x) { x.q = (x.q || []).filter(function (e) { return e.id !== qid; }); }); save(); render(); } break;
    case 'fans': { var fq = qTpl(((findPat(S.fill.pid).q || []).filter(function (x) { return x.id === S.fill.eid; })[0] || {}).tid), it = fq.items.filter(function (z) { return z.id === g('q'); })[0], ii = +g('i'); if (it.type === 'multi') { var cur3 = (S.fill.ans[it.id] || []).slice(), k3 = cur3.indexOf(ii); if (k3 >= 0) cur3.splice(k3, 1); else cur3.push(ii); S.fill.ans[it.id] = cur3; render(); } else { S.fill.ans[it.id] = ii; render(); setTimeout(function () { if (S.fill && !S.fill.done) { var vis = qVisible(fq, S.fill.ans); if (S.fill.i < vis.length - 1) { S.fill.i++; render(); } } }, 280); } break; }
    case 'fillnext': { var fq2 = qTpl(((findPat(S.fill.pid).q || []).filter(function (x) { return x.id === S.fill.eid; })[0] || {}).tid), vis2 = qVisible(fq2, S.fill.ans); if (S.fill.i >= vis2.length - 1) S.fill.done = true; else S.fill.i++; render(); break; }
    case 'fillprev': S.fill.i = Math.max(0, S.fill.i - 1); render(); break;
    case 'fillback': S.fill.done = false; render(); break;
    case 'fillsave': fillSave(); break;
    case 'fillclose': if (S.fill.done || confirm(LL('Выйти без сохранения ответов?', 'Leave without saving answers?'))) { S.fill = null; render(); } break;
    case 'qtab': UI.qtab = g('v'); saveUI(); render(); break;
    case 'qbnew': S.qb = newQB(); render(); break;
    case 'qbedit': S.qb = newQB(qTpl(g('id'))); render(); break;
    case 'qbcopy': { var src = clone(qTpl(g('id'))); src.id = uid('qt'); delete src.builtin; delete src.short; src.name = [L(src.name) + LL(' (копия)', ' (copy)'), L(src.name) + ' (copy)']; S.qb = newQB(src); S.qb.isNew = true; render(); break; }
    case 'qbscore': S.qb.score = g('v') === '1'; render(); break;
    case 'qbadd': S.qb.items.push({ id: uid('i'), type: 'single', textS: '', optsText: LL('Нет = 0\nДа = 1', 'No = 0\nYes = 1'), cond: { q: '', a: '' } }); render(); break;
    case 'qbdel': S.qb.items.splice(+g('i'), 1); render(); break;
    case 'qbmove': { var qi2 = +g('i'), qj = qi2 + (+g('d')), arr2 = S.qb.items; if (qj >= 0 && qj < arr2.length) { var tmp2 = arr2[qi2]; arr2[qi2] = arr2[qj]; arr2[qj] = tmp2; } render(); break; }
    case 'qbsave': qbSave(); break;
    case 'qbremove': if (confirm(LL('Удалить анкету? Заполненные ответы в карточках останутся.', 'Delete this questionnaire? Completed answers stay in records.'))) { var qbid = S.qb.id; DB.qtpl = (DB.qtpl || []).filter(function (x) { return x.id !== qbid; }); S.qb = null; save(); render(); } break;
    case 'qbclose': S.qb = null; render(); break;
    case 'estep': S.edit._step = +g('v'); render(); var eb = root.querySelector('.sted .dbody'); if (eb) eb.scrollTop = 0; break;
    case 'eset': { var cv0 = getPath(S.edit, g('path')); setPath(S.edit, g('path'), cv0 === g('val') && !/\.done$/.test(g('path')) ? '' : g('val')); render(); break; }
    case 'estrat': { var sr = S.edit.proto.rand.strat = S.edit.proto.rand.strat || [], si = sr.indexOf(g('f')); if (si >= 0) sr.splice(si, 1); else sr.push(g('f')); render(); break; }
    case 'elistadd': { var la = getPath(S.edit, g('list')); if (!la) { setPath(S.edit, g('list'), []); la = getPath(S.edit, g('list')); } la.push(JSON.parse(g('tpl'))); render(); break; }
    case 'elistdel': getPath(S.edit, g('list')).splice(+g('i'), 1); render(); break;
    case 'edshowdiss': S.edShowDiss = true; render(); break;
    case 'cflag': { var cf = S.edit.custom[+g('i')]; cf[g('k')] = !cf[g('k')]; render(); break; }
    case 'tpluse': applyTemplate(g('id')); break;
    case 'tpldel': if (confirm(LL('Удалить шаблон?', 'Delete template?'))) { var tid = g('id'); DB.templates = (DB.templates || []).filter(function (x) { return x.id !== tid; }); save(); render(); } break;
    case 'tplsave': saveTemplate(); break;
    case 'enroll': openEnroll(g('id'), g('pid')); break;
    case 'enrgo': doEnroll(); break;
    case 'enrclose': S.enr = null; render(); break;
    case 'unenroll': ev.stopPropagation(); unenroll(g('sid'), g('pid')); break;
    case 'rand': ev.stopPropagation(); if (confirm(LL('Рандомизировать пациента? Результат нельзя будет изменить.', 'Randomise this patient? The result cannot be changed.'))) randomize(g('sid'), g('pid')); break;
    case 'rsclose': S.randShow = null; render(); break;
    case 'stab': UI.stab = g('v'); saveUI(); render(); break;
    case 'sflt': UI.sflt = g('v'); saveUI(); render(); break;
    case 'nseen': { UI.seen = UI.seen || {}; notifs().forEach(function (n) { UI.seen[n.id] = 1; }); saveUI(); render(); break; }
    case 'ngo': goNotif(g('i')); break;
    case 'qiper': UI.qiPer = g('v'); saveUI(); render(); break;
    case 'wgo': { var wa = JSON.parse(g('a')); if (wa[0] === 'r') openRec(wa[1], wa[2]); else if (wa[0] === 's') setView('reg:' + wa[1]); break; }
    case 'labsdone': markLabs(g('id')); break;
    case 'wkf': UI.wkOff = UI.wkOff || {}; UI.wkOff[g('v')] = !UI.wkOff[g('v')]; saveUI(); render(); break;
    case 'aitoggle': UI.aip = !UI.aip; saveUI(); S.sideMob = false; render(); break;
    case 'aiopen': UI.aip = true; saveUI(); render(); break;
    case 'airegreet': { var rk = aiCtx().key; AI.threads[rk] = { msgs: [], greeted: false }; render(); break; }
    case 'aicopy': { var am = aiThread(aiCtx().key).msgs[+g('i')]; if (am) { navigator.clipboard && navigator.clipboard.writeText(am.text); toast(LL('Скопировано', 'Copied')); } break; }
    case 'aichip': { var cx0 = aiCtx(), ch0 = (cx0.chips || [])[+g('i')]; if (ch0 && !AI.busy) aiRun(cx0, null, ch0[0], ch0[1]); break; }
    case 'aisend': aiSendInput(); break;
    case 'aistop': if (AI.ctrl) AI.ctrl.abort(); break;
    case 'aikeysave': { var ki = root.querySelector('#aikey-in'), mo = root.querySelector('#aimodel'), de = root.querySelector('#aideid'); AI.model = mo ? mo.value : AI.model; AI.deid = de ? de.checked : AI.deid; try { localStorage.setItem('crr.aimodel', AI.model); localStorage.setItem('crr.aideid', AI.deid ? '1' : '0'); } catch (e) {} AI.threads = {}; aiSetKey(ki ? ki.value : ''); break; }
    case 'aikeyclear': AI.threads = {}; aiSetKey(''); break;
    case 'cmd': S.menu = null; S.cmd = { q: '', i: 0 }; render(); break;
    case 'cmdgo': cmdGo(+g('i')); break;
    case 'cmdclose': S.cmd = null; render(); break;
    case 'mpshow': S.mpShow = true; render(); break;
    case 'mptog': S.mpClosed = S.mpClosed || {}; S.mpClosed[g('id')] = !S.mpClosed[g('id')]; render(); break;
    case 'mpfill': mpFill(); break;
    case 'mpcopy': { var mt = mdtProtoText(S.rec.r, false); if (navigator.clipboard) navigator.clipboard.writeText(mt).then(function () { toast(LL('Протокол МДГ скопирован', 'MDT protocol copied')); }); break; }
    case 'mpai': { UI.aip = true; saveUI(); if (!aiReady()) { render(); break; } var cx1 = aiCtx(); aiRun(cx1, null, LL('Разбор протокола МДГ', 'MDT protocol review'), 'Проанализируй протокол МДГ целиком. Структура ответа:\n1) Резюме случая (3-4 строки).\n2) Недостающие обследования и данные для принятия решения (по стандарту стадирования колоректального рака: колоноскопия с биопсией, МРТ малого таза для рака прямой кишки с CRM/EMVI, КТ ОГК и ОБП, РЭА, MMR/MSI, RAS/BRAF при метастазах и т.д.) с пометкой, почему важно.\n3) Доступные варианты дальнейшего лечения по NCCN/ESMO/протоколам МЗ РК с уровнем доказательности и ссылками.\n4) Подходящие клинические исследования сектора или международные.\n5) Вопросы для обсуждения на МДГ.\n6) Черновик формулировки заключения МДГ (помеченный как черновик).'); break; }
    case 'aiproto': aiProtocol(); break;
    case 'logout': doLogout(); if (!SESSION) location.reload(); break;
    case 'amode': S.auth = S.auth || {}; S.auth.mode = g('v'); S.auth.err = ''; render(); break;
    case 'arole': S.auth.role = g('v'); render(); break;
    case 'alogin': doLogin(); break;
    case 'aregister': doRegister(); break;
    case 'cloudsetup': S.menu = null; S.cs = { cfg: CLOUD.cfg ? JSON.stringify(CLOUD.cfg, null, 2) : '', admins: (CLOUD.cfg && CLOUD.cfg.admins || ['achrorrachmankulov@gmail.com']).join(', ') }; render(); break;
    case 'csclose': S.cs = null; render(); break;
    case 'cssave': { var cf = parseCfg(S.cs.cfg); if (!cf || !cf.apiKey || !cf.projectId) { S.cs.err = LL('Не удалось прочитать firebaseConfig: нужны apiKey и projectId', 'Could not parse firebaseConfig: apiKey and projectId required'); render(); break; } cf.admins = String(S.cs.admins || '').split(/[\s,;]+/).filter(Boolean).map(function (x) { return x.toLowerCase(); }); try { localStorage.setItem('crr.fbconfig', JSON.stringify(cf)); } catch (e) {} setSession(null); location.reload(); break; }
    case 'csoff': if (confirm(LL('Выключить облачный режим и вернуться к локальным данным?', 'Disable cloud mode and return to local data?'))) { try { localStorage.removeItem('crr.fbconfig'); } catch (e) {} if (CLOUD.fb) CLOUD.fb.auth().signOut(); location.reload(); } break;
    case 'copyrules': { var fr = root.querySelector('#fbrules'); if (fr && navigator.clipboard) navigator.clipboard.writeText(fr.value).then(function () { toast(LL('Правила скопированы', 'Rules copied')); }); break; }
    case 'uok': setUser(g('id'), { status: 'active' }); break;
    case 'uno': if (confirm(LL('Отключить доступ пользователю?', 'Disable this user?'))) setUser(g('id'), { status: 'rejected' }); break;
    case 'demoload': if (confirm(LL('Заменить облачные данные тестовым набором?', 'Replace cloud data with the test set?'))) { DB = migrate(demoDB()); save(); render(); } break;
    case 'backup': S.menu = null; download(t('file.backup') + ' ' + isoOf(new Date()) + '.json', JSON.stringify(DB), 'application/json'); render(); break;
    case 'restore': S.menu = null; document.getElementById('importFile').click(); render(); break;
    case 'reset': S.menu = null; if (confirm(t('confirm.reset'))) { DB = freshDB(); save(); setView('home'); toast(t('toast.reset')); } else render(); break;
  }
});
document.addEventListener('input', function (ev) {
  var tg = ev.target;
  if (tg.getAttribute && tg.getAttribute('data-proto') && S.drawer) { S.drawer.protoEdit = { base: buildProtocol(S.drawer.p), text: tg.value }; }
  var ib = tg.getAttribute && tg.getAttribute('data-bind');
  if (ib && tg.type !== 'checkbox' && tg.tagName !== 'SELECT') { bind(ib, tg.value); refreshProto(); }
});
document.addEventListener('keydown', function (ev) {
  if (ev.target.getAttribute && ev.target.getAttribute('data-inline')) {
    if (ev.key === 'Enter') { ev.preventDefault(); var v = ev.target.value.trim(); if (v) quickAdd(S.inline.k, S.inline.d, v); S.inline = null; render(); }
    if (ev.key === 'Escape') { S.inline = null; render(); }
    return;
  }
  if (ev.key === 'Escape') { if (S.pick) S.pick = null; else if (S.menu) S.menu = null; else if (S.edit) S.edit = null; else if (S.rec) S.rec = null; else if (S.drawer) S.drawer = null; else if (S.inline) S.inline = null; render(); return; }
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('tr[data-act]')) { ev.preventDefault(); ev.target.click(); }
});
document.addEventListener('input', function (ev) {
  var tg = ev.target;
  if (tg.getAttribute('data-act') === 'search') { S.q = tg.value; render(); var s = root.querySelector('.search'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } return; }
  var b = tg.getAttribute('data-bind');
  if (b && tg.type !== 'checkbox' && tg.tagName !== 'SELECT') { bind(b, tg.value); return; }
  var e = tg.getAttribute('data-ebind');
  if (e && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA') && tg.type !== 'radio') { if (e === 'name') { S.edit.name = tg.value; delete S.edit.nameKey; } else setPath(S.edit, e, tg.value); }
});
document.addEventListener('change', function (ev) {
  var tg = ev.target, b = tg.getAttribute('data-bind');
  if (tg.getAttribute('data-act') === 'flt') { UI.flt = UI.flt || {}; if (tg.value) UI.flt[tg.getAttribute('data-id')] = tg.value; else delete UI.flt[tg.getAttribute('data-id')]; saveUI(); render(); return; }
  if (b) { bind(b, tg.type === 'checkbox' ? tg.checked : tg.value); if (tg.tagName === 'SELECT' || tg.type === 'checkbox' || tg.type === 'date') render(); return; }
  var e = tg.getAttribute('data-ebind');
  if (e) {
    if (tg.type === 'radio') { S.edit.mode = tg.value; render(); return; }
    var m = /^rules\.(\d+)\.f$/.exec(e); if (m) { S.edit.rules[+m[1]] = { f: tg.value, vals: [] }; render(); return; }
    if (e === 'name') return;
    if (e === 'parent') { if (tg.value) S.edit.parent = tg.value; else delete S.edit.parent; render(); return; }
    setPath(S.edit, e, tg.value); if (tg.tagName === 'SELECT' || /\.(min|max)$/.test(e)) render();
  }
});
/* drag & drop: calendar days and board columns */
var dragId = null;
document.addEventListener('dragstart', function (ev) { var el = ev.target.closest && ev.target.closest('[data-drag]'); if (!el) return; dragId = el.getAttribute('data-drag'); el.classList.add('dragging'); ev.dataTransfer.effectAllowed = 'move'; try { ev.dataTransfer.setData('text/plain', dragId); } catch (e) {} });
document.addEventListener('dragend', function () { dragId = null; root.querySelectorAll('.over').forEach(function (x) { x.classList.remove('over'); }); });
document.addEventListener('dragover', function (ev) { var z = ev.target.closest && ev.target.closest('[data-drop]'); if (z && dragId) { ev.preventDefault(); root.querySelectorAll('.over').forEach(function (x) { if (x !== z) x.classList.remove('over'); }); z.classList.add('over'); } });
document.addEventListener('drop', function (ev) {
  var z = ev.target.closest && ev.target.closest('[data-drop]'); if (!z || !dragId) return; ev.preventDefault();
  var k = z.getAttribute('data-k'), c = COLS[k], v = z.getAttribute('data-v');
  var r = DB.cols[k].filter(function (x) { return x.id === dragId; })[0]; if (!r) return;
  if (z.getAttribute('data-drop') === 'date') { if (v) { r[c.dateField] = v; toast(t('toast.moved', { d: fmtDate(v) })); } else { delete r[c.dateField]; toast(t('toast.undated')); } }
  else { if (v) r[c.statusField] = v; else delete r[c.statusField]; toast(t('toast.status', { s: v ? ov(v) : t('board.none') })); }
  dragId = null; save(); render();
});
document.getElementById('importFile').addEventListener('change', function (ev) {
  var fl = ev.target.files[0]; if (!fl) return; var rd = new FileReader();
  rd.onload = function () {
    try { var txt = String(rd.result), x; if (/^\s*window\.NOTION_IMPORT\s*=/.test(txt)) { x = dbFromImport(JSON.parse(txt.replace(/^\s*window\.NOTION_IMPORT\s*=\s*/, '').replace(/;\s*$/, ''))); } else x = JSON.parse(txt); if (!x || x.v !== 3) throw 0; CLOUD.empty = false; if (!confirm(t('confirm.restore', { n: plural(x.patients.length, 'pl.patient') }))) return; DB = migrate(x); save(); setView('home'); toast(t('toast.restored')); }
    catch (e) { toast(t('toast.badBackup')); }
    ev.target.value = '';
  };
  rd.readAsText(fl);
});
var lastW = window.innerWidth; window.addEventListener('resize', function () { var w = window.innerWidth; if ((w < 900) !== (lastW < 900)) { lastW = w; S.sideMob = false; render(); } lastW = w; });
if (window.innerWidth < 900 && UI.side === true && !localStorage.getItem(UIKEY)) UI.side = false;
/* v9 listeners: generic state binding (data-sb), global search, validation refresh */
function sbSet(tg) {
  var p = tg.getAttribute('data-sb'), v = tg.type === 'checkbox' ? tg.checked : tg.value;
  setPath(S, p, v === '' ? '' : v);
  if (tg.type === 'checkbox' && !tg.checked) { var k = p.split('.'), last = k.pop(), o = getPath(S, k.join('.')); if (o) o[last] = false; }
}
document.addEventListener('input', function (ev) {
  var tg = ev.target; if (!tg.getAttribute) return;
  if (tg.getAttribute('data-sb') && tg.type !== 'checkbox' && tg.tagName !== 'SELECT') sbSet(tg);
});
document.addEventListener('change', function (ev) {
  var tg = ev.target; if (!tg.getAttribute) return;
  if (tg.getAttribute('data-sb')) { if (!document.contains(tg)) return; sbSet(tg); if (tg.type === 'checkbox' || tg.tagName === 'SELECT' || tg.type === 'date' || tg.getAttribute('data-rr')) render(); return; }
  if (tg.getAttribute('data-check')) render();
});
document.addEventListener('keydown', function (ev) {
  var tg = ev.target;
  if (tg.getAttribute && tg.getAttribute('data-gs') && ev.key === 'Enter') { ev.preventDefault(); var q = tg.value.trim(); var hit = q && DB.patients.filter(function (p) { return p.id.toLowerCase() === q.toLowerCase() || String(p.d.ib || '') === q; }); if (hit && hit.length === 1) { openPatient(hit[0].id); return; } S.view = 'reg:all'; UI.view = S.view; saveUI(); S.q = q; render(); var s = root.querySelector('.search'); if (s) s.focus(); return; }
  if (ev.key === 'Escape') {
    if (S.fill) { ev.stopImmediatePropagation(); if (S.fill.done || confirm(LL('Выйти без сохранения ответов?', 'Leave without saving answers?'))) { S.fill = null; render(); } return; }
    var ks = ['randShow', 'enr', 'qb', 'qs', 'cx', 'imp', 'xport'];
    for (var i = 0; i < ks.length; i++) if (S[ks[i]]) { ev.stopImmediatePropagation(); S[ks[i]] = null; render(); return; }
    if (S.menu) { ev.stopImmediatePropagation(); S.menu = null; render(); return; }
  }
}, true);

/* v10 listeners: auth enter, AI composer, command palette, role select */
document.addEventListener('keydown', function (ev) {
  var tg = ev.target;
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K' || ev.key === 'л' || ev.key === 'Л') && SESSION) { ev.preventDefault(); S.menu = null; S.cmd = S.cmd ? null : { q: '', i: 0 }; render(); return; }
  if (S.cmd && tg.getAttribute && tg.getAttribute('data-cmd')) {
    var n = cmdItems().length;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); S.cmd.i = Math.min(n - 1, (S.cmd.i || 0) + 1); render(); var on = root.querySelector('.cmd-i.on'); if (on) on.scrollIntoView({ block: 'nearest' }); return; }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); S.cmd.i = Math.max(0, (S.cmd.i || 0) - 1); render(); var on2 = root.querySelector('.cmd-i.on'); if (on2) on2.scrollIntoView({ block: 'nearest' }); return; }
    if (ev.key === 'Enter') { ev.preventDefault(); cmdGo(S.cmd.i || 0); return; }
  }
  if (ev.key === 'Escape' && (S.cmd || S.cs)) { ev.stopImmediatePropagation(); S.cmd = null; S.cs = null; render(); return; }
  if (ev.key === 'Enter' && tg.getAttribute && tg.getAttribute('data-enter')) {
    ev.preventDefault(); var w = tg.getAttribute('data-enter');
    if (w === 'login') doLogin(); else if (w === 'reg') doRegister(); else if (w === 'aikey') { var b = root.querySelector('[data-act=aikeysave]'); if (b) b.click(); }
    return;
  }
  if (tg.id === 'ai-in' && ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); aiSendInput(); }
}, true);
document.addEventListener('input', function (ev) {
  var tg = ev.target; if (!tg.getAttribute) return;
  if (tg.getAttribute('data-cmd')) { S.cmd.q = tg.value; S.cmd.i = 0; render(); }
});
document.addEventListener('change', function (ev) {
  var tg = ev.target; if (!tg.getAttribute) return;
  var ur = tg.getAttribute('data-urole'); if (ur) setUser(ur, { role: tg.value });
});

window.__CRR = { SECTIONS: SECTIONS, MODULES: MODULES, MEDIA: MEDIA, COLS: COLS, DICT: DICT, OPT: OPT };
if (SESSION && isStudent()) maskForStudent();
cloudInit();
if (AI.key) aiCheck();
render();
})();
