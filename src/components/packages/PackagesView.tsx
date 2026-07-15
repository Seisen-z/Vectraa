import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const BASE = 'https://vectraa.vercel.app';

// ─── Framework logo badges ────────────────────────────────────────────────────

function Logo({ slug, bg, iconColor }: { slug: string; bg: string; iconColor?: string }) {
  const src = iconColor
    ? `https://cdn.simpleicons.org/${slug}/${iconColor}`
    : `https://cdn.simpleicons.org/${slug}`;
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
      <img src={src} width={26} height={26} alt={slug} />
    </div>
  );
}

// ─── Package data ─────────────────────────────────────────────────────────────

interface Pkg {
  id: string;
  name: string;
  logo: React.ReactNode;
  badge: string;
  badgeColor: string;
  desc: string;
  snippet: string;
}

const PACKAGES: Pkg[] = [
  {
    id: 'js',
    name: 'JavaScript',
    logo: <Logo slug="javascript" bg="#F7DF1E22" />,
    badge: 'fetch API',
    badgeColor: '#F7DF1E',
    desc: 'Use Vectra icons in any JavaScript or TypeScript project — no install required.',
    snippet:
`// Embed SVG inline
const svg = await fetch('${BASE}/api/icons/arrow-right/svg')
  .then(r => r.text());
document.getElementById('icon').innerHTML = svg;

// Or use as <img> src
const img = document.createElement('img');
img.src = '${BASE}/api/icons/arrow-right/png?size=64&color=FF2D78';`,
  },
  {
    id: 'react',
    name: 'React',
    logo: <Logo slug="react" bg="#61DAFB18" />,
    badge: 'component',
    badgeColor: '#61DAFB',
    desc: 'Drop a tiny wrapper component into your React app and use any Vectra icon by name.',
    snippet:
`function VectraIcon({ name, size = 24, color = '00B4FF', border = false }) {
  return (
    <img
      src={\`${BASE}/api/icons/\${name}/svg?size=\${size}&color=\${color}&border=\${border}\`}
      width={size}
      height={size}
      alt={name}
    />
  );
}

// Usage
<VectraIcon name="arrow-right" size={32} color="FF2D78" />`,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    logo: <Logo slug="nextdotjs" bg="#ffffff12" iconColor="ffffff" />,
    badge: 'next/image',
    badgeColor: '#ffffff',
    desc: 'Use next/image with the Vectra API URL for automatic optimisation and lazy loading.',
    snippet:
`import Image from 'next/image';

export function VectraIcon({ name, size = 24, color = '00B4FF' }) {
  return (
    <Image
      src={\`${BASE}/api/icons/\${name}/png?size=\${size * 2}&color=\${color}\`}
      width={size}
      height={size}
      alt={name}
      unoptimized
    />
  );
}`,
  },
  {
    id: 'vue',
    name: 'Vue',
    logo: <Logo slug="vuedotjs" bg="#42B88318" />,
    badge: 'component',
    badgeColor: '#42B883',
    desc: 'Register a global VectraIcon component in your Vue 3 application.',
    snippet:
`<!-- VectraIcon.vue -->
<template>
  <img :src="url" :width="size" :height="size" :alt="name" />
</template>

<script setup>
const props = defineProps({ name: String, size: { default: 24 }, color: { default: '00B4FF' } });
const url = \`${BASE}/api/icons/\${props.name}/svg?size=\${props.size}&color=\${props.color}\`;
</script>

<!-- Usage -->
<VectraIcon name="arrow-right" :size="32" color="FF2D78" />`,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    logo: <Logo slug="svelte" bg="#FF3E0018" />,
    badge: 'component',
    badgeColor: '#FF3E00',
    desc: 'A tiny Svelte component that pulls any icon by name from the Vectra API.',
    snippet:
`<!-- VectraIcon.svelte -->
<script>
  export let name, size = 24, color = '00B4FF';
  $: src = \`${BASE}/api/icons/\${name}/svg?size=\${size}&color=\${color}\`;
</script>

<img {src} width={size} height={size} alt={name} />

<!-- Usage -->
<VectraIcon name="arrow-right" size={32} color="FF2D78" />`,
  },
  {
    id: 'angular',
    name: 'Angular',
    logo: <Logo slug="angular" bg="#DD003118" />,
    badge: 'pipe',
    badgeColor: '#DD0031',
    desc: 'Use the Vectra REST API inside an Angular template with a simple pipe or service.',
    snippet:
`// vectra-icon.component.ts
@Component({
  selector: 'vectra-icon',
  template: \`<img [src]="url" [width]="size" [height]="size" [alt]="name">\`,
})
export class VectraIconComponent {
  @Input() name = '';
  @Input() size = 24;
  @Input() color = '00B4FF';
  get url() {
    return \`${BASE}/api/icons/\${this.name}/svg?size=\${this.size}&color=\${this.color}\`;
  }
}

<!-- Template -->
<vectra-icon name="arrow-right" [size]="32" color="FF2D78" />`,
  },
  {
    id: 'nuxt',
    name: 'Nuxt',
    logo: <Logo slug="nuxtdotjs" bg="#00DC8218" />,
    badge: 'component',
    badgeColor: '#00DC82',
    desc: 'Register VectraIcon as a global Nuxt component — works with SSR and static generation.',
    snippet:
`<!-- components/VectraIcon.vue -->
<template>
  <NuxtImg :src="url" :width="size" :height="size" :alt="name" />
</template>

<script setup>
const { name, size = 24, color = '00B4FF' } = defineProps(['name','size','color']);
const url = \`${BASE}/api/icons/\${name}/png?size=\${size * 2}&color=\${color}\`;
</script>

<!-- Auto-imported everywhere -->
<VectraIcon name="arrow-right" :size="32" color="FF2D78" />`,
  },
  {
    id: 'astro',
    name: 'Astro',
    logo: <Logo slug="astro" bg="#FF5D0118" />,
    badge: 'component',
    badgeColor: '#FF5D01',
    desc: 'Use Vectra icons in Astro pages and components with zero JavaScript overhead.',
    snippet:
`---
// VectraIcon.astro
const { name, size = 24, color = '00B4FF' } = Astro.props;
const src = \`${BASE}/api/icons/\${name}/svg?size=\${size}&color=\${color}\`;
---

<img src={src} width={size} height={size} alt={name} />

<!-- Usage in any .astro page -->
<VectraIcon name="arrow-right" size={32} color="FF2D78" />`,
  },
  {
    id: 'python',
    name: 'Python',
    logo: <Logo slug="python" bg="#3776AB18" />,
    badge: 'requests',
    badgeColor: '#4B8BBE',
    desc: 'Download or embed Vectra icons in any Python application using the requests library.',
    snippet:
`import requests

# Download as PNG
r = requests.get(
    f'${BASE}/api/icons/arrow-right/png',
    params={'size': 128, 'color': 'FF2D78', 'border': 'false'}
)
with open('icon.png', 'wb') as f:
    f.write(r.content)

# Get SVG string
svg = requests.get(f'${BASE}/api/icons/arrow-right/svg').text`,
  },
  {
    id: 'php',
    name: 'PHP',
    logo: <Logo slug="php" bg="#777BB418" />,
    badge: 'file_get_contents',
    badgeColor: '#8892BF',
    desc: 'Embed Vectra icons in PHP templates or download them to your server.',
    snippet:
`<?php
// Embed SVG inline
$svg = file_get_contents(
    '${BASE}/api/icons/arrow-right/svg?color=FF2D78&border=false'
);
echo $svg;

// Download PNG
$png = file_get_contents(
    '${BASE}/api/icons/arrow-right/png?size=256&color=00B4FF'
);
file_put_contents('icon.png', $png);`,
  },
  {
    id: 'go',
    name: 'Go',
    logo: <Logo slug="go" bg="#00ADD818" />,
    badge: 'net/http',
    badgeColor: '#00ACD7',
    desc: 'Fetch Vectra icons in any Go application using the standard library.',
    snippet:
`package main

import (
    "io"
    "net/http"
    "os"
)

func main() {
    url := "${BASE}/api/icons/arrow-right/png?size=256&color=FF2D78"
    resp, _ := http.Get(url)
    defer resp.Body.Close()

    f, _ := os.Create("icon.png")
    defer f.Close()
    io.Copy(f, resp.Body)
}`,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    logo: <Logo slug="ruby" bg="#CC342D18" />,
    badge: 'Net::HTTP',
    badgeColor: '#CC342D',
    desc: 'Use Vectra icons in Ruby or Rails projects with the built-in HTTP client.',
    snippet:
`require 'net/http'
require 'uri'

uri  = URI("${BASE}/api/icons/arrow-right/png?size=256&color=FF2D78")
data = Net::HTTP.get(uri)
File.binwrite('icon.png', data)

# In a Rails view — render inline SVG
svg_url = "${BASE}/api/icons/arrow-right/svg?color=00B4FF"
svg     = URI.open(svg_url).read`,
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function PackageCard({ pkg, onGuide }: { pkg: Pkg; onGuide: () => void }) {
  const [copied, setCopied] = useState(false);

  function copySnippet() {
    navigator.clipboard.writeText(pkg.snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden hover:border-white/12 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-3">
        {pkg.logo}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[var(--text-primary)]">{pkg.name}</p>
          <span
            className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border"
            style={{ color: pkg.badgeColor, borderColor: `${pkg.badgeColor}40`, background: `${pkg.badgeColor}12` }}
          >
            {pkg.badge}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="px-5 pb-3 text-xs text-[var(--text-secondary)] leading-relaxed">{pkg.desc}</p>

      {/* Code */}
      <div className="relative mx-5 mb-4">
        <pre className="p-3.5 text-[11px] font-mono text-[#c9d1d9] bg-[#0d1117] rounded-xl overflow-x-auto leading-relaxed whitespace-pre border border-white/5">
          <code>{pkg.snippet}</code>
        </pre>
        <button
          onClick={copySnippet}
          className="absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-medium transition-colors bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 pb-5 mt-auto">
        <button
          onClick={onGuide}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)] hover:brightness-110 transition-colors"
        >
          API Guide
        </button>
        <a
          href="https://github.com/Seisen88/Iconversion"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-[var(--text-secondary)] border border-white/10 hover:bg-white/8 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function PackagesView() {
  const { setAppMode } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            REST API · No install required
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Packages</h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
            Integrate 50,000+ Vectra icons into any framework or language via the REST API.
            Copy the snippet for your stack and you're done.
          </p>
        </div>

        {/* Base URL callout */}
        <div className="flex items-center gap-3 mb-10 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <span className="text-xs text-[var(--text-muted)]">Base URL</span>
          <code className="text-xs font-mono text-[var(--neon-cyan)]">{BASE}/api/icons/:name/:format</code>
          <span className="ml-auto text-xs text-[var(--text-muted)]">
            <button onClick={() => setAppMode('api-docs')} className="hover:text-[var(--accent)] transition-colors">
              Full API reference →
            </button>
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PACKAGES.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onGuide={() => setAppMode('api-docs')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
