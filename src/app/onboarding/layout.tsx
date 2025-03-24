import ProtectedFooter from "@/components/protected/footer";
import ProtectedHeader from "@/components/protected/header";

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <ProtectedHeader />
      <div className="min-h-screen">{children}</div>
      <ProtectedFooter />
    </>
  );
}