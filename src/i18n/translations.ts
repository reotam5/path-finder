// Translation types and keys
export interface Translations {
  // App header
  app: {
    title: string;
    subtitle: string;
  };

  // Status messages
  status: {
    running: string;
  };

  // Tool names and descriptions
  tools: {
    start: string;
    end: string;
    wall: string;
    eraser: string;
    drawingToolsTitle: string;
    drawingToolsDescription: string;
  };

  // Action buttons
  actions: {
    clearPath: string;
    resetGrid: string;
    findPath: string;
    running: string;
  };

  // Algorithm section
  algorithms: {
    title: string;
    description: string;
    selectPlaceholder: string;
    bfs: {
      name: string;
      description: string;
    };
    dfs: {
      name: string;
      description: string;
    };
    aStar: {
      name: string;
      description: string;
    };
    bidirectional: {
      name: string;
      description: string;
    };
  };
}

// English translations (default)
export const enTranslations: Translations = {
  app: {
    title: 'Path Finding Visualizer',
    subtitle: 'Choose your tools and algorithm, then watch the pathfinding magic happen',
  },
  status: {
    running: 'Running',
  },
  tools: {
    start: 'Start',
    end: 'End',
    wall: 'Wall',
    eraser: 'Eraser',
    drawingToolsTitle: 'Drawing Tools & Actions',
    drawingToolsDescription: 'Select tools to modify the grid and manage your workspace',
  },
  actions: {
    clearPath: 'Clear Path',
    resetGrid: 'Reset Grid',
    findPath: 'Find Path',
    running: 'Running...',
  },
  algorithms: {
    title: 'Algorithm & Execution',
    description: 'Choose your pathfinding algorithm and run the visualization',
    selectPlaceholder: 'Select algorithm',
    bfs: {
      name: 'Breadth-First Search',
      description: 'Guarantees shortest path',
    },
    dfs: {
      name: 'Depth-First Search',
      description: 'Explores deeply first',
    },
    aStar: {
      name: 'A* Search',
      description: 'Optimal & efficient',
    },
    bidirectional: {
      name: 'Bidirectional Search',
      description: 'Searches from both ends',
    },
  },
};

// Spanish translations
export const esTranslations: Translations = {
  app: {
    title: 'Visualizador de Búsqueda de Rutas',
    subtitle: 'Elige tus herramientas y algoritmo, luego observa la magia de búsqueda de rutas',
  },
  status: {
    running: 'Ejecutando',
  },
  tools: {
    start: 'Inicio',
    end: 'Final',
    wall: 'Pared',
    eraser: 'Borrador',
    drawingToolsTitle: 'Herramientas de Dibujo y Acciones',
    drawingToolsDescription: 'Selecciona herramientas para modificar la cuadrícula y gestionar tu espacio de trabajo',
  },
  actions: {
    clearPath: 'Limpiar Ruta',
    resetGrid: 'Reiniciar Cuadrícula',
    findPath: 'Encontrar Ruta',
    running: 'Ejecutando...',
  },
  algorithms: {
    title: 'Algoritmo y Ejecución',
    description: 'Elige tu algoritmo de búsqueda de rutas y ejecuta la visualización',
    selectPlaceholder: 'Seleccionar algoritmo',
    bfs: {
      name: 'Búsqueda en Anchura',
      description: 'Garantiza la ruta más corta',
    },
    dfs: {
      name: 'Búsqueda en Profundidad',
      description: 'Explora primero en profundidad',
    },
    aStar: {
      name: 'Búsqueda A*',
      description: 'Óptimo y eficiente',
    },
    bidirectional: {
      name: 'Búsqueda Bidireccional',
      description: 'Busca desde ambos extremos',
    },
  },
};

// French translations
export const frTranslations: Translations = {
  app: {
    title: 'Visualisateur de Recherche de Chemin',
    subtitle: 'Choisissez vos outils et algorithme, puis regardez la magie de recherche de chemin',
  },
  status: {
    running: 'En cours',
  },
  tools: {
    start: 'Début',
    end: 'Fin',
    wall: 'Mur',
    eraser: 'Gomme',
    drawingToolsTitle: 'Outils de Dessin et Actions',
    drawingToolsDescription: 'Sélectionnez des outils pour modifier la grille et gérer votre espace de travail',
  },
  actions: {
    clearPath: 'Effacer le Chemin',
    resetGrid: 'Réinitialiser la Grille',
    findPath: 'Trouver le Chemin',
    running: 'En cours...',
  },
  algorithms: {
    title: 'Algorithme et Exécution',
    description: 'Choisissez votre algorithme de recherche de chemin et lancez la visualisation',
    selectPlaceholder: 'Sélectionner un algorithme',
    bfs: {
      name: 'Recherche en Largeur',
      description: 'Garantit le chemin le plus court',
    },
    dfs: {
      name: 'Recherche en Profondeur',
      description: 'Explore en profondeur d\'abord',
    },
    aStar: {
      name: 'Recherche A*',
      description: 'Optimal et efficace',
    },
    bidirectional: {
      name: 'Recherche Bidirectionnelle',
      description: 'Recherche depuis les deux extrémités',
    },
  },
};

// Japanese translations
export const jaTranslations: Translations = {
  app: {
    title: '経路探索ビジュアライザー',
    subtitle: 'ツールとアルゴリズムを選択して、経路探索の魔法を見てみましょう',
  },
  status: {
    running: '実行中',
  },
  tools: {
    start: 'スタート',
    end: 'ゴール',
    wall: '壁',
    eraser: '消しゴム',
    drawingToolsTitle: '描画ツールとアクション',
    drawingToolsDescription: 'グリッドを変更し、ワークスペースを管理するためのツールを選択',
  },
  actions: {
    clearPath: 'パスをクリア',
    resetGrid: 'グリッドをリセット',
    findPath: 'パスを探索',
    running: '実行中...',
  },
  algorithms: {
    title: 'アルゴリズムと実行',
    description: '経路探索アルゴリズムを選択してビジュアライゼーションを実行',
    selectPlaceholder: 'アルゴリズムを選択',
    bfs: {
      name: '幅優先探索',
      description: '最短経路を保証',
    },
    dfs: {
      name: '深さ優先探索',
      description: '深さを優先して探索',
    },
    aStar: {
      name: 'A*探索',
      description: '最適で効率的',
    },
    bidirectional: {
      name: '双方向探索',
      description: '両端から探索',
    },
  },
};

// Supported languages
export type Language = 'en' | 'es' | 'fr' | 'ja';

// All translations mapped by language
export const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  ja: jaTranslations,
};

// Default language
export const defaultLanguage: Language = 'en';