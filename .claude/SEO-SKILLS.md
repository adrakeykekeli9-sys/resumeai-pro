# Skills SEO installés (licence MIT)

| Dossier | Source | Rôle |
|---|---|---|
| `skills/seo`, `skills/seo-*`, `agents/seo-*` | https://github.com/AgriciDaniel/claude-seo (v2.6.3) | Audit SEO complet : technique, schema, sitemap, hreflang, contenu E-E-A-T, GEO |
| `skills/geo-optimizer` | https://github.com/Auriti-Labs/geo-optimizer-skill | Visibilité dans les moteurs IA (ChatGPT, Perplexity, AI Overviews) ; outil `geo` |
| `skills/gsc-*`, `mcp/google-search-console` | https://github.com/surendranb/google-search-console-mcp | Méthodes d'analyse Search Console. Les données viennent du connecteur OpenSEO (`get_search_console_performance`, `inspect_urls`) |
| `skills/openseo-*` | https://github.com/every-app/open-seo | Recherche de mots-clés, concurrents, audits, rapports via le connecteur claude.ai OpenSEO (outils `mcp__OpenSEO__*`, projet 32bcece2-29fe-4a2d-8d68-d0912fecca32, Search Console `sc-domain:opportunite-emplois.org` déjà relié) |

Les skills d'OpenSEO sont préfixés `openseo-` et ceux de Search Console `gsc-` pour éviter les doublons de noms.

## Mise en route dans une nouvelle session

```bash
pip install geo-optimizer-skill
/home/user/resumeai-pro/.claude/skills/seo/scripts/claude-seo setup
```

Limite connue : dans Claude Code sur le web, l'outil `geo` refuse les adresses car le conteneur ne résout pas le DNS lui-même ; les audits se font alors sur les fichiers construits (`sites/opportunite-emplois/dist`) en suivant les listes de contrôle des skills.

## Crédits OpenSEO

Les lectures Search Console, l'inspection d'URL et le contexte du projet sont gratuits. La recherche de mots-clés, les SERP, les backlinks et les audits consomment des crédits : demander l'accord du propriétaire avant toute recherche payante importante.
