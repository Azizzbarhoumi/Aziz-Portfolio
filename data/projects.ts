export type ProjectLinkSet = {
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectLocalized = {
  title?: string;
  subtitle?: string;
  summary?: string;
  problem?: string;
  built?: string[];
  result?: string;
  category?: string;
  myRole?: string;
  interfaceLanguageNote?: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  summary: string;
  problem: string;
  built: string[];
  result: string;
  category: string;
  status: "Case study" | "Summary only";
  technologies: string[];
  myRole?: string;
  screenshots?: ProjectScreenshot[];
  interfaceLanguageNote?: string;
  links: ProjectLinkSet;
  fr?: ProjectLocalized;
};

export const AGRI_PROJECT_NAME = "AgriConnect";

export const projects: Project[] = [
  {
    slug: "agriconnect",
    number: "01",
    title: AGRI_PROJECT_NAME,
    subtitle: "AI agricultural decision-support platform",
    year: "2026",
    summary: "An AI platform bringing farmer assistance, pest detection, and agricultural regulatory knowledge together in a deployed application.",
    problem: "Farmers need practical support across crop decisions, pest alerts, and regulatory questions.",
    built: [
      "Built the FastAPI backend end to end, including farmer data management.",
      "Integrated LLM-based assistance, VLM pest detection, pest alerts, and AI-driven recommendations.",
      "Connected a regulatory knowledge base covering PAC, TelePAC, FranceAgriMer, and CERFA resources.",
    ],
    result: "Working web application deployed; awarded second place in the Talan internship challenge.",
    category: "AI platform",
    status: "Case study",
    myRole: "Lead Backend & AI Integration Engineer — developed the FastAPI backend end-to-end, integrated multi-agent workflows, VLM pest detection, and RAG knowledge base.",
    technologies: ["FastAPI", "LLM", "VLM", "RAG"],
    screenshots: [
      { src: "/images/projects/agriconnect-landingpage.png", alt: "AgriConnect web app landing page", caption: "Web application · landing page" },
      { src: "/images/projects/agriconnect-features.png", alt: "AgriConnect's four-step agricultural assistance journey", caption: "Product workflow · four AI-assisted steps" },
      { src: "/images/projects/agriconnect-mobile.png", alt: "AgriConnect mobile app pest detection screen", caption: "Mobile application · pest detection" },
      { src: "/images/projects/agriconnect-mobile-result.png", alt: "AgriConnect mobile app result with green stink bug identification and risk assessment", caption: "Mobile application · pest identification result" },
    ],
    interfaceLanguageNote: "Interface shown in French, the product's target-market language.",
    links: {
      githubUrl: "https://github.com/Boug-Mariem/Coccinelle",
      demoUrl: "https://agriconnect.mariemboughizene99.workers.dev/",
    },
    fr: {
      title: "AgriConnect (AgriMent)",
      subtitle: "Plateforme d’IA agricole multi-agents pour exploitants",
      summary: "Plateforme d’aide à la décision en IA générative réunissant conseil cultural, identification visuelle de ravageurs et conformité réglementaire.",
      problem: "Les agriculteurs ont besoin d'un accompagnement unifié pour leurs choix culturaux, le suivi des ravageurs et le respect des réglementations complexes.",
      built: [
        "Développement du backend FastAPI de bout en bout et gestion des données d'exploitation.",
        "Intégration d'agents conseillers LLM spécialisés (agricole, réglementaire, financier).",
        "Composant VLM pour l'identification des nuisibles à partir de photos et envoi d'alertes ciblées.",
        "Connexion d'une base RAG réglementaire exhaustive (PAC, TelePAC, FranceAgriMer, CERFA).",
      ],
      result: "Application web opérationnelle déployée ; 2e place au challenge de stage de 2e année chez Talan.",
      category: "Plateforme IA",
      myRole: "Lead Backend & Intégration IA — pilotage du développement backend FastAPI de bout en bout, intégration des agents conseillers LLM, du composant VLM et de la base RAG réglementaire.",
      interfaceLanguageNote: "Interface présentée en français, langue du marché cible de la solution.",
    },
  },
  {
    slug: "neurolearn-ai",
    number: "02",
    title: "NeuroLearn AI",
    subtitle: "Adaptive STEM learning platform",
    year: "2026",
    summary: "A multi-provider learning platform that personalizes STEM content through cognitive profiling, content generation, and speech processing.",
    problem: "STEM learners benefit from learning content adapted to their cognitive profiles.",
    built: [
      "Designed a stateless Flask backend with a JSON-first architecture.",
      "Built a React and TypeScript frontend with more than 50 components.",
      "Integrated Groq, Mistral, and OpenAI Whisper for content and speech workflows.",
    ],
    result: "Reported 85%+ profile detection accuracy and average API latency under 3 seconds.",
    category: "Web app",
    status: "Case study",
    myRole: "Lead Backend & Multi-Agent Architect — designed the stateless Flask JSON-first backend (<3s latency), cognitive profiling engine (85%+ accuracy), and dynamic LLM routing across Groq, Mistral, and Whisper.",
    technologies: ["Flask", "React", "TypeScript", "Groq", "Mistral", "Whisper"],
    screenshots: [
      { src: "/images/projects/neurolearn.png", alt: "NeuroLearn AI adaptive learning dashboard showing learner cognitive profile, progress, personalized plan, and learning tools", caption: "Adaptive learning dashboard" },
    ],
    links: { githubUrl: "https://github.com/Azizzbarhoumi/NEUROLEARN-AI" },
    fr: {
      title: "NeuroLearn AI",
      subtitle: "Plateforme d’apprentissage adaptatif STEM multi-agents",
      summary: "Plateforme d'apprentissage adaptatif en IA générative personnalisant les contenus STEM selon le profil cognitif de l'apprenant, avec agents spécialisés et interaction vocale.",
      problem: "L'apprentissage des matières scientifiques (STEM) nécessite des supports personnalisés et interactifs adaptés aux différents modes cognitifs.",
      built: [
        "Conception d'un backend Flask stateless à architecture JSON-first (latence moyenne < 3 secondes).",
        "Développement d'un frontend React & TypeScript composé de plus de 50 composants modulaires.",
        "Création d'agents d'apprentissage dédiés (Agent Visuel, Game Zone, Agent Narratif).",
        "Intégration et routage multi-fournisseurs : Groq, Mistral et interaction vocale avec OpenAI Whisper.",
      ],
      result: "Précision de détection du profil cognitif supérieure à 85% ; primé à l'IEEE Education Week Challenge 2026.",
      category: "Application web IA",
      myRole: "Lead Backend & Architecte Multi-Agents — conception du backend Flask stateless JSON-first (<3s de latence), moteur de profilage cognitif (>85% de précision) et routage dynamique LLM/vocal (Groq, Mistral, Whisper).",
    },
  },
  {
    slug: "city-brain-convergence",
    number: "03",
    title: "City Brain Convergence",
    subtitle: "Agentic AI for smart cities",
    year: "2026",
    summary: "An agentic AI system that monitors digital-twin sensor streams, detects urban incidents, and triggers targeted responses.",
    problem: "Continuously monitor urban sensor streams to detect incidents and support rapid emergency response.",
    built: [
      "Engineered a multi-agent system using Agent-to-Agent (A2A) protocols to monitor digital-twin sensor streams.",
      "Detected incidents including accidents, fires, traffic, and flooding.",
      "Autonomously triggered targeted physical and digital actuators for response.",
    ],
    result: "Autonomous multi-agent system for real-time incident detection and rapid response.",
    category: "Agentic AI · Smart cities",
    status: "Case study",
    myRole: "Agentic Systems Engineer — designed multi-agent A2A protocols for real-time digital-twin sensor monitoring and emergency actuator triggering.",
    technologies: ["Multi-agent AI", "A2A", "Digital twins", "AI agents", "Actuators"],
    links: { githubUrl: "https://github.com/Azizzbarhoumi" },
    fr: {
      title: "City Brain Convergence",
      subtitle: "IA agentique pour villes intelligentes & jumeaux numériques",
      summary: "Système d'IA agentique surveillant en temps réel les flux de capteurs d'un jumeau numérique urbain, détectant les incidents critiques et activant des réponses automatisées.",
      problem: "Surveiller en continu les flux de capteurs urbains massifs pour détecter immédiatement les incidents et piloter les secours en temps réel.",
      built: [
        "Architecture multi-agents reposant sur des protocoles Agent-to-Agent (A2A) pour l'analyse des flux capteurs de jumeaux numériques.",
        "Détection en temps réel des incidents urbains majeurs (accidents, départs de feu, congestions, inondations).",
        "Déclenchement autonome d'actionneurs physiques et numériques ciblés pour l'intervention d'urgence.",
      ],
      result: "Système multi-agents autonome pour la détection d'incidents en temps réel et l'intervention rapide.",
      category: "IA Agentique · Smart Cities",
      myRole: "Ingénieur Systèmes Agentiques — conception de l'architecture multi-agents Agent-to-Agent (A2A) pour la surveillance des flux capteurs de jumeaux numériques et l'activation des réponses d'urgence.",
    },
  },
  {
    slug: "fakeguard-ai",
    number: "04",
    title: "FakeGuard AI",
    subtitle: "Fake news detection system",
    year: "2026",
    summary: "A fake-news classification pipeline and web app that accepts text, URLs, PDFs, and images.",
    problem: "Readers need a way to assess news content supplied in more than one format.",
    built: [
      "Created a classification pipeline on the WELFake dataset, from tokenization and TF-IDF through transformer encoding.",
      "Compared BERT with CNN-LSTM and classical baselines.",
      "Built a React web app for text, URL, PDF, and image inputs.",
    ],
    result: "BERT outperformed the CNN-LSTM and classical baselines in the reported evaluation.",
    category: "NLP / ML web app",
    status: "Case study",
    myRole: "Full-Stack ML Engineer — built end-to-end classification pipeline comparing BERT against CNN-LSTM & baselines on WELFake, and developed multi-format React web application.",
    technologies: ["NLP", "BERT", "React", "WELFake"],
    screenshots: [
      { src: "/images/projects/fakeguard-landingpage.png", alt: "FakeGuard AI project landing page", caption: "Web application · landing page" },
      { src: "/images/projects/fakeguard-features.png", alt: "FakeGuard AI multi-format analyzer interface", caption: "Product interface · multi-format analyzer" },
    ],
    links: { githubUrl: "https://github.com/Azizzbarhoumi/PFA" },
    fr: {
      title: "FakeGuard AI",
      subtitle: "Système de détection de fausses informations multi-formats",
      summary: "Pipeline de classification de fake news et application web acceptant des entrées textuelles, URLs, documents PDF et images.",
      problem: "Les lecteurs ont besoin d'un outil fiable pour vérifier la véracité des informations diffusées sous des formats multiples et hétérogènes.",
      built: [
        "Pipeline complet de classification sur le jeu de données WELFake (tokenisation, TF-IDF, encodage transformers).",
        "Évaluation comparative rigoureuse de BERT face à des architectures CNN-LSTM et modèles classiques.",
        "Application web React intuitive prenant en charge le texte brut, les liens URL, les PDFs et les images.",
      ],
      result: "BERT a surpassé le CNN-LSTM et les baselines classiques ; projet de fin de 2e année (2026).",
      category: "NLP / Web app ML",
      myRole: "Ingénieur ML Full-Stack — développement du pipeline de classification de bout en bout (BERT vs CNN-LSTM sur WELFake) et création de l'application web React.",
    },
  },
  {
    slug: "emotion-recognition-speech",
    number: "05",
    title: "Emotion Recognition from Speech",
    subtitle: "Audio classification pipeline",
    year: "2025",
    summary: "An audio classification study comparing classical machine-learning models with a hybrid neural architecture.",
    problem: "Explore speech audio features and compare approaches for emotion classification.",
    built: [
      "Extracted MFCC, zero-crossing-rate, and spectral features with Librosa.",
      "Trained and compared SVM, Random Forest, and XGBoost models.",
      "Evaluated a hybrid CNN-LSTM architecture.",
    ],
    result: "Academic project; comparative evaluation across classical and hybrid models.",
    category: "Machine learning (audio)",
    status: "Case study",
    myRole: "Audio ML Researcher & Developer — extracted acoustic features with Librosa (MFCC, ZCR, spectral) and benchmarked SVM, Random Forest, XGBoost against a hybrid CNN-LSTM.",
    technologies: ["Librosa", "MFCC", "SVM", "Random Forest", "XGBoost", "CNN-LSTM"],
    links: { githubUrl: "https://github.com/Azizzbarhoumi" },
    fr: {
      title: "Reconnaissance des Émotions par la Parole",
      subtitle: "Pipeline de classification audio & deep learning",
      summary: "Étude comparative de modèles de machine learning et d'une architecture neuronale hybride CNN-LSTM pour classifier les états émotionnels dans la voix.",
      problem: "Extraire des représentations acoustiques discriminantes et classifier précisément les émotions à partir de signaux audio de parole.",
      built: [
        "Extraction de coefficients MFCC, taux de passage par zéro (ZCR) et caractéristiques spectrales via Librosa.",
        "Entraînement et benchmark de classifieurs classiques : SVM, Random Forest, XGBoost.",
        "Conception et évaluation d'une architecture hybride deep learning CNN-LSTM.",
      ],
      result: "Projet académique de fin de 1re année (2025) ; benchmark complet et analyse comparative des performances.",
      category: "Machine Learning (Audio)",
      myRole: "Développeur & Chercheur ML Audio — extraction de descripteurs audio avec Librosa (MFCC, ZCR, spectre) et évaluation comparative de modèles classiques face à un CNN-LSTM hybride.",
    },
  },
  {
    slug: "proverdy-data-extraction",
    number: "06",
    title: "Data Extraction Tool",
    subtitle: "ProVerdy · automated research workflow",
    year: "2024",
    summary: "An automated tool for collecting financial and sustainability reports from MENA sources and LinkedIn profiles within platform policy limits.",
    problem: "Research across specified sources involved repeated collection of reports and profile information.",
    built: [
      "Automated source collection with Selenium.",
      "Parsed web content with BeautifulSoup.",
      "Focused extraction on MENA financial and sustainability reports and LinkedIn profiles.",
    ],
    result: "Automation tool completed during a two-month first-year internship.",
    category: "Data tool",
    status: "Case study",
    myRole: "Data Extraction Intern — developed automated scraping tool with Selenium and BeautifulSoup for MENA financial/sustainability reports and LinkedIn profiles.",
    technologies: ["Python", "Selenium", "BeautifulSoup"],
    links: { githubUrl: "https://github.com/Azizzbarhoumi" },
    fr: {
      title: "Outil d'Extraction de Données",
      subtitle: "ProVerdy · automatisation de la recherche documentaire",
      summary: "Outil automatisé de collecte et d'analyse de rapports financiers et de durabilité (RSE/ESG) sur des sources de la région MENA et LinkedIn.",
      problem: "La collecte manuelle répétée de rapports d'activité et de profils professionnels représentait une perte de temps considérable pour les analystes.",
      built: [
        "Automatisation complète de la collecte de données web via Selenium.",
        "Parsing et structuration des contenus HTML avec BeautifulSoup.",
        "Extraction ciblée de rapports MENA et profils LinkedIn dans le respect des politiques de plateforme.",
      ],
      result: "Outil d'automatisation déployé et livré au terme d'un stage de 2 mois (2024).",
      category: "Outil Data",
      myRole: "Stagiaire Extraction de Données — développement d'outils de scraping automatisés avec Selenium et BeautifulSoup pour l'extraction de rapports financiers et ESG.",
    },
  },
];

const featuredProjectOrder = [
  "agriconnect",
  "neurolearn-ai",
  "city-brain-convergence",
  "fakeguard-ai",
  "emotion-recognition-speech",
  "proverdy-data-extraction",
];

projects.sort((a, b) => featuredProjectOrder.indexOf(a.slug) - featuredProjectOrder.indexOf(b.slug));
projects.forEach((project, index) => { project.number = String(index + 1).padStart(2, "0"); });

export function getLocalizedProject(project: Project, lang: "en" | "fr"): Project {
  if (lang !== "fr" || !project.fr) return project;
  return {
    ...project,
    title: project.fr.title ?? project.title,
    subtitle: project.fr.subtitle ?? project.subtitle,
    summary: project.fr.summary ?? project.summary,
    problem: project.fr.problem ?? project.problem,
    built: project.fr.built ?? project.built,
    result: project.fr.result ?? project.result,
    category: project.fr.category ?? project.category,
    myRole: project.fr.myRole ?? project.myRole,
    interfaceLanguageNote: project.fr.interfaceLanguageNote ?? project.interfaceLanguageNote,
  };
}
