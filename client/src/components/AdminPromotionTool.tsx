import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPromotionTool() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePromote = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await fetch(`/api/temp-admin/${username.trim()}`, {
        method: "POST"
      }).then(res => {
        if (!res.ok) throw new Error("Failed to promote user");
        return res.json();
      });

      setSuccess(true);
      toast({
        title: "Success!",
        description: `${username} is now an admin user.`,
      });
    } catch (err) {
      console.error("Error promoting user:", err);
      setError(err instanceof Error ? err.message : "Failed to promote user");
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-[#E9E6DD] bg-[#FAF9F7] rounded-[20px]">
      <CardHeader className="space-y-1 border-b border-[#E9E6DD]">
        <CardTitle className="text-xl font-semibold text-[#212121]">Admin Promotion Tool</CardTitle>
        <CardDescription className="text-[#414141]">
          Make your account an admin to access the Design System Manager
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {success ? (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              {username} is now an admin. You can now access the admin dashboard at the "/admin" route.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-[#212121]">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading || success}
              className="bg-[#FAF9F7] border-[#E9E6DD]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-[#E9E6DD] pt-4">
        <Button
          onClick={handlePromote}
          disabled={loading || success || !username.trim()}
          className="w-full bg-[#212121] hover:bg-[#000000] text-white"
        >
          {loading ? "Processing..." : success ? "Promoted Successfully" : "Make Admin"}
        </Button>
      </CardFooter>
    </Card>
  );
}