import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

type Props = { reducedMotion?: boolean }

const ORB_COUNT = { bg: 6, mid: 5, fg: 4 }

function makeOrbs(layer: 'bg' | 'mid' | 'fg') {
  const count = ORB_COUNT[layer]
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={`${layer}-${i}`}
      className={`parallax-orb parallax-orb--${layer} parallax-orb--${i}`}
      data-depth={layer === 'bg' ? 0.06 : layer === 'mid' ? 0.12 : 0.22}
    />
  ))
}

export default function ParallaxLights({ reducedMotion }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (reducedMotion) return

    const orbs = Array.from(el.querySelectorAll<HTMLDivElement>('.parallax-orb'))

    // gentle floating animations for each orb
    orbs.forEach((orb) => {
      const depth = Number(orb.dataset.depth) || 0.12
      const dur = 8 + Math.random() * 6
      const x = (Math.random() - 0.5) * 60 * depth
      const y = (Math.random() - 0.5) * 40 * depth
      gsap.to(orb, {
        x: `+=${x}`,
        y: `+=${y}`,
        duration: dur,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      })
    })

    // pointer-driven parallax
    const handle = (ev: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (ev.clientX - cx) / rect.width
      const dy = (ev.clientY - cy) / rect.height

      const layers = Array.from(el.querySelectorAll<HTMLElement>('.parallax-orb'))
      layers.forEach((layerEl) => {
        const depth = Number(layerEl.dataset.depth) || 0.1
        gsap.to(layerEl, {
          x: (dx * 40) * depth,
          y: (dy * 30) * depth,
          duration: 0.9,
          ease: 'power3.out',
        })
      })
    }

    window.addEventListener('mousemove', handle)
    return () => {
      window.removeEventListener('mousemove', handle)
      gsap.killTweensOf(orbs)
    }
  }, [reducedMotion])

  return (
    <div ref={rootRef} className="parallax-lights" aria-hidden>
      <div className="parallax-layer parallax-layer--bg">{makeOrbs('bg')}</div>
      <div className="parallax-layer parallax-layer--mid">{makeOrbs('mid')}</div>
      <div className="parallax-layer parallax-layer--fg">{makeOrbs('fg')}</div>
    </div>
  )
}
