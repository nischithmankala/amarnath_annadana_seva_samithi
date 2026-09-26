import React from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Heart } from "lucide-react"

export function Donate() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-saffron-500" />
          </div>
          <CardTitle className="text-3xl text-primary-900">Make a Donation</CardTitle>
          <CardDescription>
            Your contribution helps us serve meals to the pilgrims of Lord Amarnath Ji.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">Select Amount</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="border-saffron-500 text-saffron-600 bg-saffron-50">₹1,100</Button>
              <Button variant="outline" className="border-sand-300">₹2,100</Button>
              <Button variant="outline" className="border-sand-300">₹5,001</Button>
              <Button variant="outline" className="border-sand-300">Other</Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-sand-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">First Name</label>
                <Input placeholder="Ram" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">Last Name</label>
                <Input placeholder="Kumar" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">Email Address</label>
              <Input type="email" placeholder="ram@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">Mobile Number</label>
              <Input type="tel" placeholder="+91" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">PAN Number (For Tax Receipt)</label>
              <Input placeholder="ABCDE1234F" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-saffron-500 hover:bg-saffron-400 text-white h-12 text-lg">
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
