"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const navbarLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "About", href: "/about" },
  ]

  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()

  return (
    <div className="fixed top-0 inset-x-0 bg-slate-900 z-50">
      <div className="flex justify-between items-center px-4 md:px-7 max-w-10xl mx-auto">
        <Link href={"/"}>
          <div className="flex gap-2 items-center justify-center my-7">
            <Image src="/assets/mm.png" width={32} height={32} alt="logo" />
            {session ? (
              <p className="text-lg">
                Welcome,{" "}
                <span className="font-semibold text-red-500">
                  {user.username || user.email}
                </span>
              </p>
            ) : (
              <p className="font-semibold text-lg max-md:hidden">
                Maou<span className="text-red-500 font-bold">Messenger</span>
              </p>
            )}
          </div>
        </Link>
        <ul className="flex gap-4 items-center">
          {navbarLinks.map((nblink, index) => (
            <Link href={nblink.href} key={index}>
              <li className="font-light text-base sm:mx-2 text-slate-100 hover:text-slate-300 cursor-pointer">
                {nblink.label}
              </li>
            </Link>
          ))}
          {!session && !pathname.startsWith("/sign-in") && (
            <Link href={"/sign-in"}>
              <li className="bg-slate-100 text-black hover:bg-slate-300 transition-all font-semibold px-4 py-2 rounded-xl">
                Join Now
              </li>
            </Link>
          )}
          {session && (
            <button onClick={() => signOut()}>
              <li className="bg-slate-100 text-black hover:bg-slate-300 transition-all font-semibold px-4 py-2 rounded-xl">
                Logout
              </li>
            </button>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
