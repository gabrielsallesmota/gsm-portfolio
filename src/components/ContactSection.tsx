import { motion } from "framer-motion";

const links = [
  { label: "LinkedIn", href: "https://br.linkedin.com/in/gabrielsallesmota", icon: "in" },
  { label: "GitHub", href: "https://github.com/repos?q=owner%3A%40me", icon: "gh" },
  { label: "Email", href: "mailto:gabrielsallesmota@hotmail.com", icon: "✉" },
];

const ContactSection = () => (
  <section id="contact" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">
          Contato
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Interessado em automação, integração de sistemas ou soluções com IA?
        </p>
        <a
          href="mailto:contato@gabrielsallesmota.com"
          className="inline-flex px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity animate-pulse-green"
        >
          Vamos conversar
        </a>

        <div className="flex justify-center gap-6 mt-12">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all duration-300 card-glow">
                <span className="text-lg font-bold">{l.icon}</span>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                {l.label}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2026 Gabriel Salles Mota. Todos os direitos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ContactSection;
