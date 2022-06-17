import styles from '../styles/Home.module.css'
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import { useEffect } from 'react'



export default function Home() {
  useEffect(() => {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load({ apiKey: 'tQUwQQOuG9TNwqc6F4I2', endpoint: 'https://fp.martinmakarsky.com' })

    // Get the visitor identifier when you need it.
    fpPromise
      .then(fp => fp.get())
      .then(result => console.log(result.visitorId))
  })

  return (
    <div className={styles.container}>
      Hello world
    </div>
  )
}
