import Footer from '@/components/protected/footer';

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <div>{children}</div>
      <Footer />
    </>
    
  );
}