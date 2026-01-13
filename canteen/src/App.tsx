import { FloatingUtensils } from './components/FloatingUtensils/FloatingUtensils';
import { SteamParticles } from './components/SteamParticles/SteamParticles';
import { Hero } from './components/Hero/Hero';
import { WhoWeServe } from './components/WhoWeServe/WhoWeServe';
import { ScaleInfrastructure } from './components/ScaleInfrastructure/ScaleInfrastructure';
import { SafetyQuality } from './components/SafetyQuality/SafetyQuality';
import { Compliance } from './components/Compliance/Compliance';
import { Counters } from './components/Counters/Counters';
import { ContactForm } from './components/ContactForm/ContactForm';
import { MealsShowcase } from './components/Meals/MealsShowcase';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.ambient}>
        <FloatingUtensils />
        <SteamParticles count={10} opacity={0.08} />
      </div>

      <main>
        <Hero />
        <WhoWeServe />
        <MealsShowcase title="Menu Showcase" initialCategory="Lunch" />
        <ScaleInfrastructure />
        <SafetyQuality />
        <Compliance />
        <Counters />
        <ContactForm />
      </main>
    </div>
  );
}

export default App;
