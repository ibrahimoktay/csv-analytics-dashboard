# CSV Analytics Dashboard

A modern, interactive analytics dashboard for visualizing AI/LLM usage data from CSV files.

## 🚀 Live Demo

**Deployed URL:** https://aboriginal-ball-6368.stage.vibecoding.sixt.cloud

## Features

### 📊 Interactive Visualizations
- **Cost Over Time** - Track spending trends with line charts
- **Cost by Model** - Pie chart breakdown of expenses per AI model
- **Cost by User** - Horizontal bar chart showing top spenders
- **Usage Timeline** - Area chart visualizing request volume over time
- **Token Breakdown** - Stacked bar chart with input/output/cache token metrics

### 📈 Analytics & Insights
- **Summary KPI Cards** - Total cost, requests, users, avg cost/request, total tokens
- **User Activity Table** - Sortable table with per-user statistics
- **Cache Efficiency** - Real-time calculation of cache hit rates
- **Quick Stats** - Date range, model usage, top spender insights

### 🎯 Advanced Filtering
- **Date Range Picker** - Custom date ranges with quick presets (7d, 14d, 30d, All)
- **Model Filter** - Multi-select filter to analyze specific AI models
- **User Filter** - Multi-select filter for per-user analysis
- **Search** - Quick search functionality in user activity table

### 💻 User Experience
- **Drag & Drop Upload** - Easy CSV file import with progress indicator
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, professional interface with Tailwind CSS
- **Real-time Updates** - Instant chart updates when applying filters

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **CSV Parser:** Papa Parse
- **Date Utilities:** date-fns
- **Deployment:** Vibe Platform (Kubernetes)

## CSV File Format

The dashboard expects CSV files with the following columns:

```csv
timestamp,model,kind,maxMode,requestsCosts,isTokenBasedCall,userEmail,readable_timestamp,inputTokens,outputTokens,cacheWriteTokens,cacheReadTokens,totalCents
```

### Column Descriptions:
- `timestamp` - Unix timestamp in milliseconds
- `model` - AI model used (e.g., claude-4-sonnet, claude-4-sonnet-thinking)
- `kind` - Usage type (e.g., "Included in Business", "Errored, Not Charged")
- `maxMode` - Boolean flag (True/False)
- `requestsCosts` - Cost per request
- `isTokenBasedCall` - Boolean flag (True/False)
- `userEmail` - User identifier
- `readable_timestamp` - Human-readable timestamp (ISO 8601)
- `inputTokens` - Number of input tokens
- `outputTokens` - Number of output tokens
- `cacheWriteTokens` - Number of cache write tokens
- `cacheReadTokens` - Number of cache read tokens
- `totalCents` - Total cost in cents

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sixt-vibe/aboriginal-ball-6368.git
cd aboriginal-ball-6368
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

This project is deployed on the Vibe Platform using:

```bash
# Build
vibectl build trigger --project csv-analytics-dashboard --commit <commit-sha>

# Deploy
vibectl deploy trigger --project csv-analytics-dashboard
```

## Usage

1. Navigate to https://aboriginal-ball-6368.stage.vibecoding.sixt.cloud
2. Drag and drop your CSV file or click to browse
3. Wait for the file to process (progress bar will show)
4. Explore your data with interactive charts and filters
5. Use filters to drill down into specific time periods, models, or users

## Project Structure

```
src/
├── components/
│   ├── charts/          # Chart components (Recharts)
│   ├── filters/         # Filter components
│   ├── stats/           # Summary card components
│   ├── Dashboard.tsx    # Main dashboard layout
│   └── FileUpload.tsx   # CSV upload component
├── hooks/
│   └── useCSVData.ts    # Data management hook
├── types/
│   └── usage.ts         # TypeScript interfaces
├── utils/
│   └── dataTransformers.ts  # Data aggregation utilities
├── App.tsx
└── main.tsx
```

## License

MIT

## Support

For issues or questions, please contact the development team.
