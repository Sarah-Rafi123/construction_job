// Helper to manage page reloads
export const setupPageReload = () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return
  
    // Get the current URL path
    const currentPath = window.location.pathname
  
    // Get the last visited path from session storage
    const lastPath = sessionStorage.getItem("last_visited_path")
  
    // If this is the same path as before and not the first visit
    if (lastPath === currentPath) {
      // Reload the page
      window.location.reload()
    }
  
    // Store the current path for next time
    sessionStorage.setItem("last_visited_path", currentPath)
  }
  