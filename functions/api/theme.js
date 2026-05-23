import { argbFromHex, themeFromSourceColor, hexFromArgb } from "@material/material-color-utilities";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  let hexColor = url.searchParams.get('color') || '6750A4';
  const isDark = url.searchParams.get('dark') === 'true';

  if (!hexColor.startsWith('#')) {
    hexColor = '#' + hexColor;
  }

  const argb = argbFromHex(hexColor);
  const theme = themeFromSourceColor(argb);
  const n = theme.palettes.neutral;
  const nv = theme.palettes.neutralVariant;
  const p = theme.palettes.primary;
  const s = theme.palettes.secondary;
  const t = theme.palettes.tertiary;
  const err = theme.palettes.error;

  const vars = {};
  if (isDark) {
    vars['--md-sys-color-primary'] = hexFromArgb(p.tone(80));
    vars['--md-sys-color-on-primary'] = hexFromArgb(p.tone(20));
    vars['--md-sys-color-primary-container'] = hexFromArgb(p.tone(30));
    vars['--md-sys-color-on-primary-container'] = hexFromArgb(p.tone(90));
    
    vars['--md-sys-color-secondary'] = hexFromArgb(s.tone(80));
    vars['--md-sys-color-on-secondary'] = hexFromArgb(s.tone(20));
    vars['--md-sys-color-secondary-container'] = hexFromArgb(s.tone(30));
    vars['--md-sys-color-on-secondary-container'] = hexFromArgb(s.tone(90));
    
    vars['--md-sys-color-tertiary'] = hexFromArgb(t.tone(80));
    vars['--md-sys-color-on-tertiary'] = hexFromArgb(t.tone(20));
    vars['--md-sys-color-tertiary-container'] = hexFromArgb(t.tone(30));
    vars['--md-sys-color-on-tertiary-container'] = hexFromArgb(t.tone(90));

    vars['--md-sys-color-error'] = hexFromArgb(err.tone(80));
    vars['--md-sys-color-on-error'] = hexFromArgb(err.tone(20));
    vars['--md-sys-color-error-container'] = hexFromArgb(err.tone(30));
    vars['--md-sys-color-on-error-container'] = hexFromArgb(err.tone(90));

    vars['--md-sys-color-background'] = hexFromArgb(n.tone(6));
    vars['--md-sys-color-on-background'] = hexFromArgb(n.tone(90));
    
    vars['--md-sys-color-surface'] = hexFromArgb(n.tone(6));
    vars['--md-sys-color-on-surface'] = hexFromArgb(n.tone(90));
    vars['--md-sys-color-surface-variant'] = hexFromArgb(nv.tone(30));
    vars['--md-sys-color-on-surface-variant'] = hexFromArgb(nv.tone(80));
    
    vars['--md-sys-color-surface-container-lowest'] = hexFromArgb(n.tone(4));
    vars['--md-sys-color-surface-container-low'] = hexFromArgb(n.tone(10));
    vars['--md-sys-color-surface-container'] = hexFromArgb(n.tone(12));
    vars['--md-sys-color-surface-container-high'] = hexFromArgb(n.tone(17));
    vars['--md-sys-color-surface-container-highest'] = hexFromArgb(n.tone(22));
    
    vars['--md-sys-color-outline'] = hexFromArgb(nv.tone(60));
    vars['--md-sys-color-outline-variant'] = hexFromArgb(nv.tone(30));
    
    vars['--md-sys-color-inverse-surface'] = hexFromArgb(n.tone(90));
    vars['--md-sys-color-inverse-on-surface'] = hexFromArgb(n.tone(20));
    vars['--md-sys-color-inverse-primary'] = hexFromArgb(p.tone(40));
    vars['--md-sys-color-shadow'] = hexFromArgb(n.tone(0));
    vars['--md-sys-color-scrim'] = hexFromArgb(n.tone(0));
    vars['--md-sys-color-surface-tint'] = vars['--md-sys-color-primary'];
  } else {
    vars['--md-sys-color-primary'] = hexFromArgb(p.tone(40));
    vars['--md-sys-color-on-primary'] = hexFromArgb(p.tone(100));
    vars['--md-sys-color-primary-container'] = hexFromArgb(p.tone(90));
    vars['--md-sys-color-on-primary-container'] = hexFromArgb(p.tone(10));
    
    vars['--md-sys-color-secondary'] = hexFromArgb(s.tone(40));
    vars['--md-sys-color-on-secondary'] = hexFromArgb(s.tone(100));
    vars['--md-sys-color-secondary-container'] = hexFromArgb(s.tone(90));
    vars['--md-sys-color-on-secondary-container'] = hexFromArgb(s.tone(10));
    
    vars['--md-sys-color-tertiary'] = hexFromArgb(t.tone(40));
    vars['--md-sys-color-on-tertiary'] = hexFromArgb(t.tone(100));
    vars['--md-sys-color-tertiary-container'] = hexFromArgb(t.tone(90));
    vars['--md-sys-color-on-tertiary-container'] = hexFromArgb(t.tone(10));

    vars['--md-sys-color-error'] = hexFromArgb(err.tone(40));
    vars['--md-sys-color-on-error'] = hexFromArgb(err.tone(100));
    vars['--md-sys-color-error-container'] = hexFromArgb(err.tone(90));
    vars['--md-sys-color-on-error-container'] = hexFromArgb(err.tone(10));

    vars['--md-sys-color-background'] = hexFromArgb(n.tone(98));
    vars['--md-sys-color-on-background'] = hexFromArgb(n.tone(10));
    
    vars['--md-sys-color-surface'] = hexFromArgb(n.tone(98));
    vars['--md-sys-color-on-surface'] = hexFromArgb(n.tone(10));
    vars['--md-sys-color-surface-variant'] = hexFromArgb(nv.tone(90));
    vars['--md-sys-color-on-surface-variant'] = hexFromArgb(nv.tone(30));
    
    vars['--md-sys-color-surface-container-lowest'] = hexFromArgb(n.tone(100));
    vars['--md-sys-color-surface-container-low'] = hexFromArgb(n.tone(96));
    vars['--md-sys-color-surface-container'] = hexFromArgb(n.tone(94));
    vars['--md-sys-color-surface-container-high'] = hexFromArgb(n.tone(92));
    vars['--md-sys-color-surface-container-highest'] = hexFromArgb(n.tone(90));
    
    vars['--md-sys-color-outline'] = hexFromArgb(nv.tone(50));
    vars['--md-sys-color-outline-variant'] = hexFromArgb(nv.tone(80));
    
    vars['--md-sys-color-inverse-surface'] = hexFromArgb(n.tone(20));
    vars['--md-sys-color-inverse-on-surface'] = hexFromArgb(n.tone(95));
    vars['--md-sys-color-inverse-primary'] = hexFromArgb(p.tone(80));
    vars['--md-sys-color-shadow'] = hexFromArgb(n.tone(0));
    vars['--md-sys-color-scrim'] = hexFromArgb(n.tone(0));
    vars['--md-sys-color-surface-tint'] = vars['--md-sys-color-primary'];
  }

  let cssText = '';
  for (const [key, val] of Object.entries(vars)) {
      cssText += `${key}: ${val}; `;
  }

  return new Response(JSON.stringify({ css: cssText }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=31536000",
    }
  });
}
