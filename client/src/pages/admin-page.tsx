import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardManager from "@/components/admin/CardManager";
import UserManager from "@/components/admin/UserManager";
import DesignManager from "@/components/admin/DesignManager";
import BadgeManager from "@/components/admin/BadgeManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Users, FileText, LayoutDashboard, Palette, Award } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("cards");

  // Redirect non-admin users
  if (!isLoading && (!user || !user.isAdmin)) {
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="flex items-center mb-8">
          <LayoutDashboard className="h-6 w-6 mr-3 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <Card className="apple-card shadow-lg border-0">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl">Manage Content</CardTitle>
            <CardDescription className="text-gray-600">
              Add, edit, or remove cards, manage users, and control system resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8 p-1 bg-gray-50 border rounded-lg">
                <TabsTrigger value="cards" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <FileText className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="badges" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Award className="h-4 w-4 mr-2" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="designs" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Palette className="h-4 w-4 mr-2" />
                  Designs
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cards">
                <CardManager />
              </TabsContent>
              <TabsContent value="badges">
                <BadgeManager />
              </TabsContent>
              <TabsContent value="designs">
                <DesignManager />
              </TabsContent>
              <TabsContent value="users">
                <UserManager />
              </TabsContent>
              <TabsContent value="settings">
                <div className="text-center py-8 text-gray-500">
                  Settings page coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
