public class Stringreverse {
    public static void main(String[] args) {
        String str1="madam";
        String str2="";
        for(int i=str1.length()-1;i>=0;i--)
        {
            str2=str2 + str1.charAt(i);
        }
        System.out.print(str2);
        if(str1.equals(str2)){
            System.out.print("palindrome");
        }
        else {
            System.out.print(" not a palindrome");
        }
    }
}
