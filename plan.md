# IronySports – ProjeBilgiler.md
> Amaç: Tek editörün kullanacağı, SEO odaklı, modern/dinamik görünümlü spor haber + blog sitesi.  
> Kod üretimi: Codex “vibecoding” ile bu dosyayı okuyup projeyi uçtan uca inşa edecek.

---

## 1) Ürün Tanımı
**IronySports**, Türkiye odaklı spor haberleri ve yorum içerikleri yayınlayan bir site olacak.  
İçerik tipi ağırlıkla: Haber, Blog/Yorum, Maç Analizi, Transfer, Liste/Derleme, Rehber (evergreen).

**Hedefler**
- Hızlı açılan (Core Web Vitals iyi), mobil öncelikli.
- Google News uyumlu yayın altyapısı (haber şablonları, yapılandırılmış veri, RSS, sitemap).
- Tek editör için basit ama güçlü bir yönetim paneli.
- Otomatik SEO temel işleri + editörün kontrol edebileceği SEO alanları.

**Dil / Bölge**
- Dil: Türkçe (TR)
- Zaman dilimi: Europe/Istanbul

---

## 2) Teknik Yaklaşım (Önerilen)
### Seçenek A (Önerilen): Next.js + Headless CMS (Payload)
- **Frontend:** Next.js (App Router) + TypeScript
- **CMS:** Payload CMS (Node tabanlı, güçlü admin, RBAC, content modeling rahat)
- **DB:** PostgreSQL
- **Cache/Rate limit:** Upstash Redis (opsiyonel)
- **Arama:** PostgreSQL Full Text Search (MVP) → ileride Meilisearch
- **Deploy:** Vercel (frontend) + Render/Fly.io (CMS+DB) veya tek yerde Railway

**Neden?**
- Performans + SEO kontrolü çok iyi.
- Modern tasarım ve dinamik sayfalar kolay.
- Tek editör için admin arayüzü hazır.

### Seçenek B: Next.js + Strapi
- Benzer kurgu, Strapi’nin ekosistemi geniş.

> Codex, Seçenek A’yı baz alarak inşa etsin. (Payload)

---

## 3) Bilgi Mimarisi (IA)
### Ana Navigasyon
- Haberler
- Transfer
- Süper Lig
- Avrupa
- Basketbol
- Diğer Sporlar
- Analiz
- Videolar (opsiyonel / MVP’de sadece embed)
- Hakkımızda
- İletişim

### Taksonomi
- **Kategori**: Futbol, Basketbol, Voleybol, Motor Sporları, Tenis vb.
- **Lig/Turnuva**: Süper Lig, Premier League, UCL, EuroLeague vb.
- **Takım**: Galatasaray, Fenerbahçe… (opsiyonel ama SEO için değerli)
- **Etiket**: serbest
- **Yazar**: Tek editör (admin) ama model yine de “author” olarak tasarlansın.

---

## 4) İçerik Tipleri ve Alanlar (CMS Modelleri)

### 4.1 Post (Haber/Blog ortak modeli)
**Zorunlu alanlar**
- `title` (string)
- `slug` (unique, otomatik üret + manuel override)
- `type` (enum: `news`, `opinion`, `analysis`, `transfer`, `guide`, `list`)
- `status` (draft, scheduled, published, archived)
- `publishedAt` (date)
- `updatedAt` (date, otomatik)
- `category` (relation)
- `tags` (array)
- `heroImage` (upload)
- `excerpt` (160-220 karakter öner)
- `content` (rich text / mdx benzeri; başlık hiyerarşisini korusun)

**SEO alanları**
- `seoTitle` (60 karakter hedef)
- `metaDescription` (150-160 hedef)
- `canonicalUrl` (opsiyonel)
- `indexing` (enum: index/follow, noindex/follow, index/nofollow, noindex/nofollow)
- `ogImage` (opsiyonel; yoksa heroImage)
- `keywords` (opsiyonel; aşırı odak yok, sadece gerektiğinde)

**Haber spesifik**
- `newsSource` (opsiyonel)
- `breaking` (boolean)
- `matchInfo` (opsiyonel group: takımA, takımB, skor, tarih)

**İç linkleme**
- `relatedPosts` (manual relation)
- Otomatik öneri: aynı kategori/etiket bazlı

### 4.2 Category
- `name`
- `slug`
- `description` (opsiyonel)
- `seoTitle` / `metaDescription` (opsiyonel)

### 4.3 Tag
- `name`
- `slug`

### 4.4 Static Pages
- Hakkımızda, İletişim, KVKK, Çerez Politikası

---

## 5) URL Yapısı (SEO Standardı)
- Ana sayfa: `/`
- Kategori: `/kategori/[slug]`
- Etiket: `/etiket/[slug]`
- Haber/Blog: `/<type>/[slug]`  
  Örnek: `/news/galatasaray-transfer-son-durum`  
  Örnek: `/analysis/derbi-analizi`
- Arama: `/arama?q=...`
- Yazar sayfası (tek editör de olsa): `/yazar/[slug]`

**301/redirect stratejisi**
- Slug değişirse eski slug otomatik 301’e düşsün (CMS `slugHistory` tut).

---

## 6) SEO Gereksinimleri (Codex bunu tam uygulasın)

### 6.1 Temel Teknik SEO
- SSR/SSG: İçerik sayfaları **SSG + ISR** (revalidate) veya SSR (haber hızlı güncelleniyorsa ISR iyi).
- `robots.txt` dinamik ve doğru
- `sitemap.xml`:
  - posts sitemap (page size 5k)
  - categories sitemap
  - tags sitemap
  - pages sitemap
- `RSS`:
  - `/feed.xml` (son 50 içerik)
  - `/news.xml` (Google News için ayrı feed opsiyonel)

### 6.2 Yapılandırılmış Veri (JSON-LD)
- Post type’a göre:
  - **News**: `NewsArticle`
  - **Blog/Opinion/Analysis**: `Article` veya `BlogPosting`
- Alanlar:
  - headline, description, image, datePublished, dateModified
  - author (Organization + Person)
  - publisher (Organization + logo)
- Breadcrumb schema (kategori > içerik)

### 6.3 Meta / OG
- Her sayfada:
  - title, meta description
  - canonical
  - OG: title, description, image, type=article
  - Twitter Card: summary_large_image

### 6.4 İçerik SEO yardımcıları (Editör UX)
Admin panelde editöre:
- SEO skor göstergesi (basit):
  - title uzunluğu
  - description uzunluğu
  - en az 1 H2
  - görsel alt text
  - internal link önerisi
- Otomatik slug üretimi (Türkçe karakter dönüştürme)
- Hero image için alt text alanı (media metadata)

---

## 7) Performans ve Modern UI
### UI/UX
- Modern, editorial/newsroom görünüm:
  - Üstte “trend” şeridi (opsiyonel)
  - Hero alan: 1 büyük haber + 4 küçük kart
  - Kategorilere göre bloklar (Futbol, Basketbol…)
  - Sidebar: Son dakika / Popüler / Etiketler
  - İçerik sayfasında: okuma süresi, paylaş butonları, yapışkan TOC (uzun yazılarda)

### Tasarım sistemi
- TailwindCSS
- Tipografi: okunabilir, geniş satır aralığı
- Dark mode (opsiyonel, MVP’de var ama basit)
- Görsel optimizasyon: Next/Image, responsive sizes

### Performans
- Lazy load: görseller, embed’ler
- Font optimizasyon (next/font)
- Görsel CDN
- Lighthouse hedefleri:
  - LCP < 2.5s
  - CLS < 0.1
  - INP iyi seviyede

---

## 8) Özellikler (MVP + Sonrası)

### MVP (mutlaka)
- Admin login (tek editör)
- Post CRUD (draft/schedule/publish)
- Kategori/Etiket yönetimi
- Ana sayfa + kategori sayfaları + içerik sayfası
- Arama (basit)
- Sitemap + robots + RSS
- SEO meta/OG + JSON-LD
- “Popüler” listesi (basit: son 7 gün görüntülenme)
- Görsel yükleme + alt text
- İletişim formu (spam korumalı)

### Sonrası (nice-to-have)
- Çoklu yazar
- Newsletter (Mailchimp/Resend)
- Push notification
- Meilisearch ile gelişmiş arama
- “Canlı skor” widget (API gerektirir)
- Otomatik sosyal medya kart üretimi
- AMP (genelde şart değil; önce performans)

---

## 9) Yönetim Paneli (Admin) Detayları
- Dashboard:
  - Taslaklar
  - Zamanlanmış içerikler
  - Son yayınlananlar
  - Son 7 gün popülerleri
- Edit ekranı:
  - İçerik editörü (heading hiyerarşisi zorlanmalı)
  - SEO alanları ayrı tab
  - Önizleme (draft preview URL)
- Medya kütüphanesi:
  - Dosya adı düzenleme
  - Alt text, caption, credit

---

## 10) Güvenlik
- Admin URL gizleme: `/admin` ama opsiyonel olarak özel path
- Rate limiting (login + arama endpoint)
- CSRF koruması
- Upload boyut limitleri
- XSS sanitization (rich text)
- Env secrets yönetimi
- Basic audit log (post publish/update kim yaptı → tek editör de olsa log tut)

---

## 11) İzleme / Analitik
- Analytics: Plausible / GA4 (opsiyon)
- Search Console doğrulama meta
- Loglama: Sentry (opsiyon)
- Basit view counter:
  - Sayfa görüntülenmeleri DB’de günlük aggregate (performans için)
  - Bot filtreleme (User-Agent basit)

---

## 12) Reklam / Gelir (MVP’de altyapı hazır, kapalı)
- Reklam slot bileşenleri:
  - Header banner
  - Sidebar rectangle
  - In-article slot (paragraf arası)
- Şimdilik “placeholder” + ileride AdSense eklenebilir.
- Core Web Vitals bozulmayacak şekilde lazy script yükleme.

---

## 13) İçerik Kuralları (Editoryal)
- Başlık:
  - kısa, net, ana anahtar kelime başta
- Excerpt:
  - 1-2 cümle, merak uyandıran ama clickbait değil
- İçerik:
  - İlk 100 kelimede konu + anahtar kelime doğal
  - H2/H3 ile bölümleme
  - En az 1 iç link, 1 dış kaynak link (gerekli olursa)
- Görsel:
  - 1200x630 uyumlu (OG için)
  - Alt text anlamlı

---

## 14) Proje Yapısı (Repo ve Klasörler)
Monorepo önerisi:
- `/apps/web` → Next.js
- `/apps/cms` → Payload
- `/packages/ui` → ortak UI bileşenleri (opsiyonel)

Basit kurulum alternatifi:
- Tek repo içinde `/web` ve `/cms`

---

## 15) Codex’e Net Görev Talimatı (Uygulama Planı)
Codex aşağıdaki adımları uygulasın:

1) **Bootstrap**
- Next.js (TS) + Tailwind kur
- Payload CMS kur ve Postgres bağlantısını hazırla
- Env dosyaları şablonu oluştur (`.env.example`)

2) **CMS Modeling**
- Post, Category, Tag, Page koleksiyonlarını oluştur
- Slug, status, scheduling, seo alanlarını ekle
- “slugHistory” ile 301 yönlendirme datasını tut

3) **Frontend Pages**
- Home page: hero + category blocks + latest + popular
- Listing pages: kategori, etiket, type
- Post page: article layout + JSON-LD + breadcrumbs + related posts
- Search page
- Static pages (Hakkımızda, İletişim, KVKK/Çerez placeholder)

4) **SEO Infra**
- `robots.txt`, `sitemap.xml`, RSS feed
- Metadata (title/desc/canonical/og/twitter)
- JSON-LD schema
- OpenGraph görsel fallback mantığı

5) **Performance**
- Next/Image kullan
- Lazy embed
- ISR cache stratejisi

6) **Admin UX**
- Dashboard view (Payload admin custom view opsiyonel; değilse basic)
- Draft preview linkleri

7) **Deploy Hazırlığı**
- Vercel config (web)
- CMS deploy notları (Render/Railway)
- Migration/seed komutları
- README: local run adımları

---

## 16) Geliştirme Komutları (beklenen)
- `pnpm install`
- `pnpm dev` → web + cms birlikte
- `pnpm build`
- `pnpm lint`

---

## 17) Kabul Kriterleri (Definition of Done)
- Admin’den içerik girip yayınlayınca frontend’de anında görünür.
- Her içerikte:
  - doğru meta tag’ler
  - OG image çalışır
  - JSON-LD doğrulanabilir
- sitemap ve robots erişilebilir.
- RSS düzgün XML üretir.
- Mobilde okunabilirlik yüksek, sayfa hızlı açılır.
- Kategori ve etiket sayfaları indekslenebilir.
- 404 ve 500 sayfaları düzgün.
- Slug değişince 301 çalışır.

---

## 18) MVP İçin Örnek İçerik Seed
Seed datada en az:
- 5 kategori (Futbol, Basketbol, Transfer, Analiz, Avrupa)
- 10 etiket (derbi, şampiyonluk, sakatlık, istatistik, taktik…)
- 12 post (type karışık)

---

## 19) Notlar / Kısıtlar
- Tek editör var: RBAC minimum (admin).
- API key veya harici spor verisi MVP’de yok (haber odak).
- Önce SEO + hız + editör deneyimi; “canlı skor/fixture” sonra.

---

## 20) Marka ve Ton
- Site adı: **IronySports**
- Ton: Hafif alaycı/zeki ama “cringe” ironiden kaçınan başlıklar ve metin dili.
- Tasarım: Modern, temiz, newsroom hissi; aşırı renk ve karmaşa yok.

---
Bitti.