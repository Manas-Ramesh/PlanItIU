#!/usr/bin/env python3
"""
Script to delete your user data from Supabase
This will delete your profile and preferences so you can sign up again
"""

import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Supabase credentials not found in .env.local")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get your email
email = input("Enter your email address: ").strip()

if not email:
    print("❌ Email is required")
    exit(1)

print(f"\n🔍 Looking up user with email: {email}")

# Find user in auth (we'll need to use admin API or SQL for this)
# For now, let's find user_id from profiles table
profiles_response = supabase.table('profiles').select('user_id, email').eq('email', email).execute()

if not profiles_response.data:
    print(f"❌ No user found with email: {email}")
    exit(1)

user_id = profiles_response.data[0]['user_id']
print(f"✅ Found user_id: {user_id}")

# Confirm deletion
confirm = input(f"\n⚠️  This will delete ALL data for user {email} (user_id: {user_id})\n   Type 'DELETE' to confirm: ").strip()

if confirm != 'DELETE':
    print("❌ Deletion cancelled")
    exit(0)

print("\n🗑️  Deleting user data...")

# Delete from user_preferences
try:
    pref_response = supabase.table('user_preferences').delete().eq('user_id', user_id).execute()
    print(f"✅ Deleted from user_preferences: {len(pref_response.data) if pref_response.data else 0} records")
except Exception as e:
    print(f"⚠️  Error deleting from user_preferences: {e}")

# Delete from profiles
try:
    profile_response = supabase.table('profiles').delete().eq('user_id', user_id).execute()
    print(f"✅ Deleted from profiles: {len(profile_response.data) if profile_response.data else 0} records")
except Exception as e:
    print(f"⚠️  Error deleting from profiles: {e}")

print("\n✅ User data deleted!")
print("\n📝 Next steps:")
print("   1. Go to Supabase Dashboard → Authentication → Users")
print(f"   2. Find user with email: {email}")
print("   3. Delete the auth user (click the three dots → Delete user)")
print("   4. Now you can sign up again with the same email!")

