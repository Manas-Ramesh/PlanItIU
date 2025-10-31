# Git Setup for Different GitHub Account

## To use a different GitHub account for this repository:

### Option 1: Set local git config (only for this repo)
```bash
git config user.name "Your-GitHub-Username"
git config user.email "your-email@example.com"
```

### Option 2: Change global git config (affects all repos)
```bash
git config --global user.name "Your-GitHub-Username"
git config --global user.email "your-email@example.com"
```

### Then set up the remote and push:
```bash
# Update remote URL to PlanItIU repo
git remote set-url origin https://github.com/Manas-Ramesh/PlanItIU.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: PlanItIU with Supabase Auth"

# Push to repository
git push -u origin master
# OR if your default branch is main:
# git push -u origin main
```

## Authentication Methods:

### If using HTTPS (recommended for personal projects):
- You may need a Personal Access Token instead of password
- GitHub Settings → Developer settings → Personal access tokens → Generate new token
- Use token as password when prompted

### If using SSH (recommended for multiple accounts):
```bash
# Generate SSH key for this account
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_planitiu

# Add to SSH config
# Then update remote to use SSH:
git remote set-url origin git@github.com:Manas-Ramesh/PlanItIU.git
```

