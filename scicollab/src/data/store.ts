// SciCollab — Data store (Collaboration Management module)

export interface Researcher {
  id: number
  name: string
  initials: string
  email: string
  institution: string
  department: string
  role: string
  bio: string
  skills: string[]
  interests: string[]
  publications: number[]
  h_index: number
  citations_total: number
}

export interface Project {
  id: number
  title: string
  description: string
  status: 'Active' | 'Completed' | 'Paused'
  pi: string
  members: number[]
  startDate: string
  endDate?: string
  tags: string[]
}

export const researchers: Researcher[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    initials: 'SC',
    email: 's.chen@mit.edu',
    institution: 'MIT',
    department: 'CSAIL',
    role: 'Associate Professor',
    bio: 'Dr. Chen specializes in graph neural networks, federated learning, and quantum-classical hybrid algorithms. Her work on protein interaction prediction using geometric deep learning has been widely cited.',
    skills: ['Graph Neural Networks', 'Federated Learning', 'Quantum Computing', 'Computer Vision', 'Distributed Systems'],
    interests: ['AI for Drug Discovery', 'Privacy-Preserving ML', 'Scientific Knowledge Graphs', 'Computational Neuroscience'],
    publications: [1, 2, 3, 4, 5, 6],
    h_index: 24,
    citations_total: 3142,
  },
  {
    id: 2,
    name: 'Dr. Emma Torres',
    initials: 'ET',
    email: 'e.torres@ox.ac.uk',
    institution: 'University of Oxford',
    department: 'Department of Computer Science',
    role: 'Reader',
    bio: 'Dr. Torres focuses on privacy-preserving computation and federated learning. She has pioneered techniques for cross-silo federated learning with strong differential privacy guarantees.',
    skills: ['Differential Privacy', 'Federated Learning', 'Cryptography', 'Machine Learning', 'Data Ethics'],
    interests: ['Responsible AI', 'Cross-Institutional Collaboration', 'Privacy Law & Technology', 'Secure Multi-Party Computation'],
    publications: [2, 7, 8],
    h_index: 18,
    citations_total: 2210,
  },
  {
    id: 3,
    name: 'Prof. James Okafor',
    initials: 'JO',
    email: 'j.okafor@cam.ac.uk',
    institution: 'University of Cambridge',
    department: 'Department of Engineering',
    role: 'Professor',
    bio: 'Professor Okafor is an expert in high-performance computing and distributed systems. His work on petascale machine learning has enabled new breakthroughs in scientific simulation.',
    skills: ['High-Performance Computing', 'Distributed Systems', 'Parallel Algorithms', 'Supercomputing', 'Scientific Computing'],
    interests: ['Exascale Systems', 'Climate Modelling', 'Large-Scale Graph Analytics', 'Green Computing'],
    publications: [4, 9, 10],
    h_index: 31,
    citations_total: 5820,
  },
  {
    id: 4,
    name: 'Dr. Yuki Tanaka',
    initials: 'YT',
    email: 'y.tanaka@u-tokyo.ac.jp',
    institution: 'University of Tokyo',
    department: 'Graduate School of Informatics',
    role: 'Associate Professor',
    bio: 'Dr. Tanaka works at the intersection of AI and climate science, developing neural network approaches for climate model emulation and extreme weather prediction.',
    skills: ['Climate Modelling', 'Neural Networks', 'Time Series Analysis', 'Scientific ML', 'Python'],
    interests: ['Climate Change Mitigation', 'AI for Science', 'Ensemble Methods', 'Uncertainty Quantification'],
    publications: [11, 12],
    h_index: 14,
    citations_total: 987,
  },
  {
    id: 5,
    name: 'Dr. Amir Khan',
    initials: 'AK',
    email: 'a.khan@ethz.ch',
    institution: 'ETH Zürich',
    department: 'Department of Computer Science',
    role: 'Senior Researcher',
    bio: 'Dr. Khan specialises in secure computation and privacy-preserving machine learning. His patents on privacy-preserving distributed ML form the basis of commercial deployments.',
    skills: ['Secure Computation', 'Cryptography', 'Machine Learning', 'Privacy Engineering', 'Rust'],
    interests: ['Healthcare AI', 'Financial Technology', 'Zero-Knowledge Proofs', 'Hardware Security'],
    publications: [2, 6, 13],
    h_index: 16,
    citations_total: 1540,
  },
  {
    id: 6,
    name: 'Dr. Priya Sharma',
    initials: 'PS',
    email: 'p.sharma@iitb.ac.in',
    institution: 'IIT Bombay',
    department: 'Department of Computer Science & Engineering',
    role: 'Assistant Professor',
    bio: 'Dr. Sharma investigates large language models applied to biochemical property prediction. Her interdisciplinary work bridges NLP and chemistry, with applications in drug discovery.',
    skills: ['Large Language Models', 'NLP', 'Biochemistry', 'Drug Discovery', 'Deep Learning'],
    interests: ['AI for Drug Discovery', 'Protein Language Models', 'Materials Informatics', 'Generative AI'],
    publications: [14, 15],
    h_index: 9,
    citations_total: 624,
  },
  {
    id: 7,
    name: 'Dr. Marco Novak',
    initials: 'MN',
    email: 'm.novak@epfl.ch',
    institution: 'EPFL',
    department: 'School of Computer and Communication Sciences',
    role: 'Postdoctoral Researcher',
    bio: 'Dr. Novak works on molecular property prediction using deep learning. His thesis at ETH Zürich introduced a new graph-transformer architecture for chemical compound modelling.',
    skills: ['Graph Transformers', 'Molecular Modelling', 'Deep Learning', 'Cheminformatics', 'PyTorch'],
    interests: ['Green Chemistry', 'Automated Drug Design', 'Graph Representation Learning'],
    publications: [6],
    h_index: 5,
    citations_total: 180,
  },
  {
    id: 8,
    name: 'Dr. Lena Kovacs',
    initials: 'LK',
    email: 'l.kovacs@tum.de',
    institution: 'Technical University of Munich',
    department: 'Department of Informatics',
    role: 'Assistant Professor',
    bio: 'Dr. Kovacs focuses on quantum computing and its intersection with classical machine learning, developing quantum-enhanced optimisation algorithms.',
    skills: ['Quantum Computing', 'Quantum-Classical Hybrid', 'Optimisation', 'Algorithms', 'Qiskit'],
    interests: ['Quantum Advantage', 'Variational Quantum Algorithms', 'Combinatorial Optimisation'],
    publications: [3, 10],
    h_index: 11,
    citations_total: 830,
  },
  {
    id: 9,
    name: 'Prof. Raj Patel',
    initials: 'RP',
    email: 'r.patel@stanford.edu',
    institution: 'Stanford University',
    department: 'Department of Physics',
    role: 'Professor',
    bio: 'Professor Patel is a physicist and computer scientist working on quantum error correction, combining theoretical physics with practical ML decoders.',
    skills: ['Quantum Error Correction', 'Physics', 'Machine Learning', 'Information Theory', 'MATLAB'],
    interests: ['Fault-Tolerant Quantum Computing', 'Topological Codes', 'Quantum Information Science'],
    publications: [3],
    h_index: 27,
    citations_total: 4310,
  },
  {
    id: 10,
    name: 'Dr. Sofia Reyes',
    initials: 'SR',
    email: 's.reyes@berkeley.edu',
    institution: 'UC Berkeley',
    department: 'EECS',
    role: 'Assistant Professor',
    bio: 'Dr. Reyes develops algorithms for large-scale graph partitioning and distributed graph computation used in production at several tech companies.',
    skills: ['Graph Algorithms', 'Distributed Computing', 'Systems Programming', 'C++', 'Parallel Computing'],
    interests: ['Large-Scale Graph Analytics', 'Systems for ML', 'Open Source Software'],
    publications: [4, 9],
    h_index: 12,
    citations_total: 1120,
  },
]

export const projects: Project[] = [
  {
    id: 1,
    title: 'FedGraph: Privacy-Preserving Graph Learning',
    description: 'A cross-institutional research project developing federated learning frameworks for graph-structured scientific data. Partners include MIT, Oxford, and ETH Zürich. The project aims to enable collaborative model training across institutions without sharing raw data.',
    status: 'Active',
    pi: 'Dr. Sarah Chen',
    members: [1, 2, 5],
    startDate: '2023-03-01',
    endDate: '2025-12-31',
    tags: ['Federated Learning', 'Graph Neural Networks', 'Privacy'],
  },
  {
    id: 2,
    title: 'Quantum Biological Networks',
    description: 'An interdisciplinary project studying quantum effects in biological networks, combining quantum computing simulation with biological network analysis. Explores quantum coherence in photosynthesis and protein folding dynamics.',
    status: 'Active',
    pi: 'Dr. Emma Torres',
    members: [2, 8, 9],
    startDate: '2023-07-01',
    endDate: '2025-06-30',
    tags: ['Quantum Computing', 'Biology', 'Network Analysis'],
  },
  {
    id: 3,
    title: 'Climate-AI Early Warning Systems',
    description: 'International collaboration building AI-powered early warning systems for climate extremes. Partners span MIT, University of Tokyo, and Cambridge. The system integrates multiple climate models with deep learning to provide 14-day probabilistic forecasts.',
    status: 'Active',
    pi: 'Dr. Yuki Tanaka',
    members: [4, 3, 10],
    startDate: '2024-01-15',
    tags: ['Climate Science', 'Deep Learning', 'Forecasting', 'International'],
  },
  {
    id: 4,
    title: 'Petascale Drug Discovery Pipeline',
    description: 'A completed project that built a distributed computing pipeline for virtual screening of billion-compound libraries. The pipeline ran on three supercomputers simultaneously and identified 47 novel drug candidates for antibiotic-resistant bacteria.',
    status: 'Completed',
    pi: 'Prof. James Okafor',
    members: [3, 6, 7],
    startDate: '2022-06-01',
    endDate: '2023-12-31',
    tags: ['Drug Discovery', 'HPC', 'Bioinformatics'],
  },
  {
    id: 5,
    title: 'Secure Scientific Data Marketplace',
    description: 'A paused initiative to build a privacy-preserving marketplace for scientific datasets, allowing institutions to monetise data assets without exposing sensitive information. Uses secure multi-party computation and zero-knowledge proofs.',
    status: 'Paused',
    pi: 'Dr. Amir Khan',
    members: [5, 1, 2],
    startDate: '2023-09-01',
    tags: ['Data Privacy', 'Marketplace', 'Cryptography'],
  },
]
