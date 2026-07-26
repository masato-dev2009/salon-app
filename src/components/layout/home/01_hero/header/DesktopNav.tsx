'use client'
import Link from 'next/link'
import { Logo } from '../../../../ui/logo'
import { ArrowButton } from '../../../../ui/arrow-button'
import { handleAnchorClick } from './handleAnchorClick'

export function DesktopNav() {
  return (
    <div className='flex items-center'>
      <Logo href='/' />
      <nav className='flex-1'>
        <ul className='font-cormorant flex justify-center text-[20px] font-light tracking-widest'>
          <li className='border-l border-[#00000052] px-6'>
            <a
              href='#concept'
              className='hover:opacity-50'
              onClick={(e) => {
                handleAnchorClick(e, 'concept')
              }}
            >
              Concept
            </a>
          </li>
          <li className='border-x border-[#00000052] px-6'>
            <a
              href='#menu'
              className='hover:opacity-50'
              onClick={(e) => {
                handleAnchorClick(e, 'menu')
              }}
            >
              Menu
            </a>
          </li>
          <li className='px-6'>
            <a
              href='#staff'
              className='hover:opacity-50'
              onClick={(e) => {
                handleAnchorClick(e, 'staff')
              }}
            >
              Stylist
            </a>
          </li>
          <li className='border-x border-[#00000052] px-6'>
            <a
              href='#reservation'
              className='hover:opacity-50'
              onClick={(e) => {
                handleAnchorClick(e, 'reservation')
              }}
            >
              Reservation
            </a>
          </li>
          {/* <li className='border-x border-black px-6'>
            <Link href='/access' className='hover:opacity-50'>
              Access
            </Link>
          </li>
          <li className='border-r border-black px-6'>
            <Link href='/blog' className='hover:opacity-50'>
              Blog
            </Link>
          </li> */}
        </ul>
      </nav>
      <ArrowButton href='/reservation/new/' children='ご予約はこちら' />
    </div>
  )
}
