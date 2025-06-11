const http = require('http');
const url = require('url');

const nestedTestData = {
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          sms: false,
          push: true,
          settings: {
            frequency: "daily",
            types: ["security", "updates", "promotions"],
            advanced: {
              digest: true,
              realtime: false,
              categories: {
                marketing: false,
                product: true,
                security: true
              }
            }
          }
        }
      }
    }
  },
  posts: [
    {
      id: 1,
      title: "First Post",
      content: "This is my first post",
      tags: ["hello", "world", "first"],
      metadata: {
        views: 100,
        likes: 25,
        comments: [
          {
            id: 1,
            author: "Jane Smith",
            text: "Great post!",
            timestamp: "2024-01-15T10:30:00Z",
            replies: [
              {
                id: 1,
                author: "Bob Johnson",
                text: "I agree!",
                timestamp: "2024-01-15T11:00:00Z",
                reactions: {
                  likes: 5,
                  hearts: 2,
                  details: {
                    users: ["alice", "charlie", "diana"],
                    summary: {
                      total: 7,
                      breakdown: {
                        likes: 5,
                        hearts: 2
                      }
                    }
                  }
                }
              },
              {
                id: 2,
                author: "Alice Wilson",
                text: "Thanks for sharing!",
                timestamp: "2024-01-15T12:00:00Z"
              }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      title: "Second Post",
      content: "Another post here with more nested data",
      tags: ["update", "news", "announcement"],
      metadata: {
        views: 250,
        likes: 45,
        comments: [
          {
            id: 3,
            author: "Charlie Brown",
            text: "Interesting update!",
            replies: []
          }
        ],
        analytics: {
          engagement: {
            rate: 0.18,
            details: {
              clicks: 45,
              shares: 12,
              bookmarks: 8
            }
          }
        }
      }
    }
  ],
  settings: {
    api: {
      version: "v2.1",
      endpoints: {
        users: "/api/v2/users",
        posts: "/api/v2/posts",
        analytics: "/api/v2/analytics"
      },
      configuration: {
        rateLimit: {
          requests: 1000,
          window: "1h",
          burst: {
            allowed: true,
            limit: 50
          }
        },
        security: {
          encryption: "AES-256",
          headers: {
            required: ["Authorization", "Content-Type"],
            optional: ["X-Request-ID", "X-Client-Version"]
          }
        }
      }
    },
    features: {
      experimental: {
        newEditor: true,
        advancedAnalytics: false,
        betaFeatures: {
          aiAssistant: true,
          realTimeCollaboration: false
        }
      }
    }
  }
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  if (path === '/test/nested') {
    res.writeHead(200);
    res.end(JSON.stringify(nestedTestData, null, 2));
  } else if (path === '/test/simple') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Simple response", status: "ok" }));
  } else if (path === '/test/array') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, data: { nested: { deep: { value: "test1" } } } },
      { id: 2, data: { nested: { deep: { value: "test2" } } } },
      { id: 3, data: { nested: { deep: { value: "test3" } } } }
    ]));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoints:`);
  console.log(`   GET http://localhost:${PORT}/test/nested - Complex nested JSON`);
  console.log(`   GET http://localhost:${PORT}/test/simple - Simple JSON`);
  console.log(`   GET http://localhost:${PORT}/test/array - Array with nested objects`);
}); 