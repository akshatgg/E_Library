"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { ProfileSubscription } from "@/components/profile/profile-subscription"
import { ProfileHistory } from "@/components/profile/profile-history"
import { ProfilePreferences } from "@/components/profile/profile-preferences"
import type { UserData } from "@/lib/auth"

interface ProfileTabsProps {
  user: UserData
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("settings")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="settings">Account Settings</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="space-y-4">
        <ProfileSettings user={user} />
      </TabsContent>

      <TabsContent value="subscription" className="space-y-4">
        <ProfileSubscription user={user} />
      </TabsContent>

      <TabsContent value="preferences" className="space-y-4">
        <ProfilePreferences user={user} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <ProfileHistory user={user} />
      </TabsContent>
    </Tabs>
  )
}
