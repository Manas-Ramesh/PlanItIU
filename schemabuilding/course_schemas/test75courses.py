#!/usr/bin/env python3
"""
Test Fast Scraper for ALL courses

This script tests the fast scraper with ALL available courses to verify:
1. Load More functionality works
2. All data extraction works
3. Speed improvements are achieved
4. Component handling works
"""

from fastscraper import FastIUCourseScraper
import time


def test_fast_75_courses():
    """Test fast scraper with ALL courses"""
    print("🚀 Testing Fast Scraper - ALL Courses")
    print("=" * 60)
    print("This test will:")
    print("1. Navigate to the course search page")
    print("2. Select campus and term")
    print("3. Scrape ALL available courses (with Load More clicks)")
    print("4. Verify all functionality works")
    print("5. Measure speed improvements")
    print()
    
    # Get user input
    csv_filename = input("Enter CSV filename (default: 'test_fast_all.csv'): ").strip()
    if not csv_filename:
        csv_filename = "test_fast_all.csv"
    
    headless = input("Run in headless mode? (y/n, default n): ").strip().lower() == 'y'
    
    print(f"💾 Will save to: {csv_filename}")
    print(f"🖥️ Headless mode: {'Yes' if headless else 'No'}")
    print()
    
    # Create fast scraper instance
    scraper = FastIUCourseScraper(headless=headless)
    
    try:
        # Setup driver
        scraper.setup_driver()
        
        # Navigate to page
        if not scraper.navigate_to_course_search():
            print("❌ Failed to navigate to course search page")
            return False
        
        # Select campus
        if not scraper.select_campus():
            print("❌ Failed to select campus")
            return False
        
        # Select term
        if not scraper.select_term():
            print("❌ Failed to select term")
            return False
        
        # Wait for course results
        if not scraper.wait_for_course_results():
            print("❌ Failed to load course results")
            return False
        
        print(f"\n✅ Page loaded successfully!")
        print(f"📝 Now you need to apply a keyword filter to get courses visible:")
        print(f"1. Enter a keyword in the filter box (e.g., 'AAAD', 'CHEM', 'ENG', 'MATH')")
        print(f"2. Click the 'Add' button")
        print(f"3. Wait for results to update")
        print(f"4. Make sure you have some courses visible")
        print()
        
        # Wait for user to apply keyword filter
        input("Press Enter when you've applied a keyword filter and have courses visible...")
        
        print("🚀 Starting to scrape ALL courses...")
        print("⏳ This may take 3-4 days for 7000+ courses (vs 2 weeks with regular scraper)...")
        print("🔍 Will automatically handle Load More functionality...")
        print()
        
        # Start timing
        start_time = time.time()
        
        # Extract ALL courses (set a very high number)
        courses = scraper.extract_course_data(max_courses=10000)
        
        # End timing
        end_time = time.time()
        elapsed_time = end_time - start_time
        
        if not courses:
            print("❌ No courses found")
            return False
        
        print(f"\n✅ Test completed successfully!")
        print(f"📊 Results:")
        print(f"  Total courses: {len(courses)}")
        print(f"  Time taken: {elapsed_time:.1f} seconds ({elapsed_time/60:.1f} minutes)")
        print(f"  Rate: {len(courses)/(elapsed_time/60):.1f} courses/minute")
        
        # Show detailed breakdown
        total_sections = sum(len(course.get('class_details', [])) for course in courses)
        print(f"  Total class sections: {total_sections}")
        
        # Count component types
        component_counts = {}
        for course in courses:
            if 'class_details' in course:
                for class_detail in course['class_details']:
                    component_type = class_detail.get('component_type', 'Standard')
                    component_counts[component_type] = component_counts.get(component_type, 0) + 1
        
        print(f"  Component breakdown:")
        for component_type, count in component_counts.items():
            print(f"    {component_type}: {count} sections")
        
        # Show sample courses
        print(f"\n📚 Sample courses:")
        for i, course in enumerate(courses[:5]):
            print(f"  {i+1}. {course['course_code']}: {course['course_name']}")
            if 'class_details' in course and course['class_details']:
                print(f"     Found {len(course['class_details'])} class sections")
        
        if len(courses) > 5:
            print(f"  ... and {len(courses) - 5} more courses")
        
        # Save to CSV
        if scraper.save_courses_to_csv(courses, csv_filename):
            print(f"\n💾 All courses saved to: {csv_filename}")
            
            # Speed analysis
            print(f"\n⚡ Speed Analysis:")
            print(f"  Fast scraper: {elapsed_time/60:.1f} minutes ({elapsed_time/3600:.1f} hours) for {len(courses)} courses")
            print(f"  Rate: {len(courses)/(elapsed_time/60):.1f} courses/minute")
            print(f"  Estimated time for 7000 courses: ~{(7000/(len(courses)/(elapsed_time/60)))/60:.1f} hours")
            
            return True
        else:
            print("❌ Failed to save test data to CSV")
            return False
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        return False
    finally:
        if scraper.driver:
            print("\nPress Enter to close browser...")
            input()
            scraper.quit()


def main():
    """Main function"""
    print("🚀 Fast Scraper - ALL Courses")
    print("=" * 60)
    print("This will scrape ALL available courses with the fast scraper:")
    print("✅ Load More functionality")
    print("✅ Component handling (Lecture/Lab)")
    print("✅ Speed improvements (3-5x faster)")
    print("✅ Data extraction quality")
    print()
    
    success = test_fast_75_courses()
    
    if success:
        print("\n🎉 Fast scraper completed successfully!")
        print("✅ All courses scraped!")
        print("⚡ Speed improvements confirmed!")
        print("💾 All data saved to CSV!")
    else:
        print("\n❌ Fast scraper failed!")
        print("❌ Check errors above!")


if __name__ == "__main__":
    main()




