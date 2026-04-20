#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <map>
#include <string>
using namespace std;

const int INF = numeric_limits<int>::max();

// Node structure for graph
struct Node {
    string id;
    int x, y;
};

// Edge structure
struct Edge {
    string to;
    int weight; // traffic light delay
};

// Dijkstra result
struct PathResult {
    vector<string> path;
    int totalDelay;
};

// Graph class mirroring JS version
class TrafficGraph {
private:
    map<string, Node> nodes;
    map<string, vector<Edge>> adjList;

public:
    TrafficGraph() {
        initGraph();
    }

    void initGraph() {
        // Same layout as web version: 7 nodes A-G
        nodes["A"] = {"A", 100, 100};
        nodes["B"] = {"B", 250, 50};
        nodes["C"] = {"C", 400, 120};
        nodes["D"] = {"D", 150, 300};
        nodes["E"] = {"E", 350, 250};
        nodes["F"] = {"F", 500, 350};
        nodes["G"] = {"G", 650, 200};

        // Bidirectional edges with sample delays
        vector<tuple<string, string, int>> edgeList = {
            {"A", "B", 3}, {"B", "A", 3},
            {"A", "D", 7}, {"D", "A", 7},
            {"B", "C", 4}, {"C", "B", 4},
            {"C", "E", 2}, {"E", "C", 2},
            {"C", "G", 9}, {"G", "C", 9},
            {"D", "E", 6}, {"E", "D", 6},
            {"E", "F", 5}, {"F", "E", 5},
            {"F", "G", 1}, {"G", "F", 1}
        };

        for (auto [from, to, w] : edgeList) {
            adjList[from].push_back({to, w});
        }
    }

    PathResult dijkstra(const string&amp; start, const string&amp; end) {
        map<string, int> dist;
        map<string, string> prev;
        auto comp = [](const pair<int, string>&amp; a, const pair<int, string>&amp; b) {
            return a.first > b.first;
        };
        priority_queue<pair<int, string>, vector<pair<int, string>>, decltype(comp)> pq(comp);

        // Init
        for (auto&amp; node : nodes) {
            dist[node.first] = INF;
        }
        dist[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            string curr = pq.top().second;
            int d = pq.top().first;
            pq.pop();

            if (d > dist[curr]) continue;

            for (const auto&amp; edge : adjList[curr]) {
                int alt = dist[curr] + edge.weight;
                if (alt < dist[edge.to]) {
                    dist[edge.to] = alt;
                    prev[edge.to] = curr;
                    pq.push({alt, edge.to});
                }
            }
        }

        // Reconstruct path
        PathResult res;
        if (dist[end] == INF) {
            res.path = {};
            res.totalDelay = -1;
            return res;
        }

        string u = end;
        while (u != "") {
            res.path.insert(res.path.begin(), u);
            u = prev[u];
        }
        res.totalDelay = dist[end];
        return res;
    }

    void printPath(const PathResult&amp; res) {
        if (res.totalDelay == -1) {
            cout << "No path found!" << endl;
            return;
        }
        cout << "Fastest Route: ";
        for (size_t i = 0; i < res.path.size(); ++i) {
            cout << res.path[i];
            if (i < res.path.size() - 1) cout << " -> ";
        }
        cout << endl;
        cout << "Total Delay: " << res.totalDelay << "s" << endl;
    }
};

int main() {
    TrafficGraph graph;
    
    cout << "=== Smart Traffic Light Route System (C++) ===" << endl;
    cout << "Same graph as web version!" << endl << endl;
    
    // Example: A to G
    auto res1 = graph.dijkstra("A", "G");
    graph.printPath(res1);
    
    cout << endl << "Try compiling/running with different start/end!" << endl;
    
    return 0;
}

