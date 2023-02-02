import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import ParaderoForm from '@/components/ParaderoForm'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <ParaderoForm/>
    </main>
  )
}
