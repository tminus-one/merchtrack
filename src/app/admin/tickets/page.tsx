import { Metadata } from "next";
import PageTitle from "@/components/private/page-title";
import PageAnimation from "@/components/public/page-animation";
import TicketsContent from "@/app/admin/tickets/components/tickets-content";

export const metadata: Metadata = {
  title: "Support Tickets | MerchTrack",
  description: "Manage and handle customer support tickets",
};


export default function TicketsPage() {
  return (
    <PageAnimation>
      <div className="p-6">
        <PageTitle title="Support Tickets" />
        <TicketsContent />
      </div>
    </PageAnimation>
  );
}