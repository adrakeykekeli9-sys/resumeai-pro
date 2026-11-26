# Skills SEO installés (licence MIT)

| Dossier | Source | Rôle |
|---|---|---|
| `skills/seo`, `skills/seo-*`, `agents/seo-*` | https://github.com/AgriciDaniel/claude-seo (v2.6.3) | Audit SEO complet : technique, schema, sitemap, hreflang, contenu E-E-A-T, GEO |
| `skills/geo-optimizer` | https://github.com/Auriti-Labs/geo-optimizer-skill | Visibilité dans les moteurs IA (ChatGPT, Perplexity, AI Overviews) ; outil `geo` |
| `skills/gsc-*`, `mcp/google-search-console` | https://github.com/surendranb/google-search-console-mcp | Analyses Search Console (serveur MCP : nécessite des identifiants Google OAuth) |
| `skills/openseo-*` | https://github.com/every-app/open-seo | Recherche de mots-clés, concurrents, rapports (nécessite l'MCP OpenSEO : compte openseo.so ou auto-hébergé) |

Les skills d'OpenSEO sont préfixés `openseo-` et ceux de Search Console `gsc-` pour éviter les doublons de noms.

## Mise en route dans une nouvelle session

```bash
pip install geo-optimizer-skill
/home/user/resumeai-pro/.claude/skills/seo/scripts/claude-seo setup
```

Limite connue : dans Claude Code sur le web, l'outil `geo` refuse les adresses car le conteneur ne résout pas le DNS lui-même ; les audits se font alors sur les fichiers construits (`sites/opportunite-emplois/dist`) en suivant les listes de contrôle des skills.
