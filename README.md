# Initiative Metrics Dashboard

A web-based analytics application that processes CSV data files containing organizational initiative data and displays comprehensive metrics and insights through an interactive dashboard interface.

## Features

- **CSV File Upload & Validation**: Drag-and-drop or click-to-browse file upload with comprehensive validation
- **7 Core Metrics**: Automated calculation of key performance indicators
- **Interactive Charts**: Visual representation of initiative data
- **Team Statistics**: Performance breakdown by team members
- **Insights Generation**: Automated analysis and observations
- **Data Persistence**: Browser-based storage with export capabilities
- **Responsive Design**: Optimized for desktop and tablet viewing

## Core Metrics

1. **Initiative Throughput (Monthly)** - Completed vs. started initiatives
2. **Average Days in Progress** - Mean duration for "In Progress" status
3. **Initiative Aging** - Items without updates in 14+ days
4. **Cross-Team Dependencies** - Initiatives blocked by external dependencies
5. **Say/Do Ratio** - Quarterly completion rate of committed initiatives
6. **Strategic Coverage** - Percentage of work mapped to strategic priorities
7. **Initiative Lead Time** - Average days from proposal to execution start

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository or extract the project files
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:
```bash
npm run build
```

The application will be built as a static site in the `dist` directory, ready for deployment to GitHub Pages, S3, or any static hosting service.

### GitHub Pages Deployment

This application is fully configured for GitHub Pages deployment:

```bash
# Build and deploy to GitHub Pages
npm run build-and-deploy
```

**See `GITHUB_PAGES_DEPLOYMENT.md` for complete step-by-step instructions.**

Once deployed to a repository named `repository-name`, your dashboard will be available at:
```
https://YOUR_USERNAME.github.io/repository-name/
```

## Usage

1. **Upload CSV File**: Click or drag-and-drop your initiative CSV file
2. **Validation**: The system validates your data against the expected schema
3. **Processing**: Data is analyzed and metrics are calculated automatically
4. **Dashboard**: View your results in the interactive dashboard
5. **Export**: Download your analysis results as JSON

## CSV Format

The application expects a CSV file with the following columns:

- Initiative Name
- Owner
- Strategic Area
- Status (Completed, In Progress, Blocked, Planned)
- Start Date
- Committed Date
- Completion Date
- Days in 'In Progress'
- Completion %
- Blocker Description
- Last Updated
- Notes / Comments

## Data Security

- All processing occurs client-side (no server transmission)
- Data is stored in browser localStorage only
- No external API calls for data processing
- No user authentication required

## Technology Stack

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Chart.js with React integration
- **Data Processing**: PapaParse for CSV handling
- **Build**: Next.js static site generation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This application follows TypeScript best practices with proper type definitions and separation of concerns between UI components and business logic.

## License

Private - Internal use only
