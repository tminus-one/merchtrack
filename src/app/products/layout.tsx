import { auth } from "@clerk/nextjs/server";
import SyncUserData from "@/components/misc/sync-user-data";
import ProtectedHeader from "@/components/protected/header";
import ProtectedFooter from "@/components/protected/footer";
import { CartProvider } from "@/providers/cart-provider";
import HeaderLP from "@/components/public/header";
import { cn } from "@/lib/utils";

const Layout = async ({children}: Readonly<{ children: React.ReactNode }>) => {
  const { userId } = await auth();
  return (
    <div className="flex min-h-screen flex-col text-neutral-7">
      <SyncUserData />
      <CartProvider>
        { userId ? <ProtectedHeader /> : <HeaderLP />}
        <main className={cn("flex-1", userId ? "" : "pt-16")}>
          {children}
        </main>
        <ProtectedFooter />
      </CartProvider>
    </div>
  );
};

export default Layout;