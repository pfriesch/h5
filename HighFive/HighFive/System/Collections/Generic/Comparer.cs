namespace System.Collections.Generic
{
    [HighFive.Convention(Member = HighFive.ConventionMember.Field | HighFive.ConventionMember.Method, Notation = HighFive.Notation.CamelCase)]
    [HighFive.External]
    public abstract class Comparer<T> : IComparer<T>
    {
        [HighFive.Template("new (System.Collections.Generic.Comparer$1({T}))(System.Collections.Generic.Comparer$1.$default.fn)")]
        public static extern Comparer<T> Default();

        public abstract int Compare(T x, T y);

        [HighFive.Template("new (System.Collections.Generic.Comparer$1({T}))({comparison})")]
        public static extern Comparer<T> Create(Comparison<T> comparison);
    }
}