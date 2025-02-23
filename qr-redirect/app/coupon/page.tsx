import { getCoupon } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

export default async function CouponPage({
  searchParams,
}: {
  searchParams: { coupon?: string }
}) {
  const couponId = searchParams.coupon

  if (!couponId) {
    notFound()
  }

  const coupon = await getCoupon(couponId)

  if (!coupon) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Thank You for Your Review!</CardTitle>
          <CardDescription>Here&apos;s your exclusive discount coupon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-primary p-8 rounded-lg space-y-4 text-center">
            <div className="text-3xl font-bold text-primary">{coupon.code}</div>
            <div className="text-xl font-semibold">{coupon.discount}</div>
            <p className="text-muted-foreground">{coupon.description}</p>
            <p className="text-sm text-muted-foreground">
              Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

