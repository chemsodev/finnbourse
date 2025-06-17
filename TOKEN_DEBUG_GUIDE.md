# Token Refresh Loop Fix - Debug Guide

## 🔧 **Fixes Applied:**

### 1. **TokenManager Improvements**

- ✅ **Timeout Protection** - 15-second timeout for refresh requests
- ✅ **Race Condition Fix** - Proper cleanup of stuck promises
- ✅ **Better Logging** - Detailed expiry time information
- ✅ **Force Clear Methods** - Manual recovery options

### 2. **Auth.ts Optimization**

- ✅ **Reduced Refresh Frequency** - Only refreshes when < 1 minute to expiry
- ✅ **Better Error Handling** - Doesn't force logout on timeouts
- ✅ **Race Condition Prevention** - Simplified token checking logic

### 3. **Debug Tools Added**

- ✅ **Browser Console Access** - `window.tokenDebug` object
- ✅ **State Monitoring** - Real-time token state checking
- ✅ **Manual Recovery** - Force clear stuck refreshes

## 🐛 **How to Debug:**

### **In Browser Console:**

```javascript
// Check current token manager state
tokenDebug.getState();

// Check session token info
await tokenDebug.checkSession();

// Clear stuck refresh attempts
tokenDebug.clearStuck();

// Reset token manager completely
tokenDebug.reset();

// Start monitoring (updates every 5 seconds)
const stopMonitor = tokenDebug.monitor(5);
// To stop: stopMonitor()
```

### **Common Debug Scenarios:**

#### **If you see "Token refresh already in progress" loop:**

```javascript
// 1. Check what's happening
tokenDebug.getState();

// 2. Clear the stuck refresh
tokenDebug.clearStuck();

// 3. Monitor to ensure it's working
tokenDebug.monitor(2); // Check every 2 seconds
```

#### **If refreshes are happening too often:**

```javascript
// Check why token thinks it needs refreshing
await tokenDebug.checkSession();

// Look for:
// - Time until expiry (should be > 300s for normal operation)
// - needsRefresh should be false unless < 5 minutes to expiry
```

#### **Force a clean slate:**

```javascript
// Nuclear option - reset everything
tokenDebug.reset();
// Then refresh the page
window.location.reload();
```

## 📊 **Expected Behavior Now:**

### **Normal Operation:**

- Token refresh happens only when < 5 minutes to expiry
- Single refresh request per token expiry
- "Token refresh already in progress" should resolve within 15 seconds
- Console shows detailed timing information

### **Recovery from Issues:**

- Stuck refreshes automatically timeout after 15 seconds
- Manual recovery tools available in console
- Clear error messaging about what's happening

### **Console Output Should Look Like:**

```
Token expiry check: expires in 287s, should refresh: false
Skipping refresh - too soon since last attempt (12s ago)
Token refresh already in progress, waiting...
Token refreshed successfully via REST API
```

## 🚨 **If Problems Persist:**

1. **Open browser console** and run:

   ```javascript
   tokenDebug.monitor(1); // Monitor every second
   ```

2. **Look for patterns** in the output:

   - Is `hasActiveRefresh` always true?
   - Is `timeUntilExpiry` showing correct values?
   - Are there timeout errors?

3. **Manual intervention:**

   ```javascript
   tokenDebug.clearStuck();
   await tokenDebug.checkSession();
   ```

4. **Last resort:**
   ```javascript
   tokenDebug.reset();
   localStorage.clear();
   sessionStorage.clear();
   window.location.href = "/login";
   ```

The token management should now be much more stable with proper timeout handling and debugging capabilities! 🎉
