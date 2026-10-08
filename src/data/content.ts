/**
 * ALL PORTFOLIO CONTENT LIVES HERE.
 * To add a project: copy an entry and paste it into the right list:
 *   completed   -> finished projects
 *   hackathons  -> hackathon projects
 *   ongoing     -> work in progress (always shown last)
 * The flight path, progress bar and moment counter update automatically.
 */

export type Project = { title: string; blurb: string; tags: string[] };
export type Skill = { group: string; items: string[]; help: string };

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
  },
  {
    group: "AI and ML",
    items: ["Machine Learning", "Neural Networks", "AI Agents", "Agentic AI"],
    help: "I can build predictive models, neural networks and agent-based systems that handle real tasks.",
  },
  {
    group: "Data",
    items: ["NumPy", "Pandas", "Data Processing"],
    help: "I clean, shape and explore data so models and decisions rest on solid ground.",
  },
  {
    group: "Development",
    items: ["UI Development", "Full Stack Development", "Backend Development", "Streamlit"],
    help: "I can take an idea from interface to backend, and turn a model into something people can use.",
  },
  {
    group: "Frameworks and tools",
    items: ["TensorFlow", "Keras", "Jupyter Notebook", "Linux", "Git", "GitHub", "pytest"],
    help: "I train models, work comfortably on Linux, and keep code versioned and tested.",
  },
  {
    group: "Concepts",
    items: ["Object-Oriented Programming", "Algorithm Analysis", "Software Testing"],
    help: "I design clean structures, weigh algorithm trade-offs and test what I build.",
  },
];

export const completed: Project[] = [
  {
    title: "Smart Fire Evacuation Planner",
    blurb:
      "An AI-based evacuation system that finds routes from a starting point to an exit through a predefined building layout. I implemented and compared BFS, Dijkstra's algorithm and A* for route planning and evaluation.",
    tags: ["BFS", "Dijkstra's algorithm", "A*"],
  },
  {
    title: "AQI Prediction using Machine Learning",
    blurb:
      "A machine learning project that forecasts air quality for Indian cities, built on 2015-2020 data from monitoring stations across the country. It studies pollution trends over time and predicts AQI for a chosen city and period, with filters to tailor the results.",
    tags: ["Machine Learning", "Time trends", "AQI"],
  },
  {
    title: "SkillSwap",
    blurb:
      "A peer-to-peer academic assistance platform where college students can offer and request help in academic subjects, encouraging knowledge sharing and student networking.",
    tags: ["Peer-to-peer", "Student platform"],
  },
  {
    title: "Digital Complaint Management System",
    blurb:
      "A complaint management system for submitting, assigning, tracking and updating complaints, with workflows covering users, assigned officers, administrators and resolution status.",
    tags: ["Java", "Workflows"],
  },
  {
    title: "CNN Implementation on MNIST",
    blurb:
      "A convolutional neural network that recognises handwritten digits from the MNIST dataset, implemented as a command-line application.",
    tags: ["CNN", "MNIST", "Command-line"],
  },
];

export const hackathons: Project[] = [
  {
    title: "NyayaBot",
    blurb:
      "An agentic AI project built for the Epochon 2.0 hackathon at Amrita Vishwa Vidyapeetham, applying AI agents to legal-domain tasks.",
    tags: ["Epochon 2.0, 2026", "Agentic AI", "Legal domain"],
  },
  {
    title: "Nirikshan",
    blurb: "A hackathon project developed as part of Smart India Hackathon 2026.",
    tags: ["Smart India Hackathon 2026"],
  },
];

export const ongoing: Project[] = [
  {
    title: "Intelligent Ledger Orchestration System",
    blurb:
      "A ledger orchestration system with a human-in-the-loop protocol, so that sanction decisions are reviewed and approved by a person.",
    tags: ["Human-in-the-loop", "In progress"],
  },
];

export const activities = ["Member, ACM Amritapuri Student Chapter, SIG-AI"];

export const certifications = [
  "Certificate of Excellence, ACM Debugging Session, ACM Student Chapter, Amrita Vishwa Vidyapeetham",
  'Certificate of Participation, Amrita University Amritapuri Campus Hackathon (team "Garuda"), 17-18 July 2026. Issued by Nitrostack and Wekan Enterprises',
];
