namespace H5.Contract
{
    public interface IJumpInfo
    {
        bool Break { get; set; }

        System.Text.StringBuilder Output { get; set; }

        int Position { get; set; }
    }
}