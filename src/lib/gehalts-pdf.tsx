import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Svg, Rect, Link } from '@react-pdf/renderer'

// ─── Brand Tokens ───
const C = {
  ink: '#1B3763',
  inkSoft: '#2D4570',
  inkMuted: '#6B7A93',
  sky: '#64B2C9',
  skySoft: '#D3E8EE',
  accent: '#CB344C',
  accentSoft: '#F0C9D0',
  paper: '#F6F8FB',
  white: '#FFFFFF',
  line: '#DFE4EC',
}

// ─── Fonts ───
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw-qXA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjPQ-qXA.ttf', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiqXA.ttf', fontWeight: 600 },
  ],
})

Font.register({
  family: 'Fraunces',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIc6RujDg.ttf', fontWeight: 300 },
    { src: 'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIctxujDg.ttf', fontWeight: 400 },
  ],
})

// ─── Helpers ───
const fmt = (n: number) => n.toLocaleString('de-DE')

// ─── Styles ───
const s = StyleSheet.create({
  page: { padding: 0, fontFamily: 'Inter', fontSize: 10, color: C.ink, backgroundColor: C.white },

  // Header
  header: { backgroundColor: C.ink, paddingHorizontal: 44, paddingTop: 36, paddingBottom: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { fontFamily: 'Fraunces', fontSize: 22, fontWeight: 300, color: C.white, letterSpacing: -0.5 },
  logoAccent: { color: C.sky },
  date: { fontSize: 9, color: 'rgba(255,255,255,0.5)' },
  headerTitle: { fontFamily: 'Fraunces', fontSize: 26, fontWeight: 300, color: C.white, letterSpacing: -0.5 },
  headerName: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 },

  // Content
  content: { paddingHorizontal: 44, paddingTop: 28 },

  // Section title (eyebrow)
  eyebrow: { fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: C.inkMuted, marginBottom: 12 },

  // Eckdaten grid
  eckdatenBox: { backgroundColor: C.paper, borderRadius: 8, padding: 16, marginBottom: 24 },
  eckdatenRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.line, paddingVertical: 7 },
  eckdatenLabel: { width: 180, fontSize: 10, color: C.inkMuted },
  eckdatenValue: { fontSize: 10, fontWeight: 500, color: C.ink },

  // Salary hero
  salaryBox: { backgroundColor: C.ink, borderRadius: 10, padding: 28, marginBottom: 24 },
  salaryAmount: { fontFamily: 'Fraunces', fontSize: 44, fontWeight: 300, color: C.sky, letterSpacing: -1 },
  salarySuffix: { fontSize: 16, color: 'rgba(255,255,255,0.4)' },
  badge: { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 8 },
  badgeText: { fontSize: 10, fontWeight: 500, color: C.white },
  salaryMeta: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.15)', marginTop: 18, paddingTop: 14, gap: 40 },
  salaryMetaLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)' },
  salaryMetaValue: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: 300, color: C.white, marginTop: 2 },

  // Breakdown
  breakdownBox: { marginBottom: 24 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: C.line, paddingVertical: 9 },
  breakdownLabel: { fontSize: 10, fontWeight: 500 },
  breakdownSub: { fontSize: 8.5, color: C.inkMuted, marginTop: 2 },
  breakdownValue: { fontSize: 10, fontFamily: 'Inter', fontWeight: 500, textAlign: 'right' },
  breakdownTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1.5, borderTopColor: C.ink },
  breakdownTotalLabel: { fontSize: 11, fontWeight: 600 },
  breakdownTotalValue: { fontFamily: 'Fraunces', fontSize: 18, fontWeight: 400, color: C.sky },

  // Comparison bars
  compBox: { marginBottom: 28 },
  compRow: { marginBottom: 10 },
  compHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  compLabel: { fontSize: 9, color: C.inkMuted },
  compLabelActive: { fontSize: 9, fontWeight: 600, color: C.sky },
  compValue: { fontSize: 9, fontWeight: 500 },
  compValueActive: { fontSize: 9, fontWeight: 600, color: C.sky },
  compTrack: { height: 10, borderRadius: 5, backgroundColor: C.paper, overflow: 'hidden' },

  // CTA
  cta: { backgroundColor: C.ink, borderRadius: 10, padding: 28, marginTop: 4 },
  ctaTitle: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: 300, color: C.white, letterSpacing: -0.3 },
  ctaText: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.6 },
  ctaButton: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start', marginTop: 14 },
  ctaButtonText: { fontSize: 11, fontWeight: 600, color: C.white },
  ctaContact: { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 14 },

  // Footer
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: C.inkMuted },
})

// ─── Types ───
export interface SalaryPdfData {
  salutation: string
  firstName: string
  lastName: string
  role: string
  hours: number
  experience: number
  nightShifts: number
  weekendShifts: number
  holidayShifts: number
  samaBase: number
  nightBonus: number
  weekendBonus: number
  holidayBonusMonthly: number
  totalSalary: number
  tarifSalary: number
  diff: number
  diffPct: number
  yearly: number
  hourlyRate: number
}

// ─── Component ───
export function SalaryPdf({ data }: { data: SalaryPdfData }) {
  const barMax = Math.max(data.totalSalary, data.tarifSalary)
  const tarifPct = (data.tarifSalary / barMax) * 100
  const dateStr = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.logo}>
              samari<Text style={s.logoAccent}>tano</Text>
            </Text>
            <Text style={s.date}>{dateStr}</Text>
          </View>
          <Text style={s.headerTitle}>Dein persoenliches Gehaltsangebot</Text>
          <Text style={s.headerName}>
            fuer {data.salutation} {data.firstName} {data.lastName}
          </Text>
        </View>

        <View style={s.content}>
          {/* ── Eckdaten ── */}
          <Text style={s.eyebrow}>DEINE ECKDATEN</Text>
          <View style={s.eckdatenBox}>
            {[
              ['Beruf', data.role],
              ['Wochenstunden', `${data.hours}h`],
              ['Berufserfahrung', `${data.experience} Jahre`],
              ['Nachtdienste / Monat', String(data.nightShifts)],
              ['Wochenend-Dienste / Monat', String(data.weekendShifts)],
              ['Feiertags-Dienste / Jahr', String(data.holidayShifts)],
            ].map(([label, value], i) => (
              <View key={i} style={[s.eckdatenRow, i === 5 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={s.eckdatenLabel}>{label}</Text>
                <Text style={s.eckdatenValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* ── Salary Hero ── */}
          <View style={s.salaryBox}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={s.salaryAmount}>{fmt(data.totalSalary)}</Text>
              <Text style={s.salarySuffix}> EUR/Monat</Text>
            </View>
            <View style={s.badge}>
              <Text style={s.badgeText}>+{fmt(data.diff)} EUR (+{data.diffPct}%) ueber Tarif</Text>
            </View>
            <View style={s.salaryMeta}>
              <View>
                <Text style={s.salaryMetaLabel}>Pro Jahr (inkl. 13.)</Text>
                <Text style={s.salaryMetaValue}>{fmt(data.yearly)} EUR</Text>
              </View>
              <View>
                <Text style={s.salaryMetaLabel}>Stundensatz</Text>
                <Text style={s.salaryMetaValue}>{data.hourlyRate} EUR</Text>
              </View>
            </View>
          </View>

          {/* ── Breakdown ── */}
          <Text style={s.eyebrow}>ZUSAMMENSETZUNG</Text>
          <View style={s.breakdownBox}>
            {[
              { label: 'Grundgehalt', sub: '+ ggue. Tarif', value: data.samaBase },
              { label: 'Nachtdienste', sub: `${data.nightShifts} x 45 EUR`, value: data.nightBonus },
              { label: 'Wochenenden', sub: `${data.weekendShifts} x 65 EUR`, value: data.weekendBonus },
              { label: 'Feiertage (anteilig)', sub: `${data.holidayShifts}/Jahr x 120 EUR`, value: data.holidayBonusMonthly },
            ].map((row, i) => (
              <View key={i} style={s.breakdownRow}>
                <View>
                  <Text style={s.breakdownLabel}>{row.label}</Text>
                  <Text style={s.breakdownSub}>{row.sub}</Text>
                </View>
                <Text style={s.breakdownValue}>{fmt(row.value)} EUR</Text>
              </View>
            ))}
            <View style={s.breakdownTotal}>
              <Text style={s.breakdownTotalLabel}>Gesamt brutto / Monat</Text>
              <Text style={s.breakdownTotalValue}>{fmt(data.totalSalary)} EUR</Text>
            </View>
          </View>

          {/* ── Comparison ── */}
          <Text style={s.eyebrow}>VERGLEICH TARIF VS. SAMARITANO</Text>
          <View style={s.compBox}>
            <View style={s.compRow}>
              <View style={s.compHeader}>
                <Text style={s.compLabel}>Tarif (Durchschnitt)</Text>
                <Text style={s.compValue}>{fmt(data.tarifSalary)} EUR</Text>
              </View>
              <View style={s.compTrack}>
                <Svg width={`${tarifPct}%`} height="10">
                  <Rect width="100%" height="10" rx="5" fill={C.inkMuted} />
                </Svg>
              </View>
            </View>
            <View style={s.compRow}>
              <View style={s.compHeader}>
                <Text style={s.compLabelActive}>Samaritano</Text>
                <Text style={s.compValueActive}>{fmt(data.totalSalary)} EUR</Text>
              </View>
              <View style={s.compTrack}>
                <Svg width="100%" height="10">
                  <Rect width="100%" height="10" rx="5" fill={C.sky} />
                </Svg>
              </View>
            </View>
          </View>

          {/* ── CTA ── */}
          <View style={s.cta}>
            <Text style={s.ctaTitle}>Interesse? Lass uns reden.</Text>
            <Text style={s.ctaText}>
              Dieses Angebot ist individuell auf deine Qualifikation zugeschnitten.{'\n'}
              Alexander Esau meldet sich persoenlich bei dir — oder ruf einfach an.
            </Text>
            <Link src="https://samaritano-web.vercel.app/jobs">
              <View style={s.ctaButton}>
                <Text style={s.ctaButtonText}>Passende Stellen ansehen</Text>
              </View>
            </Link>
            <Text style={s.ctaContact}>
              Telefon: +49 (0) 571 7846640 · E-Mail: a.esau@samaritano.de
            </Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text>Unverbindliche Schaetzung auf Basis von Durchschnittswerten 2026</Text>
          <Text>samaritano GmbH · Von Oeynhausen Str. 34 · 32479 Hille</Text>
        </View>
      </Page>
    </Document>
  )
}
