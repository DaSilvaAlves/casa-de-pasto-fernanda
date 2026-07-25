# Handoff Index — Casa de Pasto Fernanda e Campinas

Índice vivo de handoffs cross-sessão (protocolo `~/.claude/rules/handoff-central.md`).
Prefixo do projecto: `cpf-`. Handoffs pending em `docs/handoffs/*.yaml`; consumidos em `docs/handoffs/archive/`.

**Na activação de qualquer agente:** ler esta tabela; abrir o YAML de entradas com `to_agent` = próprio agente ou `any` antes de aceitar tarefas relacionadas; e **verificar o estado real** (git/ficheiros/plataforma) antes de agir — um handoff é uma foto do momento.

## Pending

| Data | Ficheiro | De → Para | Resumo | Ação seguinte |
|------|----------|-----------|--------|---------------|
| 2026-07-25 | [cpf-handoff-deploy-qrcode-20260725.yaml](handoffs/cpf-handoff-deploy-qrcode-20260725.yaml) | aiox-master → **devops** | Site completo e a compilar (Next.js, 6 idiomas, pedido self-service). Falta publicar: não é repo git, sem domínio. | git init + commit → deploy Vercel → domínio → atualizar SITE_URL (4 ficheiros) → gerar QR code das mesas |

## Archived

| Data | Ficheiro | De → Para | Resumo | Consumido por |
|------|----------|-----------|--------|---------------|
| — | — | — | — | — |
