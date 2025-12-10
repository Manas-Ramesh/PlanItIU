#!/usr/bin/env python3
"""
Script to delete all data for a specific user from Supabase and Neo4j
This will delete profile, preferences, and Neo4j student data so the user can do onboarding again
"""

import os
from supabase import create_client
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv('.env.local')

# Supabase configuration
# Try service role key first (bypasses RLS), fallback to anon key
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# Neo4j configuration
NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', '')

# User email to delete
USER_EMAIL = 'mramesh@binghamton.edu'
# Partial user ID from the image (if email search fails)
PARTIAL_USER_ID = 'fca20c42-5dc5-4bbd-888b-b18a4'

def main():
    print(f"🗑️  Deleting all data for user: {USER_EMAIL}\n")
    
    # Initialize variables
    user_id = None
    full_name = None
    
    # Step 1: Delete from Supabase
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️  Supabase credentials not found in .env.local")
        print("   Skipping Supabase deletion...")
    else:
        print("📊 Step 1: Deleting from Supabase...")
        using_service_key = bool(os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
        if using_service_key:
            print("   ✅ Using service role key (RLS bypassed)")
        else:
            print("   ⚠️  Using anon key (RLS may restrict access)")
            print("      Consider adding SUPABASE_SERVICE_ROLE_KEY to .env.local")
        
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Try to find user by email first
        print(f"   🔍 Looking up user with email: {USER_EMAIL}")
        try:
            profiles_response = supabase.table('profiles').select('user_id, email, full_name').eq('email', USER_EMAIL).execute()
            
            if profiles_response.data:
                user_id = profiles_response.data[0]['user_id']
                full_name = profiles_response.data[0].get('full_name', 'Unknown')
                print(f"   ✅ Found user: {full_name} (user_id: {user_id})")
        except Exception as e:
            print(f"   ⚠️  Error searching profiles: {e}")
        
        # If not found, try searching by partial user_id
        if not user_id:
            print(f"   🔍 Trying to find user by partial user_id: {PARTIAL_USER_ID}...")
            try:
                # Get all profiles and search for matching user_id
                all_profiles = supabase.table('profiles').select('user_id, email, full_name').execute()
                for profile in all_profiles.data:
                    if profile['user_id'].startswith(PARTIAL_USER_ID):
                        user_id = profile['user_id']
                        full_name = profile.get('full_name', 'Unknown')
                        email = profile.get('email', 'Unknown')
                        print(f"   ✅ Found user by user_id: {full_name} ({email}) (user_id: {user_id})")
                        break
            except Exception as e:
                print(f"   ⚠️  Error searching by user_id: {e}")
        
        # If still not found, try user_preferences
        if not user_id:
            print(f"   🔍 Trying to find user in user_preferences...")
            try:
                all_prefs = supabase.table('user_preferences').select('user_id').execute()
                for pref in all_prefs.data:
                    pref_user_id = pref.get('user_id', '')
                    if pref_user_id.startswith(PARTIAL_USER_ID):
                        user_id = pref_user_id
                        print(f"   ✅ Found user_id in user_preferences: {user_id}")
                        # Try to get name from profiles
                        try:
                            profile = supabase.table('profiles').select('full_name, email').eq('user_id', user_id).execute()
                            if profile.data:
                                full_name = profile.data[0].get('full_name', 'Unknown')
                                email = profile.data[0].get('email', 'Unknown')
                                print(f"   ✅ Found profile: {full_name} ({email})")
                        except:
                            pass
                        break
            except Exception as e:
                print(f"   ⚠️  Error searching user_preferences: {e}")
        
        if not user_id:
            print("   ❌ Could not find user with the provided email or user_id.")
            print("   Please verify the email address or provide the full user_id.")
            print("   Skipping deletion...")
            return
        
        # Delete from user_preferences
        try:
            pref_response = supabase.table('user_preferences').delete().eq('user_id', user_id).execute()
            deleted_prefs = len(pref_response.data) if pref_response.data else 0
            print(f"   ✅ Deleted from user_preferences: {deleted_prefs} record(s)")
        except Exception as e:
            print(f"   ⚠️  Error deleting from user_preferences: {e}")
        
        # Delete from profiles
        try:
            profile_response = supabase.table('profiles').delete().eq('user_id', user_id).execute()
            deleted_profiles = len(profile_response.data) if profile_response.data else 0
            print(f"   ✅ Deleted from profiles: {deleted_profiles} record(s)")
        except Exception as e:
            print(f"   ⚠️  Error deleting from profiles: {e}")
        
        print(f"\n   📝 Note: To delete from auth.users, go to Supabase Dashboard → Authentication → Users")
        print(f"      Find user with email: {USER_EMAIL} (user_id: {user_id})")
        print(f"      Click the three dots → Delete user")
    
    # Step 2: Delete from Neo4j
    if not NEO4J_PASSWORD:
        print("\n⚠️  Neo4j password not found in .env.local")
        print("   Skipping Neo4j deletion...")
    else:
        print("\n🕸️  Step 2: Deleting from Neo4j...")
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        
        try:
            with driver.session() as session:
                # Check if user_id was found from Supabase step
                if not user_id:
                    print("   ⚠️  Cannot delete from Neo4j: user_id not found from Supabase")
                    return
                
                # Find and delete student node and all relationships
                result = session.run("""
                    MATCH (s:Student {user_id: $user_id})
                    OPTIONAL MATCH (s)-[r]-()
                    DELETE s, r
                    RETURN count(s) as deleted
                """, user_id=user_id)
                
                deleted_count = result.single()['deleted']
                if deleted_count > 0:
                    print(f"   ✅ Deleted Student node and all relationships for user_id: {user_id}")
                else:
                    print(f"   ℹ️  No Student node found in Neo4j for user_id: {user_id}")
        
        except Exception as e:
            print(f"   ⚠️  Error deleting from Neo4j: {e}")
        finally:
            driver.close()
    
    print("\n✅ Deletion process completed!")
    print("\n📋 Summary:")
    print(f"   - Email: {USER_EMAIL}")
    if user_id:
        print(f"   - User ID: {user_id}")
        if full_name:
            print(f"   - Name: {full_name}")
    print("\n📝 Next steps:")
    print("   1. Go to Supabase Dashboard → Authentication → Users")
    if user_id:
        print(f"   2. Find and delete the auth user (user_id: {user_id})")
    else:
        print(f"   2. Find and delete the auth user for: {USER_EMAIL}")
    print("   3. The user can now sign up again and complete onboarding!")

if __name__ == '__main__':
    main()
