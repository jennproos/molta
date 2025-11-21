# Molta Bakery

A small pop-up bakery website serving freshly baked Rye, Brioche, and other breads and treats using stone ground wheat. Based in Grand Rapids, MI.

**Live Site:** [moltabakery.com](https://moltabakery.com/)

## Repository Overview

This repository contains the complete website infrastructure and deployment pipeline for Molta Bakery, built using AWS services and automated with GitHub Actions.

## Repository Structure

```
molta/
├── web/              # Static website files
├── infra/            # AWS CDK infrastructure code
└── .github/          # GitHub Actions workflows
```

## Components

### 1. Web (`web/`)

The static website for Molta Bakery, featuring:
- **index.html** - Main landing page with bakery information and ordering link
- **styles.css** - Custom styling for the website
- **images/** - Product photos and visual assets

The website is a simple, elegant static site that showcases the bakery's offerings and provides a direct link to order through HotPlate.

### 2. Infrastructure (`infra/`)

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

### 3. Deployment Automation (`.github/workflows/`)

**deploy-website.yaml** - GitHub Actions workflow that automatically:
- Triggers on push to `main` branch (when `web/` files change)
- Syncs website files to S3 bucket
- Configures S3 bucket for static website hosting
- Can also be manually triggered via workflow_dispatch

**Deployment Process:**
1. Push changes to the `web/` directory
2. GitHub Actions automatically deploys to S3
3. CloudFront serves the updated content globally
4. Changes are live at moltabakery.com

## Getting Started

### Prerequisites

- AWS CLI configured with appropriate credentials
- Python 3.13+ (for infrastructure development)
- Node.js and npm (for AWS CDK)
- AWS CDK Toolkit installed (`npm install -g aws-cdk`)

### Deploying Infrastructure

```bash
cd infra
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cdk deploy
```

### Updating the Website

Simply edit files in the `web/` directory and push to the `main` branch. The GitHub Actions workflow will automatically deploy your changes.

For manual deployment:
```bash
cd web
aws s3 sync . s3://moltabakery.com --delete
```

## Architecture

```
User Request
    ↓
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
S3 Bucket (Static Website)
```

**Security:**
- All traffic redirected to HTTPS
- ACM certificate for SSL/TLS encryption
- CloudFront provides DDoS protection

## Development Workflow

1. **Infrastructure Changes:** Modify CDK code in `infra/`, run tests, deploy with `cdk deploy`
2. **Website Changes:** Edit files in `web/`, commit and push to trigger auto-deployment
3. **Testing:** Run infrastructure tests with `cd infra && ./run-tests.sh`

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
