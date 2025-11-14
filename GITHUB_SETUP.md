# GitHub Setup Guide

This guide will help you push this project to GitHub.

## Prerequisites

- Git installed on your machine
- GitHub account
- GitHub repository created (empty or with README)

## Step-by-Step Instructions

### 1. Initialize Git Repository (if not already initialized)

```bash
# Navigate to project root
cd D:\microservices-assignment

# Initialize git (if not already done)
git init
```

### 2. Add All Files to Git

```bash
# Add all files
git add .

# Check what will be committed
git status
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: Microservices application with Product and Order services"
```

### 4. Connect to GitHub Repository

```bash
# Add your GitHub repository as remote origin
# Replace <your-username> and <your-repo-name> with your actual values
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Verify remote was added
git remote -v
```

### 5. Push to GitHub

```bash
# Push to main branch (or master if that's your default)
git branch -M main
git push -u origin main
```

If you're using `master` as your default branch:

```bash
git push -u origin master
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository and push
gh repo create <your-repo-name> --public --source=. --remote=origin --push
```

## What Gets Pushed

The `.gitignore` file ensures the following are **NOT** pushed to GitHub:

- ✅ `node_modules/` - Dependencies (will be installed via `npm install`)
- ✅ `dist/` - Build outputs
- ✅ `.env` - Environment variables (use `.env.example` as template)
- ✅ `*.log` - Log files
- ✅ `coverage/` - Test coverage reports
- ✅ IDE configuration files

## What Gets Pushed

- ✅ Source code (`src/` directories)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Docker Compose file
- ✅ Database initialization scripts
- ✅ Documentation (README.md, API_DOCUMENTATION.md)
- ✅ `.env.example` files (templates for environment variables)

## After Pushing

### For Other Developers

They can clone and setup the project:

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Start database
docker-compose up -d

# Setup Product Service
cd product-service
npm install
cp .env.example .env
npm run start:dev

# Setup Order Service (in new terminal)
cd order-service
npm install
cp .env.example .env
npm run start:dev
```

## Branch Strategy (Optional)

For better collaboration, consider using branches:

```bash
# Create and switch to development branch
git checkout -b develop

# Make changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push -u origin develop
```

## Common Git Commands

```bash
# Check status
git status

# View commit history
git log

# Pull latest changes
git pull origin main

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature
```

## Troubleshooting

### Issue: "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

### Issue: "failed to push some refs"

```bash
# Pull and merge remote changes first
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

### Issue: Large file size

If you accidentally committed large files:

```bash
# Remove from git history (use with caution)
git rm --cached <large-file>
git commit -m "Remove large file"
git push
```

## Repository Settings on GitHub

After pushing, consider:

1. **Add description** - Describe your project
2. **Add topics** - Add tags like `nestjs`, `microservices`, `postgresql`, `typescript`
3. **Add README badges** - Show build status, license, etc.
4. **Set up branch protection** - Protect main/master branch
5. **Add collaborators** - If working in a team

## Security Notes

⚠️ **Important**: Never commit:
- `.env` files with real credentials
- API keys or secrets
- Database passwords
- Private keys

The `.gitignore` file is configured to prevent this, but always double-check before committing.

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Add repository description and topics
3. ✅ Consider adding CI/CD (GitHub Actions)
4. ✅ Add license file (if needed)
5. ✅ Set up issue templates
6. ✅ Add contribution guidelines

