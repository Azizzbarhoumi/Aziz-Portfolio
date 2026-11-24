# Aziz Barhoumi

## Profile

Name: Aziz Barhoumi. Based in Manouba, Tunis, Tunisia.

Focus: Generative AI and systems design, with hands-on experience in agentic architectures (A2A, RAG, MCP), LLM integration and end-to-end ML pipelines.

Looking for: an internship (4-6 months), available now.

## Education

- Third-year engineering student in Applied Mathematics and Modelling at ENSIT (Higher National School of Engineers of Tunis), 2024-2027.
- Also pursuing a Research Master's in Data Science at ENSIT, 2026-2027.
- Preparatory Cycle (Physics-Chemistry), 2022-2024.
- Baccalaureate in Experimental Sciences, Lycée Bab Elkhadhra, Tunis, 2022.

## Skills

- Generative AI and LLM engineering: LLMs, RAG, prompt engineering, ChromaDB, LangChain, LangGraph, Model Context Protocol (MCP), Agent-to-Agent (A2A), n8n, vision-language models, and multi-provider LLM integration (Groq, Mistral, OpenAI, Whisper).
- Data science and machine learning: Scikit-learn, XGBoost, Pandas, NumPy, Matplotlib, Seaborn, TF-IDF, and end-to-end ML pipelines.
- Deep learning: PyTorch, TensorFlow, CNNs, CNN-LSTM, Transformers (including BERT), NLP, computer vision, and OCR.
- Programming languages: Python, Java, C/C++, JavaScript, TypeScript, MATLAB, and PL/SQL.
- Data and databases: PostgreSQL, MySQL, MongoDB, and web scraping with Selenium and BeautifulSoup.
- Development and tools: Docker, FastAPI, Flask, REST APIs, Streamlit, React, TailwindCSS, and Git.

## Experience

### AgriConnect (called AgriMent in the CV; AI agricultural platform, 2nd place at Talan)

Second-year internship, 2 months: led development of a generative AI decision-support platform for farmers. It includes an Agricultural Advisor Agent for crop and farming guidance, a Regulatory Advisor Agent answering from PAC, TelePAC, FranceAgriMer, and CERFA resources, a Financial/Business Advisor Agent, and VLM-based pest identification and alerts. Built the FastAPI backend end to end, integrating farmer data, pest alerts, and agent recommendations into a single working deployment. Awarded second place in the Talan second-year internship challenge.

### Data Extraction Tool at ProVerdy

First-year internship, 2 months, 2024: automated scraping tool with Selenium and BeautifulSoup extracting financial and sustainability reports from MENA sources and LinkedIn profiles within platform policy limits.

## Projects

### NeuroLearn AI (adaptive STEM learning platform)

IEEE Education Week Challenge, 2026: multi-agent adaptive STEM learning platform that personalises content through cognitive profiling, with 85%+ profile detection accuracy. Specialized agents generate visual explanations, game-based exercises, and narratives. Includes voice interaction using OpenAI Whisper and LLM routing across Groq, Mistral, and OpenAI. Built with a stateless Flask backend using a JSON-first architecture (average API latency under 3 seconds) and a React/TypeScript frontend with 50+ components and TailwindCSS.

### CardioAgent-Ops (agentic MLOps platform for heart sound diagnosis)

Data Mining & ML project at ENSIT, 2026, currently in progress. GitHub: https://github.com/Azizzbarhoumi/CardioAgent-Ops. End-to-end system that classifies phonocardiogram (PCG) heart sounds as normal or abnormal, using PASCAL and PhysioNet recordings resampled to 2000 Hz. Aziz benchmarked five model families: a Decision Tree on MFCC features, SVM with RBF kernel, linear SVM, a custom 2D CNN on Mel spectrograms, and VGG16 transfer learning with a frozen backbone. Evaluation uses patient-grouped 3-fold cross-validation with versioned split manifests, and model selection is driven by recall on the abnormal class. The best test balanced accuracy is 0.81 (SVM RBF). Runs are tracked in MLflow and the model is exported to ONNX. The system is served as 6 Docker Compose services (LLM server, vector DB, audio engine, LangGraph agent orchestrator, API gateway, MLflow server) with pytest tests and GitHub Actions CI/CD. It also includes a QLoRA fine-tuned LLM with RAG that explains predictions, and a React "patient monitor" web app for analysis and benchmark review. Stack: Python, TensorFlow/Keras, scikit-learn, MLflow, ONNX, Docker, FastAPI, LangGraph, RAG, QLoRA, React. Aziz's role: ML & MLOps engineer, building the PCG classification pipeline and model benchmark, the MLflow/ONNX workflow, the Dockerized agentic services and the RAG explanation layer.

### MCP-NativeAgent (safety-first Git and GitHub assistant)

Personal project, 2026, currently in progress. GitHub: https://github.com/Azizzbarhoumi/MCP-NativeAgent. A safety-first Git and GitHub assistant for beginners: it inspects the real state of a repo, explains the error in plain language, and proposes a fix as steps with risk tiers that run only after the user approves them. Stack: Python, MCP, LangGraph, Qdrant, RAG, Mistral, Groq, Langfuse, Docker, pytest. The project is still in progress, so detailed results are not published in this portfolio yet.

### FakeGuard AI (fake news detection)

End-of-second-year project, 2026: built a full-pipeline fake-news classifier on the WELFake dataset using tokenization, TF-IDF, and transformer encoding. BERT outperformed CNN-LSTM and classical baselines. Developed a React web app accepting text, URLs, PDFs, and images.

### Emotion Recognition from Speech

End-of-first-year project, 2025: audio classification with Librosa (MFCCs, ZCR, spectral features); compared SVM, Random Forest, XGBoost and a hybrid CNN-LSTM.

## Certifications

- Fundamentals of Deep Learning (NVIDIA).
- Introduction to Data Engineering (365 Data Science).
- Introduction to AI (365 Data Science).

## Leadership

Human Resources Manager, IEEE ENSIT Student Branch.

## Languages

Arabic (native), English (intermediate), French (intermediate).

## Contact

- Email: azizbr438@gmail.com
- LinkedIn: linkedin.com/in/aziz-barhoumi-320bb9339

Do not publish a phone number in chat.
