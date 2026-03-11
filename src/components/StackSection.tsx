import { motion } from "framer-motion";

const categories = [
  {
    name: "Backend",
    icon: "🖥️",
    items: ["Python", "FastAPI", "REST APIs"],
  },
  {
    name: "Banco de Dados",
    icon: "🗄️",
    items: ["PostgreSQL", "SQL"],
  },
  {
    name: "Integrações",
    icon: "🔗",
    items: ["Webhooks", "APIs externas"],
  },
  {
    name: "Automação",
    icon: "⚙️",
    items: ["Workflows automatizados", "Integração entre sistemas"],
  },
  {
    name: "IA",
    icon: "🤖",
    items: ["LLM APIs", "Agentes de IA", "Automação inteligente"],
  },
];

const StackSection = () => (
  <section id="stack" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gradient mb-16 text-center"
      >
        Stack
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 card-glow transition-all duration-300"
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{cat.name}</h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StackSection;
