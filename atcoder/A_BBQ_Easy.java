import java.util.*;
public class A_BBQ_Easy {
  public static void main (String args[]){
    Scanner Sc = new Scanner(System.in);
    int N;
    N=Sc.nextInt();
    int A[] = new int[2*N];
    for(int i=0;i<2*N;i+=1){
      A[i] = Sc.nextInt();
    }
    Arrays.sort(A);
    int maxSkewer = 0;
    for(int i=0;i<=2*N-2;i+=2){
      maxSkewer += Math.min(A[i],A[i+1]);
    }
    System.out.println(maxSkewer);
  }
}