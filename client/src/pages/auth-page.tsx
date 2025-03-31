import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, registerSchema, LoginFormValues, RegisterFormValues } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, LogIn, UserPlus, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = (values: RegisterFormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userDataToSubmit } = values;
    
    registerMutation.mutate(userDataToSubmit, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <div className="container mx-auto p-4 flex flex-1 items-center justify-center">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Authentication Forms */}
          <div className="flex flex-col justify-center">
            <Card className="w-full max-w-md mx-auto bg-[#FAF9F7] border border-[#E9E6DD] rounded-[20px] shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="font-semibold text-[32px] leading-[40px] text-[#212121]">Welcome</CardTitle>
                <CardDescription className="text-[#414141] text-base">Sign in or create an account to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#E9E6DD]">
                    <TabsTrigger value="login" className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] text-[#414141]">Login</TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] text-[#414141]">Register</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Tab */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-[#212121] text-base">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  {...field}
                                  className="bg-[#FAF9F7] border-[#E9E6DD] focus:border-[#212121] h-11 rounded-lg" 
                                />
                              </FormControl>
                              <FormMessage className="text-[#212121]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-[#212121] text-base">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  {...field} 
                                  className="bg-[#FAF9F7] border-[#E9E6DD] focus:border-[#212121] h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage className="text-[#212121]" />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full mt-4 bg-[#212121] text-white hover:bg-black h-11 rounded-lg font-semibold" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Login
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* Register Tab */}
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-[#212121] text-base">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Choose a username" 
                                  {...field} 
                                  className="bg-[#FAF9F7] border-[#E9E6DD] focus:border-[#212121] h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage className="text-[#212121]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-[#212121] text-base">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Create a password" 
                                  {...field} 
                                  className="bg-[#FAF9F7] border-[#E9E6DD] focus:border-[#212121] h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage className="text-[#212121]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-[#212121] text-base">Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Confirm your password" 
                                  {...field} 
                                  className="bg-[#FAF9F7] border-[#E9E6DD] focus:border-[#212121] h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage className="text-[#212121]" />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full mt-4 bg-[#212121] text-white hover:bg-black h-11 rounded-lg font-semibold" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Hero Section */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="mb-8 inline-flex items-center justify-center lg:justify-start">
                <div className="h-12 w-12 rounded-[8px] bg-[#212121] flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <h1 className="ml-3 text-[44px] leading-[52px] font-semibold text-[#212121]">Design Deck</h1>
              </div>
              <h2 className="text-[32px] leading-[40px] font-semibold text-[#212121] mb-6">Boost Your Design Skills Through Play</h2>
              <p className="text-[#414141] text-base mb-8 max-w-md mx-auto lg:mx-0 leading-[24px]">
                Generate random design briefs, create meaningful projects, and get feedback from the community. Perfect for designers at any level looking to practice and grow.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-[#FAF9F7] p-5 rounded-[20px] border border-[#E9E6DD] shadow-sm">
                  <h3 className="font-semibold text-[#212121]">Draw Cards</h3>
                  <p className="text-sm text-[#414141]">Mix and match client needs, constraints, and audiences</p>
                </div>
                <div className="bg-[#FAF9F7] p-5 rounded-[20px] border border-[#E9E6DD] shadow-sm">
                  <h3 className="font-semibold text-[#212121]">Create Designs</h3>
                  <p className="text-sm text-[#414141]">Apply your skills to realistic design briefs</p>
                </div>
                <div className="bg-[#FAF9F7] p-5 rounded-[20px] border border-[#E9E6DD] shadow-sm">
                  <h3 className="font-semibold text-[#212121]">Get Feedback</h3>
                  <p className="text-sm text-[#414141]">Share your work and learn from the community</p>
                </div>
                <div className="bg-[#FAF9F7] p-5 rounded-[20px] border border-[#E9E6DD] shadow-sm">
                  <h3 className="font-semibold text-[#212121]">Track Progress</h3>
                  <p className="text-sm text-[#414141]">Earn badges and watch your skills improve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
