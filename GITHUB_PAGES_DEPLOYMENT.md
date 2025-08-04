# GitHub Pages Deployment Guide

## ✅ Application Ready for GitHub Pages

The Initiative Dashboard is now fully configured for GitHub Pages deployment with automated CI/CD.

## Step-by-Step GitHub Pages Setup

### 1. Create a New GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository" (green button)
3. Repository name: `repository-name` (replace with your desired name)
4. Make it **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license (we have our own files)
6. Click "Create repository"

### 2. Push Your Code to GitHub

From your project directory, run these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Initiative Dashboard application"

# Add GitHub remote (replace YOUR_USERNAME and repository-name)
git remote add origin https://github.com/YOUR_USERNAME/repository-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **"GitHub Actions"**
5. Click **Save**

### 4. Configure Repository Settings (if needed)

The application will automatically deploy when you push to the `main` branch.

## Deployment URLs

Once deployed, your application will be available at:

**If repository is named `repository-name`:**
```
https://YOUR_USERNAME.github.io/repository-name/
```

**If repository is named `YOUR_USERNAME.github.io`:**
```
https://YOUR_USERNAME.github.io/
```

## Example URLs

For a user `johndoe` with repository `initiative-dashboard`:
- **URL**: https://johndoe.github.io/initiative-dashboard/

For a user `johndoe` with repository `johndoe.github.io`:
- **URL**: https://johndoe.github.io/

## Deployment Process

### Automatic Deployment (Recommended)
The GitHub Actions workflow will automatically:
1. Trigger on every push to `main` branch
2. Install dependencies
3. Build the application with correct base path
4. Deploy to GitHub Pages
5. Your site will be live in 2-5 minutes

### Manual Deployment (Alternative)
If you prefer manual deployment:

```bash
# Build and deploy manually
npm run build-and-deploy
```

## Configuration Details

### What's Been Added/Modified for GitHub Pages:

1. **gh-pages package**: Added to devDependencies
2. **Deploy scripts**: Added to package.json
3. **GitHub Actions workflow**: `.github/workflows/deploy.yml`
4. **Next.js configuration**: Updated for base path handling
5. **Jekyll bypass**: `.nojekyll` file included

### Environment Variables

The deployment automatically sets:
- `NEXT_PUBLIC_BASE_PATH`: Set to `/repository-name` for proper asset loading

## Troubleshooting

### If the site doesn't load correctly:

1. **Check GitHub Actions**: Go to repository → Actions tab → Check if deployment succeeded
2. **Check Pages Settings**: Settings → Pages → Ensure source is "GitHub Actions"
3. **Wait**: Initial deployment can take 5-10 minutes
4. **Clear browser cache**: Force refresh (Ctrl+F5 or Cmd+Shift+R)

### If assets don't load:

1. **Check base path**: Ensure repository name matches the configured base path
2. **Check build logs**: Actions tab → Latest workflow → Check for errors

### Common Issues:

1. **Repository must be public** for free GitHub Pages
2. **Branch must be `main`** (not `master`)
3. **Wait for Actions to complete** before testing

## Verification Steps

After deployment:

1. ✅ Visit `https://YOUR_USERNAME.github.io/repository-name/`
2. ✅ Upload the sample CSV file (`Initiatives_July2025.csv`)
3. ✅ Verify all 7 metrics display correctly
4. ✅ Check that charts render properly
5. ✅ Test export functionality
6. ✅ Verify responsive design

## File Structure for GitHub Pages

```
your-repo/
├── .github/workflows/deploy.yml    # Auto-deployment workflow
├── dist/                          # Built files (auto-generated)
├── src/                           # Source code
├── .nojekyll                      # GitHub Pages config
├── next.config.js                 # Next.js config with base path
├── package.json                   # Scripts include gh-pages
└── README.md                      # Documentation
```

## Success! 🎉

Your Initiative Dashboard will be live at:
**`https://YOUR_USERNAME.github.io/repository-name/`**

The application is fully functional with:
- CSV file upload and validation
- All 7 core metrics calculations
- Interactive charts and visualizations
- Team statistics and insights
- Data persistence and export
- Responsive design

No server required - it's a complete client-side application!
