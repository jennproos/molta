# Molta Bakery

A small pop-up bakery website serving freshly baked Rye, Brioche, and other breads and treats using stone ground wheat. Based in Grand Rapids, MI.

**Live Site:** [moltabakery.com](https://moltabakery.com/)

## Repository Overview

This repository contains the complete website infrastructure and deployment pipeline for Molta Bakery, built using a Next.js frontend, AWS services, and automated with GitHub Actions.

## Repository Structure

```
molta/
├── web/                    # Next.js website (static export)
├── studio-molta-bakery/    # Sanity Studio (content management)
├── infra/                  # AWS CDK infrastructure code
└── .github/                # GitHub Actions workflows
```

## Components

### 1. Web (`web/`)

The website for Molta Bakery, built with [Next.js](https://nextjs.org) (App Router) using TypeScript and React. It is configured for [static export](https://nextjs.org/docs/app/guides/static-exports) (`output: 'export'` in `next.config.ts`), so `npm run build` produces a fully static site in `web/out/` that is hosted on S3 and served via CloudFront.

Key files and directories:
- **app/** - App Router pages, layout, and global styles (`page.tsx`, `layout.tsx`, `globals.css`)
- **components/** - Reusable React components (Hero, About, Markets, Nav, Footer, Ticker, etc.)
- **lib/sanity.ts** - Sanity client and GROQ queries used at build time
- **public/** - Static assets (product photos and images)
- **next.config.ts** - Next.js configuration (static export, unoptimized images)

The site showcases the bakery's offerings and provides a direct link to order through HotPlate. See [web/README.md](web/README.md) for frontend development details.

### 2. Sanity Studio (`studio-molta-bakery/`)

The content management system for Molta Bakery, hosted at [moltabakery.sanity.studio](https://moltabakery.sanity.studio). Built with [Sanity](https://sanity.io) (project ID: `c8c5zb1s`, dataset: `production`).

Content types managed through the Studio:
- **Market Schedule** — individual market events with date, location, and time
- **About** — the about section text (singleton, Portable Text)
- **Gallery Photos** — images with descriptions for future use

When content is published in the Studio, a Sanity webhook fires a `repository_dispatch` event to GitHub Actions, triggering an automatic site rebuild and deploy (~2 minutes to live).

To run the Studio locally:
```bash
cd studio-molta-bakery
npm install
npm run dev
```

### 3. Infrastructure (`infra/`)

AWS CDK (Cloud Development Kit) infrastructure written in Python that provisions:
- **S3 Bucket** - Hosts the static website files with public read access
- **CloudFront Distribution** - CDN for fast, global content delivery with HTTPS
- **Route 53** - DNS management for both root domain and www subdomain
- **ACM Certificate** - SSL/TLS certificate for secure HTTPS connections

**Key Features:**
- Infrastructure as Code (IaC) using AWS CDK
- Comprehensive test suite covering all infrastructure components
- Easy-to-use test runner script (`run-tests.sh`)

For detailed infrastructure documentation, see [infra/README.md](infra/README.md)

**Infrastructure Testing:**
```bash
cd infra
./run-tests.sh
```

### 4. CI/CD Automation (`.github/workflows/`)

**test-infra.yaml** - Continuous Integration workflow that:
- Runs on pull requests to `main` branch (when `infra/` files change)
- Executes the complete infrastructure test suite
- Prevents merging if tests fail (when branch protection is enabled)
- Uses Python 3.13 and caches dependencies for fast runs

**deploy-website.yaml** - Deployment workflow that automatically:
- Triggers on push to `main` (when `web/` files change), `workflow_dispatch`, or `repository_dispatch` from the Sanity webhook
- Sets up Node.js, installs dependencies (`npm ci`), and builds the static export (`npm run build`)
- Syncs the generated `web/out/` directory to the S3 bucket
- Invalidates the CloudFront cache so changes are served immediately

**Deployment is triggered two ways:**
1. **Code change** — push to `web/` on `main` → GitHub Actions builds and deploys
2. **Content change** — publish in Sanity Studio → webhook fires `repository_dispatch` → GitHub Actions builds and deploys (~2 min to live)

## Getting Started

### Prerequisites

- AWS CLI installed and configured (run `aws configure` to set up your credentials and default region)
- Node.js 20+ and npm (for the website and AWS CDK)
- Python 3.13+ (for infrastructure development)
- AWS CDK Toolkit installed (`npm install -g aws-cdk`)

### Running the Website Locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. To produce the static export locally:

```bash
cd web
npm run build   # outputs to web/out/
```

### Deploying Infrastructure

```bash
cd infra
source auth.sh                 # authenticate and export AWS credentials into your shell
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cdk deploy
```

> **Note:** `auth.sh` must be run with `source` (not executed directly) so the exported credentials persist in your current shell session. See [infra/README.md](infra/README.md) for more detail.

### Updating Content

Log in at [moltabakery.sanity.studio](https://moltabakery.sanity.studio) to update the market schedule, about text, or gallery photos. Publishing a change automatically triggers a site rebuild.

### Updating the Website

Simply edit files in the `web/` directory and push to the `main` branch. The GitHub Actions workflow will automatically deploy your changes.

For manual deployment:
```bash
cd web
npm ci
npm run build
aws s3 sync out/ s3://moltabakery.com --delete
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

## Architecture

```
Content update (Sanity Studio)
    ↓
Sanity webhook → GitHub Actions
    ↓
Next.js build (fetches content from Sanity API)
    ↓
Static export → S3 Bucket
    ↑
User Request → Route 53 → CloudFront → S3
```

**Security:**
- All traffic redirected to HTTPS
- ACM certificate for SSL/TLS encryption
- CloudFront provides DDoS protection

## Development Workflow

1. **Content Changes:** Edit in [moltabakery.sanity.studio](https://moltabakery.sanity.studio) and publish — site rebuilds automatically
2. **Website Changes:** Edit the Next.js app in `web/` (test locally with `npm run dev`), commit and push to trigger an automatic build and deployment
3. **Infrastructure Changes:** Modify CDK code in `infra/`, run tests, deploy with `cdk deploy`
4. **Testing:** Run infrastructure tests with `cd infra && ./run-tests.sh`

## Branch Protection & Quality Gates

To ensure code quality, this repository uses GitHub Actions for automated testing. To require tests to pass before merging:

### Setting Up Branch Protection

1. Go to your GitHub repository **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Configure the rule:
   - **Branch name pattern:** `main`
   - **Require a pull request before merging:** ✅ Check this
   - **Require status checks to pass before merging:** ✅ Check this
   - **Status checks that are required:**
     - Select `test / Test Infrastructure` (appears after first workflow run)
   - **Require branches to be up to date before merging:** ✅ Check this
4. Click **Create** or **Save changes**

Once configured, all pull requests to `main` must pass the infrastructure tests before they can be merged.

## Dependency Management

This repository uses Dependabot to automatically monitor and update dependencies:

- **Python Dependencies** - AWS CDK libraries and pytest are checked weekly
- **GitHub Actions** - Action versions are monitored for security updates
- **Automated PRs** - Dependabot creates pull requests for dependency updates
- **Grouped Updates** - Related packages (like AWS CDK) are grouped together

Dependabot configuration: `.github/dependabot.yml`

## Links

- Website: [moltabakery.com](https://moltabakery.com/)
- Order Online: [hotplate.com/molta](https://hotplate.com/molta)
