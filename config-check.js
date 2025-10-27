// ========================================================
// Cook Anything Kitchen - Demo Banner Config Check
// ========================================================
document.addEventListener("DOMContentLoaded", async () => {
  let isDemo = false;

  try {
    // Load config.json (fresh each time, no cache)
    const response = await fetch("config.json", { cache: "no-store" });
    if (response.ok) {
      const config = await response.json();
      isDemo = config.demo === true;
    }
  } catch (err) {
    console.warn("config-check.js: Could not load config.json, assuming demo=false.", err);
  }

  // Allow ?demo=true or active session override
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "true" || sessionStorage.getItem("demoMode") === "true") {
    isDemo = true;
    sessionStorage.setItem("demoMode", "true");
  }

  // Inject banner if demo mode is active
  if (isDemo) {
    const banner = document.createElement("div");
    banner.className = "demo-banner";
    banner.innerHTML = `
      👀 You’re viewing a <strong>live demo</strong> of Cook Anything Kitchen —
      <a href="https://cookanythingkitchen.com/license.html">Get your own copy →</a>
    `;
    document.body.prepend(banner);
  }
});
