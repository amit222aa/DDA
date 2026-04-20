# Smart Traffic Light Route System 🛣️

## Overview
Graph-based traffic optimization using **Dijkstra's algorithm** to find fastest routes accounting for traffic light delays. Dual implementation:
- **Web App** (JS): Interactive visualization.
- **C++ Console** (new): Efficient priority-queue Dijkstra.

## Web App (`index.html`)
- Canvas graph with 7 nodes (A-G), weighted edges (delays 1-10s).
- Select start/end → Compute → Visualize path (green highlight).
- Randomize traffic for live updates.
```
start "d:/HTML folder/sem2 web/DAA/smart-traffic-system/index.html"
```

## C++ Dijkstra (`dijkstra.cpp`)
**Priority queue optimized** (O((V+E) log V)).
- Mirrors exact web graph.
- Sample output:
```
Fastest Route: A -> B -> C -> G
Total Delay: 16s
```
**Compile & Run** (Windows):
```
g++ dijkstra.cpp -o dijkstra.exe
./dijkstra.exe
```
(Install MinGW if needed: `winget install msys2.msys2`)

## Graph Structure
```
A --3--> B --4--> C --9--> G
|         |      |
7         2      1
|         |      |
D --6--> E --5--> F --1--> G
```
Nodes: Intersections. Edges: Roads w/ delays.

## Core Dijkstra (C++)
Uses `priority_queue` for min-distance node selection. Full source in `dijkstra.cpp`.

Project enhanced per feedback!
