import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return <>
    <Header/>
    <main>
      <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
        <h1 className="text-5xl font-bold">Coming Soon...</h1>
        
      </div>
    </main>
    <div className="h-2 bg-gradient-to-r from-[#F7E16A] to-[#AE6CE3]"></div>
    <Footer/>
  </>
}
