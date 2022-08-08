using UnityEngine;

namespace FrostweepGames.Plugins.UniWebConferencePro
{
    //[CreateAssetMenu(fileName = "GeneralConfig", menuName = "FrostweepGames/UniWebConferencePro/GeneralConfig", order = 3)]
    public class GeneralConfig : ScriptableObject
    {
        private static GeneralConfig _Config;
        public static GeneralConfig Config
        {
            get
            {
                if (_Config == null)
                    _Config = GetConfig();
                return _Config;
            }
        }

        public bool showWelcomeDialogAtStartup = true;

        [Header("Connection Settings")]

        [Tooltip("Used for connecting to server. Required")]
        [PasswordField]
        public string AppKey = string.Empty;
        public bool autoConnect = true;

        [Header("Audio Settings")]

        public bool spatialAudioEnabled = false;
        [Range(0, 1000)]
        public float spatialAudioRadius = 10f;
        public AnimationCurve spatialAudioCurve = AnimationCurve.Linear(0f, 0f, 1f, 1f);

        private static GeneralConfig GetConfig()
        {
            string path = "UniWebConferencePro/GeneralConfig";
            var config = Resources.Load<GeneralConfig>(path);

            if(config == null)
            {
                Debug.LogError($"Uni Web Conference Pro General Config not found in {path} Resources folder. Will use default.");

                config = (GeneralConfig)CreateInstance("GeneralConfig");

#if UNITY_EDITOR
                string pathToFolder = "Assets/FrostweepGames/UniWebConferencePro/Resources/UniWebConferencePro";
                string filename = "GeneralConfig.asset";

                if (!System.IO.Directory.Exists(Application.dataPath + "/../" + pathToFolder))
                {
                    System.IO.Directory.CreateDirectory(pathToFolder);
                    UnityEditor.AssetDatabase.ImportAsset(pathToFolder);
                }

                if (!System.IO.File.Exists(Application.dataPath + "/../" + pathToFolder + "/" + filename))
                {
                    UnityEditor.AssetDatabase.CreateAsset(config, pathToFolder + "/" + filename);
                }
                UnityEditor.AssetDatabase.SaveAssets();
#endif
            }

            return config;
        }
    }
}
