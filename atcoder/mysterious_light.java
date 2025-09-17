
/**
 *
 * @author avi-141
 */
import java.util.*;
public class mysterious_light {
    public static long gcd(long a, long b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            long t = a % b;
            a = b;
            b = t;
        }
        return a; // >= 0
    }

    public static int gcdRecursive(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        return (b == 0) ? a : gcdRecursive(b, a % b);
    }

    /** GCD of many numbers (long). */
    public static long gcd(long... nums) {
        long g = 0;
        for (long x : nums) g = gcd(g, x);
        return g;
    }

    /** LCM using GCD; lcm(0, x)=0. Division first to limit overflow risk. */
    public static long lcm(long a, long b) {
        if (a == 0 || b == 0) return 0;
        return Math.abs(a / gcd(a, b) * b);
    }

    /**
     * Extended Euclidean Algorithm on |a|,|b|.
     * Returns [g, x, y] such that a*x + b*y = g = gcd(a,b).
     */
    public static long[] extendedGcd(long a, long b) {
        long aa = Math.abs(a), bb = Math.abs(b);
        long old_r = aa, r = bb;
        long old_s = 1,  s = 0;
        long old_t = 0,  t = 1;

        while (r != 0) {
            long q = old_r / r;
            long tmp;

            tmp = old_r - q * r; old_r = r; r = tmp;
            tmp = old_s - q * s; old_s = s; s = tmp;
            tmp = old_t - q * t; old_t = t; t = tmp;
        }
        long g = old_r; // gcd(|a|,|b|)
        long x = (a < 0) ? -old_s : old_s;
        long y = (b < 0) ? -old_t : old_t;
        return new long[]{g, x, y};
    }
    public static void main(String[] args) {
        long N;
        long X;
        Scanner sc = new Scanner(System.in);
        N = sc.nextLong();
        X = sc.nextLong();
        long ans = 3*(N - gcd(N,X));
        System.out.println(ans);
    }

}
