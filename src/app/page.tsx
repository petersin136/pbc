"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Camera,
  CirclePlay,
  Hand,
  Play,
  Users,
} from "lucide-react";
import {
  HOME_CITY_IMAGE_URL,
  HOME_HERO_IMAGE_URL,
  HOME_LOGO_URL,
  HOME_MESSAGE_TABS,
  HOME_QUICK_LINKS,
  HOME_SERVICE_TIMES,
  type QuickLinkDef,
} from "./home-page-config";

const sectionReveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const heroStagger = { duration: 0.8, ease: "easeOut" as const };

function QuickLinkIcon({ def }: { def: QuickLinkDef }) {
  const className = "h-7 w-7 shrink-0 text-[var(--accent)]";
  switch (def.icon) {
    case "building2":
      return <Building2 className={className} aria-hidden />;
    case "bookOpen":
      return <BookOpen className={className} aria-hidden />;
    case "users":
      return <Users className={className} aria-hidden />;
    case "hand":
      return <Hand className={className} aria-hidden />;
    default:
      return null;
  }
}

export default function HomePage() {
  const [messageTab, setMessageTab] = useState<string>(HOME_MESSAGE_TABS[0]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* 1. Hero */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HOME_HERO_IMAGE_URL}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col justify-end p-[7vw] pb-24 md:pb-28">
          <motion.p
            className="font-medium uppercase tracking-[0.3em] text-white/70"
            style={{ fontSize: 12 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroStagger, delay: 0 }}
          >
            PBC · POCHEON CENTRAL BAPTIST CHURCH
          </motion.p>
          <motion.h1
            className="mt-4 font-extrabold tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroStagger, delay: 0.15 }}
          >
            포천중앙침례교회
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl font-normal text-white/85"
            style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroStagger, delay: 0.3 }}
          >
            사랑으로 모이고, 말씀으로 세워지는 공동체
          </motion.p>
        </div>

        <div className="absolute bottom-10 right-[7vw] z-10 flex flex-col items-center gap-3 text-white/70">
          <div
            className="home-scroll-line h-[60px] w-px bg-white/50"
            aria-hidden
          />
          <span className="text-[12px] font-medium uppercase tracking-[0.2em]">SCROLL</span>
        </div>
      </section>

      {/* 2. Quick Links */}
      <motion.section className="py-32" style={{ background: "var(--bg)" }} {...sectionReveal}>
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">EXPLORE</p>
          <h2 className="mt-2 text-[32px] font-bold leading-tight">교회를 만나는 길</h2>

          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {HOME_QUICK_LINKS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              >
                <div>
                  <QuickLinkIcon def={card} />
                  <h3 className="mt-6 text-[18px] font-bold">{card.title}</h3>
                  <p className="mt-2 text-[14px] text-[var(--ink-muted)]">{card.description}</p>
                </div>
                <div className="flex justify-end">
                  <ArrowUpRight className="h-4 w-4 text-[var(--accent)] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. Full-bleed city */}
      <motion.section
        className="relative min-h-[560px] h-[80vh] w-full overflow-hidden"
        {...sectionReveal}
      >
        <Image
          src={HOME_CITY_IMAGE_URL}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
          aria-hidden
        />
        <motion.div
          className="absolute bottom-0 left-0 z-10 flex max-w-xl flex-col p-[7vw] pb-16 text-white"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-white/70">OUR PLACE</p>
          <h2 className="mt-3 font-bold leading-tight" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            포천에 뿌리내린 교회
          </h2>
          <p className="mt-4 max-w-xl font-normal text-white/80" style={{ fontSize: "clamp(16px, 1.5vw, 20px)" }}>
            지역과 함께 걸어온 시간, 그리고 앞으로의 여정
          </p>
        </motion.div>
      </motion.section>

      {/* 4. Message + Services */}
      <motion.section className="py-32" style={{ background: "var(--bg)" }} {...sectionReveal}>
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">TODAY</p>
          <h2 className="mt-2 text-[32px] font-bold leading-tight">이번 주, 함께하는 시간</h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* 말씀 영상 */}
            <div className="flex min-h-[420px] flex-col rounded-3xl border border-[var(--line)] bg-[var(--bg-elevated)] p-10">
              <div>
                <h3 className="text-2xl font-bold">말씀 영상</h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                  MESSAGE
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 border-b border-[var(--line)] pb-2">
                {HOME_MESSAGE_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMessageTab(tab)}
                    className={`relative pb-2 text-[14px] font-medium transition-colors duration-200 ${
                      messageTab === tab ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"
                    }`}
                  >
                    {tab}
                    {messageTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-90" strokeWidth={1.25} aria-hidden />
                </div>
              </div>
              <div className="mt-6 flex flex-1 flex-col justify-end">
                <p className="text-base font-medium">이번 주 설교 제목</p>
                <p className="mt-1 text-[14px] text-[var(--ink-muted)]">2026.05.10 · 김OO 목사</p>
                <div className="mt-6 text-right">
                  <Link
                    href="/word/sermons"
                    className="text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-80"
                  >
                    전체보기 →
                  </Link>
                </div>
              </div>
            </div>

            {/* 예배 안내 */}
            <div className="flex min-h-[420px] flex-col rounded-3xl border border-[var(--line)] bg-[var(--bg-elevated)] p-10">
              <div>
                <h3 className="text-2xl font-bold">예배 안내</h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                  SERVICES
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {HOME_SERVICE_TIMES.map((row) => (
                  <div key={row.label}>
                    <p className="text-[14px] text-[var(--ink-muted)]">{row.label}</p>
                    <p className="mt-2 text-[26px] font-bold text-[var(--accent)]">{row.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-10 text-right">
                <Link
                  href="/about/location"
                  className="text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-80"
                >
                  예배 안내 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Footer */}
      <footer className="bg-[var(--accent)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]">ABOUT</p>
              <div className="relative mt-4 h-12 w-12">
                <Image src={HOME_LOGO_URL} alt="포천중앙침례교회" fill className="object-contain" sizes="48px" />
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-white/70">
                사랑으로 모이고, 말씀으로 세워지는 공동체
              </p>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]">LINKS</p>
              <ul className="mt-4 space-y-2 text-[14px] text-white/70">
                <li>
                  <Link href="/about" className="transition-colors hover:text-white">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/education/sunday-school" className="transition-colors hover:text-white">
                    부서
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="transition-colors hover:text-white">
                    갤러리
                  </Link>
                </li>
                <li>
                  <Link href="/news/notices" className="transition-colors hover:text-white">
                    공지
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]">CONTACT</p>
              <ul className="mt-4 space-y-3 text-[14px] text-white/70">
                <li>경기도 포천시 중앙로 105번길 23-2 (신읍동 135-10)</li>
                <li>
                  <a href="tel:031-534-5078" className="transition-colors hover:text-white">
                    031-534-5078
                  </a>
                  <span className="mx-1 text-white/40">·</span>
                  <a href="tel:031-535-0571" className="transition-colors hover:text-white">
                    031-535-0571
                  </a>
                </li>
                <li className="text-white/50">이메일은 전화로 문의해 주세요.</li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]">SNS</p>
              <div className="mt-4 flex gap-4">
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 p-3 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="YouTube"
                >
                  <CirclePlay className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 p-3 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Instagram"
                >
                  <Camera className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <p className="text-center text-[12px] text-white/50">© 2026 포천중앙침례교회. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
