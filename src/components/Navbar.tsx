"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { useState } from 'react'
import { clsx } from 'clsx'
import { Menu, X, Search } from 'lucide-react'

export function Navbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: "/category/super-lig", label: "Süper Lig" },
        { href: "/category/transfer", label: "Transfer" },
        { href: "/category/futbol", label: "Futbol" },
        { href: "/category/basketbol", label: "Basketbol" },
        { href: "/category/voleybol", label: "Voleybol" },
        { href: "/category/analiz", label: "Analiz" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full bg-[#E30613] text-white shadow-md">
            <Container className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-1 text-white hover:bg-white/10 rounded"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link href="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-white group-hover:opacity-90 transition-opacity">
                            Irony<span className="text-white/80">Sports</span>
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-1 lg:space-x-6 text-sm font-bold uppercase tracking-wide">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "py-2 transition-colors border-b-2 border-transparent",
                                pathname === link.href ? "text-white border-white" : "text-white/80 hover:text-white hover:border-white/50"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="h-6 w-px bg-white/20 mx-2"></div>

                    <Link href="/search" className="hover:text-white/80 transition-colors p-2">
                        <Search size={22} strokeWidth={2.5} />
                    </Link>
                </nav>

                {/* Mobile Search Icon (visible on mobile only) */}
                <Link href="/search" className="md:hidden hover:text-white/80 transition-colors p-2">
                    <Search size={22} strokeWidth={2.5} />
                </Link>
            </Container>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#c40510] border-t border-white/10">
                    <Container className="py-4 flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "block py-3 px-4 rounded font-bold uppercase text-sm",
                                    pathname === link.href ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 text-white"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Container>
                </div>
            )}
        </header>
    )
}
