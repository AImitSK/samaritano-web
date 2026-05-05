/**
 * Seed-Skript: legt 11 Blogartikel + Kategorien aus samaritano.de in Sanity an.
 * Idempotent (createOrReplace).
 * Aufruf: node --env-file=.env.local scripts/seed-blog-posts.mjs
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) {
  console.error('SANITY-Env-Vars fehlen.'); process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ============================================================
// Markdown-light → Portable Text
// ============================================================
function parseInline(text, blockKey) {
  const out = []
  const regex = /\*\*([^*]+?)\*\*/g
  let last = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), marks: [] })
    out.push({ text: m[1], marks: ['strong'] })
    last = regex.lastIndex
  }
  if (last < text.length) out.push({ text: text.slice(last), marks: [] })
  if (out.length === 0) out.push({ text: '', marks: [] })
  return out.map((c, i) => ({
    _key: `${blockKey}-c${i}`,
    _type: 'span',
    text: c.text,
    marks: c.marks,
  }))
}

function parseToBlocks(content) {
  let k = 0
  const blocks = []
  for (const raw of content.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const key = `b${++k}`

    let style = 'normal'
    let listItem = null
    let text = line

    if (line.startsWith('### ')) {
      style = 'h3'
      text = line.slice(4)
    } else if (line.startsWith('## ')) {
      style = 'h2'
      text = line.slice(3)
    } else if (line.startsWith('- ')) {
      listItem = 'bullet'
      text = line.slice(2)
    }

    const block = {
      _key: key,
      _type: 'block',
      style,
      markDefs: [],
      children: parseInline(text, key),
    }
    if (listItem) {
      block.listItem = listItem
      block.level = 1
    }
    blocks.push(block)
  }
  return blocks
}

// ============================================================
// Categories
// ============================================================
const CATEGORIES = [
  { slug: 'aktuelle-themen', title: 'Aktuelle Themen' },
  { slug: 'einrichtungen', title: 'Einrichtungen' },
]

const catRef = (slug, i = 0) => ({
  _key: `cat${i}`,
  _type: 'reference',
  _ref: `category-${slug}`,
})

// ============================================================
// Posts
// ============================================================
const POSTS = [
  {
    slug: 'fachkraeftemangel-anaesthesiepflege-beste-karten',
    title: 'Fachkräftemangel in der Anästhesiepflege: Warum du gerade die besten Karten hast',
    publishedAt: '2026-03-17',
    excerpt:
      'Personalmangel in der Anästhesiepflege bedeutet konkrete Verhandlungsmacht für Fachkräfte. Was Zahlen, Alltag und Optionen wirklich bedeuten.',
    categories: ['aktuelle-themen', 'einrichtungen'],
    content: `7:15 Uhr, Übergabe vom Bereitschaftsdienst. BTM-Schlüssel, Telefon, Besonderheiten aus der Nacht. Dann ab in den Saal: Narkosegerät hochfahren, Selbsttest laufen lassen, Medikamente aufziehen, Monitoring vorbereiten. Bevor der erste Patient da ist, hast du schon zwanzig Handgriffe erledigt, die kein Außenstehender je sieht.

Und genau das ist das Problem – und gleichzeitig dein größter Vorteil. Denn der Fachkräftemangel bedeutet: Ohne dich läuft kein Saal. Und das wissen die Kliniken.

## Was die Zahlen über den Fachkräftemangel verraten

Auf 100 offene Stellen in der Intensiv- und Anästhesiepflege kommen aktuell nur rund 55 qualifizierte Fachkräfte. Die Deutsche Gesellschaft für Fachkrankenpflege fordert seit Jahren eine 1:1-Besetzung – eine Anästhesiefachkraft pro Saal. Die Realität in vielen Häusern sieht anders aus: Zwei Säle gleichzeitig betreuen, zwischen Einleitungsraum und Aufwachraum springen, Material auffüllen nebenbei.

Das DKG-Fachkräftemonitoring 2025 meldet anhaltende Besetzungsprobleme im Anästhesie-Dienst. Die Prognose: Bis 2030 schrumpft die Personalreserve von 2 auf 0,5 Prozent.

## Dein Alltag und warum er sich von der Stationspflege unterscheidet

Du arbeitest im Tandem mit dem Anästhesisten. Ihr seid ein eingespieltes Team. Du legst den pVK, schließt das Monitoring an, assistierst beim ZVK oder bei der arteriellen Druckmessung. Im Aufwachraum überwachst du Vitalparameter, managst Schmerz, Übelkeit, Shivering und gibst die Patienten erst frei, wenn du sicher bist.

Und dann der Bereitschaftsdienst: Kein klassischer Schichtdienst wie auf Station. Stattdessen 24-Stunden-Präsenzbereitschaft oder Rufbereitschaft. Das verlangt eine Kombination aus Fachwissen, Handlungssicherheit und Belastbarkeit, die man nicht in drei Monaten anlernen kann.

## Die echten Schmerzpunkte

- **Parallele Saalabdeckung bei dünner Besetzung.** Eine Fachkraft pro Saal wäre der Standard. In deinem Haus deckst du vielleicht zwei ab, plus Außenarbeitsplätze in CT oder MRT.
- **Bereitschaftsdienste, die keine Erholung lassen.** Die Auslastung erreicht teilweise 80 Prozent. Das ist kein Bereithalten mehr, das ist durcharbeiten.
- **Hohe Verantwortung, wenig Sichtbarkeit.** Deine Kompetenz wird genutzt, aber selten benannt.
- **Der OP-Plan diktiert dein Leben.** Kein geregelter Feierabend, kein planbares Wochenende.

## Was dir der Fachkräftemangel konkret ermöglicht

Deine Fachweiterbildung Anästhesie macht dich zu einer Fachkraft, um die Kliniken aktiv konkurrieren. Du hast Verhandlungsmacht. Und du kannst sie nutzen:

- **Verhandeln.** Verbindliche Ruhezeiten, weniger parallele Saalbetreuung, konkrete Ausgleichsregelungen.
- **Vergleichen.** Nicht jedes Krankenhaus organisiert den Dienst gleich. Manche haben Rufbereitschaft statt Präsenzbereitschaft.
- **Zeitarbeit als echte Option prüfen.** In der Arbeitnehmerüberlassung sind Bereitschaftsdienste in der Regel nicht Teil deines Einsatzes.

## Deine Kompetenz wird gebraucht – und du darfst danach handeln

Der Fachkräftemangel gibt dir eine Position, die Pflegekräfte in Deutschland selten haben: die Wahl. Ob du bleibst und verhandelst, den Arbeitgeber wechselst oder etwas Neues ausprobierst, die Entscheidung liegt bei dir.`,
  },
  {
    slug: 'du-liebst-die-pflege-bedingungen-zermuerben',
    title: 'Du liebst deinen Beruf. Die Bedingungen lieben dich gerade nicht zurück.',
    publishedAt: '2026-03-17',
    excerpt:
      'Ein ehrlicher Blick auf die Pflege und wie Zeitarbeit bei samaritano mehr Selbstbestimmung bietet — nicht als Universallösung, sondern als realistischer Weg zu mehr Kontrolle.',
    categories: ['aktuelle-themen', 'einrichtungen'],
    content: `Du hast Pflege nicht gewählt, weil du keine andere Option hattest. Du hast sie gewählt, weil du etwas bewegen willst. Weil dieser Beruf etwas mit dir macht, das kein anderer hinbekommt: Menschen in schwierigen Momenten wirklich da sein.

Und trotzdem fragst du dich irgendwann, ob du noch lange so weitermachen kannst.

## Das Problem liegt nicht an dir

Rund 40 Prozent der Pflegekräfte in Deutschland denken ernsthaft daran, den Beruf aufzugeben. Aber die gleichen Studien zeigen: Jede zweite Pflegekraft, die gegangen ist, würde eigentlich gerne zurückkehren. Nicht zur alten Station. Aber zur Pflege, ja.

Der Beruf selbst ist nicht das Problem. Das System drum herum ist es. Permanenter Zeitdruck, Einspringen aus dem Frei, zu wenig Zeit für die Menschen, die du pflegst.

## Was Zeitarbeit verändert und was nicht

Eine ehrliche Antwort: Zeitarbeit löst nicht die strukturellen Probleme des Pflegesystems. Eine unterbesetzte Station bleibt unterbesetzt. Schichtdienst bleibt Schichtdienst.

Was sich ändert: Du entscheidest selbst, wo und wann du dich dieser Realität aussetzt. Du bist bei samaritano angestellt, nicht bei der Einrichtung. Du gibst an, welche Einsätze du annimmst.

## Drei Dinge, die sich konkret verändern können

### Du kommst raus, ohne den Beruf aufzugeben

Manchmal ist es nicht die Pflege, die zermürbt. Es ist diese eine Einrichtung. Dieses eine Team. Diese eine Leitung. Zeitarbeit gibt dir die Möglichkeit, Abstand zu nehmen, von einer toxischen Struktur, nicht vom Beruf.

### Deine Erfahrung wird breiter

Wer in Kliniken, Pflegeheimen und ambulanten Diensten gearbeitet hat, bringt etwas mit, das kein Lehrbuch vermittelt: Perspektive. Du siehst, wie unterschiedliche Teams arbeiten.

### Du weißt irgendwann, was du wirklich willst

Viele Pflegekräfte, die Zeitarbeit ausprobiert haben, sagen hinterher: Ich weiß jetzt, was ich suche. Manche bleiben, manche kehren in eine Festanstellung zurück, aber eine, die sie bewusst gewählt haben.

## Bereit für ein ehrliches Gespräch?

Wenn dich das anspricht, dann meld dich. Kein langer Bewerbungsprozess. Nur ein ehrliches Gespräch darüber, ob das, was wir anbieten, zu dem passt, was du gerade brauchst.`,
  },
  {
    slug: 'samaritano-vs-andere-christliche-zeitarbeit',
    title: 'Samaritano vs. Andere: Warum unser Ansatz für christliche Zeitarbeit anders ist',
    publishedAt: '2025-06-05',
    excerpt:
      'Fünf Unterscheidungsmerkmale, die samaritano von anderen Zeitarbeitsfirmen in der Pflege abheben — vom christlichen Fundament bis zu transparentem Handeln.',
    categories: ['aktuelle-themen'],
    content: `Der Markt für Zeitarbeit in der Pflege ist groß und vielfältig. Viele Anbieter versprechen Flexibilität und gute Bezahlung. Doch wenn Ihnen als Pflegekraft christliche Werte wichtig sind, stellt sich die Frage: Sind wirklich alle Zeitarbeitsfirmen gleich?

samaritano tritt mit dem Anspruch an, ein Personaldienstleister mit einem explizit christlichen Fundament zu sein. Was unterscheidet das Unternehmen konkret von anderen?

## Christliche Werte: Mehr als nur ein Etikett

Für samaritano sind christliche Werte das gelebte Fundament unseres Handelns. Begriffe wie Nächstenliebe, Ehrlichkeit, Respekt und Verlässlichkeit prägen den Umgang mit Mitarbeitern und Kunden. Wir verstehen unsere Arbeit als Dienst, das oberste Ziel ist das Wohlergehen der Menschen.

## Gemeinschaft: Netzwerk statt Anonymität

Viele Zeitarbeitskräfte fühlen sich isoliert. Wir legen großen Wert auf eine echte, unterstützende Gemeinschaft. Durch regelmäßige Treffen und interne Kommunikationswege entsteht ein Gefühl der Zugehörigkeit und gegenseitigen Unterstützung.

## Faire Bedingungen: Aus Überzeugung, nicht nur aus Pflicht

Wir bieten faire, oft übertarifliche Bezahlung und flexible Arbeitszeitmodelle. Der Unterschied: Die Motivation entspringt der christlichen Überzeugung von der Würde jedes Einzelnen.

## Passgenaue Einsätze: Mensch und Aufgabe im Blick

Wir versuchen, Mitarbeiter nicht nur nach fachlicher Qualifikation, sondern auch gemäß persönlichen Wünschen einzusetzen. Das Ziel ist eine gute Passung, nicht die schnelle Vermittlung um jeden Preis.

## Transparenz und ethisches Handeln

Offenheit, Ehrlichkeit und ethisch korrektes Verhalten sind unverzichtbar. Wir kommunizieren transparent über Einsatzbedingungen, Verträge und alle relevanten Aspekte der Anstellung.

## Fazit

samaritano bietet Pflegekräften nicht nur einen Job, sondern eine berufliche Heimat in einer starken Gemeinschaft, faire Bedingungen aus Überzeugung und die Möglichkeit, Arbeit im Einklang mit eigenen Werten zu gestalten.`,
  },
  {
    slug: 'gemeinschaft-im-glauben-pflegealltag',
    title: 'Gemeinschaft im Glauben: Wie der Austausch mit christlichen Kollegen im Pflegealltag stärkt',
    publishedAt: '2025-05-27',
    excerpt:
      'Der Pflegeberuf fordert fachlich und seelisch. Eine starke Gemeinschaft mit Gleichgesinnten kann eine tragfähige Säule sein, auch in der Zeitarbeit.',
    categories: ['aktuelle-themen'],
    content: `Der Pflegeberuf fordert uns täglich heraus, nicht nur fachlich, sondern auch emotional und seelisch. Die Konfrontation mit Leid, ethischen Fragen und hohem Arbeitsdruck kann belastend sein. In solchen Zeiten ist Unterstützung Gold wert. Für christliche Pflegekräfte kann die Gemeinschaft im Glauben mit Gleichgesinnten eine besonders tragfähige Säule sein.

## Warum ist Gemeinschaft im Glauben am Arbeitsplatz wichtig?

Sich gegenseitig zu ermutigen, Lasten zu tragen und füreinander zu beten, sind zentrale Aspekte gelebten Glaubens. Im beruflichen Kontext bedeutet das:

- **Geteiltes Verständnis:** Kollegen, die den Glauben teilen, verstehen oft intuitiv die Werte und Herausforderungen, die damit im Pflegeberuf verbunden sind.
- **Emotionale Entlastung:** Schwierige Erlebnisse können im vertrauensvollen Gespräch mit Gleichgesinnten anders verarbeitet werden.
- **Gegenseitige Ermutigung:** Ein aufmunterndes Wort oder das Wissen, nicht allein zu sein, kann in stressigen Phasen den entscheidenden Unterschied machen.
- **Gemeinsames Gebet:** Die Möglichkeit, füreinander zu beten, schafft eine tiefe Verbindung.

## Wege zur Gemeinschaft finden und pflegen

- **Offenheit signalisieren:** Seien Sie authentisch in Ihrem Glauben, ohne aufdringlich zu sein.
- **Gespräche initiieren:** Nutzen Sie Pausen für tiefere Gespräche, fragen Sie nach dem Befinden.
- **Gemeinsame Gebetszeiten:** Vielleicht ergibt sich die Möglichkeit für kurze, informelle Gebetsmomente.
- **Austausch suchen:** Auch außerhalb der direkten Arbeit können wertvolle Kontakte entstehen.

## Gemeinschaft in der Zeitarbeit, geht das?

Gerade in der Zeitarbeit, wo die Einsatzorte wechseln, scheint Gemeinschaft schwierig. Hier kommt der Agentur eine Schlüsselrolle zu. Ein Personaldienstleister wie samaritano fördert unter seinen Mitarbeitenden eine starke Gemeinschaft, durch regelmäßige Treffen, gemeinsame Veranstaltungen und das Gefühl, Teil einer wertebasierten Familie zu sein.

## Fazit

Die Kraft der Gemeinschaft im Glauben ist ein unschätzbarer Wert, gerade im anspruchsvollen Pflegeberuf. Suchen Sie aktiv nach diesen Verbindungen oder nach einem Arbeitsumfeld, das eine solche Gemeinschaft bewusst fördert.`,
  },
  {
    slug: 'work-life-balance-pflege-5-tipps',
    title: 'Work-Life-Balance in der Pflege: 5 Tipps für christliche Pflegekräfte',
    publishedAt: '2025-05-10',
    excerpt:
      'Fünf praktische Tipps für eine gesunde Balance zwischen Beruf und Privatleben aus christlicher Perspektive.',
    categories: ['aktuelle-themen'],
    content: `Work-Life-Balance, ein Begriff, der für viele Pflegekräfte wie ein ferner Wunschtraum klingt. Zwischen anspruchsvollen Diensten, hoher Verantwortung und dem ständigen Gefühl, gebraucht zu werden, scheint ein gesunder Ausgleich kaum erreichbar. Aus christlicher Perspektive ist die Sorge um das eigene Wohlbefinden keine Nebensache, sondern Teil unserer Verantwortung als gute Verwalter der uns anvertrauten Zeit und Gesundheit.

## 1. Grenzen setzen lernen, Selbstfürsorge als Verantwortung

Christliche Nächstenliebe bedeutet nicht grenzenlose Selbstaufgabe. Lernen Sie, freundlich aber bestimmt Nein zu sagen, wenn Ihre Grenzen erreicht sind. Sehen Sie das nicht als Egoismus, sondern als verantwortungsvollen Umgang mit Ihren Kräften.

## 2. Bewusste Auszeiten und Sabbat-Momente schaffen

Planen Sie Erholung genauso fest ein wie Ihre Dienste. Schaffen Sie kleine Inseln der Ruhe: ein Spaziergang in der Natur, Zeit für Gebet, ein Hobby, ungestörte Zeit mit der Familie. Der biblische Gedanke des Sabbats erinnert uns daran, wie wichtig regelmäßige Unterbrechungen sind.

## 3. Flexible Arbeitsmodelle prüfen, mehr Kontrolle gewinnen

Feste, starre Dienstpläne machen eine gute Balance schwierig. Teilzeitmodelle oder die Zeitarbeit bei einem fairen Anbieter können Türen öffnen. Agenturen wie samaritano bieten oft Wunschdienstpläne an, die mehr Kontrolle über Arbeitszeiten geben.

## 4. Prioritäten klären und Perfektionismus ablegen

Nicht alles, was dringend erscheint, ist wirklich wichtig. Konzentrieren Sie sich auf das Wesentliche. Der christliche Glaube lehrt uns Gnade, auch uns selbst gegenüber. Wir dürfen unsere Grenzen anerkennen.

## 5. Spirituelle Ressourcen nutzen und Gemeinschaft suchen

Ihr Glaube ist eine Kraftquelle. Nutzen Sie Gebet, Bibellesen oder christliche Meditation, um zur Ruhe zu kommen. Suchen Sie die Gemeinschaft mit anderen Christen.

## Fazit

Work-Life-Balance ist kein unerreichbarer Luxus, sondern eine Notwendigkeit. Es erfordert bewusste Entscheidungen und das Setzen von Grenzen.`,
  },
  {
    slug: 'pflege-als-berufung-glauben-im-alltag',
    title: 'Mehr als nur ein Job: Pflege als Berufung — Den Glauben im Berufsalltag leben',
    publishedAt: '2025-04-30',
    excerpt:
      'Wie Pflegekräfte mit christlichem Hintergrund ihre Arbeit als Berufung verstehen und ihren Glauben konkret im hektischen Berufsalltag leben können.',
    categories: ['aktuelle-themen'],
    content: `Der Pflegeberuf ist fordernd, körperlich wie emotional. Lange Schichten, hohe Verantwortung und schwierige Situationen gehören zum Alltag. Was motiviert Menschen, diesen Weg zu wählen und ihm treu zu bleiben? Für viele Pflegekräfte mit christlichem Hintergrund ist es mehr als ein Job: Es ist eine Berufung.

## Was bedeutet Berufung im christlichen Kontext?

Im christlichen Verständnis ist Berufung die Erkenntnis, dass uns Gaben und Talente geschenkt sind, um sie in den Dienst und zum Wohl der Mitmenschen einzusetzen. Die Arbeit wird nicht nur Broterwerb, sondern ein sinnvoller Beitrag, gelebte Nächstenliebe.

## Herausforderungen und Chancen im Alltag

Zeitdruck, Personalmangel, ethische Dilemmata oder ein Umfeld, das wenig Verständnis für religiöse Überzeugungen hat, können Herausforderungen sein. Doch genau hier liegen auch Chancen: Ihr Glaube kann Ihnen innere Stärke und Orientierung geben.

## Praktische Wege, den Glauben im Pflegealltag zu leben

- **Momente der Stille:** Nutzen Sie kurze Pausen für ein stilles Gebet oder Besinnung.
- **Gelebtes Mitgefühl:** Ein freundliches Wort, ein offenes Ohr oder eine sanfte Berührung können Ausdruck gelebter Nächstenliebe sein.
- **Integrität und Ethik:** Treffen Sie Entscheidungen im Einklang mit Ihren christlichen Werten.
- **Fokus auf den Dienst:** Erinnern Sie sich an den Dienstcharakter Ihrer Arbeit.
- **Suche nach Gemeinschaft:** Tauschen Sie sich mit gleichgesinnten Kolleginnen und Kollegen aus.

## Die Bedeutung eines unterstützenden Arbeitsumfelds

Ein Arbeitgeber, der christliche Prinzipien aktiv lebt, schafft einen Raum, in dem Sie Ihre Berufung leichter entfalten können. Bei samaritano ist genau dieser Ansatz zentral: Wir möchten Pflegekräften ein berufliches Zuhause bieten, in dem der Glaube als integraler Bestandteil verstanden und wertgeschätzt wird.

## Fazit

Pflege als Berufung zu verstehen, verändert die Perspektive. Es gibt der täglichen Arbeit einen tieferen Sinn und kann eine unerschöpfliche Quelle der Kraft sein.`,
  },
  {
    slug: 'zeitarbeit-pflege-mythos-vs-realitaet',
    title: 'Zeitarbeit Pflege: Mythos vs. Realität — Eine echte Chance für werteorientierte Pflegekräfte',
    publishedAt: '2025-04-24',
    excerpt:
      'Der Artikel räumt mit verbreiteten Vorurteilen über Zeitarbeit in der Pflege auf und zeigt, wie sie zu mehr Flexibilität und wertebasiertem Arbeiten führen kann.',
    categories: ['aktuelle-themen'],
    content: `Zeitarbeit in der Pflege, ein Begriff, der oft gemischte Gefühle hervorruft und von zahlreichen Mythen umgeben ist. Mangelnde Sicherheit, schlechtere Bezahlung, fehlende Zugehörigkeit? Diese Vorurteile halten viele qualifizierte und engagierte Pflegekräfte davon ab, diese Arbeitsform überhaupt in Betracht zu ziehen. Doch wie sieht die Realität wirklich aus?

## Mythos 1: Ständig woanders und nirgendwo dazugehören

Wechselnde Einsätze gehören zur Natur der Zeitarbeit und bieten die Chance, vielfältige Erfahrungen zu sammeln. Bei einem guten Personaldienstleister sind Sie Teil dessen Teams. Agenturen mit starker Werteorientierung wie samaritano legen Wert auf Gemeinschaft, regelmäßigen Austausch und das Gefühl des Zuhauseseins innerhalb der Agentur.

## Mythos 2: Schlechtere Bezahlung und Bedingungen

Dieses Vorurteil stammt oft aus der Vergangenheit. Heute zahlen viele renommierte Personaldienstleister übertariflich und bieten attraktive Zusatzleistungen. Oftmals haben Sie als Zeitarbeitskraft sogar mehr Kontrolle über Ihre Arbeitszeiten.

## Mythos 3: Nur ein Lückenfüller ohne Wertschätzung

Zeitarbeitskräfte bringen wertvolle Expertise und frische Perspektiven in die Teams. Eine gute Agentur sorgt dafür, dass Sie entsprechend Ihrer Qualifikation eingesetzt werden und tritt für Ihre Interessen ein.

## Mythos 4: Passt nicht zu christlichen Werten

Das Gegenteil kann der Fall sein. Sie können dazu beitragen, dass Stationen nicht unterbesetzt sind und die Kernteams entlastet werden. Eine Agentur wie samaritano teilt Ihre christlichen Werte aktiv und schafft ein Arbeitsumfeld, das von Respekt, Gemeinschaft und Fairness geprägt ist.

## Die Chance: Zeitarbeit mit dem richtigen Partner

Eine Agentur, die Ihre Werte teilt, Sie fair bezahlt, Ihnen Mitspracherecht bei der Dienstplanung gibt und eine starke Gemeinschaft pflegt, macht den Unterschied.

## Fazit

Zeitarbeit in der Pflege hat sich weiterentwickelt und kann heute eine attraktive Alternative zur Festanstellung sein, gerade für Pflegekräfte, die Flexibilität suchen, ohne auf Mitsprache und ein wertebasiertes Umfeld zu verzichten.`,
  },
  {
    slug: 'pflege-am-limit-5-wege-christliche-werte',
    title: 'Pflege am Limit? 5 Wege, wie christliche Werte im Joballtag neue Kraft geben können',
    publishedAt: '2025-04-19',
    excerpt:
      'Wie Pflegekräfte durch christliche Werte wie Nächstenliebe, Hoffnung und Berufung innere Kraftquellen nutzen können, um Stress und Überlastung zu bewältigen.',
    categories: ['aktuelle-themen'],
    content: `Fühlen Sie sich im Pflegealltag oft gestresst, überlastet und an Ihrer persönlichen Grenze? Sie sind nicht allein. Viele Pflegekräfte kennen das Gefühl, zwischen hohem Anspruch, Zeitdruck und emotionaler Belastung aufgerieben zu werden.

Während strukturelle Verbesserungen dringend nötig sind, gibt es auch innere Kraftquellen, die Ihnen helfen können, den anspruchsvollen Alltag besser zu meistern.

## 1. Nächstenliebe als täglicher Anker

Das Kerngebot der Nächstenliebe ist mehr als ein abstraktes Konzept. Sich bewusst zu machen, warum Sie diesen Beruf gewählt haben, kann unglaublich kraftspendend sein. Die Konzentration auf kleine Momente der Zuwendung erinnert daran, dass Ihre Arbeit einen tiefen Wert hat.

## 2. Hoffnung inmitten von Herausforderungen

Christliche Hoffnung bedeutet nicht, die Augen vor der Realität zu verschließen. Sie bietet eine tiefere Perspektive, die über den Moment hinausgeht und eine innere Resilienz stärkt.

## 3. Arbeit als Berufung verstehen

Wenn der Job nur noch als Belastung empfunden wird, kann die Sichtweise der Berufung eine neue Dimension eröffnen. Den Dienst am Menschen als von Gott gegebene Aufgabe zu sehen, stärkt die Motivation.

## 4. Kraft aus der Gemeinschaft schöpfen

Der Austausch mit Kolleginnen und Kollegen, die ähnliche Werte teilen, wirkt dem Gefühl des Alleinseins entgegen. Ein unterstützendes Team bietet immense Stütze.

## 5. Selbstfürsorge als Ausdruck von Verantwortung

Christliche Werte bedeuten auch, verantwortungsvoll mit den eigenen Ressourcen umzugehen. Sie können nur gut für andere sorgen, wenn Sie auch auf sich selbst achten.

## Fazit

Die Integration christlicher Werte in den Berufsalltag kann eine kraftvolle Ressource sein. Ein Arbeitsumfeld, das diese Werte aktiv lebt und fördert, macht dabei einen entscheidenden Unterschied.`,
  },
  {
    slug: 'vielfalt-der-pflegeberufe-uebersicht',
    title: 'Die Vielfalt der Pflegeberufe: Eine Übersicht',
    publishedAt: '2024-07-27',
    excerpt:
      'Umfassender Überblick über Pflegeberufe in Deutschland, deren Aufgaben, Ausbildungswege und Karrieremöglichkeiten.',
    categories: ['aktuelle-themen'],
    content: `In der sich schnell entwickelnden Gesundheitslandschaft von heute spielen Pflegeberufe eine entscheidende Rolle. Dieser Leitfaden taucht ein in die Welt der Pflegeberufe in Deutschland.

## Die Bedeutung von Pflegeberufen

Pflege ist mehr als ein Job, es ist eine Berufung, die Engagement, Mitgefühl und die Bereitschaft zum lebenslangen Lernen erfordert. Die Nachfrage nach qualifizierten Pflegefachkräften wächst stetig:

- Eine alternde Bevölkerung
- Fortschritte in der Medizintechnik
- Zunehmender Fokus auf Präventivmedizin
- Wachsendes Bewusstsein für psychische Gesundheitsprobleme

## Arten von Pflegeberufen in Deutschland

### Gesundheits- und Krankenpfleger/in

Bilden das Rückgrat des Gesundheitssystems, arbeiten in Krankenhäusern, Kliniken und Pflegeheimen.

- Verabreichung von Medikamenten und Behandlungen
- Überwachung des Gesundheitszustands der Patienten
- Unterstützung von Ärzten bei Untersuchungen
- Emotionale Unterstützung für Patienten und Angehörige

### Altenpfleger/in

Spezialisiert auf die Pflege älterer Menschen.

- Unterstützung bei Alltagsaktivitäten
- Verabreichung von Medikamenten
- Entwicklung von Pflegeplänen
- Emotionale und soziale Unterstützung

### Gesundheits- und Kinderkrankenpfleger/in

Versorgung von Säuglingen, Kindern und Jugendlichen, in Krankenhäusern und Kinderkliniken.

### Fachweiterbildung Psychiatrie

Tätig in psychiatrischen Kliniken, ambulanten Einrichtungen und gemeindenahen Zentren.

### Fachkrankenpfleger/in für Intensivpflege und Anästhesie

Arbeit mit Schwerstkranken, die ständige Überwachung und komplexe Pflege benötigen.

## Ausbildung

### Generalistische Pflegeausbildung

Seit 2020 vereinheitlicht durch das neue Pflegeberufegesetz:

- Dauer: 3 Jahre
- Kombiniert Elemente der Gesundheits- und Krankenpflege, Kinderkrankenpflege und Altenpflege
- Theorie und Praxis
- Führt zur Qualifikation als Pflegefachfrau oder Pflegefachmann

### Weiterbildung und Spezialisierungen

- Management- und Führungspositionen
- Spezialisierte klinische Bereiche (Onkologie, Notfallversorgung)
- Lehr- und Ausbildungspositionen
- Forschung in der Pflegewissenschaft

## Karriereaussichten

- Jobsicherheit
- Wettbewerbsfähige Gehälter
- Aufstiegsmöglichkeiten
- Work-Life-Balance-Optionen
- Bedeutsamer Unterschied im Leben von Menschen

## Herausforderungen und Belohnungen

- Körperliche und emotionale Belastungen
- Schichtarbeit und unregelmäßige Arbeitszeiten
- Anforderungen an kontinuierliche Weiterbildung
- Umgang mit schwierigen Situationen

Trotz dieser Herausforderungen empfinden viele Pflegekräfte ihre Arbeit als zutiefst erfüllend.

## Zukunft der Pflege

- Digitalisierung und E-Health
- Verstärkter Fokus auf Präventivmedizin
- Wachsende Bedeutung interdisziplinärer Zusammenarbeit
- Patientenzentrierte Pflegemodelle

## Fazit

Pflegeberufe bieten vielfältige Möglichkeiten für Menschen, die sich für das Gesundheitswesen begeistern. Mit ausgezeichneten Aussichten und der Chance, einen echten Unterschied zu machen, bleibt die Pflege eine attraktive Berufswahl.`,
  },
  {
    slug: 'einfuehrung-pflegeberufegesetz-2020',
    title: 'Einführung zum Pflegeberufegesetz vom 1. Januar 2020',
    publishedAt: '2024-07-27',
    excerpt:
      'Das Pflegeberufegesetz modernisiert die Pflegeausbildung durch eine generalistische Ausbildung und macht den Beruf attraktiver, um dem Fachkräftemangel zu begegnen.',
    categories: ['aktuelle-themen'],
    content: `Das Pflegeberufegesetz (PflBG) ist ein deutsches Bundesgesetz, das am 1. Januar 2020 in Kraft getreten ist und die bisherigen Gesetze zur Kranken-, Kinderkranken- und Altenpflege ablöst. Im Mittelpunkt steht die Einführung einer generalistischen Pflegeausbildung, die zur Pflegefachfrau oder zum Pflegefachmann führt.

## Ziele und Zwecke des Pflegeberufegesetzes

- **Vereinheitlichung der Ausbildung:** Das Gesetz vereint die bisher getrennten Ausbildungen zu einer einheitlichen, generalistischen Pflegeausbildung.
- **Verbesserung der Ausbildungsqualität:** Mindeststandards stellen sicher, dass Auszubildende erforderliche Fähigkeiten erwerben.
- **Attraktivität des Pflegeberufs:** Eine Vergütung für alle Auszubildenden soll mehr Menschen für den Beruf gewinnen.
- **Verbesserung der Patientenversorgung:** Die generalistische Ausbildung soll den wachsenden Pflegebedarf decken.

## Neuregelungen

- **Generalistische Ausbildung:** In den ersten beiden Jahren gleiche Grundlagen, im dritten Jahr Schwerpunktwahl.
- **Ausbildungsvergütung:** Alle Auszubildenden erhalten eine Vergütung vom Arbeitgeber.
- **Akademisierung:** Bachelor-Studiengang Pflege wird ermöglicht.
- **Praxisanleitung:** Wird gestärkt durch verbindliche Vorgaben.
- **EU-Konformität:** Verbesserte Anerkennung der deutschen Pflegeausbildung in der EU.

## Auswirkungen auf die Pflegekräfte

- **Neue Ausbildungsstruktur:** Vorbereitung auf Pflege von Menschen aller Altersgruppen.
- **Vergütete Ausbildung:** Wird in allen Bundesländern vergütet.
- **Stärkere Anerkennung:** Pflege als eigenständiger Beruf mit klarer Identität.
- **Flexibilität:** Arbeit in verschiedenen Bereichen der Pflege möglich.
- **Höhere Anforderungen:** Bedenken, dass spezialisiertes Wissen zu kurz kommt.

## Chancen für Zeitarbeitsfirmen

- **Steigende Nachfrage nach flexiblen Lösungen:** Einrichtungen suchen verstärkt nach hochqualifizierten Pflegekräften.
- **Anpassungsfähigkeit:** Zeitarbeitsfirmen reagieren schnell auf sich ändernde Anforderungen.
- **Qualifizierte Fachkräfte im Portfolio:** Konzentration auf hochqualifiziertes Personal.
- **Kosteneffizienz:** Bedarfsgerechte Personalressourcen.
- **Langfristige Partnerschaften:** Vertrauen durch zuverlässiges Personal.

## Auswirkungen auf die Patienten

- **Verbesserte Pflegequalität** durch praxisorientiertere Ausbildung
- **Ganzheitliche Betreuung** durch allgemeinen Pflegeberuf
- **Verbesserte Versorgung** durch Modernisierung
- **Stärkere Patientenbeteiligung**
- **Verbesserte Interdisziplinarität**

## Warum Zeitarbeit attraktiv bleibt

- **Flexibilität** für Arbeitgeber und Arbeitnehmer
- **Berufserfahrung** in verschiedenen Einrichtungen
- **Abwechslung** im Berufsalltag
- **Sicherheit** durch gesetzliche Verpflichtungen
- **Weiterbildung** durch Zeitarbeitsfirmen

Das Pflegeberufegesetz hat das Potenzial, den Pflegeberuf attraktiver zu machen und die Qualität der Ausbildung zu verbessern. Trotz Begrenzungen wie der Überlassungsdauer und Equal Pay nach 9 Monaten bleibt Zeitarbeit für viele attraktiv.`,
  },
  {
    slug: 'beste-zeitarbeitsfirma-pflege-finden',
    title: 'Die beste Zeitarbeitsfirma in der Pflege finden',
    publishedAt: '2023-10-03',
    excerpt:
      'Welche Kriterien zählen bei der Auswahl einer Zeitarbeitsfirma in der Pflege — und warum samaritano durch qualifiziertes Personal, Zuverlässigkeit und Support überzeugt.',
    categories: ['aktuelle-themen'],
    content: `Die Wahl der richtigen Zeitarbeitsfirma kann den Unterschied zwischen einem erfüllten Arbeitsleben und permanenter Frustration ausmachen. Welche Kriterien sind wirklich relevant?

## Wichtige Kriterien bei der Auswahl

- **Qualifikationen der Pflegekräfte:** hochqualifiziertes und lizenziertes Personal
- **Zuverlässigkeit:** nachgewiesener Ruf für Pünktlichkeit
- **Flexibilität:** Anpassung an wechselnde Anforderungen und kurzfristige Anfragen
- **Qualitätssicherung:** implementierte Kontrollmechanismen
- **Kundensupport:** responsive und hilfreiche Unterstützung

## Wie Sie die passende Zeitarbeitsfirma auswählen

- Anforderungen klären und präzise definieren
- Umfassende Recherche durchführen
- Angebote vergleichen, nicht nur die Kosten
- Referenzen von früheren Kunden anfordern
- Persönliche Gespräche mit Firmenvertretern führen
- Verträge gründlich prüfen

## Warum samaritano eine herausragende Wahl ist

samaritano zeichnet sich durch engagiertes und qualifiziertes Fachpersonal aus, kombiniert mit Verlässlichkeit, Flexibilität, strikter Qualitätssicherung, exzellentem Support und Transparenz in allen Vereinbarungen.

## Wie samaritano diese Merkmale in der Praxis umsetzt

Wir setzen unsere Merkmale durch aktiven Einsatz qualifizierten Personals, schnelle Reaktion auf dringende Anfragen, strenge Qualitätskontrollen und transparente Kommunikation um.

## Fazit

Die richtige Zeitarbeitsfirma zu finden braucht Zeit und Recherche. Wer auf die genannten Kriterien achtet und in den Dialog geht, findet einen Partner, der wirklich zu den eigenen Werten passt.`,
  },
]

// ============================================================
// Run
// ============================================================
console.log(`Schreibe Kategorien...`)
for (let i = 0; i < CATEGORIES.length; i++) {
  const c = CATEGORIES[i]
  await client.createOrReplace({
    _id: `category-${c.slug}`,
    _type: 'category',
    title: c.title,
    slug: { _type: 'slug', current: c.slug },
  })
  console.log(`  [OK] ${c.title}`)
}

console.log(`\nSchreibe ${POSTS.length} Posts...`)
for (let i = 0; i < POSTS.length; i++) {
  const p = POSTS[i]
  const doc = {
    _id: `post-${p.slug}`,
    _type: 'post',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    excerpt: p.excerpt,
    publishedAt: `${p.publishedAt}T08:00:00.000Z`,
    content: parseToBlocks(p.content),
    categories: p.categories.map((s, j) => catRef(s, j)),
  }
  await client.createOrReplace(doc)
  console.log(`  [${i + 1}/${POSTS.length}] ${p.title}`)
}
console.log(`\nFertig.`)
