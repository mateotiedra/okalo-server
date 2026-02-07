# Okalo Project Notes (Taky's Ownership)

*Started: 2026-02-06*

## Architecture Overview

### Backend (okalo-server)
- **Framework:** Express.js
- **Database:** MySQL via Sequelize ORM
- **Auth:** JWT tokens
- **Email:** Nodemailer (SendGrid SMTP)
- **Hosting:** Lab server (pm2 + nginx + Let's Encrypt)
- **URL:** https://api.okalo.ch

**Structure:**
```
app/
├── controllers/  # Business logic (auth, bid, book, mail, user, institution, admin)
├── models/       # Sequelize models (user, book, bid, institution)
├── routes/       # API endpoints
├── middlewares/  # Auth, validation, finders
└── helpers/      # Utilities
```

~1570 lines of JS. Clean MVC pattern.

### Frontend (okalo-client)
- **Framework:** React
- **UI:** Material UI (theme folder)
- **Hosting:** Currently Netlify → migrating to lab server
- **URL:** https://www.okalo.ch

**Structure:**
```
src/
├── components/   # 20 reusable components
├── pages/        # 16 page components
├── helpers/      # API calls (AxiosHelper), utilities
├── config/       # AppConfig (API URL env vars)
├── theme/        # MUI customization
└── assets/       # Static files
```

## Domain Model

- **User:** Students, has institutions
- **Institution:** Schools (26 Geneva schools loaded)
- **Book:** Textbooks with ISBN, title, etc.
- **Bid:** Buy/sell offers linking users and books

## Security Audit (2026-02-06)

**Status (after npm audit fix):** 10 vulnerabilities remaining (1 critical, 8 high, 1 moderate)

**Fixed by npm audit fix (22:15):**
- body-parser, express, and 20+ transitive deps updated
- Reduced from 32 → 10 vulnerabilities

**Remaining (need major version testing):**
| Package | Issue | CVSS | Required Version |
|---------|-------|------|-----------------|
| mysql2 | RCE via readCodeFor | 9.8 | 3.16.3 (major) |
| sequelize | SQL injection via replacements | 10.0 | 6.19.1+ |
| jsonwebtoken | Various | - | Major bump |
| axios | CSRF/SSRF | - | 1.x (major) |

**Next step:** Test major version bumps in a branch before production deployment.

## TODO / Ideas

- [x] Security audit (found issues above)
- [x] Run npm audit fix (non-breaking) — done 2026-02-06
- [ ] Explore codebase in detail
- [ ] Identify deprecated deps or security issues
- [ ] Check for obvious performance improvements
- [ ] Document API endpoints
- [ ] Migrate frontend to lab server
- [ ] Add monitoring/alerting

## Uncommitted Changes (Migration)

**Status:** Changes made during lab server migration, not yet pushed.

| File | Change | Reason |
|------|--------|--------|
| `server.js` | Skip db.sequelize.sync() in production mode | Prevents accidental schema changes on live DB |
| `app/models/db.model.js` | Connection config for local MySQL | Using .env instead of JAWSDB_URL |
| `app/controllers/*.js` | Minor adjustments | Migration compatibility |
| `package-lock.json` | Updated deps | npm audit fix (32→10 vulns) |

**Action needed:** Once GitHub push access confirmed, create a migration branch and commit these.

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-06 | Migrated backend from Heroku to lab | Heroku subscription cancelled |
| 2026-02-06 | Using pm2 for process management | Auto-restart, logging |
| 2026-02-06 | SSL via Let's Encrypt + certbot | Free, auto-renewing |
