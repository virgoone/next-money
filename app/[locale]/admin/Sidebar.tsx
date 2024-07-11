'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, SearchIcon } from 'lucide-react'

import {
  ArticleIcon,
  DashboardIcon,
  HomeIcon,
  NewCommentIcon,
  SubscriberIcon,
  TiltedSendIcon,
} from '~/assets'
import { CommandDialogSearch } from '~/components/CommandSearch'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import logo from '../apple-icon.png'

export interface MenuType {
  name: string
  href?: string
  icon?: any
  badge?: number
  isDynamic?: boolean
  isActive?: (pathname: string) => boolean
  children?: MenuType[]
}
const variants = {
  open: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
      delayChildren: 0.2,
    },
  },
  closed: {
    y: -10,
    scale: 0.5,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}
export const menus = [
  { name: '仪表盘', href: '/admin', icon: DashboardIcon },
  {
    name: '内容管理',
    icon: ArticleIcon,
    children: [
      // {
      //   name: '分类管理',
      //   href: '/admin/content/category',
      // },
      // {
      //   name: '标签管理',
      //   href: '/admin/content/tags',
      // },
      // {
      //   name: '文章管理',
      //   href: '/admin/content/post',
      // },
      {
        name: '项目列表',
        href: '/admin/content/project',
      },
    ],
  },
  { name: '评论', href: '/admin/comments', icon: NewCommentIcon },
  { name: '订阅', href: '/admin/subscribers', icon: SubscriberIcon },
  { name: 'Newsletters', href: '/admin/newsletters', icon: TiltedSendIcon },
]

export const renderMenu = (menu: MenuType) => {
  const pathname = usePathname()
  const defaultOpenPopover = useMemo(() => {
    return (
      pathname === menu.href ||
      (menu.children &&
        menu.children?.filter((item) => item.href === pathname)?.length > 0) ||
      false
    )
  }, [pathname, menu])
  const isActive = useMemo(() => {
    if (menu.isActive) {
      return menu.isActive(pathname)
    }
    return menu.href === pathname
  }, [menu, pathname])
  const [openPopover, setOpenPopover] = useState<boolean>(defaultOpenPopover)
  return (
    <AnimatePresence key={`ap-${menu.href || menu.name}`}>
      <li>
        <Link
          className={`focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 group relative flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium before:absolute before:inset-px before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset disabled:cursor-not-allowed disabled:opacity-75 dark:focus-visible:outline-none  ${
            isActive
              ? ' text-gray-900 before:bg-gray-100 dark:text-white dark:before:bg-gray-800'
              : 'text-gray-500 hover:text-gray-900 hover:before:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:before:bg-gray-800/50'
          }`}
          href={menu.href || '#'}
          key={`link-${menu.href || menu.name}`}
          onClick={(e) => {
            if (!menu.href) {
              e.preventDefault()
            }
            setOpenPopover(!openPopover)
          }}
        >
          <menu.icon
            className={cn(
              'relative h-5 w-5 flex-shrink-0',
              isActive
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-200',
            )}
          />
          <div className="relative truncate text-sm">{menu.name}</div>
          {menu.children?.length && (
            <div
              className={`text-wedges-gray-400 ml-auto h-6 w-6 flex-shrink-0 transform transition-all ${
                !openPopover ? 'rotate-180' : ''
              }`}
            >
              <ChevronUp className="h-full" />
            </div>
          )}
        </Link>
        {menu.children && (
          <div className={openPopover ? 'block h-auto' : 'hidden h-0'}>
            <div className="relative !min-h-[auto] !min-w-[auto]">
              {renderMenus(menu.children, pathname, openPopover)}
            </div>
          </div>
        )}
      </li>
    </AnimatePresence>
  )
}

const renderMenus = (
  menus: MenuType[],
  activePath?: string,
  open?: boolean,
) => {
  return menus.map((menu, index) => {
    const { name, icon, href, children } = menu
    const isCurrentActive = activePath === href
    return (
      <Link
        key={`menu-link-${menu.href || menu.name}`}
        href={menu.href || '#'}
        onClick={(e) => {
          if (!menu.href) {
            e.preventDefault()
          }
        }}
        className={`focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 group relative flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium before:absolute before:inset-px before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset disabled:cursor-not-allowed disabled:opacity-75 dark:focus-visible:outline-none ${
          isCurrentActive
            ? 'text-gray-900 before:bg-gray-100 dark:text-white dark:before:bg-gray-800'
            : 'text-gray-500 hover:text-gray-900 hover:before:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:before:bg-gray-800/50'
        }`}
      >
        <span
          className={cn(
            'relative mx-[9.5px] h-5 w-px',
            menus.length - 1 === index
              ? ' bg-gray-200 dark:bg-gray-700'
              : ' bg-gray-200 after:absolute after:inset-x-0 after:z-[1] after:h-full after:w-px after:translate-y-full after:transform after:bg-gray-200 dark:bg-gray-700 after:dark:bg-gray-700',
          )}
        >
          <span
            className={cn(
              'absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 transform rounded-full',
              isCurrentActive
                ? 'bg-gray-900 dark:bg-white'
                : 'bg-gray-400 group-hover:bg-gray-700 dark:bg-gray-500 dark:group-hover:bg-gray-200',
            )}
          />
        </span>
        <motion.div
          animate={open ? 'open' : 'closed'}
          variants={variants}
          key={menu.name}
          className={'relative truncate text-sm'}
        >
          {menu.name}
        </motion.div>
      </Link>
    )
  })
}

export function Sidebar() {
  return (
    <div
      className="relative hidden w-full flex-shrink-0 flex-col items-stretch border-b border-gray-200 dark:border-gray-800 lg:flex lg:w-[--width] lg:border-b-0 lg:border-r"
      style={{ '--width': '250px' } as React.CSSProperties}
    >
      <div className="flex h-[--header-height] min-w-0 flex-shrink-0 items-center gap-x-4 border-b !border-transparent border-gray-200 px-4 dark:border-gray-800">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-x-1.5">
          <Link href="/" className="flex min-w-0 flex-1 items-stretch gap-1.5">
            <span className="relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px]">
              <img
                src={
                  'https://avatars.githubusercontent.com/u/23360933?s=200&v=4'
                }
                alt="logo"
                className="h-5 w-5 rounded-full text-[10px]"
              />
            </span>

            <span className="truncate font-semibold text-gray-900 dark:text-white">
              Meme
            </span>
          </Link>
        </div>
      </div>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-grow flex-col gap-y-2 py-2">
          <div className="flex w-full flex-col px-4">
            <CommandDialogSearch>
              <Button
                type="button"
                aria-label="Search"
                className="focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex h-8 flex-shrink-0 items-center gap-x-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-none focus-visible:outline-0 focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-75 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800"
              >
                <SearchIcon className="h-5 w-5 flex-shrink-0" />
                <span className="line-clamp-1 break-all text-left">
                  Search...
                </span>
                <div className="-my-1 ml-auto hidden flex-shrink-0 items-center gap-0.5 lg:flex">
                  <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-gray-100 px-1 font-sans text-[11px] font-medium text-gray-900 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-white dark:ring-gray-700">
                    ⌘
                  </kbd>
                  <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-gray-100 px-1 font-sans text-[11px] font-medium text-gray-900 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-white dark:ring-gray-700">
                    k
                  </kbd>
                </div>
              </Button>
            </CommandDialogSearch>
          </div>
          <nav className="flex flex-1 flex-col gap-y-2 overflow-y-auto px-4">
            <ul className="relative !min-h-[auto] !min-w-[auto]">
              {menus.map((menu) => renderMenu(menu))}
            </ul>
          </nav>
          <div className="flex flex-shrink-0 items-center justify-between gap-x-1.5 px-4">
            <div className="relative inline-flex w-full text-left rtl:text-right">
              <Link
                href="/"
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 dark:text-slate-50 dark:hover:bg-slate-800"
              >
                <HomeIcon className="h-5 w-5" aria-hidden="true" />
                返回前台
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="group absolute inset-y-0 -right-[5px] z-50 hidden h-full w-[9px] cursor-col-resize select-none bg-transparent md:block">
        <div className="absolute inset-x-0 mx-auto h-full w-px transition duration-200 group-hover:bg-gray-300 dark:group-hover:bg-gray-700" />
      </div>
    </div>
  )
}
