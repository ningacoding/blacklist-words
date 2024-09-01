// https://raw.githubusercontent.com/thisandagain/washyourmouthoutwithsoap/develop/data/build.json
import All from "./all.json";

export default {
  all: Object.keys(All)
    .map((key) => All[key])
    .flat(),
  be: All.be,
  bg: All.bg,
  ca: All.ca,
  cs: All.cs,
  cy: All.cy,
  da: All.da,
  de: All.de,
  el: All.el,
  en: All.en,
  es: All.es,
  et: All.et,
  eu: All.eu,
  fa: All.fa,
  fi: All.fi,
  fr: All.fr,
  gd: All.gd,
  gl: All.gl,
  hi: All.hi,
  hr: All.hr,
  hu: All.hu,
  hy: All.hy,
  id: All.id,
  is: All.is,
  it: All.it,
  ja: All.ja,
  kn: All.kn,
  ko: All.ko,
  la: All.la,
  lt: All.lt,
  lv: All.lv,
  mk: All.mk,
  ml: All.ml,
  mn: All.mn,
  mr: All.mr,
  ms: All.ms,
  mt: All.mt,
  my: All.my,
  nl: All.nl,
  pl: All.pl,
  pt: All.pt,
  ro: All.ro,
  ru: All.ru,
  sk: All.sk,
  sl: All.sl,
  sq: All.sq,
  sr: All.sr,
  sv: All.sv,
  te: All.te,
  th: All.th,
  tr: All.tr,
  uk: All.uk,
  uz: All.uz,
  vi: All.vi,
  zu: All.zu,
};
