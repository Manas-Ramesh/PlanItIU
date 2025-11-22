# Why Screenshot Upload Works Locally But Not in Vercel Production

## Summary

The screenshot upload feature works locally but fails in Vercel production due to **Vercel's platform limitations** that don't exist in local development. The main issues are:

1. **Function Timeout Limits** (Most Likely)
2. **Request Body Size Limits**
3. **Environment Variable Configuration**

## Root Causes

### 1. Function Timeout Limits ⏱️

**Problem:**
- **Vercel Hobby Plan**: Default function timeout is **10 seconds**
- **Vercel Pro Plan**: Default function timeout is **60 seconds**
- Your image analysis process involves:
  - Converting image to base64
  - Calling OpenAI Vision API (can take 5-15 seconds)
  - Multiple database queries to validate courses (can take 2-5 seconds)
  - Total time: Often **15-25 seconds**

**Why it works locally:**
- Local development has no timeout limits
- Your machine can process the request for as long as needed

**Why it fails in production:**
- Vercel kills the function after the timeout limit
- The function returns a timeout error before completing

**Solution Applied:**
✅ Added `export const maxDuration = 60` to the route configuration
- This increases the timeout to 60 seconds (requires Pro plan)
- If you're on Hobby plan, you'll need to upgrade or optimize the code

### 2. Request Body Size Limits 📦

**Problem:**
- **Vercel Hobby Plan**: 4.5MB request body limit
- **Vercel Pro Plan**: 50MB request body limit
- When you convert an image to base64, it increases in size by **~33%**
  - A 3MB image → ~4MB in base64
  - A 3.5MB image → ~4.6MB in base64 (exceeds Hobby limit!)

**Why it works locally:**
- No request body size limits in local development
- Your local server accepts any size

**Why it fails in production:**
- Vercel rejects requests that exceed the limit
- The request may fail silently or return a 413 error

**Solution Applied:**
✅ Added file size validation (3MB limit) before processing
✅ Added logging to track base64 size for debugging

### 3. Environment Variables 🔑

**Problem:**
- `OPENAI_API_KEY` might not be set in Vercel production
- Environment variables are only loaded during deployment
- If added after deployment, a redeploy is required

**Why it works locally:**
- You have `.env.local` with the API key
- Local development reads environment variables immediately

**Why it fails in production:**
- Missing or incorrect environment variable
- No redeploy after adding the variable

**Solution:**
- Verify `OPENAI_API_KEY` is set in Vercel Dashboard → Settings → Environment Variables
- Ensure it's set for **Production** environment (not just Preview/Development)
- **Redeploy** after adding/modifying environment variables

## How to Diagnose

### Check Vercel Function Logs

1. Go to **Vercel Dashboard → Your Project → Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Find `/api/analyze-transcript` function
5. Click to view logs

**Look for these indicators:**

✅ **Success indicators:**
- `📸 Starting transcript analysis` - API is being called
- `🤖 Calling OpenAI Vision API...` - OpenAI call is starting
- `✅ OpenAI API call successful` - OpenAI responded successfully

❌ **Failure indicators:**
- `❌ OPENAI_API_KEY is missing` - Environment variable issue
- `❌ OpenAI API call failed` - API key or quota issue
- `Function execution timeout` - Timeout limit exceeded
- `413 Payload Too Large` - Request body size limit exceeded
- `No response from AI` - OpenAI API issue

### Test the API Directly

Use curl to test the production API:

```bash
curl -X POST https://your-domain.vercel.app/api/analyze-transcript \
  -F "image=@/path/to/test-image.jpg" \
  -H "Content-Type: multipart/form-data" \
  -v
```

Check the response for error messages.

## Solutions Implemented

### ✅ 1. Added Function Timeout Configuration

```typescript
export const maxDuration = 60  // 60 seconds
```

**Note:** This requires Vercel Pro plan. If you're on Hobby plan:
- Upgrade to Pro plan, OR
- Optimize the code to run faster (reduce database queries, use caching)

### ✅ 2. Added File Size Validation

```typescript
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
if (file.size > MAX_FILE_SIZE) {
  return error response
}
```

This prevents requests that would exceed Vercel's limits.

### ✅ 3. Enhanced Logging

Added detailed logging to help diagnose issues:
- File size information
- Base64 size tracking
- OpenAI API call status
- Database query results

## Next Steps

### If Still Not Working:

1. **Check Your Vercel Plan:**
   - Hobby plan: 10s timeout, 4.5MB body limit
   - Pro plan: 60s timeout, 50MB body limit
   - If on Hobby, consider upgrading or optimizing

2. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure `OPENAI_API_KEY` is set for Production
   - Redeploy after any changes

3. **Check Function Logs:**
   - Look for specific error messages
   - The enhanced logging will show exactly where it fails

4. **Test with Smaller Images:**
   - Try with a smaller screenshot (< 2MB)
   - If smaller images work, it's a size limit issue

5. **Check OpenAI API Status:**
   - Visit https://status.openai.com
   - Verify your OpenAI account has credits/quota

## Alternative Solutions (If Issues Persist)

### Option 1: Optimize Image Processing
- Compress images before sending to API
- Resize images to reduce file size
- Use image optimization libraries

### Option 2: Use Streaming/Chunked Upload
- Upload image to a storage service (S3, Cloudinary)
- Pass the URL to the API instead of the file
- Reduces request body size

### Option 3: Split the Process
- Upload image → return immediately
- Process in background job
- Poll for results or use webhooks

## Summary

The main difference between local and production is **Vercel's platform constraints**:
- ⏱️ **Timeout limits** (10s Hobby, 60s Pro)
- 📦 **Request body size limits** (4.5MB Hobby, 50MB Pro)
- 🔑 **Environment variable loading** (only during deployment)

The code changes I've made address these issues, but you may need to:
1. Upgrade to Vercel Pro plan (for 60s timeout)
2. Ensure environment variables are set correctly
3. Use smaller images or optimize image processing

Check the Vercel function logs to see exactly which constraint is being hit.

