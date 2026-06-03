import React, { useState, useEffect, useRef } from 'react';

// ─── tiny helpers ────────────────────────────────────────────────────────────

type Lang = 'curl' | 'js' | 'python' | 'php';

const LANG_LABELS: Record<Lang, string> = {
  curl: 'cURL', js: 'JavaScript', python: 'Python', php: 'PHP',
};

function CodeBlock({ tabs }: { tabs: Record<Lang, string> }) {
  const [lang, setLang] = useState<Lang>('curl');
  return (
    <div className="rounded-xl overflow-hidden border border-white/8 mt-3">
      <div className="flex bg-black/40 border-b border-white/8">
        {(Object.keys(tabs) as Lang[]).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 text-xs font-mono font-semibold transition-colors ${
              lang === l
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)] bg-[var(--neon-green)]/5'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>
      <pre className="p-4 text-xs font-mono text-[#c9d1d9] bg-[#0d1117] overflow-x-auto leading-relaxed whitespace-pre">
        <code>{tabs[lang]}</code>
      </pre>
    </div>
  );
}

function Badge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-[var(--neon-green)]/15 text-[var(--neon-green)] border-[var(--neon-green)]/30',
    POST: 'bg-[var(--neon-blue)]/15 text-[var(--neon-blue)] border-[var(--neon-blue)]/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${colors[method] ?? 'bg-white/10 text-white/60 border-white/10'}`}>
      {method}
    </span>
  );
}

function Endpoint({ id, method, path, desc, params, response, examples }: {
  id: string; method: string; path: string; desc: string;
  params?: { name: string; type: string; required?: boolean; default?: string; desc: string }[];
  response: string;
  examples: Record<Lang, string>;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-3">
        <Badge method={method} />
        <code className="text-sm font-mono text-[var(--neon-blue)] bg-[var(--neon-blue)]/5 px-3 py-1 rounded-lg border border-[var(--neon-blue)]/20">
          {path}
        </code>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{desc}</p>

      {params && params.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Parameters</p>
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/3 border-b border-white/8">
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold w-32">Name</th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold w-24">Type</th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold w-24">Required</th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold w-24">Default</th>
                  <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p, i) => (
                  <tr key={p.name} className={i < params.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-[var(--neon-cyan)]">{p.name}</code>
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)] font-mono">{p.type}</td>
                    <td className="px-4 py-2.5">
                      {p.required
                        ? <span className="text-[var(--neon-red)]">required</span>
                        : <span className="text-[var(--text-muted)]">optional</span>}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text-muted)] font-mono">{p.default ?? '—'}</td>
                    <td className="px-4 py-2.5 text-[var(--text-secondary)]">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Response</p>
        <pre className="p-4 text-xs font-mono text-[#c9d1d9] bg-[#0d1117] rounded-xl border border-white/8 overflow-x-auto leading-relaxed whitespace-pre">
          <code>{response}</code>
        </pre>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1 mt-4">Examples</p>
      <CodeBlock tabs={examples} />
    </section>
  );
}

// ─── TOC entry ───────────────────────────────────────────────────────────────

const TOC = [
  { id: 'overview',    label: 'Overview' },
  { id: 'base-url',    label: 'Base URL' },
  { id: 'sizes',       label: 'Sizes & Formats' },
  { id: 'colors',      label: 'Color Reference' },
  { id: 'ep-list',     label: 'GET /api/icons' },
  { id: 'ep-cats',     label: 'GET /api/categories' },
  { id: 'ep-meta',     label: 'GET /api/icons/:id' },
  { id: 'ep-svg',      label: 'GET /api/icons/:id/svg' },
  { id: 'ep-png',      label: 'GET /api/icons/:id/png' },
  { id: 'ep-jpg',      label: 'GET /api/icons/:id/jpg' },
  { id: 'ep-webp',     label: 'GET /api/icons/:id/webp' },
  { id: 'errors',      label: 'Error Responses' },
];

const BASE = 'https://vectraa.vercel.app';

// ─── Main component ───────────────────────────────────────────────────────────

export default function ApiDocsView() {
  const [activeSection, setActiveSection] = useState('overview');
  const mainRef = useRef<HTMLDivElement>(null);

  // Highlight active TOC entry on scroll
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    const handler = () => {
      const containerTop = container.getBoundingClientRect().top;
      const sections = TOC.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
      for (let i = sections.length - 1; i >= 0; i--) {
        const top = sections[i].getBoundingClientRect().top - containerTop;
        if (top <= 120) {
          setActiveSection(sections[i].id);
          return;
        }
      }
      setActiveSection('overview');
    };
    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    const container = mainRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;
    const targetTop = target.getBoundingClientRect().top;
    const containerTop = container.getBoundingClientRect().top;
    container.scrollBy({ top: targetTop - containerTop - 24, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-[var(--bg-primary)]">
      {/* ── Sidebar TOC ─────────────────────────────────────────── */}
      <nav className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[var(--border-subtle)] overflow-y-auto py-6 px-3 gap-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">Contents</p>
        {TOC.map(t => (
          <button
            key={t.id}
            onClick={() => scrollTo(t.id)}
            className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeSection === t.id
                ? 'text-[var(--neon-green)] bg-[var(--neon-green)]/8 font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Main content ────────────────────────────────────────── */}
      <div ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/25 text-[var(--neon-green)] text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              REST API
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Vectra Icon API</h1>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              A simple HTTP API that lets you fetch, search, and render any icon in the library — from any language.
              No authentication required. All responses include CORS headers.
            </p>
          </div>

          {/* Overview */}
          <section id="overview" className="mb-10 scroll-mt-20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Icons', value: '50,000+' },
                { label: 'Formats', value: 'SVG · PNG · JPG · WebP' },
                { label: 'Max size', value: '4096 px' },
                { label: 'Auth', value: 'None' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Base URL */}
          <section id="base-url" className="mb-10 scroll-mt-20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Base URL</h2>
            <pre className="p-4 text-xs font-mono text-[#c9d1d9] bg-[#0d1117] rounded-xl border border-white/8 overflow-x-auto">
              <code>{`https://vectraa.vercel.app`}</code>
            </pre>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              No setup required — the API is publicly accessible. All endpoints support CORS so you can call them directly from a browser, server, or any HTTP client.
            </p>
          </section>

          {/* Sizes */}
          <section id="sizes" className="mb-10 scroll-mt-20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Sizes &amp; Formats</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              The <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">size</code> parameter controls the pixel dimensions of the rendered image.
            </p>
            <div className="rounded-xl border border-white/8 overflow-hidden mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/3 border-b border-white/8">
                    <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold">Size (px)</th>
                    <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold">Typical use</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['16', 'Browser favicon (legacy)'],
                    ['32', 'Favicon, small toolbar icon'],
                    ['64', 'App icon, list thumbnail'],
                    ['128', 'Medium UI icon'],
                    ['256', 'App icon (macOS, Windows)'],
                    ['512', 'App store, high-DPI icon'],
                    ['1024', 'Large marketing asset'],
                    ['2048', 'Print, retina display'],
                    ['4096', 'High-res print / poster'],
                  ].map(([s, u], i, a) => (
                    <tr key={s} className={i < a.length - 1 ? 'border-b border-white/5' : ''}>
                      <td className="px-4 py-2.5 font-mono text-[var(--neon-blue)]">{s}×{s}</td>
                      <td className="px-4 py-2.5 text-[var(--text-secondary)]">{u}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Supported formats</p>
            <div className="flex flex-wrap gap-2">
              {['SVG (vector)', 'PNG (transparent)', 'JPG (dark bg)', 'WebP (modern)'].map(f => (
                <span key={f} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/3 text-xs text-[var(--text-secondary)]">{f}</span>
              ))}
            </div>
          </section>

          {/* Colors */}
          <section id="colors" className="mb-10 scroll-mt-20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Color Reference</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Pass a hex value (with or without <code className="font-mono bg-white/5 px-1 py-0.5 rounded">#</code>) to the <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">color</code> parameter, or use one of the built-in neon keys below.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                ['pink',   '#FF2D78'],
                ['purple', '#BE00FF'],
                ['blue',   '#00B4FF'],
                ['green',  '#00FF87'],
                ['orange', '#FF6B00'],
                ['yellow', '#FFE600'],
                ['red',    '#FF2525'],
                ['cyan',   '#00FFFF'],
                ['violet', '#7B2FFF'],
                ['lime',   '#AAFF00'],
                ['white',  '#FFFFFF'],
                ['black',  '#000000'],
              ].map(([key, hex]) => (
                <div key={key} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/8 bg-white/2">
                  <span className="w-5 h-5 rounded-full shrink-0 border border-white/10" style={{ background: hex }} />
                  <div>
                    <p className="text-xs font-mono text-[var(--text-primary)]">{key}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">{hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border-subtle)]">Endpoints</h2>
            <div className="rounded-xl border border-[var(--neon-blue)]/20 bg-[var(--neon-blue)]/5 px-4 py-3 text-sm text-[var(--text-secondary)] mb-4">
              <span className="font-semibold text-[var(--neon-blue)]">Name-based access</span> — use the short <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">iconName</code> (e.g.{' '}
              <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">a-arrow-down</code>) anywhere a{' '}
              <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">:id</code> is expected.
              The full internal ID (e.g. <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-white/40">custom-outline-a-arrow-down</code>) also works.
            </div>
          </div>

          {/* ── Endpoint: list ─────────────────────────────────── */}
          <Endpoint
            id="ep-list"
            method="GET"
            path="/api/icons"
            desc="Returns a paginated list of icons. Supports full-text search by name and filtering by category."
            params={[
              { name: 'q',        type: 'string',  desc: 'Search term — matches icon name and category.' },
              { name: 'category', type: 'string',  desc: 'Filter to a specific category id (e.g. arrows, technology).' },
              { name: 'page',     type: 'integer', default: '1',  desc: '1-based page number.' },
              { name: 'limit',    type: 'integer', default: '50', desc: 'Results per page. Maximum 200.' },
            ]}
            response={`{
  "total": 12247,
  "page": 1,
  "limit": 50,
  "icons": [
    {
      "id": "custom-outline-a-arrow-down",
      "iconName": "a-arrow-down",
      "name": "A Arrow Down",
      "category": "arrows",
      "color": "blue"
    }
  ]
}`}
            examples={{
              curl:   `curl "${BASE}/api/icons?q=arrow&category=arrows&limit=10"`,
              js:     `const res  = await fetch('${BASE}/api/icons?q=arrow&category=arrows&limit=10');
const data = await res.json();
console.log(data.icons);`,
              python: `import requests

r    = requests.get('${BASE}/api/icons', params={'q': 'arrow', 'category': 'arrows', 'limit': 10})
data = r.json()
print(data['icons'])`,
              php:    `<?php
$url  = '${BASE}/api/icons?' . http_build_query(['q' => 'arrow', 'category' => 'arrows', 'limit' => 10]);
$data = json_decode(file_get_contents($url), true);
print_r($data['icons']);`,
            }}
          />

          {/* ── Endpoint: categories ───────────────────────────── */}
          <Endpoint
            id="ep-cats"
            method="GET"
            path="/api/categories"
            desc="Returns all available categories with their icon counts."
            response={`{
  "total": 50000,
  "categories": [
    { "id": "arrows",     "label": "Arrows & Navigation", "count": 940 },
    { "id": "technology", "label": "Technology",          "count": 3200 }
  ]
}`}
            examples={{
              curl:   `curl "${BASE}/api/categories"`,
              js:     `const res  = await fetch('${BASE}/api/categories');
const data = await res.json();
data.categories.forEach(c => console.log(c.id, c.count));`,
              python: `import requests

cats = requests.get('${BASE}/api/categories').json()['categories']
for c in cats:
    print(c['id'], c['count'])`,
              php:    `<?php
$cats = json_decode(file_get_contents('${BASE}/api/categories'), true)['categories'];
foreach ($cats as $c) {
    echo $c['id'] . ': ' . $c['count'] . PHP_EOL;
}`,
            }}
          />

          {/* ── Endpoint: metadata ─────────────────────────────── */}
          <Endpoint
            id="ep-meta"
            method="GET"
            path="/api/icons/:id"
            desc="Returns full metadata for a single icon including the raw SVG path content, tags, viewBox, and color."
            params={[
              { name: 'id', type: 'string', required: true, desc: 'The icon id as returned by the list endpoint (e.g. a-arrow-down).' },
            ]}
            response={`{
  "id":         "custom-outline-a-arrow-down",
  "iconName":   "a-arrow-down",
  "name":       "A Arrow Down",
  "category":   "arrows",
  "tags":       ["a", "arrow", "down", "letter", "font", "text"],
  "style":      "outline",
  "source":     "custom",
  "viewBox":    "0 0 24 24",
  "color":      "blue",
  "svgContent": "<path d=\\"M2 18H9\\"/><path d=\\"M12 18L22 18\\"/><path d=\\"M19 15L22 18L19 21\\"/><path d=\\"M5 10.5L9 3L13 10.5\\"/><path d=\\"M5.7 9H12.3\\"/>"
}`}
            examples={{
              curl:   `curl "${BASE}/api/icons/a-arrow-down"`,
              js:     `const res  = await fetch('${BASE}/api/icons/a-arrow-down');
const icon = await res.json();
console.log(icon.svgContent);`,
              python: `import requests

icon = requests.get('${BASE}/api/icons/a-arrow-down').json()
print(icon['svgContent'])`,
              php:    `<?php
$icon = json_decode(file_get_contents('${BASE}/api/icons/a-arrow-down'), true);
echo $icon['svgContent'];`,
            }}
          />

          {/* ── Endpoint: SVG ──────────────────────────────────── */}
          <Endpoint
            id="ep-svg"
            method="GET"
            path="/api/icons/:id/svg"
            desc="Streams the icon as an SVG file. Customize color, border, and intrinsic dimensions."
            params={[
              { name: 'color',  type: 'string',  default: 'icon default', desc: 'Hex value (e.g. FF2D78 or #FF2D78) or neon key (pink, blue…).' },
              { name: 'border', type: 'boolean', default: 'true',         desc: 'Set to false to remove the rounded-square border frame.' },
              { name: 'size',   type: 'integer', default: '512',          desc: 'Sets the SVG width/height attribute in pixels.' },
            ]}
            response={`<!-- Content-Type: image/svg+xml -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="512" height="512">
  <rect x="1.5" y="1.5" width="85" height="85" rx="16" fill="none"
        stroke="#00B4FF" stroke-width="3"/>
  <svg x="17" y="17" width="54" height="54" viewBox="0 0 24 24" fill="#00B4FF">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</svg>`}
            examples={{
              curl: `# Save SVG file
curl "${BASE}/api/icons/a-arrow-down/svg?color=FF2D78&border=false" \\
     -o arrow-right.svg`,
              js: `// Embed directly in an <img> or display inline
const url = '${BASE}/api/icons/a-arrow-down/svg?color=00FF87';
document.getElementById('my-icon').src = url;

// Or fetch the text and inject as innerHTML
const svg = await fetch(url).then(r => r.text());
document.getElementById('container').innerHTML = svg;`,
              python: `import requests

r = requests.get(
    '${BASE}/api/icons/a-arrow-down/svg',
    params={'color': 'FF2D78', 'border': 'false'}
)
with open('arrow-right.svg', 'wb') as f:
    f.write(r.content)`,
              php: `<?php
$url = '${BASE}/api/icons/a-arrow-down/svg?' . http_build_query([
    'color'  => 'FF2D78',
    'border' => 'false',
]);
file_put_contents('arrow-right.svg', file_get_contents($url));`,
            }}
          />

          {/* ── Endpoint: PNG ──────────────────────────────────── */}
          <Endpoint
            id="ep-png"
            method="GET"
            path="/api/icons/:id/png"
            desc="Renders and streams a PNG raster image. Supports transparent background. Valid sizes: 16, 32, 64, 128, 256, 512, 1024, 2048, 4096."
            params={[
              { name: 'size',   type: 'integer', default: '512',          desc: 'Output size in pixels. Must be one of the valid sizes listed above.' },
              { name: 'color',  type: 'string',  default: 'icon default', desc: 'Hex or neon key.' },
              { name: 'border', type: 'boolean', default: 'true',         desc: 'Include the rounded-square border frame.' },
            ]}
            response={`<!-- Content-Type: image/png -->
<!-- Binary PNG data stream -->`}
            examples={{
              curl: `# 256 px, pink, no border
curl "${BASE}/api/icons/a-arrow-down/png?size=256&color=FF2D78&border=false" \\
     -o arrow-right-256.png`,
              js: `// Display in an <img> tag — browser fetches directly
const img   = document.createElement('img');
img.src     = '${BASE}/api/icons/a-arrow-down/png?size=128&color=00B4FF';
img.width   = 128;
document.body.appendChild(img);

// Or download as a Blob
const blob = await fetch(img.src).then(r => r.blob());
const link = Object.assign(document.createElement('a'), {
  href: URL.createObjectURL(blob), download: 'icon.png'
});
link.click();`,
              python: `import requests

r = requests.get(
    '${BASE}/api/icons/a-arrow-down/png',
    params={'size': 256, 'color': 'FF2D78', 'border': 'false'}
)
with open('arrow-right.png', 'wb') as f:
    f.write(r.content)`,
              php: `<?php
$url = '${BASE}/api/icons/a-arrow-down/png?' . http_build_query([
    'size'   => 256,
    'color'  => 'FF2D78',
    'border' => 'false',
]);
file_put_contents('arrow-right.png', file_get_contents($url));`,
            }}
          />

          {/* ── Endpoint: JPG ──────────────────────────────────── */}
          <Endpoint
            id="ep-jpg"
            method="GET"
            path="/api/icons/:id/jpg"
            desc="Renders a JPEG image with a dark (#131319) background — useful for platforms that don't support transparency."
            params={[
              { name: 'size',   type: 'integer', default: '512',          desc: 'Output size. Must be a valid size (16–4096).' },
              { name: 'color',  type: 'string',  default: 'icon default', desc: 'Hex or neon key.' },
              { name: 'border', type: 'boolean', default: 'true',         desc: 'Include border frame.' },
            ]}
            response={`<!-- Content-Type: image/jpeg -->
<!-- Binary JPEG data stream -->`}
            examples={{
              curl: `curl "${BASE}/api/icons/a-arrow-down/jpg?size=512&color=cyan" \\
     -o arrow-right.jpg`,
              js: `const url = '${BASE}/api/icons/a-arrow-down/jpg?size=512&color=cyan';
const res  = await fetch(url);
const blob = await res.blob();
// use blob as needed`,
              python: `import requests

r = requests.get('${BASE}/api/icons/a-arrow-down/jpg',
                 params={'size': 512, 'color': 'cyan'})
open('arrow.jpg', 'wb').write(r.content)`,
              php: `<?php
$data = file_get_contents('${BASE}/api/icons/a-arrow-down/jpg?size=512&color=cyan');
file_put_contents('arrow.jpg', $data);`,
            }}
          />

          {/* ── Endpoint: WebP ─────────────────────────────────── */}
          <Endpoint
            id="ep-webp"
            method="GET"
            path="/api/icons/:id/webp"
            desc="Renders a WebP image with transparency. Smaller file size than PNG — recommended for modern web use."
            params={[
              { name: 'size',   type: 'integer', default: '512',          desc: 'Output size. Must be a valid size (16–4096).' },
              { name: 'color',  type: 'string',  default: 'icon default', desc: 'Hex or neon key.' },
              { name: 'border', type: 'boolean', default: 'true',         desc: 'Include border frame.' },
            ]}
            response={`<!-- Content-Type: image/webp -->
<!-- Binary WebP data stream -->`}
            examples={{
              curl: `curl "${BASE}/api/icons/a-arrow-down/webp?size=128" \\
     -o arrow-right.webp`,
              js: `const url = '${BASE}/api/icons/a-arrow-down/webp?size=128';
document.querySelector('img').src = url;`,
              python: `import requests

r = requests.get('${BASE}/api/icons/a-arrow-down/webp', params={'size': 128})
open('arrow.webp', 'wb').write(r.content)`,
              php: `<?php
$data = file_get_contents('${BASE}/api/icons/a-arrow-down/webp?size=128');
file_put_contents('arrow.webp', $data);`,
            }}
          />

          {/* Errors */}
          <section id="errors" className="mb-12 scroll-mt-20">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Error Responses</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              All errors return JSON with an <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[var(--neon-cyan)]">error</code> field describing the problem.
            </p>
            <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/3 border-b border-white/8">
                    <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold w-24">Status</th>
                    <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['400', 'Bad request — invalid parameter (e.g. unsupported size).'],
                    ['404', 'Icon not found — the id does not exist in the library.'],
                    ['500', 'Internal server error — image rendering failed.'],
                  ].map(([code, msg], i, a) => (
                    <tr key={code} className={i < a.length - 1 ? 'border-b border-white/5' : ''}>
                      <td className="px-4 py-2.5 font-mono text-[var(--neon-red)]">{code}</td>
                      <td className="px-4 py-2.5 text-[var(--text-secondary)]">{msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre className="p-4 text-xs font-mono text-[#c9d1d9] bg-[#0d1117] rounded-xl border border-white/8">
              <code>{`{ "error": "Invalid size. Valid sizes: 16, 32, 64, 128, 256, 512, 1024, 2048, 4096" }`}</code>
            </pre>
          </section>

        </div>
      </div>
    </div>
  );
}
