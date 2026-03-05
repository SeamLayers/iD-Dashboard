# iD+ by Mhawer — Web Admin Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/next--intl-i18n-66FCF1?style=for-the-badge" alt="i18n" />
  <img src="https://img.shields.io/badge/Theme-Dark_Mode-0B0C10?style=for-the-badge" alt="Dark Mode" />
</p>

An ultra-premium, dark-mode B2B SaaS admin dashboard for **iD+** — a smart digital business card platform by **Mhawer**. Built with Next.js 16, featuring glassmorphism design, glowing cyan/teal accents, full RTL/LTR internationalization (Arabic & English), and interactive data management.

---

## ✨ Features

| Screen | Description |
|--------|-------------|
| **Dashboard** | Glassmorphic metric cards (clickable), engagement area chart, real-time activity feed |
| **Employees** | Searchable/filterable data table, Add/Edit/Delete modals, pagination, toast notifications |
| **Card Templates** | Split-screen builder with logo upload, color pickers, toggle switches, 3D flipping business card preview |
| **CRM Leads** | Kanban board (4 columns) + List view toggle, lead cards with source tracking |
| **Settings** | 5-tab layout — Profile, Organization, Appearance (language toggle), Notifications, Security |

### 🌐 Internationalization
- Full **Arabic (RTL)** and **English (LTR)** support
- Language switcher in the top navbar and Settings > Appearance
- Dynamic `dir` and `lang` attributes on `<html>`
- RTL-aware CSS using `.rtl` / `.ltr` parent selectors

### 🎨 Design System
- **Theme**: Obsidian Black dark mode with glowing Cyan (#66FCF1) / Teal (#45A29E) accents
- **Style**: Glassmorphism (frosted panels, backdrop blur, subtle borders)
- **Icons**: [Lucide React](https://lucide.dev/) — consistent, crisp SVG icons
- **Charts**: [Recharts](https://recharts.org/) — responsive area charts
- **Typography**: System font stack with premium weights

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/MohamedElgohary88/iD-by-Mhawer-Dashboard.git
cd iD-by-Mhawer-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── messages/
│   ├── en.json              # English translations
│   └── ar.json              # Arabic translations
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.js    # Root layout (i18n provider, RTL/LTR)
│   │       ├── page.js      # Dashboard home
│   │       ├── employees/   # Employee management
│   │       ├── templates/   # Smart card builder
│   │       ├── leads/       # CRM Kanban pipeline
│   │       ├── settings/    # Settings (5 tabs)
│   │       └── globals.css  # Complete design system
│   ├── components/
│   │   ├── Dashboard.js     # Metrics, chart, activity feed
│   │   ├── Sidebar.js       # Navigation with active detection
│   │   ├── TopNavbar.js     # Search, notifications, profile
│   │   └── LanguageSwitcher.js
│   ├── i18n.js              # next-intl request config
│   ├── i18n/routing.js      # Locale routing & navigation
│   └── middleware.js        # Locale detection middleware
├── next.config.mjs
└── package.json
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [next-intl](https://next-intl.dev/) | Internationalization (i18n) |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Recharts](https://recharts.org/) | Data visualization |

---

## 🗺 Routes

| Path | Page |
|------|------|
| `/` | Dashboard (redirects to default locale) |
| `/en` | Dashboard (English) |
| `/ar` | Dashboard (Arabic / RTL) |
| `/[locale]/employees` | Employee Directory |
| `/[locale]/templates` | Smart Card Builder |
| `/[locale]/leads` | CRM Leads Pipeline |
| `/[locale]/settings` | Settings |

---

## 📄 License

This project is proprietary software developed for **iD+ by Mhawer**.

---

<p align="center">
  Built with ❤️ for <strong>iD+ by Mhawer</strong>
</p>
