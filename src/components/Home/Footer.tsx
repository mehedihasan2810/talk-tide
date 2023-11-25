import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 flex w-full flex-wrap items-center justify-center gap-4 border-t border-t-primary/20 p-4 text-primary/50 sm:gap-6">
    <Link className="hover:text-primary" href="#">
      Privacy Policy
    </Link>
    <Link className="hover:text-primary" href="#">
      Terms
    </Link>
    <Link className="hover:text-primary" href="#">
      Cookies Policy
    </Link>
    <Link className="hover:text-primary" href="#">
      {" "}
      © Talk Tide 2023
    </Link>
  </footer>
  )
}

export default Footer