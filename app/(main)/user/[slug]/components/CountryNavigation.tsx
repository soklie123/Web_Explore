'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLists = [
  { name: 'Overview', path: 'overview' },
  { name: 'Laws', path: 'law' },
  { name: 'Attractions', path: 'attract' },
  { name: 'Things to Do', path: 'thing' },
  { name: 'Tips', path: 'tip' },
]

type Props = {
  slug: string
}

export default function CountryNavigation({ slug }: Props) {
  const pathname = usePathname()

  if (!slug) return null

  return (
    <nav className="border-b border-gray-200">
      <ul className="flex gap-8 px-6">
        {navLists.map(item => {
          const href = `/user/${slug}/${item.path}`
          const isActive = pathname === href

          return (
            <li key={item.name}>
              <Link
                href={href}
                className={`
                  relative py-4 text-sm font-medium transition-colors
                  ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}
                `}
              >
                {item.name}

                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 rounded-full" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
