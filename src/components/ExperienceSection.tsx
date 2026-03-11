import { motion } from "framer-motion";

const timeline = [
  {
    period: "Atual",
    role: "Senior FullStack Engineer",
    desc: "Desenvolvimento de APIs escaláveis, integração entre sistemas, automação de processos e implementação de soluções com IA.",
    highlights: ["APIs REST", "Integração de sistemas", "Automação", "IA aplicada"],
  },
  {
    period: "Experiência anterior",
    role: "Backend Developer",
    desc: "Criação de microsserviços, otimização de queries, desenvolvimento de integrações com APIs externas e melhoria de performance.",
    highlights: ["Microsserviços", "PostgreSQL", "APIs externas", "Performance"],
  },
];

const automationItems = [
  "Automatizar tarefas manuais",
  "Integrar diferentes sistemas",
  "Reduzir retrabalho",
  "Melhorar eficiência operacional",
];

const ExperienceSection = () => (
  <section id="experience" className="py-24">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gradient mb-16 text-center"
      >
        Experiência
      </motion.h2>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto space-y-8 mb-16">
        {timeline.map((item, i) => (
          <motion.div
            key={item.role}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-8 border-l-2 border-primary/30"
          >
            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary green-glow" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {item.period}
            </span>
            <h3 className="text-xl font-bold text-foreground mt-1 mb-2">{item.role}</h3>
            <p className="text-muted-foreground mb-3 leading-relaxed">{item.desc}</p>
            <div className="flex flex-wrap gap-2">
              {item.highlights.map((h) => (
                <span
                  key={h}
                  className="text-xs px-3 py-1 rounded-lg bg-secondary text-secondary-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Automation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-8"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">
          🤖 Automação no trabalho
        </h3>
        <p className="text-muted-foreground mb-4">
          Ao longo da carreira, foram desenvolvidas soluções para:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {automationItems.map((item) => (
            <div key={item} className="flex items-center gap-3 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ExperienceSection;
