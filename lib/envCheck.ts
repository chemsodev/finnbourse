/**
 * Environment Configuration Check
 * Utility to verify that required environment variables are set
 */

export function checkEnvironmentConfig() {
  const issues: string[] = [];

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    issues.push("NEXT_PUBLIC_BACKEND_URL is not set");
  }

  if (!process.env.NEXT_PUBLIC_REST_API_URL) {
    issues.push("NEXT_PUBLIC_REST_API_URL is not set");
  }

  if (!process.env.NEXTAUTH_SECRET) {
    issues.push("NEXTAUTH_SECRET is not set");
  }

  if (!process.env.NEXTAUTH_URL) {
    issues.push("NEXTAUTH_URL is not set");
  }

  return {
    isValid: issues.length === 0,
    issues,
    config: {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
      restApiUrl: process.env.NEXT_PUBLIC_REST_API_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    },
  };
}

export function logEnvironmentConfig() {
  const check = checkEnvironmentConfig();

  console.log("🔧 Environment Configuration Check");
  console.log("==================================");

  if (check.isValid) {
    console.log("✅ All required environment variables are set");
    console.log("📋 Configuration:");
    console.log(`   Backend URL: ${check.config.backendUrl}`);
    console.log(`   REST API URL: ${check.config.restApiUrl}`);
    console.log(`   NextAuth URL: ${check.config.nextAuthUrl}`);
  } else {
    console.error("❌ Missing required environment variables:");
    check.issues.forEach((issue) => console.error(`   - ${issue}`));
  }

  return check;
}
