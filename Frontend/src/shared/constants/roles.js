export const Roles = Object.freeze({
  Customer: 'Customer',
  ShopOwner: 'ShopOwner',
  Admin: 'Admin',
})

export function normalizeRole(role) {
  if (!role) return null
  const value = String(role)
  switch (value.toLowerCase()) {
    case 'customer':
      return Roles.Customer
    case 'shopowner':
    case 'owner':
      return Roles.ShopOwner
    case 'admin':
      return Roles.Admin
    default:
      return value
  }
}


