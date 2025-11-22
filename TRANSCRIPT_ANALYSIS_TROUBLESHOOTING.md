# Transcript Analysis Troubleshooting

## Issue: Works on localhost but not in production

If the transcript upload feature works locally but not on Vercel, follow these steps:

## 1. Verify Environment Variables in Vercel

Even if `OPENAI_API_KEY` appears in the Vercel dashboard, verify:

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Check that `OPENAI_API_KEY` is set for **Production** environment (not just Preview/Development)
3. The value should start with `sk-` (OpenAI API keys)
4. **Important**: After adding/modifying environment variables, you MUST redeploy

## 2. Redeploy After Environment Variable Changes

Environment variables are only loaded during deployment. If you just added the key:

1. Go to **Vercel Dashboard → Your Project → Deployments**
2. Click **"..."** on the latest deployment → **Redeploy**
3. Or push a new commit to trigger a redeploy

## 3. Check Vercel Function Logs

The API now has comprehensive logging. Check logs to see what's happening:

1. Go to **Vercel Dashboard → Your Project → Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Find `/api/analyze-transcript` function
5. Click to view logs

Look for:
- ✅ `📸 Starting transcript analysis` - API is being called
- ✅ `🤖 Calling OpenAI Vision API...` - OpenAI call is starting
- ✅ `✅ OpenAI API call successful` - OpenAI responded successfully
- ❌ `❌ OpenAI API call failed` - OpenAI API error (check error details)
- ❌ `❌ Missing OPENAI_API_KEY` - Environment variable not found

## 4. Common Issues

### Issue: "Missing OPENAI_API_KEY environment variable"
**Fix**: 
- Verify the key is set in Vercel for Production environment
- Redeploy after adding the key

### Issue: "OpenAI API call failed" with 401/403
**Fix**: 
- Check that your OpenAI API key is valid and not expired
- Verify you have credits/quota in your OpenAI account
- Check the key has access to GPT-4o model

### Issue: "No response from AI"
**Fix**: 
- Check OpenAI API status: https://status.openai.com
- Verify your account has sufficient credits
- Check Vercel function timeout settings (should be at least 60s for image analysis)

### Issue: API returns 200 but finds 0 valid courses
**This is NOT an AI issue** - the AI is working, but:
- The extracted courses don't match your database format
- Check the `invalidCourses` in the response
- Verify course codes in your database match the format being extracted

## 5. Test the API Directly

You can test the API endpoint directly using curl:

```bash
curl -X POST https://planitiu.vercel.app/api/analyze-transcript \
  -F "image=@/path/to/test-image.jpg" \
  -H "Content-Type: multipart/form-data"
```

Or use the browser console on your production site:
```javascript
const formData = new FormData()
formData.append('image', fileInput.files[0])

fetch('/api/analyze-transcript', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## 6. Debug Checklist

- [ ] `OPENAI_API_KEY` is set in Vercel for **Production** environment
- [ ] Redeployed after adding/modifying environment variables
- [ ] OpenAI API key is valid and has credits
- [ ] Checked Vercel function logs for errors
- [ ] Tested API endpoint directly
- [ ] Browser console shows no client-side errors
- [ ] Network tab shows the API request is being made

## 7. Still Not Working?

If the API key is set and you've redeployed, check:

1. **Vercel Function Logs** - Look for the detailed error messages we added
2. **OpenAI Dashboard** - Check API usage and any rate limits
3. **Browser Console** - Check for client-side errors
4. **Network Tab** - Verify the request is reaching the API

The enhanced logging will show exactly where the failure is occurring.

