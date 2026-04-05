export const questionBlueprints = {
  DSA: [
    {
      difficulty: "easy",
      prompt: "What is the difference between an array and a linked list?",
      expectedPoints: [
        "Contiguous memory for arrays",
        "Dynamic nodes for linked lists",
        "Different access and insertion tradeoffs"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is the time complexity of binary search and why?",
      expectedPoints: [
        "O(log n)",
        "Search space halves each step"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is a stack and where is it commonly used?",
      expectedPoints: [
        "LIFO structure",
        "Function calls or undo/backtracking"
      ]
    },
    {
      difficulty: "medium",
      prompt: "Explain the difference between BFS and DFS with a practical use case for each.",
      expectedPoints: [
        "BFS explores level by level",
        "DFS explores depth first",
        "Shortest path for BFS",
        "Traversal/backtracking for DFS"
      ]
    },
    {
      difficulty: "medium",
      prompt: "How does a hash table handle collisions?",
      expectedPoints: [
        "Collision occurs when keys map to same bucket",
        "Chaining or open addressing",
        "Load factor matters"
      ]
    },
    {
      difficulty: "medium",
      prompt: "What makes merge sort stable and what is its time complexity?",
      expectedPoints: [
        "Equal elements preserve order",
        "O(n log n)"
      ]
    },
    {
      difficulty: "medium",
      prompt: "When would you choose a heap over a balanced BST?",
      expectedPoints: [
        "Priority queue use case",
        "Efficient access to min/max",
        "BST better for ordered traversal/search"
      ]
    },
    {
      difficulty: "hard",
      prompt: "Explain dynamic programming using the 0/1 knapsack problem.",
      expectedPoints: [
        "Overlapping subproblems",
        "Optimal substructure",
        "State definition",
        "Transition relation"
      ]
    },
    {
      difficulty: "hard",
      prompt: "How would you detect a cycle in a directed graph?",
      expectedPoints: [
        "DFS with recursion stack or Kahn's algorithm",
        "Track visited states",
        "Back edge indicates cycle"
      ]
    }
  ],
  OS: [
    {
      difficulty: "easy",
      prompt: "What is the purpose of an operating system?",
      expectedPoints: [
        "Resource management",
        "Interface between user and hardware"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is a process?",
      expectedPoints: [
        "Program in execution",
        "Has state and resources"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is the difference between a process and a thread?",
      expectedPoints: [
        "Process has separate memory",
        "Threads share process resources"
      ]
    },
    {
      difficulty: "medium",
      prompt: "Explain CPU scheduling and compare FCFS with Round Robin.",
      expectedPoints: [
        "Scheduling chooses next process",
        "FCFS non-preemptive",
        "Round Robin time slice",
        "Tradeoff in responsiveness"
      ]
    },
    {
      difficulty: "medium",
      prompt: "What is deadlock and what are its four necessary conditions?",
      expectedPoints: [
        "Mutual exclusion",
        "Hold and wait",
        "No preemption",
        "Circular wait"
      ]
    },
    {
      difficulty: "medium",
      prompt: "How does paging help memory management?",
      expectedPoints: [
        "Fixed-size pages and frames",
        "Reduces external fragmentation",
        "Virtual memory mapping"
      ]
    },
    {
      difficulty: "medium",
      prompt: "What is context switching and why is it costly?",
      expectedPoints: [
        "Switching CPU between tasks",
        "Save and restore state",
        "Overhead with no useful work"
      ]
    },
    {
      difficulty: "hard",
      prompt: "Describe the producer-consumer problem and one way to solve it.",
      expectedPoints: [
        "Shared bounded buffer",
        "Synchronization needed",
        "Semaphores or monitors"
      ]
    },
    {
      difficulty: "hard",
      prompt: "How do page replacement algorithms like LRU improve memory utilization?",
      expectedPoints: [
        "Choose victim page",
        "LRU approximates recent use",
        "Goal is fewer page faults"
      ]
    }
  ],
  CN: [
    {
      difficulty: "easy",
      prompt: "What is the role of the OSI model in computer networks?",
      expectedPoints: [
        "Layered network model",
        "Standardizes communication"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is the difference between TCP and UDP?",
      expectedPoints: [
        "TCP reliable and connection-oriented",
        "UDP faster and connectionless"
      ]
    },
    {
      difficulty: "easy",
      prompt: "What is an IP address?",
      expectedPoints: [
        "Identifier for a device on a network",
        "Used for routing"
      ]
    },
    {
      difficulty: "medium",
      prompt: "Explain how DNS works when a browser opens a website.",
      expectedPoints: [
        "Domain resolves to IP",
        "Recursive lookup",
        "Browser uses IP to connect"
      ]
    },
    {
      difficulty: "medium",
      prompt: "What is the purpose of subnetting?",
      expectedPoints: [
        "Split network into smaller parts",
        "Efficient address use",
        "Better routing/security"
      ]
    },
    {
      difficulty: "medium",
      prompt: "How does the three-way handshake work in TCP?",
      expectedPoints: [
        "SYN",
        "SYN-ACK",
        "ACK"
      ]
    },
    {
      difficulty: "medium",
      prompt: "Compare a hub, switch, and router.",
      expectedPoints: [
        "Hub broadcasts",
        "Switch forwards by MAC",
        "Router forwards between networks by IP"
      ]
    },
    {
      difficulty: "hard",
      prompt: "How does congestion control improve network performance?",
      expectedPoints: [
        "Prevents overload",
        "Adjusts sending rate",
        "Improves fairness and throughput"
      ]
    },
    {
      difficulty: "hard",
      prompt: "Explain NAT and one of its tradeoffs.",
      expectedPoints: [
        "Maps private to public IPs",
        "Conserves addresses",
        "Can complicate peer-to-peer connectivity"
      ]
    }
  ]
};

