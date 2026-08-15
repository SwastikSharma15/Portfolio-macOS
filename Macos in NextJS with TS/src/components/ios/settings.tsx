import { Button } from "@/components/shared/ui/button"
import { Switch } from "@/components/shared/ui/switch"
import { Label } from "@/components/shared/ui/label"
import { Wifi, Bluetooth, Moon, BatteryMedium, Bell } from "lucide-react"

export function Settings() {
  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Wifi className="h-5 w-5 text-white" />
              </div>
              <Label htmlFor="wifi">Wi-Fi</Label>
            </div>
            <Switch id="wifi" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Bluetooth className="h-5 w-5 text-white" />
              </div>
              <Label htmlFor="bluetooth">Bluetooth</Label>
            </div>
            <Switch id="bluetooth" defaultChecked />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <Label htmlFor="focus">Focus</Label>
            </div>
            <Switch id="focus" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <BatteryMedium className="h-5 w-5 text-white" />
              </div>
              <div>
                <Label htmlFor="battery">Battery</Label>
                <div className="text-xs text-gray-500">80%</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-500">
              Details
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-500">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
