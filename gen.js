const { argbFromHex, themeFromSourceColor, hexFromArgb } = require('@material/material-color-utilities');
const t = themeFromSourceColor(argbFromHex('#6750A4'));
const n = t.palettes.neutral, nv = t.palettes.neutralVariant, p = t.palettes.primary, s = t.palettes.secondary, ter = t.palettes.tertiary, err = t.palettes.error;
const gen = (dark) => {
  let v = '';
  const set = (k, val) => v += `  --md-sys-color-${k}: ${hexFromArgb(val)};\n`;
  if(dark) {
    set('primary', p.tone(80)); set('on-primary', p.tone(20)); set('primary-container', p.tone(30)); set('on-primary-container', p.tone(90));
    set('secondary', s.tone(80)); set('on-secondary', s.tone(20)); set('secondary-container', s.tone(30)); set('on-secondary-container', s.tone(90));
    set('tertiary', ter.tone(80)); set('on-tertiary', ter.tone(20)); set('tertiary-container', ter.tone(30)); set('on-tertiary-container', ter.tone(90));
    set('error', err.tone(80)); set('on-error', err.tone(20)); set('error-container', err.tone(30)); set('on-error-container', err.tone(90));
    set('background', n.tone(6)); set('on-background', n.tone(90)); set('surface', n.tone(6)); set('on-surface', n.tone(90));
    set('surface-variant', nv.tone(30)); set('on-surface-variant', nv.tone(80));
    set('surface-container-lowest', n.tone(4)); set('surface-container-low', n.tone(10)); set('surface-container', n.tone(12)); set('surface-container-high', n.tone(17)); set('surface-container-highest', n.tone(22));
    set('outline', nv.tone(60)); set('outline-variant', nv.tone(30));
    set('inverse-surface', n.tone(90)); set('inverse-on-surface', n.tone(20)); set('inverse-primary', p.tone(40));
    set('shadow', n.tone(0)); set('scrim', n.tone(0)); set('surface-tint', p.tone(80));
  } else {
    set('primary', p.tone(40)); set('on-primary', p.tone(100)); set('primary-container', p.tone(90)); set('on-primary-container', p.tone(10));
    set('secondary', s.tone(40)); set('on-secondary', s.tone(100)); set('secondary-container', s.tone(90)); set('on-secondary-container', s.tone(10));
    set('tertiary', ter.tone(40)); set('on-tertiary', ter.tone(100)); set('tertiary-container', ter.tone(90)); set('on-tertiary-container', ter.tone(10));
    set('error', err.tone(40)); set('on-error', err.tone(100)); set('error-container', err.tone(90)); set('on-error-container', err.tone(10));
    set('background', n.tone(98)); set('on-background', n.tone(10)); set('surface', n.tone(98)); set('on-surface', n.tone(10));
    set('surface-variant', nv.tone(90)); set('on-surface-variant', nv.tone(30));
    set('surface-container-lowest', n.tone(100)); set('surface-container-low', n.tone(96)); set('surface-container', n.tone(94)); set('surface-container-high', n.tone(92)); set('surface-container-highest', n.tone(90));
    set('outline', nv.tone(50)); set('outline-variant', nv.tone(80));
    set('inverse-surface', n.tone(20)); set('inverse-on-surface', n.tone(95)); set('inverse-primary', p.tone(80));
    set('shadow', n.tone(0)); set('scrim', n.tone(0)); set('surface-tint', p.tone(40));
  }
  return v;
};
console.log(':root {\n' + gen(false) + '  --md-elevation-1: 0px 1px 2px 0px rgba(0,0,0,0.15), 0px 1px 3px 1px rgba(0,0,0,0.1);\n}');
console.log('@media (prefers-color-scheme: dark) {\n  :root:not(.light-theme) {\n' + gen(true).split('\n').filter(l=>l).map(l=>'  '+l).join('\n') + '\n  }\n}');
console.log(':root.dark-theme {\n' + gen(true) + '}');
