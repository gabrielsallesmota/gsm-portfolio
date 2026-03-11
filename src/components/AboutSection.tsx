import { motion } from "framer-motion";
import avatar from "@/assets/avatar.png";

const interests = [
  "Automação de processos",
  "Integração de sistemas",
  "Inteligência artificial aplicada a negócios",
  "Arquitetura backend escalável",
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gradient mb-16 text-center"
      >
        Sobre mim
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-primary/30 animate-pulse-green">
              <img src={avatar} alt="Gabriel Salles Mota" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-xl bg-primary/20 border border-primary/30" />
            <div className="absolute -top-3 -left-3 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <p className="text-muted-foreground leading-relaxed">
            Sou desenvolvedor backend com experiência em arquitetura de sistemas, integrações e
            automação de processos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Ao longo da minha carreira trabalhei criando APIs, integrações entre plataformas e
            soluções que aumentam eficiência operacional.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Também desenvolvo agentes de IA e automações que ajudam empresas a:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {["Reduzir trabalho manual", "Melhorar atendimento", "Extrair insights de dados", "Automatizar processos internos"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Principais interesses técnicos</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm border border-border"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
