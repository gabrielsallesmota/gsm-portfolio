import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const slides = [
  { title: "Backend Engineering", desc: "Arquitetura robusta e APIs escaláveis para soluções de alto desempenho." },
  { title: "Automação de Processos", desc: "Eliminando tarefas manuais com workflows inteligentes e integrados." },
  { title: "Agentes de Inteligência Artificial", desc: "IA aplicada para resolver problemas reais de negócio." },
  { title: "Integração de Sistemas", desc: "Conectando plataformas e unificando dados entre diferentes sistemas." },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        {/* Carousel */}
        <div className="relative h-48 md:h-56 mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center px-12 md:px-16"
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4">
                {slides[current].title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {slides[current].desc}
              </p>
              <div className="mt-6">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Ver projetos →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex gap-2 mb-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-10 bg-primary" : "w-4 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
            Gabriel Salles Mota
          </h1>
          <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
            Senior FullStack Engineer
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-2">
            Automation & AI Systems
          </p>
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Desenvolvedor backend especializado em automação, integração de sistemas e aplicações
            de Inteligência Artificial para resolver problemas reais de negócio.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Ver projetos
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              Entrar em contato
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
