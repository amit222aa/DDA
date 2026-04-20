class Graph {
    constructor() {
        this.nodes = new Map(); // nodeId -> {x, y, label}
        this.edges = new Map(); // from -> [{to, weight}]
        this.initGraph();
    }

    initGraph() {
        // Define 7 nodes (intersections) with positions for nice layout
        const nodePositions = {
            'A': {x: 100, y: 100},
            'B': {x: 250, y: 50},
            'C': {x: 400, y: 120},
            'D': {x: 150, y: 300},
            'E': {x: 350, y: 250},
            'F': {x: 500, y: 350},
            'G': {x: 650, y: 200}
        };

        for (let id in nodePositions) {
            this.nodes.set(id, {...nodePositions[id], label: id});
        }

        // Define edges (roads) with initial random traffic light delays (1-10)
        const edgeList = [
            ['A', 'B', 3], ['A', 'D', 7],
            ['B', 'A', 3], ['B', 'C', 4],
            ['C', 'B', 4], ['C', 'E', 2], ['C', 'G', 9],
            ['D', 'A', 7], ['D', 'E', 6],
            ['E', 'C', 2], ['E', 'D', 6], ['E', 'F', 5],
            ['F', 'E', 5], ['F', 'G', 1],
            ['G', 'C', 9], ['G', 'F', 1]
        ];

        for (let [from, to, weight] of edgeList) {
            if (!this.edges.has(from)) this.edges.set(from, []);
            this.edges.get(from).push({to, weight});
        }
    }

    randomizeTraffic() {
        // Update weights dynamically (simulate live traffic changes)
        for (let [from, targets] of this.edges) {
            for (let target of targets) {
                target.weight = Math.floor(Math.random() * 10) + 1; // 1-10 delay
            }
        }
    }

    dijkstra(start, end) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set(this.nodes.keys());

        for (let node of this.nodes.keys()) {
            distances.set(node, Infinity);
        }
        distances.set(start, 0);

        while (unvisited.size > 0) {
            let current = null;
            let currentDist = Infinity;

            for (let node of unvisited) {
                if (distances.get(node) < currentDist) {
                    currentDist = distances.get(node);
                    current = node;
                }
            }

            if (current === null || current === end) break;

            unvisited.delete(current);

            if (this.edges.has(current)) {
                for (let {to, weight} of this.edges.get(current)) {
                    const alt = distances.get(current) + weight;
                    if (alt < distances.get(to)) {
                        distances.set(to, alt);
                        previous.set(to, current);
                    }
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path.length > 1 ? {path, totalDelay: distances.get(end)} : null;
    }

    getNeighbors(node) {
        return this.edges.get(node) || [];
    }
}

const graph = new Graph();
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const startSelect = document.getElementById('startNode');
const endSelect = document.getElementById('endNode');
const computeBtn = document.getElementById('computeBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const resultDiv = document.getElementById('result');

let shortestPath = [];
let pathNodes = new Set();

function getNodePosition(nodeId) {
    return graph.nodes.get(nodeId);
}

function drawGraph(highlightPath = new Set()) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    for (let [from, targets] of graph.edges) {
        const fromPos = getNodePosition(from);
        for (let {to, weight} of targets) {
            const toPos = getNodePosition(to);
            const isPathEdge = highlightPath.has(from) && highlightPath.has(to);

            // Edge line
            ctx.lineWidth = isPathEdge ? 6 : 3;
            ctx.strokeStyle = isPathEdge ? '#4ecdc4' : 'rgba(255,255,255,0.6)';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.stroke();

            // Weight label (traffic delay)
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            ctx.fillStyle = isPathEdge ? '#fff' : '#ffeb3b';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(weight.toString(), midX, midY);

            // Traffic light icon
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(midX + 15, midY - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw nodes
    for (let [id, pos] of graph.nodes) {
        const isPathNode = highlightPath.has(id);
        const radius = isPathNode ? 18 : 12;
        ctx.fillStyle = isPathNode ? '#4ecdc4' : '#45b7d1';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${isPathNode ? 16 : 14}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.label, pos.x, pos.y);
    }
}

function computePath() {
    const start = startSelect.value;
    const end = endSelect.value;
    if (start === end) {
        resultDiv.textContent = 'Select different start and end nodes!';
        shortestPath = [];
        pathNodes.clear();
        drawGraph(pathNodes);
        return;
    }

    const result = graph.dijkstra(start, end);
    if (result) {
        shortestPath = result.path;
        pathNodes = new Set(shortestPath);
        resultDiv.innerHTML = `✅ Fastest Route: ${shortestPath.join(' → ')}<br>Total Delay: ${result.totalDelay}s`;
    } else {
        resultDiv.textContent = 'No path found!';
        shortestPath = [];
        pathNodes.clear();
    }
    drawGraph(pathNodes);
}

function randomizeTraffic() {
    graph.randomizeTraffic();
    resultDiv.textContent = '🔄 Traffic updated! Recompute route.';
    shortestPath = [];
    pathNodes.clear();
    drawGraph(pathNodes);
}

// Event listeners
computeBtn.addEventListener('click', computePath);
randomizeBtn.addEventListener('click', randomizeTraffic);

// Initial draw
drawGraph(pathNodes);

// Auto-compute on change (optional convenience)
startSelect.addEventListener('change', computePath);
endSelect.addEventListener('change', computePath);

