"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Shield,
  Settings,
  Bell,
  User,
  Lock,
  Search,
  Fingerprint,
  Zap,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import apiClient from "../utils/axiosInstance";
import { deleteCookie, getCookies } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMutation , useQueryClient , useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter()
  const queryClient = useQueryClient() 

  const handleSignOut = () => {
    // Implement sign out logic here
    deleteCookie("token")
    deleteCookie("userId")
    router.push("/")
  }

  const cookies = getCookies()

  const getTabs = async () => {
    let response =  await apiClient.get(`apiii/liveTabs/${cookies.userId}`)
    return response.data
  };

  const {data} = useQuery({ queryKey: ['tabs'], queryFn: getTabs })


  const handleCloseAllTabs = async ()=>{
    let response = await apiClient.post(`apiii/closeLiveTabs/${cookies.userId}` , {"close":true} )
    return response.data
  }

  const closeAllTabsMutation = useMutation({
    mutationFn: handleCloseAllTabs,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tabs'] })
    },
    onError:(e)=>{
        console.log('error in close all tabs = ', e)
    }
  })

  const sidebarItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      value: "dashboard",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Protection",
      value: "protection",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      value: "settings",
    },
  ];

  const BlockLink = async (link) => {
    let response = await apiClient.post(`apiii/closeTab/${cookies.userId}` , {url:link})
    console.log("block link = ", response.data)
    return response.data
  }

  const mutation  = useMutation({
    mutationFn: BlockLink,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tabs'] })
    },
    onError:(e)=>{
        console.log('error in close single tab = ', e)
    }
  })

  return (
    <div className="flex relative h-screen bg-transparent text-white">
      {/* Sidebar */}
      <aside
        className={`bg-black transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold">Anti-AI</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-white hover:text-gray-300"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className={`w-full justify-start px-4 py-2 ${
                activeTab === item.value
                  ? "bg-white text-black"
                  : "text-white hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              {item.icon}
              {!isSidebarCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-transparent">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Welcome to Anti-AI Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-white">
                    <span>Anti-AI Shield</span>
                    <Switch
                      id="switch"
                      checked={isBlocked}
                      onCheckedChange={setIsBlocked}
                    />
                  </div>
                  <p className="mt-4 text-white">
                    Advanced AI protection {isBlocked ? "active" : "inactive"}{" "}
                    on your device.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Threat Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <BarChart className="h-32 w-32 text-white" />
                  </div>
                  <p className="mt-4 text-center text-white">
                    No active threats detected in the last 24 hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Lock System
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Deep Scan
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Boost Defense
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Verify Identity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "protection" && (
            <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Protection Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <h2 className="text-xl font-semibold mb-4">You are fully protected</h2>
        <Button
          variant="outline"
          className="mb-6 border-white text-white hover:bg-white hover:text-black"
          onClick = {()=>{closeAllTabsMutation.mutate()}}
        >
          Close All Live Tabs
        </Button>
        <div className="protection-cards mb-6">
          {/* Add protection cards here if needed */}
        </div>
        <div className="dashboard-links mb-6">
          <h3 className="text-lg font-semibold mb-2">Dashboard Links</h3>
          <ul className="space-y-4">



            {Object.values(data).map((link,i) => {
               

              if(link === `No open tabs found for userId=${cookies.userId}` )  return <p className="text-white">No active Links</p> 

                const match = link.match(/\/\/([^.]+)\./); // Match the part between // and .
                const aiName = match ? match[1] : 'Unknown'; // Extracted AI name or 'Unknown'


                return(
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  {link.icon ? (
                    <img
                      src={link.icon}
                      alt={`icon-${link.id}`}
                      className="w-8 h-8 mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 mr-2 bg-gray-700 flex items-center justify-center text-xs">
                      N/A
                    </div>
                  )}
                  <span>{aiName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mutation.mutate(link)}
                  className={`border-white text-white hover:bg-white hover:text-black `}
                >
                   block
                </Button>
              </li>
            )})}
          </ul>
        </div>
        <div className="scan-status">
          <p className="font-semibold">You're up to date</p>
          <p className="text-sm text-gray-400">Last updated: a few seconds ago</p>
        </div>
      </CardContent>
    </Card>
          )}

          {activeTab === "settings" && (
            <Card className="bg-zinc-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">System Configuration</CardTitle>
                <CardDescription>
                  Customize your Anti-AI defense parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        Auto-Update Defense Protocols
                      </p>
                      <p className="text-sm text-gray-400">
                        Keep your system up-to-date with the latest AI
                        countermeasures
                      </p>
                    </div>
                    <Switch id="switch" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        Advanced Threat Notifications
                      </p>
                      <p className="text-sm text-gray-400">
                        Receive alerts for potential AI-driven security risks
                      </p>
                    </div>
                    <Switch id="switch" defaultChecked />
                  </div>
                  <div className="mt-6">
                    <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
