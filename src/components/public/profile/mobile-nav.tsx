import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import MyProfileSideBar from "./my-profile-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith('/profile');
  
  if (!isProfilePage) return null;

  return (
    <div className="sticky top-0 z-50 -mx-4 mb-4 border-b bg-white/80 px-4 py-2 backdrop-blur-sm lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Menu className="size-4" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <MyProfileSideBar />
        </SheetContent>
      </Sheet>
    </div>
  );
}