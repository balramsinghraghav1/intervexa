const buildSubjectQuestions = (easy, medium, hard) => [
  ...easy.map((item) => ({ ...item, difficulty: "easy" })),
  ...medium.map((item) => ({ ...item, difficulty: "medium" })),
  ...hard.map((item) => ({ ...item, difficulty: "hard" }))
];

export const questionBlueprints = {
  DSA: buildSubjectQuestions(
    [
      {
        prompt: "What is the difference between an array and a linked list?",
        expectedPoints: [
          "Contiguous memory for arrays",
          "Dynamic nodes for linked lists",
          "Access and insertion tradeoffs"
        ]
      },
      {
        prompt: "What is the time complexity of binary search and why?",
        expectedPoints: [
          "O log n",
          "Search space halves at every step"
        ]
      },
      {
        prompt: "What is a stack and one common use case?",
        expectedPoints: [
          "LIFO",
          "Function calls undo or backtracking"
        ]
      }
    ],
    [
      {
        prompt: "Explain the difference between BFS and DFS with one use case each.",
        expectedPoints: [
          "BFS level order",
          "DFS depth first",
          "Shortest path for BFS",
          "Traversal or backtracking for DFS"
        ]
      },
      {
        prompt: "How does a hash table handle collisions?",
        expectedPoints: [
          "Collision means same bucket",
          "Chaining or open addressing",
          "Load factor impacts performance"
        ]
      },
      {
        prompt: "What makes merge sort stable and what is its time complexity?",
        expectedPoints: [
          "Equal items keep relative order",
          "O n log n"
        ]
      },
      {
        prompt: "When would you prefer a heap over a balanced BST?",
        expectedPoints: [
          "Priority queue use case",
          "Fast min max access",
          "BST better for ordered traversal"
        ]
      }
    ],
    [
      {
        prompt: "Explain dynamic programming using the 0/1 knapsack problem.",
        expectedPoints: [
          "Overlapping subproblems",
          "Optimal substructure",
          "State definition",
          "Transition relation"
        ]
      },
      {
        prompt: "How would you detect a cycle in a directed graph?",
        expectedPoints: [
          "DFS with recursion stack or Kahn algorithm",
          "Track visited states",
          "Back edge or leftover indegree indicates cycle"
        ]
      },
      {
        prompt: "Compare Kruskal and Prim algorithms for minimum spanning tree.",
        expectedPoints: [
          "Both build MST",
          "Kruskal sorts edges and uses DSU",
          "Prim grows from a node with priority queue"
        ]
      }
    ]
  ),
  OS: buildSubjectQuestions(
    [
      {
        prompt: "What is the purpose of an operating system?",
        expectedPoints: [
          "Resource management",
          "Interface between user and hardware"
        ]
      },
      {
        prompt: "What is a process?",
        expectedPoints: [
          "Program in execution",
          "Has state and resources"
        ]
      },
      {
        prompt: "What is the difference between a process and a thread?",
        expectedPoints: [
          "Process has separate memory",
          "Threads share process resources"
        ]
      }
    ],
    [
      {
        prompt: "Explain CPU scheduling and compare FCFS with Round Robin.",
        expectedPoints: [
          "Scheduling chooses next process",
          "FCFS non preemptive",
          "Round Robin uses time slice",
          "Responsiveness tradeoff"
        ]
      },
      {
        prompt: "What is deadlock and what are its four necessary conditions?",
        expectedPoints: [
          "Mutual exclusion",
          "Hold and wait",
          "No preemption",
          "Circular wait"
        ]
      },
      {
        prompt: "How does paging help memory management?",
        expectedPoints: [
          "Pages and frames",
          "Virtual to physical mapping",
          "Reduces external fragmentation"
        ]
      },
      {
        prompt: "What is context switching and why is it costly?",
        expectedPoints: [
          "Switch CPU between tasks",
          "Save and restore state",
          "Overhead without useful work"
        ]
      }
    ],
    [
      {
        prompt: "Describe the producer consumer problem and one way to solve it.",
        expectedPoints: [
          "Shared bounded buffer",
          "Synchronization needed",
          "Semaphores or monitors"
        ]
      },
      {
        prompt: "How do page replacement algorithms like LRU improve memory utilization?",
        expectedPoints: [
          "Choose victim page",
          "Recent use approximation",
          "Goal is fewer page faults"
        ]
      },
      {
        prompt: "Explain starvation and aging in operating systems.",
        expectedPoints: [
          "Starvation means indefinite waiting",
          "Low priority processes may suffer",
          "Aging gradually increases priority"
        ]
      }
    ]
  ),
  CN: buildSubjectQuestions(
    [
      {
        prompt: "What is the role of the OSI model in computer networks?",
        expectedPoints: [
          "Layered communication model",
          "Standardizes networking functions"
        ]
      },
      {
        prompt: "What is the difference between TCP and UDP?",
        expectedPoints: [
          "TCP reliable and connection oriented",
          "UDP faster and connectionless"
        ]
      },
      {
        prompt: "What is an IP address?",
        expectedPoints: [
          "Unique network identifier",
          "Used for routing devices"
        ]
      }
    ],
    [
      {
        prompt: "Explain how DNS works when a browser opens a website.",
        expectedPoints: [
          "Domain resolves to IP",
          "Recursive lookup",
          "Browser connects using IP"
        ]
      },
      {
        prompt: "What is the purpose of subnetting?",
        expectedPoints: [
          "Split network into smaller parts",
          "Efficient IP usage",
          "Better routing and isolation"
        ]
      },
      {
        prompt: "How does the TCP three way handshake work?",
        expectedPoints: [
          "SYN",
          "SYN ACK",
          "ACK"
        ]
      },
      {
        prompt: "Compare a hub, switch, and router.",
        expectedPoints: [
          "Hub broadcasts",
          "Switch forwards by MAC",
          "Router forwards by IP between networks"
        ]
      }
    ],
    [
      {
        prompt: "How does congestion control improve network performance?",
        expectedPoints: [
          "Prevents overload",
          "Adjust sending rate",
          "Improves fairness and throughput"
        ]
      },
      {
        prompt: "Explain NAT and one tradeoff.",
        expectedPoints: [
          "Maps private to public IPs",
          "Conserves addresses",
          "Can complicate peer to peer communication"
        ]
      },
      {
        prompt: "What is the sliding window protocol and why is it useful?",
        expectedPoints: [
          "Controls multiple frames in transit",
          "Supports flow control",
          "Improves link utilization"
        ]
      }
    ]
  ),
  DBMS: buildSubjectQuestions(
    [
      {
        prompt: "What is a database management system?",
        expectedPoints: [
          "Software to store manage retrieve data",
          "Provides controlled access to data"
        ]
      },
      {
        prompt: "What is the difference between a primary key and a foreign key?",
        expectedPoints: [
          "Primary key uniquely identifies a row",
          "Foreign key references another table"
        ]
      },
      {
        prompt: "What is normalization in DBMS?",
        expectedPoints: [
          "Organizing data to reduce redundancy",
          "Improves consistency"
        ]
      }
    ],
    [
      {
        prompt: "Explain ACID properties in transactions.",
        expectedPoints: [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability"
        ]
      },
      {
        prompt: "What is the difference between clustered and non clustered indexes?",
        expectedPoints: [
          "Clustered affects data storage order",
          "Non clustered uses separate structure",
          "Performance tradeoff"
        ]
      },
      {
        prompt: "What is a join and when would you use an inner join?",
        expectedPoints: [
          "Combines rows from tables",
          "Inner join returns matching rows",
          "Used when related data must exist in both tables"
        ]
      },
      {
        prompt: "Explain the difference between DELETE, TRUNCATE, and DROP.",
        expectedPoints: [
          "DELETE removes rows",
          "TRUNCATE removes all rows faster",
          "DROP removes the table object"
        ]
      }
    ],
    [
      {
        prompt: "What is concurrency control and why is it needed in DBMS?",
        expectedPoints: [
          "Manage simultaneous transactions",
          "Prevent anomalies",
          "Maintain consistency"
        ]
      },
      {
        prompt: "Explain deadlock in DBMS and one way to handle it.",
        expectedPoints: [
          "Transactions wait on each other",
          "Detection prevention or avoidance",
          "Rollback one transaction"
        ]
      },
      {
        prompt: "How do B plus trees help database indexing?",
        expectedPoints: [
          "Balanced tree structure",
          "Efficient search insert delete",
          "Leaf nodes useful for range queries"
        ]
      }
    ]
  )
};
