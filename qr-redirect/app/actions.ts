"use server"

interface Coupon {
  id: string
  code: string
  discount: string
  description: string
  expiryDate: string
  used?: boolean
  usedAt?: string
}

// Store coupons in memory (note: this is temporary and will reset on server restart)
const coupons = new Map<string, Coupon>()

export async function createCoupon(coupon: Coupon) {
  coupons.set(coupon.id, {
    ...coupon,
    used: false,
    createdAt: new Date().toISOString(),
  })
  return coupon
}

export async function getCoupon(id: string) {
  return coupons.get(id) || null
}

export async function markCouponAsUsed(id: string) {
  const coupon = coupons.get(id)
  if (coupon) {
    coupons.set(id, {
      ...coupon,
      used: true,
      usedAt: new Date().toISOString(),
    })
  }
}

