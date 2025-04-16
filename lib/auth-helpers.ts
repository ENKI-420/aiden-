// Simplified auth helpers that don't require external dependencies

export async function getSession() {
  // Mock session data
  return {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: "healthcare_professional",
    },
  }
}

export async function getUserDetails() {
  // Mock user details
  return {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    role: "healthcare_professional",
    avatar_url: null,
  }
}

export async function getSubscription() {
  // Mock subscription data
  return {
    id: "sub-123",
    status: "active",
    price_id: "price-123",
    quantity: 1,
    cancel_at_period_end: false,
    created: new Date().toISOString(),
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ended_at: null,
    cancel_at: null,
    canceled_at: null,
    trial_start: null,
    trial_end: null,
  }
}
