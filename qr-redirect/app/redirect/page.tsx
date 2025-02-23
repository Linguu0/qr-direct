"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RedirectPage() {
  const searchParams = useSearchParams()
  const reviewUrl = searchParams.get("review")
  const couponId = searchParams.get("coupon")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!reviewUrl) return

    // Redirect to review URL immediately
    window.location.href = reviewUrl

    // Start progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Redirect to coupon page after 10 seconds
          window.location.href = `/coupon?coupon=${couponId}`
          return prev
        }
        return prev + 1
      })
    }, 100) // 10 seconds total

    return () => clearInterval(interval)
  }, [reviewUrl, couponId])

  const handleSkip = () => {
    window.location.href = `/coupon?coupon=${couponId}`
  }

  if (!reviewUrl) {
    return <div>Invalid URL</div>
  }

  return (
    <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redirecting to Google Reviews</CardTitle>
          <CardDescription>Please leave your review, and you&apos;ll get a discount coupon!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <Button onClick={handleSkip} variant="outline" className="w-full">
            I&apos;ve submitted my review
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

