import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Bot, User, Database, Webhook, Brain, ArrowDown, Send, CheckCircle2, Loader2, Search, Zap, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
}

const conversationFlows: Record<string, Message[]> = {
  "Agente de Atendimento com IA": [
    { role: "user", text: "Olá, estou com problema na minha conta" },
    { role: "bot", text: "Olá! Posso ajudar. Qual o número da conta?" },
    { role: "user", text: "12345" },
    { role: "bot", text: "Perfeito. Estou verificando as informações." },
    { role: "bot", text: "Encontrei sua conta. O problema foi resolvido! Posso ajudar com mais algo?" },
  ],
  "Sistema de Qualificação de Leads com IA": [
    { role: "user", text: "Oi, gostaria de saber mais sobre o produto" },
    { role: "bot", text: "Olá! Qual é o tamanho da sua empresa?" },
    { role: "user", text: "Temos 50 funcionários" },
    { role: "bot", text: "Ótimo! E qual problema principal vocês enfrentam?" },
    { role: "user", text: "Perda de leads por falta de follow-up" },
    { role: "bot", text: "Entendi! Lead qualificado. Encaminhando para um consultor." },
  ],
  "Sistema RAG para Suporte Técnico": [
    { role: "user", text: "Como configuro a integração com webhooks?" },
    { role: "bot", text: "Buscando na documentação..." },
    { role: "bot", text: "Encontrei! Acesse Configurações > Integrações > Webhooks e adicione a URL de destino." },
    { role: "user", text: "Quais formatos são suportados?" },
    { role: "bot", text: "Suportamos JSON e XML. A documentação recomenda JSON para melhor performance." },
  ],
  "Automação de Processos Empresariais": [
    { role: "user", text: "Preciso automatizar o envio de um relatório." },
    { role: "bot", text: "Com que frequência você quer enviar esse relatório?" },
    { role: "user", text: "Todos os dias às 8h." },
    { role: "bot", text: "Para qual email o relatório deve ser enviado?" },
    { role: "user", text: "Para o time@empresa.com." },
    { role: "bot", text: "Perfeito! Vou configurar o envio automático do relatório todos os dias às 8h." },
    { role: "bot", text: "Automação criada com sucesso!" }
  ],
  "Agente de Análise de Dados": [
    { role: "user", text: "Qual foi o faturamento do último trimestre?" },
    { role: "bot", text: "Consultando banco de dados..." },
    { role: "bot", text: "Faturamento Q4: R$ 2.4M (+18% vs Q3). Principais drivers: Produto A (45%), Produto B (32%)." },
    { role: "user", text: "Gere um comparativo com o ano anterior" },
    { role: "bot", text: "Crescimento anual: +27%. Destaque: redução de churn em 12% após automação do atendimento." },
  ],
};

const processingSteps = [
  { label: "Recebendo mensagem do usuário", icon: MessageCircle },
  { label: "Detectando intenção", icon: Search },
  { label: "Classificando tipo de solicitação", icon: Zap },
  { label: "Consultando base de conhecimento", icon: Database },
  { label: "Gerando resposta", icon: Brain },
  { label: "Enviando resposta ao usuário", icon: Send },
];

const architectureSteps = [
  { label: "WhatsApp", icon: MessageSquare },
  { label: "Webhook", icon: Webhook },
  { label: "FastAPI", icon: Zap },
  { label: "Agente de IA", icon: Brain },
  { label: "Banco de dados", icon: Database },
];

interface Props {
  projectName: string;
  onClose: () => void;
}

const ProjectSimulationModal = ({ projectName, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [activeProcessingStep, setActiveProcessingStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [simulationDone, setSimulationDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const flow = conversationFlows[projectName] || conversationFlows["Agente de Atendimento com IA"];

  useEffect(() => {
    if (currentStep >= flow.length) {
      setSimulationDone(true);
      return;
    }

    const msg = flow[currentStep];
    const delay = currentStep === 0 ? 800 : msg.role === "bot" ? 2200 : 1200;

    const timer = setTimeout(() => {
      if (msg.role === "bot") {
        setIsTyping(true);
        // Run processing steps
        runProcessingSteps().then(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, msg]);
          setCurrentStep((s) => s + 1);
        });
      } else {
        setMessages((prev) => [...prev, msg]);
        setCurrentStep((s) => s + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, flow]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const runProcessingSteps = () => {
    return new Promise<void>((resolve) => {
      let step = 0;
      setCompletedSteps([]);
      const interval = setInterval(() => {
        if (step < processingSteps.length) {
          setActiveProcessingStep(step);
          if (step > 0) {
            setCompletedSteps((prev) => [...prev, step - 1]);
          }
          step++;
        } else {
          setCompletedSteps((prev) => [...prev, step - 1]);
          setActiveProcessingStep(-1);
          clearInterval(interval);
          resolve();
        }
      }, 350);
    });
  };

  const resetSimulation = () => {
    setMessages([]);
    setCurrentStep(0);
    setIsTyping(false);
    setActiveProcessingStep(-1);
    setCompletedSteps([]);
    setSimulationDone(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{projectName}</h3>
              <p className="text-xs text-muted-foreground">Simulação interativa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left - Chat (60%) */}
            <div className="lg:w-[60%] border-b lg:border-b-0 lg:border-r border-border flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Agente IA</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>

              <div ref={chatRef} className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[350px]">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "bot" && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-foreground rounded-bl-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-secondary px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Fake input */}
              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2">
                  <span className="text-xs text-muted-foreground flex-1">Simulação automática em andamento...</span>
                  <Send className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Right - Processing (40%) */}
            <div className="lg:w-[40%] flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-secondary/30">
                <span className="text-xs font-semibold text-primary">⚡ Processamento do Agente de IA</span>
              </div>

              <div className="p-4 space-y-2 flex-1">
                {processingSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = activeProcessingStep === i;
                  const isCompleted = completedSteps.includes(i);

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.4 }}
                      animate={{
                        opacity: isActive || isCompleted ? 1 : 0.4,
                        x: isActive ? 4 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-3 p-2 rounded-xl text-xs transition-colors ${
                        isActive
                          ? "bg-primary/10 border border-primary/30"
                          : isCompleted
                          ? "bg-secondary/50"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? "bg-primary/20 text-primary"
                            : isCompleted
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span
                        className={`${
                          isActive ? "text-primary font-medium" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {simulationDone && (
                <div className="p-4 border-t border-border">
                  <button
                    onClick={resetSimulation}
                    className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Reiniciar simulação
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Section */}
          <div className="border-t border-border p-6">
            <h4 className="text-xs font-semibold text-primary mb-4 text-center">Arquitetura do sistema</h4>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {architectureSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{step.label}</span>
                    </motion.div>
                    {i < architectureSteps.length - 1 && (
                      <ArrowDown className="w-3 h-3 text-primary/50 rotate-[-90deg]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectSimulationModal;
