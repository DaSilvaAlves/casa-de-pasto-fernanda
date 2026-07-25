# Casa de Pasto Fernanda e Campinas — Site

Site vitrine (Next.js 15 · App Router · TypeScript · Tailwind CSS v4) do restaurante
Casa de Pasto Fernanda e Campinas, em Vila Nova de Cacela (Algarve).

Trilingue: Português (default) · Inglês · Espanhol, com roteamento por prefixo `/pt`, `/en`, `/es`.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000  (redireciona para /pt)
npm run build    # build de produção
npm start        # servir o build
```

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| `app/[locale]/` | Layout e página por idioma (SSG) |
| `components/` | Header, Hero, Specialties, MenuSection, Gallery, Location, Footer, JsonLd |
| `i18n/` | Configuração de locales e dicionários de UI (`pt`/`en`/`es`) |
| `content/menu.json` | Ementa estruturada trilingue |
| `content/info.json` | Dados do restaurante (contactos, morada, horário, GPS) |
| `lib/` | Carregamento de conteúdo, formatação de preços, galeria |
| `public/menu/`, `public/fotos/` | Imagens |
| `middleware.ts` | Redireciona `/` para o idioma detetado |

## Conteúdo

Para atualizar a ementa, editar `content/menu.json`. Para contactos/horário, `content/info.json`.
Os textos de interface estão em `i18n/dictionaries/{pt,en,es}.json`.

## Pendente (conteúdo do cliente)

- Email oficial e Instagram (`content/info.json`)
- Validação de preços da ementa (ver `docs/menu-transcricao.md`)
- Revisão nativa das traduções EN/ES
- Domínio final (o código assume `casadepastofernanda.pt` em SEO/sitemap — ajustar)
