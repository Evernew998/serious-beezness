import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import TravellingBee from './components/TravellingBee/TravellingBee'

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <TravellingBee />
      <header className='flex justify-center items-center fixed top-0 px-10 w-full transition-all duration-300'>
        <nav className='flex justify-between  items-center py-4 w-full max-w-7xl font-medium'>
          <a href='/'>
            <span className='sr-only'>Go to home page.</span>
          </a>
          <div className='hidden md:flex justify-center items-center gap-10 '>
            <a href='#honey-section' className='text-text-link hover:text-brown-900'>
              Honey
            </a>
            <a href='#bees-section' className='text-text-link hover:text-brown-900'>
              Bees
            </a>
            <a href='#faqs-section' className='text-text-link hover:text-brown-900'>
              FAQs
            </a>
          </div>
          <a
            href='#purchase-section'
            className='hidden md:block bg-button-primary-bg hover:bg-button-primary-bg-hover text-brown-900 px-6 py-3 rounded-full transition'
          >
            Buy some honey
          </a>
        </nav>
      </header>
      <main>
        <div className='flex flex-col gap-45'>
          <section className='flex flex-col justify-center items-center h-dvh text-center'>
            <span>LIQUID GOLD</span>
            <h1 className='text-5xl font-bold underline'>Serious Beezness</h1>
            <p>Our bees are as professional as they come.</p>
          </section>
          <section id='honey-section' className='flex flex-col justify-center items-center h-dvh text-center'>
            <h2 className='text-2xl font-bold underline'>Our Delicious Honey</h2>
          </section>
          <section id='bees-section' className='flex flex-col justify-center items-center h-dvh text-center'>
            <h2 className='text-2xl font-bold underline'>Meet the Queen Bees</h2>
            <p>At Serious Beezness, we believe in diversity and inclusivity.</p>
          </section>
          <section id='faqs-section' className='flex flex-col justify-center items-center h-dvh text-center'>
            <h2 className='text-2xl font-bold underline'>FaQs</h2>
          </section>
        </div>
      </main>
      <footer></footer>
    </>
  )
}

export default App
