<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const starCanvas = ref<HTMLCanvasElement | null>(null)
let cleanupFn: (() => void) | null = null

type Star = {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkleAlpha: number
  speed: number
  phase: number
  bright: boolean
  flareLength: number
  sparkleStartsAt: number
  sparkleEndsAt: number
  sparkleAlpha: number
}

type ShootingStar = {
  startX: number
  startY: number
  endX: number
  endY: number
  spawnedAt: number
  duration: number
  length: number
  width: number
  alpha: number
}

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  const el = starCanvas.value
  if (!el) return
  const ctx = el.getContext('2d')!
  const stars: Star[] = []
  const shootingStars: ShootingStar[] = []
  let nextShootingStarAt = 0
  let frameId = 0

  const scheduleSparkle = (star: Star, now: number) => {
    const duration = star.bright ? 360 + Math.random() * 820 : 180 + Math.random() * 620
    star.sparkleStartsAt = now + (star.bright ? 450 + Math.random() * 4200 : 900 + Math.random() * 7600)
    star.sparkleEndsAt = star.sparkleStartsAt + duration
    star.sparkleAlpha = star.bright ? 0.34 + Math.random() * 0.34 : 0.08 + Math.random() * 0.16
  }

  const scheduleNextShootingStar = (now: number) => {
    const isCompact = window.innerWidth < 960
    const minDelay = isCompact ? 3200 : 1700
    const maxDelay = isCompact ? 7800 : 5600
    nextShootingStarAt = now + minDelay + Math.random() * (maxDelay - minDelay)
  }

  const spawnShootingStar = (now: number) => {
    const width = window.innerWidth
    const height = window.innerHeight
    const startX = width * (-0.08 + Math.random() * 0.38)
    const startY = height * (0.05 + Math.random() * 0.24)
    const angle = Math.PI * (0.2 + Math.random() * 0.14)
    const distance = Math.max(width, height) * (0.2 + Math.random() * 0.26)

    shootingStars.push({
      startX,
      startY,
      endX: startX + Math.cos(angle) * distance,
      endY: startY + Math.sin(angle) * distance,
      spawnedAt: now,
      duration: 1100 + Math.random() * 900,
      length: 70 + Math.random() * 130,
      width: 1 + Math.random() * 1.35,
      alpha: 0.48 + Math.random() * 0.34,
    })
  }

  const makeStar = (bright: boolean, now: number): Star => {
    const star: Star = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: bright ? 1.25 + Math.random() * 0.75 : 0.25 + Math.random() * 0.95,
      baseAlpha: bright ? 0.46 + Math.random() * 0.28 : 0.08 + Math.random() * 0.26,
      twinkleAlpha: bright ? 0.14 + Math.random() * 0.18 : 0.08 + Math.random() * 0.2,
      speed: bright ? 0.0007 + Math.random() * 0.0011 : 0.00035 + Math.random() * 0.0009,
      phase: Math.random() * Math.PI * 2,
      bright,
      flareLength: bright ? 7 + Math.random() * 10 : 0,
      sparkleStartsAt: 0,
      sparkleEndsAt: 0,
      sparkleAlpha: 0,
    }

    scheduleSparkle(star, now - Math.random() * 5000)
    return star
  }

  const fitCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    el.width = Math.floor(width * dpr)
    el.height = Math.floor(height * dpr)
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const seedStars = () => {
    const now = performance.now()
    fitCanvas()
    stars.length = 0
    shootingStars.length = 0
    for (let i = 0; i < 350; i++) {
      stars.push(makeStar(false, now))
    }
    for (let i = 0; i < 18; i++) {
      stars.push(makeStar(true, now))
    }
    scheduleNextShootingStar(now)
  }

  const render = (now: number) => {
    if (now >= nextShootingStarAt) {
      const isCompact = window.innerWidth < 960
      const maxActive = isCompact ? 1 : 2
      if (shootingStars.length < maxActive) {
        spawnShootingStar(now)
      }
      if (!isCompact && Math.random() < 0.18 && shootingStars.length < maxActive) {
        spawnShootingStar(now + 80 + Math.random() * 120)
      }
      scheduleNextShootingStar(now)
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    for (const star of stars) {
      const twinkle = (Math.sin(now * star.speed + star.phase) + 1) / 2
      const shimmer = (Math.sin(now * star.speed * 2.7 + star.phase * 1.9) + 1) / 2
      let alpha = star.baseAlpha + star.twinkleAlpha * twinkle * (0.55 + shimmer * 0.45)
      let sparkle = 0

      if (now >= star.sparkleStartsAt && now <= star.sparkleEndsAt) {
        const progress = (now - star.sparkleStartsAt) / (star.sparkleEndsAt - star.sparkleStartsAt)
        sparkle = Math.sin(progress * Math.PI)
        alpha += sparkle * star.sparkleAlpha
      } else if (now > star.sparkleEndsAt) {
        scheduleSparkle(star, now)
      }

      alpha = Math.min(alpha, star.bright ? 0.96 : 0.78)

      if (star.bright) {
        const flareAlpha = Math.min(0.9, 0.08 + twinkle * 0.18 + sparkle * 0.72)
        const flareLength = star.flareLength * (0.7 + twinkle * 0.16 + sparkle * 0.68)
        const flareWidth = 0.55 + sparkle * 0.65
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, flareLength * 0.46)
        const horizontal = ctx.createLinearGradient(star.x - flareLength, star.y, star.x + flareLength, star.y)
        const vertical = ctx.createLinearGradient(star.x, star.y - flareLength, star.x, star.y + flareLength)

        glow.addColorStop(0, `rgba(255,255,255,${flareAlpha * 0.2})`)
        glow.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.arc(star.x, star.y, flareLength * 0.46, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        horizontal.addColorStop(0, 'rgba(255,255,255,0)')
        horizontal.addColorStop(0.5, `rgba(255,255,255,${flareAlpha})`)
        horizontal.addColorStop(1, 'rgba(255,255,255,0)')
        vertical.addColorStop(0, 'rgba(255,255,255,0)')
        vertical.addColorStop(0.5, `rgba(210,225,255,${flareAlpha * 0.9})`)
        vertical.addColorStop(1, 'rgba(255,255,255,0)')

        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineWidth = flareWidth
        ctx.strokeStyle = horizontal
        ctx.beginPath()
        ctx.moveTo(star.x - flareLength, star.y)
        ctx.lineTo(star.x + flareLength, star.y)
        ctx.stroke()
        ctx.strokeStyle = vertical
        ctx.beginPath()
        ctx.moveTo(star.x, star.y - flareLength)
        ctx.lineTo(star.x, star.y + flareLength)
        ctx.stroke()
        ctx.restore()
      }

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = star.bright ? `rgba(255,255,255,${alpha})` : `rgba(210,225,255,${alpha})`
      ctx.fill()
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const shootingStar = shootingStars[i]
      const progress = (now - shootingStar.spawnedAt) / shootingStar.duration

      if (progress >= 1) {
        shootingStars.splice(i, 1)
        continue
      }

      if (progress < 0) {
        continue
      }

      const x = shootingStar.startX + (shootingStar.endX - shootingStar.startX) * progress
      const y = shootingStar.startY + (shootingStar.endY - shootingStar.startY) * progress
      const angle = Math.atan2(shootingStar.endY - shootingStar.startY, shootingStar.endX - shootingStar.startX)
      const tailX = x - Math.cos(angle) * shootingStar.length
      const tailY = y - Math.sin(angle) * shootingStar.length
      const fade = Math.sin(progress * Math.PI)
      const alpha = shootingStar.alpha * fade
      const line = ctx.createLinearGradient(x, y, tailX, tailY)

      line.addColorStop(0, `rgba(255,255,255,${alpha})`)
      line.addColorStop(0.32, `rgba(196,224,255,${alpha * 0.64})`)
      line.addColorStop(1, 'rgba(196,224,255,0)')

      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineWidth = shootingStar.width * (1 - progress * 0.25)
      ctx.strokeStyle = line
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()

      const glow = ctx.createRadialGradient(x, y, 0, x, y, shootingStar.length * 0.18)
      glow.addColorStop(0, `rgba(255,255,255,${alpha * 0.62})`)
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, shootingStar.length * 0.18, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    frameId = requestAnimationFrame(render)
  }

  seedStars()
  frameId = requestAnimationFrame(render)
  window.addEventListener('resize', seedStars)
  cleanupFn = () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', seedStars)
  }
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  cleanupFn?.()
})
</script>

<template>
  <div class="sh">
    <canvas ref="starCanvas" class="sh-bg" />
    <div class="sh-nb sh-nb-1" />
    <div class="sh-nb sh-nb-2" />
    <div class="sh-nb sh-nb-3" />

    <header class="sh-header">
      <a href="/" class="sh-brand">
        <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="bp" x1="9" y1="7" x2="21" y2="23" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#93c5fd"/>
              <stop offset="100%" stop-color="#1d4ed8"/>
            </linearGradient>
            <linearGradient id="br" x1="1" y1="15" x2="29" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.3"/>
              <stop offset="50%" stop-color="#93c5fd"/>
              <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
          <circle cx="15" cy="15" r="7.5" fill="url(#bp)"/>
          <ellipse cx="15" cy="15" rx="14" ry="5" fill="none" stroke="url(#br)" stroke-width="1.8" transform="rotate(-22,15,15)"/>
          <circle cx="15" cy="15" r="2.2" fill="rgba(255,255,255,0.3)"/>
        </svg>
        <span>BookOrbit</span>
      </a>

      <nav class="sh-nav">
        <a href="/what-is-bookorbit" class="sh-nav-link">Docs</a>
        <a href="/installation" class="sh-nav-link">Installation</a>
        <a href="https://github.com/bookorbit/bookorbit" target="_blank" rel="noreferrer" class="sh-nav-link sh-nav-gh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          GitHub
        </a>
      </nav>
    </header>

    <main class="sh-main">
      <div class="sh-text">
        <p class="sh-eyebrow">Self-hosted&ensp;&middot;&ensp;Open source</p>
        <h1 class="sh-h1">
          BookOrbit<br>
          <span class="sh-accent">Your reading space.</span>
        </h1>
        <p class="sh-desc">
          A self-hosted library and reading platform for ebooks, audiobooks, and comics.<br>
          Automate metadata at scale, sync with Kobo, track reading analytics, and support multiple users.
        </p>
        <div class="sh-ctas">
          <a href="https://demo.bookorbit.app/magic?token=2d92cb900e184cf0eb8b11f72cffc6011673d1016e1b300d750eb3d76abc1572" class="sh-btn sh-btn-alt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0"><path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5Z"/></svg>
            Try it live
          </a>
          <a href="/installation" class="sh-btn sh-btn-primary">
            Get started
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        <div class="sh-feats">
          <div class="sh-feat sh-feat-priority">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Self-hosted</span>
              <span class="sh-feat-detail">One Docker container, local files, no subscription or third-party account.</span>
            </div>
          </div>
          <div class="sh-feat sh-feat-priority">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Multi-format readers</span>
              <span class="sh-feat-detail">Built-in readers for ebooks, PDF, comics, and audiobooks.</span>
            </div>
          </div>
          <div class="sh-feat sh-feat-priority">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Multi-user + OIDC/SSO</span>
              <span class="sh-feat-detail">Per-user libraries and permissions with identity-provider login.</span>
            </div>
          </div>
          <div class="sh-feat sh-feat-priority">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Powerful metadata management</span>
              <span class="sh-feat-detail">9 providers, bulk editing, field-level rules, and confidence scoring.</span>
            </div>
          </div>
          <div class="sh-feat">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Kobo + KOReader sync</span>
              <span class="sh-feat-detail">Send books to kobo and koreader with two-way progress sync</span>
            </div>
          </div>
          <div class="sh-feat">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Book Dock</span>
              <span class="sh-feat-detail">Stage book uploads, review metadata, then finalize to a library.</span>
            </div>
          </div>
          <div class="sh-feat">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">OPDS</span>
              <span class="sh-feat-detail">Private OPDS catalog for KOReader, Thorium, Moon+, and similar apps.</span>
            </div>
          </div>
          <div class="sh-feat">
            <span class="sh-feat-dot" />
            <div class="sh-feat-body">
              <span class="sh-feat-name">Reading analytics + Widgets</span>
              <span class="sh-feat-detail">Rich, beautiful charts and widgets for exploring library insights and reading habits.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sh-visual">
        <div class="sh-glow" />
        <div class="sh-tilt-wrap">
          <div class="sh-app-frame">
            <img
              src="/images/home/dashboard-overview.webp"
              alt="BookOrbit dashboard showing reading stats, currently reading shelf, and book collections"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </main>

    <footer class="sh-footer">
      <span>BookOrbit &copy; 2025 - {{ new Date().getFullYear() }}</span>
    </footer>
  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.sh {
  --sh-bg: #06091a;
  --sh-text-main: #e7efff;
  --sh-text-hero: #f3f7ff;
  --sh-text-nav: #b3c2dd;
  --sh-text-nav-strong: #cad8ee;
  --sh-text-body: #8a9fc2;
  --sh-text-body-strong: #d5e2f4;
  --sh-text-body-soft: #7f93ae;
  --sh-text-btn-alt: #a8b9d5;
  --sh-text-footer: #8ea2c2;
  --sh-text-footer-hover: #c8d7ee;
  --sh-accent-blue: #60a5fa;
  --sh-accent-cyan: #22d3ee;
  --sh-accent-green: #34d399;
  --sh-primary: #1d4ed8;
  --sh-primary-hover: #2563eb;
  --sh-dot: #3b82f6;
  --sh-white: #fff;
  --sh-white-05: rgba(255,255,255,0.05);
  --sh-white-055: rgba(255,255,255,0.055);
  --sh-white-065: rgba(255,255,255,0.065);
  --sh-white-07: rgba(255,255,255,0.07);
  --sh-white-08: rgba(255,255,255,0.08);
  --sh-white-09: rgba(255,255,255,0.09);
  --sh-white-10: rgba(255,255,255,0.1);
  --sh-white-12: rgba(255,255,255,0.12);
  --sh-white-20: rgba(255,255,255,0.2);
  --sh-cyan-glow: rgba(34,211,238,0.22);

  position: fixed;
  inset: 0;
  z-index: 99;
  overflow: hidden;
  background: var(--sh-bg);
  color: var(--sh-text-main);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Right-edge gradient fade so the screenshot dissolves into background
   instead of being hard-clipped by overflow:hidden on .sh */
.sh::after {
  content: '';
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 44px;
  width: 140px;
  background: linear-gradient(to right, transparent, var(--sh-bg) 82%);
  pointer-events: none;
  z-index: 8;
}

.sh-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.sh-nb {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}
.sh-nb-1 {
  width: 860px; height: 860px;
  top: -340px; left: -240px;
  background: radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 58%);
}
.sh-nb-2 {
  width: 700px; height: 700px;
  bottom: -220px; right: -180px;
  background: radial-gradient(circle, rgba(29,78,216,0.26) 0%, transparent 58%);
}
.sh-nb-3 {
  width: 480px; height: 480px;
  top: 22%; right: 18%;
  background: radial-gradient(circle, rgba(5,150,105,0.055) 0%, transparent 58%);
}

/* ── Header ── */
.sh-header {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 52px;
  height: 60px;
  border-bottom: 1px solid var(--sh-white-065);
  background: rgba(6,9,26,0.7);
  backdrop-filter: blur(18px);
}
.sh-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: var(--sh-text-main);
  font-size: 15px;
  font-weight: 640;
  letter-spacing: -0.015em;
}
.sh-nav {
  display: flex;
  align-items: center;
  gap: 22px;
}
.sh-nav-link {
  font-size: 13.5px;
  color: var(--sh-text-nav);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color 0.16s;
}
.sh-nav-link:hover { color: var(--sh-text-main); }
.sh-nav-gh {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  background: var(--sh-white-05);
  border: 1px solid var(--sh-white-10);
  border-radius: 8px;
  color: var(--sh-text-nav-strong) !important;
  transition: background 0.16s, color 0.16s !important;
}
.sh-nav-gh:hover {
  background: var(--sh-white-09) !important;
  color: var(--sh-text-main) !important;
}

/* ── Two-column grid ── */
.sh-main {
  flex: 1;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 38% 62%;
  align-items: center;
  padding: 0 0 0 72px;
  overflow: visible;
  min-height: 0;
}

/* ── Left: text ── */
.sh-text {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  padding-right: 24 px;
}
.sh-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sh-accent-blue);
  margin-bottom: 18px;
}
.sh-h1 {
  font-size: clamp(34px, 3.5vw, 56px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: var(--sh-text-hero);
  margin-bottom: 16px;
}
.sh-accent {
  background: linear-gradient(118deg, var(--sh-accent-blue) 0%, var(--sh-accent-cyan) 52%, var(--sh-accent-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px var(--sh-cyan-glow));
}
.sh-desc {
  font-size: 14.5px;
  line-height: 1.68;
  color: var(--sh-text-body);
  margin-bottom: 26px;
}

/* CTAs */
.sh-ctas {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
}
.sh-btn {
  padding: 10px 20px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 560;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.16s;
}
.sh-btn-primary {
  background: var(--sh-primary);
  color: var(--sh-white);
  box-shadow: 0 0 26px rgba(29,78,216,0.42), 0 2px 6px rgba(0,0,0,0.3);
}
.sh-btn-primary:hover {
  background: var(--sh-primary-hover);
  box-shadow: 0 0 40px rgba(37,99,235,0.58), 0 2px 8px rgba(0,0,0,0.3);
  transform: translateY(-1px);
  color: var(--sh-white);
}
.sh-btn-alt {
  background:
    linear-gradient(var(--sh-bg), var(--sh-bg)) padding-box,
    linear-gradient(118deg, var(--sh-accent-blue), var(--sh-accent-cyan)) border-box;
  border: 1px solid transparent;
  color: var(--sh-accent-cyan);
  font-weight: 600;
  box-shadow: 0 0 14px rgba(34,211,238,0.18);
  animation: sh-demo-glow 2.6s ease-in-out infinite;
}
.sh-btn-alt:hover {
  animation: none;
  background:
    linear-gradient(rgba(34,211,238,0.07), rgba(34,211,238,0.07)) padding-box,
    linear-gradient(118deg, var(--sh-accent-blue), var(--sh-accent-cyan)) border-box;
  color: var(--sh-text-main);
  box-shadow: 0 0 26px rgba(34,211,238,0.38);
  transform: translateY(-1px);
}
@keyframes sh-demo-glow {
  0%, 100% { box-shadow: 0 0 12px rgba(34,211,238,0.15); }
  50%       { box-shadow: 0 0 22px rgba(34,211,238,0.32); }
}

/* ── Feature grid with glowing orbit dots ── */
.sh-feats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 20px;
  padding-top: 20px;
  border-top: 1px solid var(--sh-white-07);
}
.sh-feat {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.sh-feat-priority .sh-feat-name {
  color: var(--sh-text-main);
}
.sh-feat-priority .sh-feat-dot {
  box-shadow: 0 0 10px rgba(59,130,246,0.85);
}
.sh-feat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sh-dot);
  box-shadow: 0 0 7px rgba(59,130,246,0.65);
  flex-shrink: 0;
  margin-top: 5px;
}
.sh-feat-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sh-feat-name {
  font-size: 14px;
  font-weight: 620;
  color: var(--sh-text-body-strong);
  line-height: 1.2;
}
.sh-feat-detail {
  font-size: 12.5px;
  color: var(--sh-text-body-soft);
  line-height: 1.3;
}

/* ── Right: screenshot ── */
.sh-visual {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  overflow: visible;
}

.sh-glow {
  position: absolute;
  width: 620px; height: 480px;
  top: 50%; left: 20%;
  transform: translate(-40%, -52%);
  background: radial-gradient(ellipse, rgba(29,78,216,0.22) 0%, transparent 68%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* Screenshot is positioned so its visual right edge lands at the viewport
   edge after perspective projection; .sh::after fades any overflow gracefully */
.sh-tilt-wrap {
  position: relative;
  z-index: 1;
  transform: perspective(1000px) rotateX(10deg) rotateY(-22deg) rotateZ(2deg);
}

.sh-app-frame {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--sh-white-12);
  box-shadow:
    inset 0 1px 0 var(--sh-white-20),
    inset 1px 0 0 var(--sh-white-08),
    0 60px 140px rgba(0,0,0,0.75),
    24px 20px 80px rgba(29,78,216,0.16),
    -18px 10px 60px rgba(20,184,166,0.12);
}
.sh-app-frame img {
  display: block;
  width: 105%;
}

/* ── Footer ── */
.sh-footer {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  height: 44px;
  border-top: 1px solid var(--sh-white-055);
  background: rgba(6,9,26,0.5);
  font-size: 12px;
  color: var(--sh-text-footer);
}
.sh-footer a {
  color: var(--sh-text-footer);
  text-decoration: none;
  transition: color 0.16s;
}
.sh-footer a:hover { color: var(--sh-text-footer-hover); }

/* ── Responsive ── */
@media (max-width: 960px) {
  .sh::after { display: none; }
  .sh-main {
    grid-template-columns: 1fr;
    padding: 32px 24px 0;
    overflow-y: auto;
    overflow-x: hidden;
    align-items: flex-start;
  }
  .sh-nav {
    gap: 14px;
  }
  .sh-nav-link {
    font-size: 12.5px;
  }
  .sh-nav-gh {
    gap: 5px;
    padding: 6px 10px;
  }
  .sh-visual {
    height: 240px;
    margin-top: 32px;
    justify-content: center;
  }
  .sh-tilt-wrap {
    width: 96%;
    margin-left: 0;
    transform: perspective(900px) rotateX(5deg) rotateY(-12deg) rotateZ(1deg);
  }
  .sh-header { padding: 0 24px; }
  .sh-h1 { font-size: clamp(32px, 8vw, 50px); }
  .sh-text { padding-right: 0; }
}

@media (max-width: 640px) {
  .sh-header {
    padding: 0 14px;
  }
  .sh-nav {
    gap: 10px;
  }
  .sh-nav-gh {
    padding: 5px 8px;
    font-size: 0;
  }
}
</style>
