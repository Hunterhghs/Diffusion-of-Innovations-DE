# Diffusion of Innovations in Development Economics

An analytical, interactive webpage exploring technology adoption and convergence in low-income agricultural and financial corridors. Designed with a professional consulting and economist aesthetic.

## Features
- **Theoretical Foundations Analysis**: Covers credit constraints, risk aversion, social learning network models, and supply chain infrastructure issues.
- **Interactive Bass Diffusion Model Simulator**: A dynamic S-curve simulator demonstrating how changing policy parameters (credit subsidies, weather index insurance, network density, infrastructure investments) modifies adoption speeds and ceilings.
- **Interactive Case Studies**: Deep dives into Suri & Jack (2016) on M-Pesa mobile money in Kenya, Conley & Udry (2010) on pineapple farming in Ghana (social learning), and Duflo et al. (2011) on nudging preventative health adoption.
- **Policy Matrix Table**: Summarizes specific policy levers, constraint targets, microeconomic mechanisms, and historical effectiveness scores.
- **Print Optimization**: Clean style overrides for high-quality printing to PDF via headless Google Chrome or direct print.

## Math Model Implementation
The simulator applies a discretized version of the **Bass Diffusion Model**:

$$\frac{dF(t)}{dt} = \left(p + q \frac{F(t)}{M}\right) (M - F(t))$$

Where:
- $p$ is the coefficient of innovation (external drivers: credit micro-subsidies, baseline advertising, distribution).
- $q$ is the coefficient of imitation (internal drivers: peer learning, village copying, risk dilution).
- $M$ is the potential market size adoption ceiling (physically limited by road, electricity, or telecom coverage).

## Local Development
To view the report locally:
1. Clone this repository.
2. Open `index.html` directly in any web browser, or run a local web server (e.g. `npx serve` or `python -m http.server`).

## Cloudflare Pages Deployment
This repository is optimized for frictionless deployment on **Cloudflare Pages**:
1. Connect your GitHub account to the Cloudflare dashboard.
2. Create a new Pages Project and link the `Diffusion-of-Innovations-DE` repository.
3. Configure the build settings:
   - **Framework Preset**: None (Static HTML/CSS/JS)
   - **Build Command**: Leave blank (no compilation step needed)
   - **Build Output Directory**: `/` (root directory)
4. Click **Save and Deploy**. Cloudflare will compile and deploy the static assets instantly.
