'use client'
import dynamic from 'next/dynamic'

// Dynamically import the children with SSR disabled
const NoSSR = ({ children }) => <>{children}</>

export default dynamic(() => Promise.resolve(NoSSR), { ssr: false })
