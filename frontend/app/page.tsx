import Hero from "./components/Hero";
import DefiningTechno from "./components/DefiningTechno";
import Gallery from "./components/Gallery";
import SearchTheNetwork from "./components/SearchTheNetwork";
import Events from "./components/Events";
export default function Home() {
  return (
    <div>
      <Hero />
      <DefiningTechno />
      <Gallery />
      <SearchTheNetwork />
      <Events />
    </div>
  );
}
