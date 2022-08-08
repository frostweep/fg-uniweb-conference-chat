#if UNITY_EDITOR
namespace FrostweepGames.Plugins.UniWebConferencePro
{
    [UnityEditor.InitializeOnLoad]
    public class DefineProcessing : Plugins.DefineProcessing
    {
        private static readonly string[] _Defines = new string[] 
        {
            "FG_WEBGLUWCP"
        };

        static DefineProcessing()
        {
            AddOrRemoveDefines(true, true, _Defines);
        }
    }
}
#endif