import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 11, color: '#1a1a2e' },
  header: { backgroundColor: '#1a1a2e', padding: 28, borderRadius: 8, marginBottom: 28 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  greeting: { fontSize: 13, marginBottom: 20, lineHeight: 1.6 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' as const, letterSpacing: 1, color: '#888', marginBottom: 10, marginTop: 24 },
  bigNumber: { fontSize: 36, fontWeight: 'bold', color: '#1a1a2e' },
  bigSuffix: { fontSize: 14, color: '#888' },
  badge: { backgroundColor: '#22c55e', color: '#fff', fontSize: 10, padding: '4 10', borderRadius: 10, alignSelf: 'flex-start' as const, marginTop: 6 },
  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
  rowLabel: { fontSize: 11 },
  rowSub: { fontSize: 9, color: '#888', marginTop: 2 },
  rowValue: { fontSize: 11, fontFamily: 'Courier' },
  totalRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 12, fontWeight: 'bold' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' },
  comparison: { flexDirection: 'row' as const, gap: 20, marginTop: 16 },
  compBox: { flex: 1, padding: 14, borderRadius: 6, backgroundColor: '#f8f8fa' },
  compLabel: { fontSize: 9, color: '#888' },
  compValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  cta: { backgroundColor: '#1a1a2e', padding: 24, borderRadius: 8, marginTop: 32 },
  ctaTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  ctaText: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 6, lineHeight: 1.5 },
  ctaUrl: { fontSize: 11, color: '#0ea5e9', marginTop: 8 },
  footer: { position: 'absolute' as const, bottom: 30, left: 48, right: 48, fontSize: 8, color: '#aaa', textAlign: 'center' as const },
})

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

export function SalaryPdf({ data }: { data: SalaryPdfData }) {
  const fmt = (n: number) => n.toLocaleString('de-DE')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dein persoenliches Gehaltsangebot</Text>
          <Text style={styles.headerSub}>samaritano GmbH · {new Date().toLocaleDateString('de-DE')}</Text>
        </View>

        <Text style={styles.greeting}>
          {data.salutation === 'Herr' ? 'Lieber' : data.salutation === 'Frau' ? 'Liebe' : 'Hallo'} {data.firstName},{'\n'}
          basierend auf deinen Angaben haben wir dein individuelles Gehaltsangebot berechnet.
        </Text>

        <Text style={styles.sectionTitle}>Deine Eckdaten</Text>
        <View style={styles.row}><Text style={styles.rowLabel}>Beruf</Text><Text style={styles.rowValue}>{data.role}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Wochenstunden</Text><Text style={styles.rowValue}>{data.hours}h</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Berufserfahrung</Text><Text style={styles.rowValue}>{data.experience} Jahre</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Nachtdienste/Monat</Text><Text style={styles.rowValue}>{data.nightShifts}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Wochenend-Dienste/Monat</Text><Text style={styles.rowValue}>{data.weekendShifts}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Feiertags-Dienste/Jahr</Text><Text style={styles.rowValue}>{data.holidayShifts}</Text></View>

        <Text style={styles.sectionTitle}>Zusammensetzung</Text>
        <View style={styles.row}>
          <View><Text style={styles.rowLabel}>Grundgehalt</Text><Text style={styles.rowSub}>+ ggue. Tarif</Text></View>
          <Text style={styles.rowValue}>{fmt(data.samaBase)} EUR</Text>
        </View>
        <View style={styles.row}>
          <View><Text style={styles.rowLabel}>Nachtdienste</Text><Text style={styles.rowSub}>{data.nightShifts} x 45 EUR</Text></View>
          <Text style={styles.rowValue}>{fmt(data.nightBonus)} EUR</Text>
        </View>
        <View style={styles.row}>
          <View><Text style={styles.rowLabel}>Wochenenden</Text><Text style={styles.rowSub}>{data.weekendShifts} x 65 EUR</Text></View>
          <Text style={styles.rowValue}>{fmt(data.weekendBonus)} EUR</Text>
        </View>
        <View style={styles.row}>
          <View><Text style={styles.rowLabel}>Feiertage (anteilig)</Text><Text style={styles.rowSub}>{data.holidayShifts}/Jahr x 120 EUR</Text></View>
          <Text style={styles.rowValue}>{fmt(data.holidayBonusMonthly)} EUR</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Gesamt brutto / Monat</Text>
          <Text style={styles.totalValue}>{fmt(data.totalSalary)} EUR</Text>
        </View>

        <View style={styles.comparison}>
          <View style={styles.compBox}>
            <Text style={styles.compLabel}>Tarif (Durchschnitt)</Text>
            <Text style={styles.compValue}>{fmt(data.tarifSalary)} EUR</Text>
          </View>
          <View style={[styles.compBox, { backgroundColor: '#f0f9ff' }]}>
            <Text style={[styles.compLabel, { color: '#0ea5e9' }]}>Samaritano</Text>
            <Text style={[styles.compValue, { color: '#0ea5e9' }]}>{fmt(data.totalSalary)} EUR</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text>+{fmt(data.diff)} EUR (+{data.diffPct}%) ueber Tarif</Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Interesse? Lass uns reden.</Text>
          <Text style={styles.ctaText}>
            Alexander Esau meldet sich persoenlich bei dir.{'\n'}
            Telefon: +49 (0) 571 7846640 · E-Mail: a.esau@samaritano.de
          </Text>
          <Text style={styles.ctaUrl}>https://samaritano-web.vercel.app/jobs</Text>
        </View>

        <Text style={styles.footer}>
          Unverbindliche Schaetzung · samaritano GmbH · Von Oeynhausen Str. 34, 32479 Hille
        </Text>
      </Page>
    </Document>
  )
}
