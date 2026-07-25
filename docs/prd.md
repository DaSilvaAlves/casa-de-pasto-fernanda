# PRD — Site Casa de Pasto Fernanda

- **Produto:** Site vitrine (marketing/presença online) da Casa de Pasto Fernanda
- **Versão do documento:** 1.2 (âmbito de idiomas reposto para 3 — PT/EN/ES — em 25/07/2026, corrigindo desvio da v1.1)
- **Data:** 25/07/2026
- **Autor:** Morgan (Strategist / Product Manager)
- **Estado:** Rascunho para aprovação — base para stories de desenvolvimento
- **Tipo de iniciativa:** Greenfield (novo produto, sem site anterior)

---

## 1. Visão geral e objetivos

### 1.1 Background context

A Casa de Pasto Fernanda é um restaurante tradicional português de cozinha regional e caseira (registo Alentejo/Algarve), com pratos como açorda de galinha, ensopado de javali, arroz de cabidela, porco ibérico, conquilhas e tarte de alfarroba. Atualmente não tem presença digital estruturada: quem procura o restaurante online não encontra informação fiável sobre menu, localização, horários ou identidade.

O objetivo deste projeto é criar uma **vitrine digital moderna e profissional** que capture a autenticidade da casa e a converta em visitas ao restaurante físico. Não se trata de uma plataforma transacional — não há e-commerce nem reservas online no MVP. O site é um instrumento de marketing e descoberta: alguém procura "restaurante tradicional português" no Google ou nas redes sociais, encontra a Casa de Pasto Fernanda, vê que o ambiente e os pratos são apetitosos, percebe onde fica e a que horas abre, e decide visitar.

O restaurante recebe dois perfis de público distintos: clientela local e regular, e turismo estrangeiro (daí o requisito multilingue). O site tem de servir bem ambos, com forte ênfase na experiência em telemóvel, uma vez que a maioria das pesquisas de restaurantes acontece em mobilidade. O alcance turístico exige suporte para **três idiomas**: Português (default), Inglês e Espanhol.

### 1.2 Goals

| ID | Objetivo | Como se traduz no produto |
|----|----------|---------------------------|
| G1 | Ser encontrável por quem procura o restaurante online | SEO técnico e de conteúdo, menu em HTML real, dados estruturados de negócio local |
| G2 | Transmitir identidade autêntica e apetitosa | Hero com impacto visual, galeria curada, tom acolhedor tradicional com apresentação moderna |
| G3 | Converter visita online em visita física | CTAs claros para "Como chegar", telefone e menu; localização e horários sempre acessíveis |
| G4 | Servir público local e turista estrangeiro | Multilingue: PT (default) / EN / ES com seletor de idioma |
| G5 | Entregar uma experiência rápida e acessível em qualquer dispositivo | Mobile-first, performance (Core Web Vitals), acessibilidade WCAG 2.1 AA |

### 1.3 Métrica de sucesso principal

Aumentar o número de visitantes que, tendo descoberto o restaurante online, se deslocam ao espaço físico — medido de forma proxy através de tráfego orgânico, cliques em "Como chegar" (abertura de mapa/rota) e cliques no número de telefone. Ver secção 7 para KPIs detalhados.

---

## 2. Personas / público-alvo

### 2.1 Persona A — Cliente local ("Manuel", 52 anos)

- **Contexto:** vive ou trabalha na zona, conhece ou ouviu falar do restaurante. Procura confirmar horário, ver o menu do dia/especialidades e o telefone.
- **Dispositivo:** telemóvel, muitas vezes já a caminho.
- **Necessidades:** informação rápida e fiável — está aberto? o que há hoje? qual o número para ligar?
- **Idioma:** Português.
- **Critério de sucesso:** encontra horário e telefone em menos de 10 segundos.

### 2.2 Persona B — Turista estrangeiro ("Sophie", 34 anos)

- **Contexto:** de férias na região, procura "authentic Portuguese food near me" ou segue recomendação. Não fala português.
- **Dispositivo:** telemóvel, em roaming ou Wi-Fi intermitente.
- **Necessidades:** perceber que tipo de cozinha é, ver fotos apetitosas, entender o menu na sua língua, e obter direções (rota no mapa).
- **Idioma:** Inglês ou Espanhol.
- **Critério de sucesso:** compreende a oferta e obtém rota para o restaurante sem barreira linguística.

### 2.3 Persona C — Pesquisador em descoberta ("Ana", 29 anos)

- **Contexto:** procura ativamente um sítio para almoçar/jantar em grupo. Compara várias opções em simultâneo no telemóvel.
- **Dispositivo:** telemóvel, sessão curta e comparativa.
- **Necessidades:** primeira impressão forte (fotos, ambiente), gama de pratos, e sinais de confiança (fotos reais de sala e clientes).
- **Idioma:** Português (predominante) ou um dos idiomas de turismo (EN/ES).
- **Critério de sucesso:** o site convence à primeira vista e diferencia-se da concorrência genérica.

---

## 3. Requisitos

### 3.1 Requisitos funcionais (FR)

| ID | Requisito |
|----|-----------|
| FR1 | O site deve apresentar uma **página inicial (hero)** com forte impacto visual, o nome e identidade do restaurante, uma frase de posicionamento e chamadas à ação primárias ("Ver menu" e "Como chegar"). |
| FR2 | O site deve apresentar um **menu visual** organizado por categorias (entradas, especialidades, peixe, grelhados no carvão, carne/porco, vinhos), com os nomes dos pratos em **texto HTML real** (não apenas imagens). |
| FR3 | Cada categoria de menu deve ser navegável e legível em telemóvel, com âncoras/navegação interna entre categorias. |
| FR4 | O site deve apresentar uma **galeria de fotos** de pratos e ambiente, com carregamento otimizado (lazy loading) e visualização ampliada (lightbox) em telemóvel e desktop. |
| FR5 | O site deve apresentar uma secção de **localização e contactos** com: morada, mapa incorporado com rota, horário de funcionamento, telefone (clicável — `tel:`), email (clicável — `mailto:`) e links para redes sociais. |
| FR6 | O botão/link "Como chegar" deve abrir a rota no serviço de mapas nativo do dispositivo (Google Maps / Apple Maps). |
| FR7 | O número de telefone deve ser clicável em telemóvel para iniciar chamada diretamente. |
| FR8 | O site deve suportar **três idiomas — Português (default), Inglês e Espanhol** — com um seletor de idioma visível e persistente em todas as páginas. |
| FR9 | Todo o conteúdo textual (menu, secções, navegação, metadados) deve estar disponível nas três línguas; a troca de idioma não deve recarregar a página para um estado perdido nem alterar a secção em que o utilizador está. |
| FR9a | O seletor de idioma deve ser usável em telemóvel (ex: dropdown/lista com nome nativo e bandeira/código), sem ocupar espaço excessivo no header. |
| FR10 | O menu, atualmente disponível apenas como imagens JPEG fotografadas, deve ser **transcrito para conteúdo estruturado** (dados/HTML) para permitir SEO, i18n e acessibilidade — ver Risco R1. |
| FR11 | O site deve expor uma navegação global consistente (header/menu) e um rodapé com contactos, horário resumido e seletor de idioma. |
| FR12 | O site deve incluir dados estruturados de **negócio local (Schema.org `Restaurant`/`LocalBusiness`)** com nome, morada, horário, telefone e geolocalização. |

### 3.2 Requisitos não-funcionais (NFR)

| ID | Requisito |
|----|-----------|
| NFR1 | **Performance** — o site deve cumprir os Core Web Vitals em bom nível: LCP < 2,5 s, CLS < 0,1, INP < 200 ms, medidos em 4G móvel. Imagens servidas em formatos modernos (WebP/AVIF) com dimensionamento responsivo. |
| NFR2 | **SEO** — cada página deve ter title e meta description únicos por idioma, tags Open Graph/Twitter Card, `hreflang` para as três línguas (com `x-default`), sitemap.xml multilingue, robots.txt e URLs limpos e legíveis. Menu indexável como texto. |
| NFR3 | **Acessibilidade** — conformidade WCAG 2.1 nível AA: contraste adequado, texto alternativo em todas as imagens (nas três línguas quando relevante), navegação por teclado, foco visível, HTML semântico e landmarks. |
| NFR4 | **Responsivo mobile-first** — o design deve ser concebido primeiro para telemóvel e escalar para tablet e desktop; nenhuma funcionalidade essencial pode depender de hover. O layout e o seletor de idioma devem acomodar as três línguas sem quebrar. |
| NFR5 | **Internacionalização (i18n)** — arquitetura de i18n prevista desde o início, com roteamento por idioma (`/pt`, `/en`, `/es`) e conteúdo externalizado em ficheiros de tradução; não pode haver strings fixas no código. A estrutura de conteúdo deve ser única e as traduções paralelas, mantendo o custo de manutenção baixo. |
| NFR6 | **Compatibilidade** — funcionamento correto nas duas últimas versões major de Chrome, Safari, Firefox e Edge, e em iOS Safari e Android Chrome. |
| NFR7 | **Manutenibilidade de conteúdo** — os textos e o menu devem viver em ficheiros de conteúdo/tradução editáveis sem alterar lógica, facilitando futuras atualizações de pratos e preços. |
| NFR8 | **Privacidade/legal** — aviso de cookies (se aplicável ao mapa/analytics), política de privacidade mínima e conformidade RGPD para qualquer recolha de dados. |
| NFR9 | **Disponibilidade** — alojamento em plataforma de edge/CDN (Vercel/Netlify) com HTTPS obrigatório e deploy contínuo a partir do repositório. |
| NFR10 | **Resiliência de conteúdo** — enquanto faltar conteúdo real (ver secção 9), o site deve degradar de forma controlada (placeholders claros) sem quebrar layout nem SEO. |

---

## 4. Épicos e stories de alto nível

O MVP está agrupado em **5 épicos**. As stories são de alto nível e servirão de base a detalhe posterior (critérios de aceitação por story a definir na fase de desenvolvimento).

### Epic 1 — Fundações técnicas, i18n e deployment

Estabelecer o esqueleto do projeto Next.js (App Router), o roteamento multilingue (três línguas), o pipeline de build/deploy e as bases de performance e SEO transversais.

| Story | Descrição |
|-------|-----------|
| Story 1.1 | Inicializar projeto Next.js (App Router) com estrutura de pastas, linting e convenções, e repositório versionado. |
| Story 1.2 | Configurar i18n com roteamento por idioma para as três línguas (`/pt`, `/en`, `/es`), idioma default PT e mecanismo de ficheiros de tradução escalável. |
| Story 1.3 | Implementar seletor de idioma global (header/rodapé) usável em telemóvel, que preserva a secção atual e persiste a escolha. |
| Story 1.4 | Configurar deployment contínuo (Vercel/Netlify) com HTTPS, previews por branch e domínio de staging. |
| Story 1.5 | Definir bases transversais de SEO (metadados por idioma, `hreflang`, sitemap, robots) e de performance (otimização de imagens, fontes). |

### Epic 2 — Página inicial (Hero) e identidade

Criar a primeira impressão: hero de impacto, posicionamento e navegação para as áreas-chave.

| Story | Descrição |
|-------|-----------|
| Story 2.1 | Implementar layout global (header com navegação, rodapé com contactos e seletor de idioma). |
| Story 2.2 | Construir a secção hero com imagem de impacto, nome, frase de posicionamento e CTAs primários ("Ver menu", "Como chegar"). |
| Story 2.3 | Adicionar secções introdutórias na página inicial (identidade/"quem somos" resumido, destaques de especialidades) alimentadas por conteúdo traduzível. |

### Epic 3 — Menu visual estruturado

Transformar os menus fotografados em conteúdo real, navegável, traduzível e indexável.

| Story | Descrição |
|-------|-----------|
| Story 3.1 | Transcrever os menus JPEG (`menu/`) para conteúdo estruturado (dados/ficheiros) por categoria, com pratos e, quando disponíveis, preços. |
| Story 3.2 | Construir a página/secção de menu por categorias (entradas, especialidades, peixe, grelhados no carvão, carne/porco, vinhos) com navegação interna. |
| Story 3.3 | Traduzir o conteúdo de menu para EN e ES (nomes de pratos com abordagem editorial adequada a cada idioma, com revisão humana). |
| Story 3.4 | Garantir versão do menu como texto HTML acessível e indexável (fallback/opção de descarregar imagem original, se desejado). |

### Epic 4 — Galeria e conteúdo visual

Apresentar pratos e ambiente de forma apetitosa e performante.

| Story | Descrição |
|-------|-----------|
| Story 4.1 | Otimizar e catalogar os assets de `fotos/` (pratos e ambiente/sala), com texto alternativo por imagem. |
| Story 4.2 | Construir galeria responsiva com lazy loading e lightbox. |
| Story 4.3 | Integrar imagens-chave nas secções (hero, destaques, menu) de forma coerente com a identidade. |

### Epic 5 — Localização, contactos e conversão

Fechar o ciclo de descoberta → visita física.

| Story | Descrição |
|-------|-----------|
| Story 5.1 | Construir secção de localização com mapa incorporado e botão "Como chegar" (rota nativa). |
| Story 5.2 | Apresentar horário de funcionamento, morada, telefone (`tel:`), email (`mailto:`) e redes sociais. |
| Story 5.3 | Implementar dados estruturados Schema.org `Restaurant`/`LocalBusiness`. |
| Story 5.4 | Adicionar aviso de cookies/privacidade e página de política mínima (RGPD). |

---

## 5. Requisitos de UX/design (direção, não design final)

Esta secção define a **direção**, não o design final (a cargo da fase de design/UI).

- **Mood:** tradicional e acolhedor, mas com apresentação moderna, limpa e apetitosa. Evitar clichés "rústicos" datados; procurar autenticidade elegante.
- **Emoção-alvo:** "isto parece bom e genuíno, quero ir lá comer".
- **Mobile-first:** todas as decisões de layout partem do telemóvel; conteúdo essencial (menu, horário, telefone, como chegar) sempre a poucos toques.
- **Fotografia como protagonista:** os pratos e o ambiente reais são o principal ativo emocional — o design serve a comida, não a substitui.
- **Paleta e tipografia:** sugerir tons quentes e naturais associados à cozinha regional; tipografia legível com um toque de carácter. Decisão final na fase de design.
- **Hierarquia clara:** CTAs de conversão ("Como chegar", telefone) sempre visíveis e distinguíveis.
- **Consistência multilingue:** o layout não pode partir quando os textos mudam de comprimento entre as três línguas (PT/EN/ES — testar overflow). O seletor de idioma deve permanecer usável em telemóvel.
- **Tom de escrita:** acolhedor e direto, em PT-PT autêntico; nas traduções, tom equivalente e natural (não literal).

---

## 6. Assunções técnicas

| ID | Assunção |
|----|----------|
| AT1 | **Framework:** Next.js com App Router (React). |
| AT2 | **Renderização:** site maioritariamente estático (SSG) — conteúdo pré-renderizado por idioma para máxima performance e SEO. |
| AT3 | **i18n:** roteamento por prefixo de idioma para três línguas (`/pt`, `/en`, `/es`), PT como default, conteúdo em ficheiros de tradução paralelos. |
| AT4 | **Alojamento:** plataforma edge/CDN tipo Vercel ou Netlify, com deploy contínuo a partir do repositório e HTTPS. |
| AT5 | **Imagens:** otimização via componente de imagem do Next.js (formatos modernos, responsivo, lazy loading). |
| AT6 | **Conteúdo:** menu e textos geridos como ficheiros de conteúdo/tradução no repositório (sem CMS no MVP). |
| AT7 | **Mapa:** incorporação de mapa (ex: Google Maps embed) e deep-link de rota para o serviço nativo do dispositivo. |
| AT8 | **Analytics:** ferramenta de analytics respeitadora de privacidade para medir os KPIs (ex: Vercel Analytics ou equivalente com consentimento). |
| AT9 | **Sem backend aplicacional** no MVP — não há base de dados, autenticação, reservas nem pagamentos. |

---

## 7. Métricas de sucesso e KPIs

| KPI | O que mede | Alvo indicativo (MVP + 3 meses) |
|-----|------------|--------------------------------|
| Tráfego orgânico | Sessões vindas de motores de busca | Tendência crescente mês a mês; indexação completa das três línguas |
| Cliques em "Como chegar" | Intenção de visita física (abertura de rota) | Proxy principal de conversão — monitorizar taxa sobre sessões |
| Cliques no telefone (`tel:`) | Intenção de contacto direto | Proxy secundário de conversão |
| Tempo médio no site / scroll do menu | Envolvimento com a oferta | Sessões que chegam ao menu e à galeria |
| Distribuição por idioma | Alcance do público turista | Volume mensurável de sessões nas línguas de turismo (EN/ES) |
| LCP (Core Web Vital) | Velocidade de carregamento móvel | < 2,5 s em 4G |
| CLS (Core Web Vital) | Estabilidade visual | < 0,1 |
| INP (Core Web Vital) | Responsividade à interação | < 200 ms |
| Cobertura de indexação SEO | Páginas indexadas por idioma | 100% das páginas-chave nas 3 línguas |

Nota: como não há transação online, a "conversão" é medida por **sinais de intenção** (rota + telefone), não por vendas.

---

## 8. Fora de âmbito / roadmap futuro

Explicitamente **fora do MVP**, listados como potencial evolução futura:

| Item | Fase futura sugerida |
|------|----------------------|
| Reservas online (mesa/data/hora) | Fase 2 |
| Encomendas / takeaway / entrega | Fase 2/3 |
| Blog / novidades / eventos | Fase 2 |
| Painel de gestão de conteúdo (CMS) | Fase 2 — quando a frequência de atualização o justificar |
| Menu do dia dinâmico | Fase 2 (depende de CMS) |
| Newsletter / captação de email | Fase 2 |
| Avaliações/testemunhos integrados (Google Reviews) | Fase 2 |
| Programa de fidelização | Fase 3 |

---

## 9. Open questions / dependências de conteúdo

O MVP **depende de conteúdo real do cliente** que ainda não está disponível. Sem estes dados, várias funcionalidades ficam com placeholders.

| ID | Dependência / questão | Bloqueia | Estado / Prioridade |
|----|-----------------------|----------|------------|
| OQ1 | **Morada exata + coordenadas** do restaurante | FR5, FR6, FR12 (mapa, rota, Schema) | Parcial — coordenadas GPS e embed do mapa obtidos (37,223819 / -7,571490); falta **morada postal** (rua + código postal + localidade) para Schema.org. Prioridade Alta |
| OQ2 | **Horário de funcionamento** completo (dias e horas, encerramentos) | FR5, FR12 | Em aberto — Crítica |
| OQ3 | **Contactos oficiais** — telefone e email | FR5, FR7 | Parcial — telefone confirmado (281 951 770); falta **email**. Prioridade Média |
| OQ4 | **Transcrição fiável dos menus** (pratos e preços atuais) a partir dos JPEG | FR2, FR10, Epic 3 | Resolvido — transcrição em `docs/menu-transcricao.md` e dados em `docs/content/menu.json`; a aguardar validação de preços pelo cliente |
| OQ5 | Links de **redes sociais** (Facebook, Instagram, etc.) | FR5 | Alta |
| OQ6 | **História/identidade** do restaurante (texto "quem somos", origem, tradição) | Epic 2 | Alta |
| OQ7 | Confirmação da **grafia oficial do nome** ("Casa de Pasto Fernanda") e existência de logótipo | Identidade/branding | Alta |
| OQ8 | **Domínio** pretendido e quem faz a gestão de DNS | Deployment | Média |
| OQ9 | Qualidade/direitos das **fotos** — algumas com nomes de ficheiro com gralhas e possível necessidade de tratamento (ver R2) | Epic 4 | Média |
| OQ10 | Existência de **preços fixos vs. variáveis** (ex: "preço do dia", peixe ao peso) — afeta como o menu é apresentado | Epic 3 | Média |
| OQ11 | Necessidade real de **aviso de cookies/RGPD** conforme analytics e mapa escolhidos | NFR8, Story 5.4 | Média |
| OQ12 | **Traduções profissionais** — quem fornece e revê os textos EN/ES? (custo, prazo e revisão nativa) | FR8, FR9, Epic 3 | Parcial — traduções de menu EN/ES já redigidas em `docs/content/menu.json` (rascunho editorial); falta **revisão por falante nativo** e tradução do restante conteúdo do site (hero, secções). Prioridade Média |

---

## 10. Riscos e mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|---------------|---------|-----------|
| R1 | **Menus apenas em imagem** — servir os JPEG diretamente destrói SEO, i18n e acessibilidade | Alta | Alto | Transcrever os menus para conteúdo estruturado (FR10, Story 3.1) como pré-requisito do Epic 3; imagem original apenas como fallback opcional. |
| R2 | **Qualidade e consistência dos assets** — fotos com gralhas de nome (`vitine`, `coeteletas-borrego`, `doce-tarte-alfarooba-figo`, `açorda-galinha-01`) e possível iluminação/enquadramento irregular | Média | Médio | Auditoria e catalogação dos assets (Story 4.1); normalizar nomes, recortar/tratar imagens fracas, descartar duplicados. |
| R3 | **Conteúdo real em falta** (morada, horário, contactos, história) atrasa o lançamento | Alta | Alto | Recolher OQ1–OQ7 o mais cedo possível; usar placeholders controlados (NFR10) para não bloquear desenvolvimento paralelo. |
| R4 | **Traduções de baixa qualidade** (nomes de pratos regionais difíceis de traduzir para EN/ES) prejudicam a perceção junto de turistas | Média | Médio | Abordagem editorial (não literal) com revisão humana por falante nativo de cada língua; manter nome original em PT + descrição traduzida quando fizer sentido. Custo de tradução a orçamentar. |
| R9 | **Manutenção de três línguas** — cada alteração de conteúdo repete-se por 3; risco de traduções desatualizadas | Média | Baixo | Estrutura de conteúdo única com traduções paralelas (NFR5); processo claro de atualização; fallback controlado para PT quando uma tradução faltar. |
| R5 | **Expectativa de reservas online** — utilizadores podem esperar reservar e frustrar-se por não poderem | Média | Médio | CTA claro para telefone como canal de reserva; comunicar que reservas são por chamada; roadmap Fase 2. |
| R6 | **Performance degradada por imagens pesadas** (fotos de comida em alta resolução) | Média | Médio | Otimização obrigatória (NFR1, AT5): WebP/AVIF, dimensionamento responsivo, lazy loading. |
| R7 | **Preços desatualizados** no menu sem CMS — alterações exigem novo deploy | Média | Baixo | Conteúdo em ficheiros editáveis (NFR7); avaliar CMS em Fase 2 se a frequência de alteração o justificar. |
| R8 | **Descoberta local fraca** por falta de sinais de negócio local | Média | Alto | Schema.org `Restaurant` (FR12), consistência NAP (nome/morada/telefone) e alinhamento com Google Business Profile do cliente. |

---

## Apêndice A — Inventário de assets disponíveis

### Imagens de menu (`menu/`) — fotografadas, a transcrever (ver R1/FR10)

| Ficheiro | Categoria de menu |
|----------|-------------------|
| `menu-capa.jpeg` | Capa |
| `entradas.jpeg` | Entradas |
| `especialidades.jpeg` | Especialidades |
| `peixe-especialidades-.jpeg` | Peixe / especialidades |
| `grelhados-carvao.jpeg` | Grelhados no carvão |
| `carne-porco.jpeg` | Carne / porco |
| `vinho-tinto.jpeg` | Vinhos tintos |
| `vinho-br-vr-rose.jpeg` | Vinhos branco / verde / rosé |

### Fotos de pratos e ambiente (`fotos/`)

- **Pratos:** `acorda-galinha.jpg` / `açorda-galinha-01.jpg`, `ensopado-javali.jpg`, `ensopado.jpg`, `arroz-cabidela.jpg`, `porco-iberico-plumas.jpg`, `grelhada-mista.jpg`, `espetada-mista.jpg`, `coeteletas-borrego.jpg` (gralha), `entrecosto.jpg`, `secreto.jpg`, `carapaus-fritos.jpg`, `conquilhas.jpg`, `peru.jpg`, `queijo-fresco.jpg`, `azeitonas.jpg`.
- **Doces:** `doce-torta-limao.jpg`, `doce-tarte-alfarooba-figo.jpg` (gralha), `doce-folhado-merengue.jpg`, `tarte-alfarroba.jpg`.
- **Ambiente/identidade:** `casa-de-pasto-fernanda.jpg`, `vitine.jpg` (gralha de "vitrine"), `clientes.jpg`, `clientes-01.jpg` a `clientes-06.jpg`.

Nota: nomes com gralha assinalados para normalização em Story 4.1 (ver R2).

---

## Apêndice B — Registo de decisões automáticas

Decisões tomadas de forma autónoma na elaboração deste PRD (a validar com o cliente):

- **[AUTO-DECISION]** Estrutura de roteamento i18n → prefixo de idioma `/pt` `/en` `/es` com PT default (razão: padrão SSG do Next.js, bom para `hreflang` e SEO). Nota de correção: a v1.1 introduziu erradamente 6 línguas (FR/IT/DE) por interpretação incorreta da data como um pedido; a v1.2 repõe o âmbito acordado de 3 línguas (PT/EN/ES).
- **[AUTO-DECISION]** Canal de "reserva" no MVP → telefone (`tel:`) em vez de formulário (razão: reservas online estão fora de âmbito; evita expectativa transacional).
- **[AUTO-DECISION]** Menu servido como HTML estruturado com imagem original apenas como fallback (razão: SEO/i18n/acessibilidade — R1).
- **[AUTO-DECISION]** Sem CMS no MVP; conteúdo em ficheiros de tradução (razão: simplicidade e performance; reavaliar em Fase 2 — R7).
