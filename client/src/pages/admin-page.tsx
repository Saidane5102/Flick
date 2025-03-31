import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardManager from "@/components/admin/CardManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Users, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center mb-8">
          <Settings className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Manage Content</CardTitle>
            <CardDescription>
              Add, edit, or remove cards and manage other system resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="cards" className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="designs" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Designs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cards">
                <CardManager />
              </TabsContent>
              
              <TabsContent value="users">
                <div className="p-4 text-center border border-dashed rounded-md">
                  <h3 className="text-xl font-medium mb-2">User Management</h3>
                  <p className="text-gray-500">User management features will be implemented in a future update.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="designs">
                <div className="p-4 text-center border border-dashed rounded-md">
                  <h3 className="text-xl font-medium mb-2">Design Management</h3>
                  <p className="text-gray-500">Design management features will be implemented in a future update.</p>
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
