import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lottie from 'lottie-web/build/player/lottie_light'
import { BEE_SIZE, SHADOW_SIZE } from './beeFlight'
import { getFlightPath, positionBee } from './beeFlight'

export default function TravellingBee() {
  const beeRef = useRef<HTMLDivElement | null>(null)
  const shadowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!beeRef.current) return
    if (!shadowRef.current) return

    const beeAnim = Lottie.loadAnimation({
      container: beeRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/bee-lounging.json',
    })

    const shadowAnim = Lottie.loadAnimation({
      container: shadowRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/bee-lounging.json',
    })

    return () => {
      beeAnim.destroy()
      shadowAnim.destroy()
    }
  }, [])

  useGSAP(() => {
    if (!beeRef.current || !shadowRef.current) return

    const elements = { bee: beeRef.current, shadow: shadowRef.current }
    let path = getFlightPath()

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onRefresh: () => {
        path = getFlightPath()
      }, // re-measure after a resize
      onUpdate: (self) => positionBee(path, elements, self.progress),
    })

    positionBee(path, elements, 0)
  })

  return (
    <div aria-hidden='true' className='fixed top-0 left-0 w-full h-svh pointer-events-none z-50'>
      <div
        className='absolute top-0 left-0]'
        ref={beeRef}
        style={{ width: `${BEE_SIZE}px`, height: `${BEE_SIZE}px` }}
      />
      <div
        className='absolute top-0 left-0 brightness-0 blur-[2px]'
        style={{ width: `${SHADOW_SIZE}px`, height: `${SHADOW_SIZE}px` }}
        ref={shadowRef}
      />
    </div>
  )
}
