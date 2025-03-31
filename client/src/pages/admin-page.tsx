import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardManager from "@/components/admin/CardManager";
import UserManager from "@/components/admin/UserManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Users, FileText, LayoutDashboard } from "lucide-react";

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
              <TabsList className="grid grid-cols-3 mb-8 p-1 bg-gray-50 border rounded-lg">
                <TabsTrigger value="cards" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Database className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="designs" className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <FileText className="h-4 w-4 mr-2" />
                  Designs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cards" className="mt-0">
                <CardManager />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <UserManager />
              </TabsContent>
              
              <TabsContent value="designs" className="mt-0">
                <div className="p-8 text-center border border-dashed rounded-lg bg-gray-50/50">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800">Design Management</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The design management interface allowing you to review, approve, and provide feedback on user submissions will be implemented in the next update.
                  </p>
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
