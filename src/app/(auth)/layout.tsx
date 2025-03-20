
import Footer from "@/components/protected/footer";
import HeaderLP from "@/components/public/header";


const Layout = ({children}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col pt-16">
      <HeaderLP />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;