import Link from 'next/link'
import { Container } from './Container'

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold italic tracking-tighter text-white">
                            Irony<span className="text-blue-500">Sports</span>
                        </span>
                        <p className="mt-4 text-sm leading-relaxed max-w-md">
                            Sporun en ciddi anlarına hafif tebessümle yaklaşan, Türkiye'nin yeni nesil spor haberciliği ve analiz platformu.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Kategoriler</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/category/futbol" className="hover:text-white transition-colors">Futbol</Link></li>
                            <li><Link href="/category/basketbol" className="hover:text-white transition-colors">Basketbol</Link></li>
                            <li><Link href="/category/transfer" className="hover:text-white transition-colors">Transfer</Link></li>
                            <li><Link href="/category/analiz" className="hover:text-white transition-colors">Analiz</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} IronySports. Tüm hakları saklıdır.
                </div>
            </Container>
        </footer>
    )
}
