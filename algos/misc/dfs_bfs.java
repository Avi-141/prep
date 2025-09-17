import java.util.*;

public class dfs_bfs {
    
    static HashMap<Integer, List<Integer>> graph = new HashMap<>();
    static boolean[] visited;
    // Add edge to graph (undirected)
    public static void addEdge(int u, int v) {
        graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        graph.computeIfAbsent(v, k -> new ArrayList<>()).add(u); 
        // comment this out if directed
    }
    
    // DFS traversal
    public static void dfs(int node) {
        visited[node] = true;
        System.out.print(node + " ");
        
        // Visit all neighbors
        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
    
    // BFS traversal
    public static void bfs(int start) {
        Queue<Integer> queue = new LinkedList<>();
        visited = new boolean[1001]; // Reset visited array
        
        queue.offer(start);
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
    }
    
    public static void main(String args[]) {
        try (Scanner sc = new Scanner(System.in)) {
            int N = sc.nextInt(); // number of edges
            int K = sc.nextInt(); // starting node for traversal
            
            visited = new boolean[1001]; // assuming max nodes <= 1000
            
            // Read edges and build graph
            for (int i = 0; i < N; i++) {
                int u = sc.nextInt();
                int v = sc.nextInt();
                addEdge(u, v);
            }
            
            System.out.println("Graph built successfully!");
            System.out.println("DFS from node " + K + ":");
            dfs(K);
            
            System.out.println("\nBFS from node " + K + ":");
            bfs(K);
        }
    }
}