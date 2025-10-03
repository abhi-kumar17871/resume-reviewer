"use client";

import Link from "next/link";
import { Upload, Users, Award, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/auth/admin";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [submitUrl, setSubmitUrl] = useState("/login");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const updateUserStatus = (currentUser: User | null) => {
      if (currentUser && currentUser.email) {
        if (isAdminUser(currentUser.email)) {
          setSubmitUrl("/admin/resumes");
        } else {
          setSubmitUrl("/dashboard");
        }
      } else {
        setSubmitUrl("/login");
      }
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      updateUserStatus(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      updateUserStatus(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-gray-200 opacity-50 -z-10"></div>
        <h1 className="ext-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
          Get Your Resume Reviewed by Experts
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
          Upload your resume and receive professional feedback with detailed scores and actionable insights to land your dream job.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={submitUrl} className="bg-gray-300 hover:bg-gray-700 hover:text-white h-12 px-8 font-bold rounded-md flex justify-center items-center">
            Submit Your Resume
          </Link>
          <Link href="/leaderboard" className="border-gray-600 rounded-md border-2 h-12 px-8 bg-transparent flex justify-center items-center hover:bg-gray-200">
            View Leaderboard
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Drag and drop your PDF resume with instant preview before submission.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Expert Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Professional reviewers provide detailed feedback and actionable insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">Scoring System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get scored out of 100 and see how you rank against other candidates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Your resume data is protected with enterprise-grade security.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">See How You Compare</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out our public leaderboard to see top-performing resumes and get inspired by the best.
          </p>
        </div>
        <div className="text-center">
          <Link href="/leaderboard">
            <button className="border-gray-600 rounded-md border-2 h-12 px-8 bg-transparent hover:bg-gray-200">
              View Leaderboard
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}