import React from "react";
import { Metadata } from "next";
import PageAnimation from "@/components/public/page-animation";
import PageTitle from "@/components/private/page-title";
import { LogsContent } from "@/app/admin/logs/components/logs-content";



export const metadata: Metadata = {
  title: "Logs | MerchTrack",
  description: "Oversee and manage activity logs",
};

export default function LogsPage() {
  return (
    <PageAnimation>
      <div className="space-y-6 p-6">
        <PageTitle 
          title="Logs and Audits" 
          level={1}
        />
        <LogsContent />
      </div>
    </PageAnimation>
  );
}