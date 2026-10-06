import Hero from "../../components/site/Hero.jsx";
import RecentWork from "../../components/site/RecentWork.jsx";
import Services from "../../components/site/Services.jsx";
import Process from "../../components/site/Process.jsx";
import CtaBand from "../../components/site/CtaBand.jsx";
import useTitle from "../../hooks/useTitle.js";

export default function Home() {
  useTitle();
  return (
    <>
      <Hero />
      <RecentWork />
      <Services />
      <Process />
      <CtaBand />
    </>
  );
}
