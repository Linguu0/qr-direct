"use client"

import type React from "react"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createCoupon } from "@/app/actions"
import { toast } from "sonner"

export default function QRCodeGenerator() {
  const [reviewUrl, setReviewUrl] = useState("")
  const [qrCodeData, setQrCodeData] = useState("")
  const [couponDetails, setCouponDetails] = useState({
    code: "",
    discount: "",
    description: "",
    expiryDate: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      // Create unique coupon ID
      const couponId = Math.random().toString(36).substring(2, 15)

      // Save coupon details
      await createCoupon({
        id: couponId,
        ...couponDetails,
      })

      // Create redirect URL through our app
      const redirectUrl = `${window.location.origin}/redirect?review=${encodeURIComponent(reviewUrl)}&coupon=${couponId}`
      setQrCodeData(redirectUrl)

      toast.success("QR Code generated successfully!")
    } catch (error) {
      toast.error("Failed to generate QR code. Please try again.")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    const svg = document.querySelector("svg")
    if (svg) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()

      canvas.width = 200
      canvas.height = 200

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          const pngUrl = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.href = pngUrl
          downloadLink.download = "qrcode.png"
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      }

      img.src = "data:image/svg+xml;base64," + btoa(svgData)
      img.crossOrigin = "anonymous"
    }
  }

  return (
    <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create a custom coupon and QR code for your Google Reviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewUrl">Google Review URL</Label>
              <Input
                id="reviewUrl"
                type="url"
                placeholder="https://www.google.com/search?q=your-business"
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                placeholder="e.g., CAFE10"
                value={couponDetails.code}
                onChange={(e) => setCouponDetails((prev) => ({ ...prev, code: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount Amount</Label>
              <Input
                id="discount"
                placeholder="e.g., 10% OFF"
                value={couponDetails.discount}
                onChange={(e) => setCouponDetails((prev) => ({ ...prev, discount: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Coupon Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Get 10% off on your next visit"
                value={couponDetails.description}
                onChange={(e) => setCouponDetails((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={couponDetails.expiryDate}
                onChange={(e) => setCouponDetails((prev) => ({ ...prev, expiryDate: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </Button>
          </form>

          {qrCodeData && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <QRCodeSVG
                  value={qrCodeData}
                  size={200}
                  level="H"
                  includeMargin
                  className="border p-2 rounded bg-white"
                />
              </div>
              <Button onClick={downloadQRCode} variant="outline" className="w-full">
                Download QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

