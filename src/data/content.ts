/**
 * ALL PORTFOLIO CONTENT LIVES HERE.
 * To add a project: copy an entry and paste it into the right list:
 *   completed   -> finished projects
 *   hackathons  -> hackathon projects
 *   ongoing     -> work in progress (always shown last)
 * The flight path, progress bar and moment counter update automatically.
 */

export type Project = { title: string; blurb: string; tags: string[] };
export type Skill = {
  group: string;
  items: string[];
  help: string;
  status: "current" | "in-progress" | "next";
};

export const profile = {
  name: "Vaishnav Sunil Nair",
  role: "AI and ML student building agents, models and software that do real work",
  intro:
    "Second-year B.Tech Computer Science and Engineering (Artificial Intelligence) student with strong analytical skills, keen on solving real-world business problems using AI and ML.",
  location: "Mumbai, India",
  education: {
    degree: "B.Tech, Computer Science and Engineering (Artificial Intelligence)",
    school: "Amrita Vishwa Vidyapeetham, Amritapuri Campus",
    period: "June 2025 to present",
    cgpa: "7.64 / 10",
  },
  // Shown only in the final moment.
  email: "vaishu25nair@gmail.com",
  github: "https://github.com/mythicwarchief",
  linkedin: "https://www.linkedin.com/in/vaishnav-nair-31b811437",
};

export const skills: Skill[] = [
  {
    group: "Languages",
    items: ["Python", "Java", "C"],
    help: "I write the logic, from algorithm-level C to full applications in Java and Python.",
    status: "current",
  },
  {
    group: "AI and ML",
    items: ["Machine Learning", "Neural Networks", "AI Agents", "Agentic AI"],
    help: "I can build predictive models, neural networks and agent-based systems that handle real tasks.",
    status: "current",
  },
  {
    group: "Data",
    items: ["NumPy", "Pandas", "Data Processing"],
    help: "I clean, shape and explore data so models and decisions rest on solid ground.",
    status: "current",
  },
  {
    group: "Development",
    items: ["UI Development", "Full Stack Development", "Backend Development", "Streamlit"],
    help: "I can take an idea from interface to backend, and turn a model into something people can use.",
    status: "current",
  },
  {
    group: "Frameworks and tools",
    items: ["TensorFlow", "Keras", "Jupyter Notebook", "Linux", "Git", "GitHub", "pytest"],
    help: "I train models, work comfortably on Linux, and keep code versioned and tested.",
    status: "current",
  },
  {
    group: "Concepts",
    items: ["Object-Oriented Programming", "Algorithm Analysis", "Software Testing"],
    help: "I design clean structures, weigh algorithm trade-offs and test what I build.",
    status: "current",
  },

  {
    group: "Deep learning",
    items: ["PyTorch", "Backpropagation", "CNNs", "RNNs", "Optimisation"],
    help: "Moving past using models to understanding how they learn, and building training loops from first principles.",
    status: "in-progress",
  },
  {
    group: "Transformers",
    items: ["Self-attention", "Positional encoding", "Encoder-decoder", "Fine-tuning", "Hugging Face"],
    help: "Learning the architecture behind modern language and vision models, and adapting pretrained models to real tasks.",
    status: "next",
  },
  {
    group: "LLMs and retrieval",
    items: ["Embeddings", "Vector search", "RAG", "Prompt design", "Evaluation"],
    help: "Connecting language models to trusted knowledge, and measuring whether the answers are actually good.",
    status: "next",
  },
  {
    group: "Agentic AI",
    items: ["Tool calling", "Planning loops", "Multi-agent systems", "Guardrails"],
    help: "Designing agents that plan, use tools and hand work over safely, with a person able to step in at any point.",
    status: "next",
  },
];

export const completed: Project[] = [
  {
    title: "Smart Fire Evacuation Planner",
    blurb:
      "Proud to share my AI evacuation planner. It finds a route from any starting point to an exit through a building layout. I implemented and compared BFS, Dijkstra's algorithm and A* to see which one plans the best route. When seconds count, search strategy is everything.",
    tags: ["BFS", "Dijkstra's algorithm", "A*"],
  },
  {
    title: "AQI Prediction using Machine Learning",
    blurb:
      "Turned years of monitoring-station data from 2015 to 2020 into a machine learning model that forecasts air quality for Indian cities. It studies pollution trends over time and predicts AQI for any city and period you choose, with filters to tailor the results. Data is only valuable once it helps someone decide something.",
    tags: ["Machine Learning", "Time trends", "AQI"],
  },
  {
    title: "SkillSwap",
    blurb:
      "Built SkillSwap, a peer-to-peer platform where college students offer and request help in academic subjects. Students learn best from each other, and this platform makes that exchange easy and encourages a real network of knowledge sharing.",
    tags: ["Peer-to-peer", "Student platform"],
  },
  {
    title: "Digital Complaint Management System",
    blurb:
      "Designed and built a complaint management system in Java that tracks every complaint from submission to resolution. It has clear workflows for users, assigned officers and administrators, because accountability needs a structure people can follow.",
    tags: ["Java", "Workflows"],
  },
  {
    title: "CNN Implementation on MNIST",
    blurb:
      "Built a convolutional neural network that recognises handwritten digits from the MNIST dataset, and packaged it as a command-line application. A focused project that showed me how a network learns to see.",
    tags: ["CNN", "MNIST", "Command-line"],
  },
];

export const hackathons: Project[] = [
  {
    title: "NyayaBot",
    blurb:
      "Built NyayaBot for the Epochon 2.0 hackathon at Amrita Vishwa Vidyapeetham, an agentic AI system that applies AI agents to legal-domain tasks. A hackathon forces you to turn an idea into a working system under pressure, and this one got me thinking in agents.",
    tags: ["Epochon 2.0, 2026", "Agentic AI", "Legal domain"],
  },
  {
    title: "Nirikshan",
    blurb: "Proud to have built Nirikshan for Smart India Hackathon 2026, one of the country's largest national innovation challenges. Working on a real problem statement with a team pushed my engineering in every direction.",
    tags: ["Smart India Hackathon 2026"],
  },
];

export const ongoing: Project[] = [
  {
    title: "Intelligent Ledger Orchestration System",
    blurb:
      "Currently building an intelligent ledger orchestration system with a human-in-the-loop protocol, so every sanction decision is reviewed and approved by a person. Automation should speed up decisions, never remove accountability.",
    tags: ["Human-in-the-loop", "In progress"],
  },
];

export const activities = ["Member, ACM Amritapuri Student Chapter, SIG-AI"];

export const certifications = [
  "Certificate of Excellence, ACM Debugging Session, ACM Student Chapter, Amrita Vishwa Vidyapeetham",
  'Certificate of Participation, Amrita University Amritapuri Campus Hackathon (team "Garuda"), 17-18 July 2026. Issued by Nitrostack and Wekan Enterprises',
];
