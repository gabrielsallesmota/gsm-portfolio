import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectSimulationModal from "./ProjectSimulationModal";

const projects = [
  {
    name: "Agente de Atendimento com IA",
    desc: "Chatbot inteligente que automatiza atendimento ao cliente utilizando IA e integrações com APIs.",
    tech: ["FastAPI", "LLM API", "PostgreSQL", "Workflows"],
    problem: "Reduzir tempo de resposta e escalar o atendimento ao cliente.",
  },
  {
    name: "Sistema de Qualificação de Leads com IA",
    desc: "Agente que conversa com leads e qualifica oportunidades automaticamente.",
    tech: ["FastAPI", "APIs externas"],
    problem: "Qualificar leads de forma automática sem intervenção humana.",
  },
  {
    name: "Sistema RAG para Suporte Técnico",
    desc: "Agente que responde perguntas com base em documentos da empresa.",
    tech: ["FastAPI", "Embeddings", "Busca Semântica"],
    problem: "Agilizar o suporte técnico com respostas baseadas em documentação.",
  },
  {
    name: "Automação de Processos Empresariais",
    desc: "Sistema que automatiza tarefas repetitivas através de integrações entre APIs.",
    tech: ["Python", "APIs REST", "Workflows"],
    problem: "Eliminar retrabalho e aumentar eficiência operacional.",
  },
  {
    name: "Agente de Análise de Dados",
    desc: "Sistema que consulta banco de dados e gera insights automaticamente.",
    tech: ["Python", "SQL", "APIs"],
    problem: "Gerar insights de dados sem análise manual.",
  },
];

const ProjectsSection = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <>
      <section id="projects" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gradient mb-16 text-center"
          >
            Projetos
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-card rounded-2xl border border-border p-6 transition-all duration-300 card-glow hover:-translate-y-1"
              >
                {/* Hover overlay with Simular button */}
                <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <motion.button
                    // start hidden via Tailwind; motion initial conflicts with opacity transition
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveProject(p.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90"
                  >
                    Simular
                  </motion.button>
                </div>

                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-lg">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.desc}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  <span className="text-primary font-medium">Problema: </span>
                  {p.problem}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <ProjectSimulationModal
            projectName={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsSection;
