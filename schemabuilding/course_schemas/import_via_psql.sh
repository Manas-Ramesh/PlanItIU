#!/bin/bash
# Script to import courses directly via psql
# You'll need your Supabase connection details

echo "📋 Supabase Direct Database Import"
echo "=================================="
echo ""
echo "You'll need your Supabase connection details:"
echo "  1. Go to Supabase Dashboard"
echo "  2. Go to Settings → Database"
echo "  3. Find 'Connection string' section"
echo "  4. Copy the 'URI' or 'Connection pooling' string"
echo ""
echo "Or use these individual values:"
echo "  - Host"
echo "  - Database name"
echo "  - Port (usually 5432)"
echo "  - User"
echo "  - Password"
echo ""

# Option 1: Using connection URI
read -p "Enter your Supabase connection URI (or press Enter to use individual values): " CONNECTION_URI

if [ -z "$CONNECTION_URI" ]; then
    # Option 2: Using individual values
    read -p "Enter Host (e.g., db.xxxxx.supabase.co): " DB_HOST
    read -p "Enter Database name (default: postgres): " DB_NAME
    DB_NAME=${DB_NAME:-postgres}
    read -p "Enter Port (default: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    read -p "Enter User (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    read -sp "Enter Password: " DB_PASSWORD
    echo ""
    
    CONNECTION_URI="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

echo ""
echo "🚀 Running import..."
echo ""

# Run the SQL file
psql "$CONNECTION_URI" -f import_courses.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Import completed successfully!"
    echo ""
    echo "Verify with: SELECT COUNT(*) FROM courses;"
else
    echo ""
    echo "❌ Import failed. Check the error messages above."
fi

